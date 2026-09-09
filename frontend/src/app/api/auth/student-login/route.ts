import { NextResponse, NextRequest } from 'next/server';
import { findStudentUser, verifyStudentPassword } from '@/lib/google-sheets';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  // Prompt 1: Rate limiting on login routes (max 5 attempts per 15 min)
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

    // Query real Google Sheets database
    const student = await findStudentUser(cleanPrn);

    if (!student) {
      // If student is not registered in Google Sheets, prompt to create account
      return NextResponse.json(
        { success: false, error: `No account found for PRN "${cleanPrn}". Please click "Create Account" first.` },
        { status: 404 }
      );
    }

    const isMatch = verifyStudentPassword(cleanPass, student.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please verify and try again.' },
        { status: 401 }
      );
    }

    const studentData = {
      id: `student_${cleanPrn || student.prn}`,
      prn: cleanPrn || student.prn,
      full_name: student.name,
      role: 'student',
    };

    // Prepare response with session cookie for this browser
    const cookiePayload = encodeURIComponent(JSON.stringify(studentData));

    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      student: studentData,
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
      { success: false, error: err.message || 'Failed to authenticate student.' },
      { status: 500 }
    );
  }
}
