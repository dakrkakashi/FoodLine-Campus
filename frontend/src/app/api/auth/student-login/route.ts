import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limiter';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ylweomuodekukjjpjrgx.supabase.co';
const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export async function POST(request: NextRequest) {
  const rateLimitResponse = checkRateLimit(request, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    routeName: 'student-login',
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { prn, password } = body;

    const cleanPrn = (prn || '').toString().trim().toUpperCase();
    const cleanPass = (password || '').toString();

    if (!cleanPrn || !cleanPass) {
      return NextResponse.json(
        { success: false, error: 'PRN and password are required.' },
        { status: 400 }
      );
    }

    if (!SUPABASE_ANON) {
      return NextResponse.json(
        { success: false, error: 'Supabase anon key is not configured.' },
        { status: 503 }
      );
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Server auth is not configured. Missing SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 503 }
      );
    }

    // Resolve PRN → email from Supabase profiles (source of truth)
    const cleanNoZero = cleanPrn.replace(/^0+/, '');
    let profile: { id: string; email: string; full_name: string | null; prn: string | null } | null = null;

    const { data: byPrn } = await admin
      .from('profiles')
      .select('id, email, full_name, prn')
      .ilike('prn', cleanPrn)
      .maybeSingle();
    profile = byPrn;

    if (!profile && cleanNoZero && cleanNoZero !== cleanPrn) {
      const { data: alt } = await admin
        .from('profiles')
        .select('id, email, full_name, prn')
        .ilike('prn', cleanNoZero)
        .maybeSingle();
      profile = alt;
    }

    // Login requires a real profile email — never invent student_*@sanjivani.edu.in
    if (!profile?.email) {
      return NextResponse.json(
        {
          success: false,
          error: `No account found for PRN "${cleanPrn}". Please click "Create Account" and add your Gmail.`,
        },
        { status: 404 }
      );
    }

    const loginEmail = profile.email;

    const anon = createClient(SUPABASE_URL, SUPABASE_ANON);
    const { data: authData, error: authError } = await anon.auth.signInWithPassword({
      email: loginEmail,
      password: cleanPass,
    });

    if (authError || !authData.session || !authData.user) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please verify and try again.' },
        { status: 401 }
      );
    }

    // Touch last_login_at
    await admin
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', authData.user.id);

    const studentData = {
      id: authData.user.id,
      prn: profile?.prn || cleanPrn,
      full_name: profile?.full_name || authData.user.user_metadata?.full_name || 'Campus Student',
      email: authData.user.email || loginEmail,
      role: 'student' as const,
    };

    const cookiePayload = encodeURIComponent(JSON.stringify(studentData));
    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      student: studentData,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    });

    response.cookies.set('foodline_student_session', cookiePayload, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to authenticate student.' },
      { status: 500 }
    );
  }
}
