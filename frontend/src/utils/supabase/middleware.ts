import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/kds': ['kitchen', 'canteen_manager', 'admin'],
  '/admin': ['canteen_manager', 'admin'],
};

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

  // Refresh auth session
  const { data: { user } } = await supabase.auth.getUser();

  // Check if route requires role authorization
  const protectedEntry = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  );

  if (protectedEntry) {
    const [, allowedRoles] = protectedEntry;

    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

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
      // Unauthorized role -> redirect to menu
      const redirectUrl = new URL('/menu', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
};
