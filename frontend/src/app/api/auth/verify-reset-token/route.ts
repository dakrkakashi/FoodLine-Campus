import { NextResponse, NextRequest } from 'next/server';

const BACKEND_API_BASE = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || '';

  if (!token) {
    return NextResponse.json(
      { valid: false, message: 'Password reset token is missing.' },
      { status: 400 }
    );
  }

  try {
    const backendRes = await fetch(`${BACKEND_API_BASE}/auth/verify-reset-token?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }

    const errData = await backendRes.json().catch(() => ({}));
    return NextResponse.json(
      { valid: false, message: errData.message || 'Token verification failed.' },
      { status: backendRes.status || 400 }
    );
  } catch (err: any) {
    console.warn('[VerifyResetTokenRoute] Backend fetch notice:', err.message);
    return NextResponse.json(
      { valid: false, message: 'Unable to verify reset token at this time. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = body.token || '';

    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Password reset token is missing.' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_API_BASE}/auth/verify-reset-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, message: err.message || 'Verification request failed.' },
      { status: 500 }
    );
  }
}
