import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import canteensData from '@/data/canteens.json';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ campusId: string }> }
) {
  try {
    const { campusId } = await params;
    const defaultCampus = {
      id: campusId || 'a1111111-1111-1111-1111-111111111111',
      name: 'Sanjivani University',
      slug: 'sanjivani',
      location: 'Kopargaon, Maharashtra',
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('cafeterias')
          .select('*, campuses(id, name, slug, location)')
          .eq('campus_id', defaultCampus.id);

        if (!error && data && data.length > 0) {
          const canteens = data.map((c: any) => ({
            id: c.id,
            campus_id: c.campus_id,
            name: c.name,
            slug: c.slug,
            tagline: c.tagline || (c.slug === 'cafe7' ? 'Main Academic Canteen' : 'Campus Express'),
            location: c.location || 'Campus Quad',
            upiId: c.upi_id || '9960091371@slc',
            isPureVeg: c.is_pure_veg !== undefined ? c.is_pure_veg : true,
            isOpen: c.is_open !== undefined ? c.is_open : true,
            prepTimeMins: c.prep_time_mins || 5,
            activeSlotsCount: 4,
            dishesCount: c.slug === 'cafe7' ? 44 : 15,
            imageUrl: c.image_url || `/images/canteens/${c.slug}.webp`,
          }));

          const campusMeta = data[0]?.campuses || defaultCampus;
          return NextResponse.json({
            success: true,
            data: { campus: campusMeta, canteens },
            meta: { timestamp: new Date().toISOString() }
          });
        }
      } catch (dbErr) {
        console.warn('Supabase canteens fetch error, falling back:', dbErr);
      }
    }

    const canteens = (canteensData as any[]).filter(
      (c) => c.campus_id === defaultCampus.id || defaultCampus.id.includes('a1111111')
    );

    return NextResponse.json({
      success: true,
      data: { campus: defaultCampus, canteens },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch canteens' } },
      { status: 500 }
    );
  }
}
