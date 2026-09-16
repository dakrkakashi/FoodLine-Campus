import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getSupabaseFrontendRuntimeConfig } from '@/lib/supabase/runtime';

export async function POST(request: NextRequest) {
  const rateLimitResponse = checkRateLimit(request, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    routeName: 'student-login',
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const runtime = getSupabaseFrontendRuntimeConfig(process.env);
    const SUPABASE_URL = runtime.url || '';
    const SUPABASE_ANON = runtime.anonKey || '';

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

    if (!runtime.isConfigured || !SUPABASE_URL || !SUPABASE_ANON) {
      return NextResponse.json(
        { success: false, error: runtime.reason || 'Supabase auth is not configured.' },
        { status: 503 }
      );
    }

    const admin = createAdminClient();
    const anon = createClient(SUPABASE_URL, SUPABASE_ANON);
    const dbClient = admin || anon;

    // Resolve PRN → email from Supabase profiles (source of truth)
    const cleanNoZero = cleanPrn.replace(/^0+/, '');
    let profile: { id: string; email: string; full_name: string | null; prn: string | null } | null = null;

    const { data: byPrn } = await dbClient
      .from('profiles')
      .select('id, email, full_name, prn')
      .ilike('prn', cleanPrn)
      .maybeSingle();
    profile = byPrn;

    if (!profile && cleanNoZero && cleanNoZero !== cleanPrn) {
      const { data: alt } = await dbClient
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
    if (admin) {
      await admin
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', authData.user.id);
    }

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
      message: 'Signed in successfully!',
      student: studentData,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    });

    response.cookies.set('foodline_student_session', cookiePayload, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
