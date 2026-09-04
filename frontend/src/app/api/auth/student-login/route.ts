import { NextResponse } from 'next/server';
import { findStudentUser, verifyStudentPassword } from '@/lib/google-sheets';

export async function POST(request: Request) {
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
      id: `student_${student.prn}`,
      prn: student.prn,
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
