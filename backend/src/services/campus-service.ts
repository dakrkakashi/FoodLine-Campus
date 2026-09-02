import { CampusGeoHierarchy, Canteen, ResolvedStudentProfile } from '../lib/types.js';
import campusesGeoData from '../data/campuses-geo.json';
import canteensData from '../data/canteens.json';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export class CampusService {
  /**
   * Get 4-tier geographic hierarchy of campuses (State -> District -> Town -> Campus)
   */
  public static async getGeoHierarchy(): Promise<CampusGeoHierarchy> {
    if (isSupabaseConfigured) {
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

          const hierarchy: CampusGeoHierarchy = {
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
            return hierarchy;
          }
        }
      } catch (err) {
        console.warn('Supabase geo hierarchy fetch fallback to local cache:', err);
      }
    }

    // Fallback to local memory cache
    return campusesGeoData as CampusGeoHierarchy;
  }

  /**
   * Get all registered canteens for a specific campus with live operational metrics
   */
  public static async getCanteensByCampus(campusId: string): Promise<{ campus: any; canteens: Canteen[] }> {
    const defaultCampus = {
      id: campusId || 'a1111111-1111-1111-1111-111111111111',
      name: 'Sanjivani University',
      slug: 'sanjivani',
      location: 'Kopargaon, Maharashtra',
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('cafeterias')
          .select('*, campuses(id, name, slug, location)')
          .eq('campus_id', defaultCampus.id);

        if (!error && data && data.length > 0) {
          const canteens: Canteen[] = data.map((c: any) => ({
            id: c.id,
            campus_id: c.campus_id,
            name: c.name,
            slug: c.slug,
            tagline: c.tagline || (c.slug === 'cafe7' ? 'Main Academic Canteen' : 'Campus Express'),
            location: c.location || 'Campus Quad',
            upiId: c.upi_id || '9960091371@slc',
            upi_id: c.upi_id || '9960091371@slc',
            isPureVeg: c.is_pure_veg !== undefined ? c.is_pure_veg : true,
            is_pure_veg: c.is_pure_veg !== undefined ? c.is_pure_veg : true,
            isOpen: c.is_open !== undefined ? c.is_open : true,
            is_active: c.is_active !== undefined ? c.is_active : true,
            prepTimeMins: c.prep_time_mins || 5,
            prep_time_mins: c.prep_time_mins || 5,
            activeSlotsCount: 4,
            dishesCount: c.slug === 'cafe7' ? 44 : 15,
            imageUrl: c.image_url || `/images/canteens/${c.slug}.webp`,
            image_url: c.image_url || `/images/canteens/${c.slug}.webp`,
          }));

          const campusMeta = data[0]?.campuses || defaultCampus;
          return { campus: campusMeta, canteens };
        }
      } catch (err) {
        console.warn('Supabase canteens fetch fallback to local cache:', err);
      }
    }

    // Fallback to local memory cache
    const canteens = (canteensData as any[]).filter(
      (c) => c.campus_id === defaultCampus.id || defaultCampus.id.includes('a1111111')
    );

    return {
      campus: defaultCampus,
      canteens,
    };
  }

  /**
   * Auto-resolve student name, PRN, campus, and default canteen
   */
  public static async resolveStudent(identifier: string): Promise<ResolvedStudentProfile> {
    const cleanId = (identifier || '').trim();

    if (isSupabaseConfigured && cleanId) {
      try {
        const query = cleanId.includes('@')
          ? supabase.from('profiles').select('*, campuses(*), cafeterias(*)').ilike('email', cleanId).maybeSingle()
          : supabase.from('profiles').select('*, campuses(*), cafeterias(*)').ilike('prn', cleanId).maybeSingle();

        const { data, error } = await query;
        if (!error && data) {
          return {
            studentName: data.full_name || 'Student',
            prn: data.prn || cleanId,
            campus: {
              id: data.campuses?.id || 'a1111111-1111-1111-1111-111111111111',
              name: data.campuses?.name || 'Sanjivani University',
              slug: data.campuses?.slug || 'sanjivani',
              location: data.campuses?.location || 'Kopargaon, Maharashtra',
            },
            defaultCafeteriaId: data.cafeteria_id || 'b2222222-2222-2222-2222-222222222222',
          };
        }
      } catch (err) {
        console.warn('Supabase student resolve fallback to PRN heuristic:', err);
      }
    }

    // Local heuristic fallback based on Sanjivani PRN structure (e.g. 2023SUCS... or @sanjivani.edu.in)
    return {
      studentName: cleanId.toLowerCase().includes('shivam') ? 'Shivam Nirmal' : 'Campus Student',
      prn: cleanId || '2023SUCS0142',
      campus: {
        id: 'a1111111-1111-1111-1111-111111111111',
        name: 'Sanjivani University',
        slug: 'sanjivani',
        location: 'Kopargaon, Maharashtra',
      },
      defaultCafeteriaId: 'b2222222-2222-2222-2222-222222222222',
    };
  }
}
