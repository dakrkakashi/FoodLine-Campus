import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import geoData from '@/data/campuses-geo.json';

export async function GET() {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('campuses')
          .select('id, name, slug, location, state, district, city_town, pincode');

        if (!error && data && data.length > 0) {
          const stateMap: Record<string, any> = {};

          for (const campus of data) {
            const stateName = campus.state || 'Maharashtra';
            const stateId = stateName.toLowerCase().replace(/\s+/g, '-');
            const distName = campus.district || 'Ahmednagar';
            const distId = distName.toLowerCase().replace(/\s+/g, '-');
            const cityName = campus.city_town || 'Kopargaon';
            const cityId = cityName.toLowerCase().replace(/\s+/g, '-');

            if (!stateMap[stateId]) {
              stateMap[stateId] = { id: stateId, name: stateName, districtsMap: {} };
            }
            if (!stateMap[stateId].districtsMap[distId]) {
              stateMap[stateId].districtsMap[distId] = { id: distId, name: distName, citiesMap: {} };
            }
            if (!stateMap[stateId].districtsMap[distId].citiesMap[cityId]) {
              stateMap[stateId].districtsMap[distId].citiesMap[cityId] = {
                id: cityId,
                name: cityName,
                campuses: [],
              };
            }

            stateMap[stateId].districtsMap[distId].citiesMap[cityId].campuses.push({
              id: campus.id,
              name: campus.name,
              slug: campus.slug,
              location: campus.location,
              pincode: campus.pincode || '423603',
              totalCanteens: 5,
              isVerified: true,
            });
          }

          const hierarchy = {
            states: Object.values(stateMap).map((s: any) => ({
              id: s.id,
              name: s.name,
              districts: Object.values(s.districtsMap).map((d: any) => ({
                id: d.id,
                name: d.name,
                cities: Object.values(d.citiesMap).map((c: any) => ({
                  id: c.id,
                  name: c.name,
                  campuses: c.campuses,
                })),
              })),
            })),
          };

          if (hierarchy.states.length > 0) {
            return NextResponse.json({
              success: true,
              data: hierarchy,
              meta: { timestamp: new Date().toISOString() }
            });
          }
        }
      } catch (dbErr) {
        console.warn('Supabase geo hierarchy fetch error, falling back:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: geoData,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch geo hierarchy' } },
      { status: 500 }
    );
  }
}
