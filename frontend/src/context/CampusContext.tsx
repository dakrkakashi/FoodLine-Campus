'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Campus, Canteen, CampusGeoHierarchy } from '@/lib/types';

export const DEFAULT_CAMPUS: Campus = {
  id: 'a1111111-1111-1111-1111-111111111111',
  name: 'Sanjivani University',
  slug: 'sanjivani',
  location: 'Kopargaon, Maharashtra',
  state: 'Maharashtra',
  district: 'Ahmednagar',
  city_town: 'Kopargaon',
  pincode: '423603',
  totalCanteens: 5,
  isVerified: true,
};

export const SANJIVANI_CANTEENS: Canteen[] = [
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    campus_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Cafe @7',
    slug: 'cafe7',
    tagline: 'Main Academic Canteen',
    location: 'Ground Floor, Main Academic Quad (Near Mech Dept)',
    upiId: '9960091371@slc',
    isPureVeg: true,
    isOpen: true,
    prepTimeMins: 5,
    activeSlotsCount: 4,
    dishesCount: 44,
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    campus_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'South Corner Dosa Bar',
    slug: 'south-corner',
    tagline: 'Authentic Crispy Dosas & Idli Sambar',
    location: 'Next to Central Library Block',
    upiId: '9960091371@slc',
    isPureVeg: true,
    isOpen: true,
    prepTimeMins: 4,
    activeSlotsCount: 4,
    dishesCount: 18,
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    campus_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Nescafe Campus Kiosk',
    slug: 'nescafe-kiosk',
    tagline: 'Instant Frappe, Maggi & Quick Sips',
    location: 'Central Lawn Fountain Corner',
    upiId: '9960091371@slc',
    isPureVeg: true,
    isOpen: true,
    prepTimeMins: 2,
    activeSlotsCount: 4,
    dishesCount: 14,
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    campus_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'MBA Block Cafeteria',
    slug: 'mba-cafeteria',
    tagline: 'Gourmet Paninis, Rolls & Subs',
    location: 'Management Building, 1st Floor Terrace',
    upiId: '9960091371@slc',
    isPureVeg: true,
    isOpen: true,
    prepTimeMins: 6,
    activeSlotsCount: 4,
    dishesCount: 22,
  },
  {
    id: 'b6666666-6666-6666-6666-666666666666',
    campus_id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Central Hostel Dining Mess',
    slug: 'hostel-mess',
    tagline: 'Student Lunch Thali & Poha',
    location: 'Hostel Complex, Wing B',
    upiId: '9960091371@slc',
    isPureVeg: true,
    isOpen: true,
    prepTimeMins: 1,
    activeSlotsCount: 3,
    dishesCount: 8,
  },
];

export const FALLBACK_GEO_HIERARCHY: CampusGeoHierarchy = {
  states: [
    {
      id: 'maharashtra',
      name: 'Maharashtra',
      districts: [
        {
          id: 'ahmednagar',
          name: 'Ahmednagar',
          cities: [
            {
              id: 'kopargaon',
              name: 'Kopargaon',
              campuses: [
                DEFAULT_CAMPUS,
                {
                  id: 'a2222222-2222-2222-2222-222222222222',
                  name: 'Sanjivani College of Engineering (Autonomous)',
                  slug: 'sres-coe',
                  location: 'Kopargaon, Maharashtra',
                  state: 'Maharashtra',
                  district: 'Ahmednagar',
                  city_town: 'Kopargaon',
                  pincode: '423603',
                  totalCanteens: 3,
                  isVerified: true,
                },
              ],
            },
            {
              id: 'shirdi',
              name: 'Shirdi',
              campuses: [
                {
                  id: 'a3333333-3333-3333-3333-333333333333',
                  name: 'Shri Saibaba Institute of Engineering',
                  slug: 'ssie-shirdi',
                  location: 'Shirdi, Maharashtra',
                  state: 'Maharashtra',
                  district: 'Ahmednagar',
                  city_town: 'Shirdi',
                  pincode: '423109',
                  totalCanteens: 2,
                  isVerified: true,
                },
              ],
            },
          ],
        },
        {
          id: 'pune',
          name: 'Pune',
          cities: [
            {
              id: 'kothrud',
              name: 'Kothrud / Shivajinagar',
              campuses: [
                {
                  id: 'a4444444-4444-4444-4444-444444444444',
                  name: 'COEP Technological University',
                  slug: 'coep-pune',
                  location: 'Shivajinagar, Pune',
                  state: 'Maharashtra',
                  district: 'Pune',
                  city_town: 'Pune',
                  pincode: '411005',
                  totalCanteens: 4,
                  isVerified: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

interface CampusContextType {
  selectedCampus: Campus;
  selectedCanteen: Canteen;
  availableCanteens: Canteen[];
  geoHierarchy: CampusGeoHierarchy;
  isLoadingCanteens: boolean;
  selectCampus: (campus: Campus) => void;
  selectCanteen: (canteen: Canteen) => void;
  refreshCanteens: () => Promise<void>;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [selectedCampus, setSelectedCampus] = useState<Campus>(DEFAULT_CAMPUS);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen>(SANJIVANI_CANTEENS[0]);
  const [availableCanteens, setAvailableCanteens] = useState<Canteen[]>(SANJIVANI_CANTEENS);
  const [geoHierarchy, setGeoHierarchy] = useState<CampusGeoHierarchy>(FALLBACK_GEO_HIERARCHY);
  const [isLoadingCanteens, setIsLoadingCanteens] = useState(false);

  // Restore saved selections from localStorage
  useEffect(() => {
    try {
      const savedCampus = localStorage.getItem('foodline_selected_campus');
      if (savedCampus) {
        setSelectedCampus(JSON.parse(savedCampus));
      }
      const savedCanteen = localStorage.getItem('foodline_selected_canteen');
      if (savedCanteen) {
        setSelectedCanteen(JSON.parse(savedCanteen));
      }
    } catch (e) {
      console.warn('Could not restore campus from localStorage:', e);
    }
  }, []);

  // Fetch live canteens for selected campus
  const loadCanteens = useCallback(async (campusId: string) => {
    setIsLoadingCanteens(true);
    try {
      const res = await fetch(`/api/campuses/${campusId}/canteens`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.canteens) && json.data.canteens.length > 0) {
          setAvailableCanteens(json.data.canteens);
          return;
        }
      }
    } catch (e) {
      console.warn('API /api/campuses/:id/canteens not yet reachable, using resilient client fallback:', e);
    } finally {
      setIsLoadingCanteens(false);
    }
    // Fallback if API is offline or migrating
    if (campusId === DEFAULT_CAMPUS.id) {
      setAvailableCanteens(SANJIVANI_CANTEENS);
    }
  }, []);

  // Fetch geo hierarchy
  useEffect(() => {
    async function loadGeo() {
      try {
        const res = await fetch('/api/campuses/geo');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.states) {
            setGeoHierarchy(json.data);
          }
        }
      } catch (e) {
        console.warn('API /api/campuses/geo not yet reachable, using fallback:', e);
      }
    }
    loadGeo();
  }, []);

  useEffect(() => {
    loadCanteens(selectedCampus.id);
  }, [selectedCampus.id, loadCanteens]);

  const selectCampus = (campus: Campus) => {
    setSelectedCampus(campus);
    try {
      localStorage.setItem('foodline_selected_campus', JSON.stringify(campus));
    } catch (e) {
      console.warn('Failed to persist campus selection:', e);
    }
  };

  const selectCanteen = (canteen: Canteen) => {
    setSelectedCanteen(canteen);
    try {
      localStorage.setItem('foodline_selected_canteen', JSON.stringify(canteen));
    } catch (e) {
      console.warn('Failed to persist canteen selection:', e);
    }
  };

  const refreshCanteens = async () => {
    await loadCanteens(selectedCampus.id);
  };

  return (
    <CampusContext.Provider
      value={{
        selectedCampus,
        selectedCanteen,
        availableCanteens,
        geoHierarchy,
        isLoadingCanteens,
        selectCampus,
        selectCanteen,
        refreshCanteens,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
}
