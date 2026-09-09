import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { findStudentUser } from '@/lib/google-sheets';

async function resolveStudent(identifier: string) {
  const cleanId = (identifier || '').trim();
  if (!cleanId) {
    return { success: false, error: 'PRN or email is required', status: 400 };
  }

  // 1. Check real Google Sheets Master Database first
  try {
    const sheetStudent = await findStudentUser(cleanId);
    if (sheetStudent) {
      return {
        success: true,
        exists: true,
        data: {
          studentName: sheetStudent.name,
          prn: cleanId.toUpperCase() || sheetStudent.prn,
          email: sheetStudent.email,
          phone: sheetStudent.phone || '',
          role: 'student',
          campus: {
            id: 'a1111111-1111-1111-1111-111111111111',
            name: 'Sanjivani University',
            slug: 'sanjivani',
            location: 'Kopargaon, Maharashtra',
          },
          defaultCafeteriaId: 'b2222222-2222-2222-2222-222222222222',
        },
      };
    }
  } catch (sheetErr) {
    console.warn('[resolve-student] Error checking Google Sheets:', sheetErr);
  }

  // 2. Check Supabase profiles table
  if (supabase) {
    try {
      const cleanNoZero = cleanId.replace(/^0+/, '');
      const query = cleanId.includes('@')
        ? supabase.from('profiles').select('*, campuses(*), cafeterias(*)').ilike('email', cleanId).maybeSingle()
        : supabase.from('profiles').select('*, campuses(*), cafeterias(*)').ilike('prn', cleanId).maybeSingle();

      let { data, error } = await query;
      if (!data && cleanNoZero && cleanNoZero !== cleanId && !cleanId.includes('@')) {
        const altQuery = await supabase.from('profiles').select('*, campuses(*), cafeterias(*)').ilike('prn', cleanNoZero).maybeSingle();
        if (altQuery.data) {
          data = altQuery.data;
          error = null;
        }
      }

      if (!error && data) {
        return {
          success: true,
          exists: true,
          data: {
            studentName: data.full_name || 'Campus Student',
            prn: cleanId.toUpperCase() || data.prn,
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || 'student',
            campus: {
              id: data.campuses?.id || 'a1111111-1111-1111-1111-111111111111',
              name: data.campuses?.name || 'Sanjivani University',
              slug: data.campuses?.slug || 'sanjivani',
              location: data.campuses?.location || 'Kopargaon, Maharashtra',
            },
            defaultCafeteriaId: data.cafeteria_id || 'b2222222-2222-2222-2222-222222222222',
          },
        };
      }
    } catch (dbErr) {
      console.warn('[resolve-student] Supabase query error:', dbErr);
    }
  }

  // Not found
  return {
    success: true,
    exists: false,
    data: null,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prn = searchParams.get('prn') || searchParams.get('identifier') || searchParams.get('email') || '';
    const result = await resolveStudent(prn);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const prn = body.prn || body.identifier || body.email || '';
    const result = await resolveStudent(prn);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
