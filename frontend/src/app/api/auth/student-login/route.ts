import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'src/data/student-accounts.json');

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_foodline_campus_2026').digest('hex');
}

function getStoredStudents(): Record<string, any> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {}
  return {};
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prn, password } = body;

    const cleanPrn = (prn || '').toString().trim();
    const cleanPass = (password || '').toString();

    if (!cleanPrn || !cleanPass) {
      return NextResponse.json(
        { success: false, error: 'PRN and password are required.' },
        { status: 400 }
      );
    }

    const students = getStoredStudents();
    const student = students[cleanPrn];

    if (!student) {
      return NextResponse.json(
        { success: false, error: `No account found for PRN "${cleanPrn}". Please click "Create Account" first.` },
        { status: 404 }
      );
    }

    const passHash = hashPassword(cleanPass);
    if (student.password_hash !== passHash) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please verify and try again.' },
        { status: 401 }
      );
    }

    // Prepare response with session cookie for this browser
    const cookiePayload = encodeURIComponent(JSON.stringify({
      id: student.id || `student_${cleanPrn}`,
      prn: student.prn,
      full_name: student.full_name,
      role: 'student',
    }));

    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      student: {
        id: student.id || `student_${cleanPrn}`,
        prn: student.prn,
        full_name: student.full_name,
        role: 'student',
      },
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
