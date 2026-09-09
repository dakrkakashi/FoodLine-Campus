import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase/route-client';
import { appendStudentUser, findStudentUser } from '@/lib/google-sheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prn, password, fullName, phone, email } = body;

    const cleanPrn = (prn || '').toString().trim().toUpperCase();
    const cleanName = (fullName || '').toString().trim();
    const cleanPass = (password || '').toString();
    const cleanPhone = phone ? String(phone).trim() : '';
    const cleanEmail = email ? String(email).trim().toLowerCase() : `student_${cleanPrn.toLowerCase()}@sanjivani.edu.in`;

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

    // Check duplicate from real Google Sheets Database
    const existing = await findStudentUser(cleanPrn);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `An account for PRN ${cleanPrn} already exists. Please Sign In.` },
        { status: 409 }
      );
    }

    // Persist directly to Google Sheets Master Database ('FoodLine — Student Signup Form' tab)
    await appendStudentUser({
      name: cleanName,
      prn: cleanPrn,
      email: cleanEmail,
      password: cleanPass,
      phone: cleanPhone,
    });

    // Also persist to Supabase profiles (fire & forget)
    try {
      await supabase.from('profiles').upsert({
        id: crypto.randomUUID(),
        email: cleanEmail,
        full_name: cleanName,
        prn: cleanPrn,
        role: 'student',
      });
    } catch (e) {}

    const studentRecord = {
      id: `student_${cleanPrn}`,
      prn: cleanPrn,
      full_name: cleanName,
      role: 'student',
    };

    // Prepare response with session cookie for this browser
    const cookiePayload = encodeURIComponent(JSON.stringify(studentRecord));

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
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
      { success: false, error: err.message || 'Failed to create student account.' },
      { status: 500 }
    );
  }
}
