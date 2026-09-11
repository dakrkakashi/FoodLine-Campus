import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { findStudentUser } from '@/lib/google-sheets';

async function resolveStudent(identifier: string) {
  const cleanId = (identifier || '').trim();
  if (!cleanId) {
    return { success: false, error: 'PRN or email is required', status: 400 };
  }

  const campusFallback = {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Sanjivani University',
    slug: 'sanjivani',
    location: 'Kopargaon, Maharashtra',
  };
  const cafeteriaFallback = 'b2222222-2222-2222-2222-222222222222';

  // 1. Supabase profiles first (source of truth for login) — admin bypasses RLS
  const admin = createAdminClient();
  if (admin) {
    try {
      const cleanNoZero = cleanId.replace(/^0+/, '');
      const query = cleanId.includes('@')
        ? admin.from('profiles').select('*, campuses(*), cafeterias(*)').ilike('email', cleanId).maybeSingle()
        : admin.from('profiles').select('*, campuses(*), cafeterias(*)').ilike('prn', cleanId).maybeSingle();

      let { data, error } = await query;
      if (!data && cleanNoZero && cleanNoZero !== cleanId && !cleanId.includes('@')) {
        const altQuery = await admin.from('profiles').select('*, campuses(*), cafeterias(*)').ilike('prn', cleanNoZero).maybeSingle();
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
            prn: data.prn || cleanId.toUpperCase(),
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || 'student',
            campus: {
              id: data.campuses?.id || campusFallback.id,
              name: data.campuses?.name || campusFallback.name,
              slug: data.campuses?.slug || campusFallback.slug,
              location: data.campuses?.location || campusFallback.location,
            },
            defaultCafeteriaId: data.cafeteria_id || cafeteriaFallback,
          },
        };
      }
    } catch (dbErr) {
      console.warn('[resolve-student] Supabase query error:', dbErr);
    }
  }

  // 2. Google Sheets mirror (legacy / staff ledger fallback)
  try {
    const sheetStudent = await findStudentUser(cleanId);
    if (sheetStudent) {
      return {
        success: true,
        exists: true,
        data: {
          studentName: sheetStudent.name,
          prn: sheetStudent.prn || cleanId.toUpperCase(),
          email: sheetStudent.email,
          phone: sheetStudent.phone || '',
          role: 'student',
          campus: campusFallback,
          defaultCafeteriaId: cafeteriaFallback,
        },
      };
    }
  } catch (sheetErr) {
    console.warn('[resolve-student] Error checking Google Sheets:', sheetErr);
  }

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
