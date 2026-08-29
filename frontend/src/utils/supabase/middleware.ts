import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

// Routes that require specific staff/admin roles
const ROLE_RESTRICTED_ROUTES: Record<string, string[]> = {
  '/kds': ['kitchen', 'canteen_manager', 'admin'],
  '/admin': ['canteen_manager', 'admin'],
};

// Routes that can be accessed without any login
const PUBLIC_ROUTES = [
  '/login',
  '/display', // Public TV counter display kiosk in cafeteria
  '/auth',
  '/terms',
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

  // 2. Fetch authenticated user session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Strict Login Enforcement: If not logged in, redirect directly to /login
  if (!user) {
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

    // Query user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (profile && !profile.is_active) {
      const deactivatedUrl = new URL('/login?error=deactivated', request.url);
      return NextResponse.redirect(deactivatedUrl);
    }

    const userRole = profile?.role || 'student';

    if (!allowedRoles.includes(userRole)) {
      // Unauthorized role -> redirect to student menu
      const redirectUrl = new URL('/menu', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
};
