import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase/route-client';

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

function saveStoredStudents(data: Record<string, any>) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prn, password, fullName } = body;

    const cleanPrn = (prn || '').toString().trim();
    const cleanName = (fullName || '').toString().trim();
    const cleanPass = (password || '').toString();

    if (!cleanPrn || !cleanPass || !cleanName) {
      return NextResponse.json(
        { success: false, error: 'Full name, PRN, and password are required.' },
        { status: 400 }
      );
    }

    if (cleanPass.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 4 characters.' },
        { status: 400 }
      );
    }

    const students = getStoredStudents();
    if (students[cleanPrn]) {
      return NextResponse.json(
        { success: false, error: `An account for PRN ${cleanPrn} already exists. Please Sign In.` },
        { status: 409 }
      );
    }

    const passHash = hashPassword(cleanPass);
    const studentRecord = {
      id: `student_${cleanPrn}`,
      prn: cleanPrn,
      full_name: cleanName,
      password_hash: passHash,
      role: 'student',
      created_at: new Date().toISOString(),
    };

    // Save locally
    students[cleanPrn] = studentRecord;
    saveStoredStudents(students);

    // Also attempt to upsert in Supabase profiles if possible
    try {
      await supabase.from('profiles').upsert({
        id: crypto.randomUUID(),
        email: `student_${cleanPrn}@sanjivani.edu.in`,
        full_name: cleanName,
        prn: cleanPrn,
        role: 'student',
      });
    } catch (e) {}

    // Prepare response with session cookie for this browser
    const cookiePayload = encodeURIComponent(JSON.stringify({
      id: studentRecord.id,
      prn: studentRecord.prn,
      full_name: studentRecord.full_name,
      role: 'student',
    }));

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      student: {
        id: studentRecord.id,
        prn: studentRecord.prn,
        full_name: studentRecord.full_name,
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
      { success: false, error: err.message || 'Failed to create student account.' },
      { status: 500 }
    );
  }
}
