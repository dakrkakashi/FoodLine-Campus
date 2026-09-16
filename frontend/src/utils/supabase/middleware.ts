import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { getSupabaseFrontendRuntimeConfig } from '@/lib/supabase/runtime';

const runtime = getSupabaseFrontendRuntimeConfig(process.env);

if (!runtime.isConfigured || !runtime.url || !runtime.anonKey) {
  throw new Error(`[utils/supabase/middleware] ${runtime.reason}`);
}

const supabaseUrl = runtime.url;
const supabaseKey = runtime.anonKey;

// Routes that require specific staff/admin roles
const ROLE_RESTRICTED_ROUTES: Record<string, string[]> = {
  '/kds': ['kitchen', 'canteen_manager', 'admin'],
  '/admin': ['canteen_manager', 'admin'],
};

// Routes that can be accessed without forced login redirect
const PUBLIC_ROUTES = [
  '/',
  '/select-campus',
  '/canteens',
  '/onboarding',
  '/login',
  '/display', // Public TV counter display kiosk in cafeteria
  '/auth',
  '/terms',
  '/orders',
  '/order',
  '/menu',
  '/checkout',
  '/debug',
];

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // 1. Allow public landing page, TV display, login, terms & API requests immediately
  const isPublicRoute =
    pathname === '/' ||
    PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isPublicRoute || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return supabaseResponse;
  }

  // 2. Fetch authenticated user session, student session, or staff session cookie
  const { data: { user } } = await supabase.auth.getUser();
  const studentCookie = request.cookies.get('foodline_student_session')?.value;
  let studentSession: { prn?: string; phone?: string; role?: string } | null = null;
  if (studentCookie) {
    try {
      studentSession = JSON.parse(decodeURIComponent(studentCookie));
    } catch {
      try {
        studentSession = JSON.parse(studentCookie);
      } catch {}
    }
  }

  const staffCookie = request.cookies.get('foodline_staff_session')?.value;
  let staffSession: { email?: string; role?: string; full_name?: string } | null = null;
  if (staffCookie) {
    try {
      staffSession = JSON.parse(decodeURIComponent(staffCookie));
    } catch {
      try {
        staffSession = JSON.parse(staffCookie);
      } catch {}
    }
  }

  const isAuthenticated = !!user || (!!studentSession && studentSession.role === 'student') || !!staffSession;

  // 3. Strict Login Enforcement: If not logged in, redirect directly to /login
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 4. If logged in, check role permissions for restricted admin/kds pages
  const roleRestrictedEntry = Object.entries(ROLE_RESTRICTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  );

  if (roleRestrictedEntry) {
    const [, allowedRoles] = roleRestrictedEntry;

    let userRole = 'student';

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .single();

      if (profile && !profile.is_active) {
        const deactivatedUrl = new URL('/login?error=deactivated', request.url);
        return NextResponse.redirect(deactivatedUrl);
      }
      userRole = profile?.role || 'student';
    } else if (staffSession && staffSession.role) {
      userRole = staffSession.role;
    } else if (studentSession) {
      userRole = studentSession.role || 'student';
    }

    if (!allowedRoles.includes(userRole)) {
      // Unauthorized role -> redirect to student menu
      const redirectUrl = new URL('/menu', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
};
