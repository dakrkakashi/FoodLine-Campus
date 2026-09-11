import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { findStudentUser, updateStudentPassword } from '@/lib/google-sheets';
import { checkRateLimit } from '@/lib/rate-limiter';
import { supabase } from '@/lib/supabase/route-client';

const BACKEND_API_BASE = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const AUTHORIZED_STAFF_PASSKEY = process.env.STAFF_AUTH_PASSKEY || 'foodline2026';
const AUTHORIZED_STAFF_EMAILS = [
  'foodlinecampus07@gmail.com',
  'foodlinecampus@gmail.com',
  'admin@sanjivani.edu.in',
  'kitchen@sanjivani.edu.in',
  'cafe7@sanjivani.edu.in',
];

export async function POST(request: NextRequest) {
  // Rate limiting: max 6 attempts per 15 minutes
  const rateLimitResponse = checkRateLimit(request, {
    maxRequests: 6,
    windowMs: 15 * 60 * 1000,
    routeName: 'reset-password',
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { token, newPassword, type, prn, identifier, email } = body;

    // A. TOKEN-BASED PASSWORD RESET (High Security Flow)
    if (token) {
      const cleanToken = (token || '').toString().trim();
      const cleanPass = (newPassword || '').toString();

      if (!cleanPass || cleanPass.length < 4) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 4 characters long.' },
          { status: 400 }
        );
      }

      // Proxy to backend engine
      try {
        const clientIp =
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          request.headers.get('x-real-ip') ||
          '127.0.0.1';

        const backendRes = await fetch(`${BACKEND_API_BASE}/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': clientIp,
          },
          body: JSON.stringify({ token: cleanToken, newPassword: cleanPass }),
          cache: 'no-store',
        });

        const backendData = await backendRes.json();
        return NextResponse.json(backendData, { status: backendRes.status });
      } catch (backendErr) {
        console.warn('[ResetPasswordRoute] Backend proxy notice:', backendErr);
        return NextResponse.json(
          { success: false, error: 'Password reset service temporarily unavailable. Please try again shortly.' },
          { status: 500 }
        );
      }
    }

    // B. LEGACY / DIRECT MODAL RESETS

    // 1. Staff / Admin Password Recovery
    if (type === 'staff') {
      return NextResponse.json({
        success: true,
        authorizedPasskey: AUTHORIZED_STAFF_PASSKEY,
        authorizedEmails: AUTHORIZED_STAFF_EMAILS,
        message: 'Staff master passkey retrieved for authorized campus accounts.',
      });
    }

    // 2. Student PRN Password Reset (Direct form)
    const cleanPrn = (prn || '').toString().trim().toUpperCase();
    const cleanPass = (newPassword || '').toString();
    const cleanId = (identifier || '').toString().trim().toLowerCase();

    if (!cleanPrn) {
      return NextResponse.json(
        { success: false, error: 'Student PRN / Roll Number is required.' },
        { status: 400 }
      );
    }

    if (!cleanId) {
      return NextResponse.json(
        { success: false, error: 'Registered College Email or Phone Number is required for verification.' },
        { status: 400 }
      );
    }

    if (!cleanPass || cleanPass.length < 4) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 4 characters.' },
        { status: 400 }
      );
    }

    // Locate student in Google Sheets database
    const student = await findStudentUser(cleanPrn);
    if (!student) {
      return NextResponse.json(
        { success: false, error: `No student account found for PRN "${cleanPrn}". Please click "Create Account".` },
        { status: 404 }
      );
    }

    // Verification check: email or phone must match registered student record
    const studentEmail = (student.email || '').toLowerCase();
    const studentPhone = (student.phone || '').replace(/\D/g, '');
    const cleanDigits = cleanId.replace(/\D/g, '');

    const matchesEmail = studentEmail && (studentEmail === cleanId || cleanId.includes(studentEmail) || studentEmail.includes(cleanId));
    const matchesPhone = studentPhone && cleanDigits.length >= 4 && (studentPhone.endsWith(cleanDigits) || cleanDigits.endsWith(studentPhone));
    const hasVerificationData = !!(studentEmail || studentPhone);

    if (hasVerificationData && !matchesEmail && !matchesPhone) {
      return NextResponse.json(
        {
          success: false,
          error: `Verification mismatch: The email or mobile number provided does not match the registered record for PRN "${cleanPrn}".`,
        },
        { status: 403 }
      );
    }

    // Update password in Google Sheets master tab
    const updated = await updateStudentPassword(cleanPrn, cleanPass);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update password in Google Sheets. Please contact the canteen desk.' },
        { status: 500 }
      );
    }

    // Also update Supabase profiles if exists
    try {
      await supabase
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('prn', cleanPrn);
    } catch {}

    const studentRecord = {
      id: `student_${cleanPrn}`,
      prn: cleanPrn,
      full_name: student.name,
      role: 'student',
    };

    // Prepare response and set active session cookie
    const cookiePayload = encodeURIComponent(JSON.stringify(studentRecord));
    const response = NextResponse.json({
      success: true,
      message: `Password for ${student.name} (${cleanPrn}) reset successfully! You are now logged in.`,
      student: studentRecord,
    });

    response.cookies.set('foodline_student_session', cookiePayload, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process password reset.' },
      { status: 500 }
    );
  }
}
