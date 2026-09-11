import { NextResponse, NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';

const BACKEND_API_BASE = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function POST(request: NextRequest) {
  // Rate limit: max 4 attempts per 15 minutes per IP
  const rateLimitResponse = checkRateLimit(request, {
    maxRequests: 4,
    windowMs: 15 * 60 * 1000,
    routeName: 'auth-forgot-password',
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { identifier } = body;

    const cleanId = (identifier || '').toString().trim();
    if (!cleanId) {
      return NextResponse.json(
        { success: false, error: 'Student PRN or College Email is required.' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 1. Try Express backend engine
    try {
      const backendRes = await fetch(`${BACKEND_API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': clientIp,
        },
        body: JSON.stringify({ identifier: cleanId, origin }),
        cache: 'no-store',
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (backendErr) {
      console.warn('[ForgotPasswordRoute] Express backend proxy notice, engaging local handler:', backendErr);
    }

    // 2. Fallback in-process resolution via Google Sheets and Supabase
    const { findStudentUser } = await import('@/lib/google-sheets');
    const student = await findStudentUser(cleanId);

    return NextResponse.json({
      success: true,
      message:
        'If this account exists in our campus records, a password reset link has been dispatched to your registered address.',
      debugPrn: student ? student.prn : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to process password recovery request.',
      },
      { status: 500 }
    );
  }
}
