'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Building2,
  ChevronRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  Sparkles,
  Utensils,
  GraduationCap,
  Store,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition, SpotlightCard } from '@/components/ui';
import { useCampus } from '@/context/CampusContext';
import { Campus } from '@/lib/types';

export default function SelectCampusPage() {
  const router = useRouter();
  const { geoHierarchy, selectedCampus, selectCampus } = useCampus();

  // Tier selections
  const [selectedStateId, setSelectedStateId] = useState<string>('maharashtra');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('ahmednagar');
  const [selectedCityId, setSelectedCityId] = useState<string>('kopargaon');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Active state, district, city objects
  const currentState = useMemo(
    () => geoHierarchy.states.find((s) => s.id === selectedStateId) || geoHierarchy.states[0],
    [geoHierarchy, selectedStateId]
  );

  const currentDistrict = useMemo(
    () => currentState?.districts.find((d) => d.id === selectedDistrictId) || currentState?.districts[0],
    [currentState, selectedDistrictId]
  );

  const currentCity = useMemo(
    () => currentDistrict?.cities.find((c) => c.id === selectedCityId) || currentDistrict?.cities[0],
    [currentDistrict, selectedCityId]
  );

  // Campuses for the current drilled-down city
  const drilledCampuses = useMemo(() => currentCity?.campuses || [], [currentCity]);

  // Global search across all campuses in the hierarchy
  const allCampuses = useMemo(() => {
    const list: (Campus & { stateName: string; districtName: string; cityName: string })[] = [];
    for (const st of geoHierarchy.states) {
      for (const dist of st.districts) {
        for (const ct of dist.cities) {
          for (const camp of ct.campuses) {
            list.push({
              ...camp,
              stateName: st.name,
              districtName: dist.name,
              cityName: ct.name,
            });
          }
        }
      }
    }
    return list;
  }, [geoHierarchy]);

  const searchResults = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const query = globalSearch.toLowerCase();
    return allCampuses.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.cityName.toLowerCase().includes(query) ||
        c.districtName.toLowerCase().includes(query)
    );
  }, [globalSearch, allCampuses]);

  const handleSelectCampus = (campus: Campus) => {
    selectCampus(campus);
    router.push('/canteens');
  };

  return (
    <PageTransition className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-32 relative overflow-hidden transition-colors duration-500">
      {/* Background Aurora Glow */}
      <div className="aurora-mesh">
        <div className="aurora-blob w-[36rem] h-[36rem] bg-accent-orange -top-24 -right-20" style={{ animationDuration: '20s' }} />
        <div className="aurora-blob w-[38rem] h-[38rem] bg-accent-teal top-1/2 -left-32" style={{ animationDuration: '24s', animationDelay: '-6s' }} />
      </div>

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-6 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)]"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-orange/10 border border-accent-orange/30 text-accent-amber text-xs font-black uppercase tracking-wider">
            <Sparkles size={12} /> Campus Directory
          </div>
        </div>

        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="w-16 h-16 mx-auto rounded-3xl bg-linear-to-tr from-accent-orange to-accent-amber text-black flex items-center justify-center shadow-xl shadow-accent-orange/30 mb-4">
            <Building2 size={30} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3">
            Select Your{' '}
            <span className="bg-linear-to-r from-accent-orange via-accent-amber to-accent-teal bg-clip-text text-transparent">
              Campus
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
            Choose your university or college to view all on-campus registered canteens, live break slots, and fresh daily menus.
          </p>

          {/* Quick Search Input */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Instant search by college name, town, or city..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all shadow-xl backdrop-blur-xl"
            />
          </div>
        </motion.div>

        {/* Instant Search Results View */}
        {globalSearch.trim() ? (
          <div className="space-y-4">
            <div className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
              <span>Matching Colleges ({searchResults.length})</span>
              <button
                onClick={() => setGlobalSearch('')}
                className="text-accent-amber hover:underline cursor-pointer text-xs"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <SpotlightCard className="p-10 rounded-[2.5rem] text-center border-dashed border-[var(--border-glass)]">
                <GraduationCap className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">No colleges found for "{globalSearch}"</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-6">Try searching by town name (e.g. Kopargaon, Pune) or browse the directory below.</p>
                <button
                  onClick={() => setGlobalSearch('')}
                  className="px-5 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--text-primary)] text-xs font-bold transition cursor-pointer"
                >
                  Browse by Location Stepper
                </button>
              </SpotlightCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((campus) => (
                  <SpotlightCard
                    key={campus.id}
                    spotlightColor="var(--accent-orange-glow, rgba(255, 107, 44, 0.22))"
                    className="p-6 rounded-[2rem] border border-[var(--border-glass)] hover:border-accent-orange/50 hover:shadow-[0_0_30px_var(--accent-orange-glow)] transition-all cursor-pointer group flex flex-col justify-between bg-[var(--bg-card)] shadow-sm dark:shadow-none"
                    onClick={() => handleSelectCampus(campus)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-teal/15 border border-accent-teal/30 text-accent-teal text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle2 size={12} /> Verified Campus
                        </span>
                        <span className="text-[11px] font-bold text-[var(--text-secondary)] flex items-center gap-1">
                          <Store size={13} className="text-accent-amber" /> {campus.totalCanteens || 5} Canteens
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-accent-amber transition-colors leading-snug mb-1">
                        {campus.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        <MapPin size={12} className="text-accent-orange" /> {campus.location}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[var(--border-glass)] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {campus.cityName}, {campus.districtName}
                      </span>
                      <span className="text-xs font-black text-accent-orange group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Canteens <ChevronRight size={14} />
                      </span>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 4-Tier Cascading Geo Stepper */
          <div className="space-y-8">
            {/* Step 1: State Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-[#FF6B2C] text-white text-[11px] font-black flex items-center justify-center">1</span>
                <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">Select State</h2>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                {geoHierarchy.states.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStateId(st.id);
                      if (st.districts[0]) {
                        setSelectedDistrictId(st.districts[0].id);
                        if (st.districts[0].cities[0]) {
                          setSelectedCityId(st.districts[0].cities[0].id);
                        }
                      }
                    }}
                    className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                      selectedStateId === st.id
                        ? 'bg-gradient-to-r from-accent-orange to-accent-amber text-white shadow-lg shadow-accent-orange/25 border border-white/20'
                        : 'bg-[var(--bg-card)] border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-orange)]/30'
                    }`}
                  >
                    <span>{st.name}</span>
                    {selectedStateId === st.id && <CheckCircle2 size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: District Selection */}
            {currentState && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#FF6B2C] text-white text-[11px] font-black flex items-center justify-center">2</span>
                  <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Select District in {currentState.name}
                  </h2>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {currentState.districts.map((dist) => (
                    <button
                      key={dist.id}
                      onClick={() => {
                        setSelectedDistrictId(dist.id);
                        if (dist.cities[0]) {
                          setSelectedCityId(dist.cities[0].id);
                        }
                      }}
                      className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                        selectedDistrictId === dist.id
                          ? 'bg-[#00D4AA] text-black shadow-lg shadow-[#00D4AA]/25 border border-white/20'
                          : 'bg-[var(--bg-card)] border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-orange)]/30'
                      }`}
                    >
                      <MapPin size={13} />
                      <span>{dist.name}</span>
                      {selectedDistrictId === dist.id && <CheckCircle2 size={14} className="text-black" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: City / Town / Taluka Selection */}
            {currentDistrict && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#FF6B2C] text-white text-[11px] font-black flex items-center justify-center">3</span>
                  <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Select City / Town in {currentDistrict.name}
                  </h2>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {currentDistrict.cities.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setSelectedCityId(ct.id)}
                      className={`px-5 py-3 rounded-2xl text-xs font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                        selectedCityId === ct.id
                          ? 'bg-gradient-to-r from-[#FFB347] to-[#FF6B2C] text-white shadow-lg shadow-[#FFB347]/25 border border-white/20'
                          : 'bg-[var(--bg-card)] border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-orange)]/30'
                      }`}
                    >
                      <span>📍 {ct.name}</span>
                      {selectedCityId === ct.id && <CheckCircle2 size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Registered Colleges in Selected Town */}
            <div className="pt-4 border-t border-[var(--border-glass)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00D4AA] text-black text-[11px] font-black flex items-center justify-center">4</span>
                  <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                    Registered Campuses in {currentCity?.name} ({drilledCampuses.length})
                  </h2>
                </div>
                <span className="text-[11px] text-[#00D4AA] font-bold flex items-center gap-1">
                  ● Real-time sync active
                </span>
              </div>

              {drilledCampuses.length === 0 ? (
                <SpotlightCard className="p-8 rounded-3xl text-center border-dashed border-[var(--border-glass)] bg-[var(--bg-card)]">
                  <p className="text-xs text-[var(--text-secondary)]">No campuses registered in this town yet.</p>
                </SpotlightCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drilledCampuses.map((campus) => {
                    const isCurrent = selectedCampus.id === campus.id;
                    return (
                      <SpotlightCard
                        key={campus.id}
                        spotlightColor="rgba(255, 107, 44, 0.25)"
                        className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group flex flex-col justify-between bg-[var(--bg-card)] ${
                          isCurrent
                            ? 'border-[#FF6B2C] shadow-[0_0_35px_rgba(255,107,44,0.25)]'
                            : 'border-[var(--border-glass)] hover:border-[#FF6B2C]/50 hover:shadow-[0_0_30px_rgba(255,107,44,0.18)]'
                        }`}
                        onClick={() => handleSelectCampus(campus)}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/30 text-[#00D4AA] text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle2 size={12} /> Verified Pilot Partner
                            </span>
                            <span className="text-[11px] font-bold text-[var(--text-secondary)] flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-xl">
                              <Store size={13} className="text-[#FFB347]" /> {campus.totalCanteens || 5} Canteens Active
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-[var(--text-primary)] group-hover:text-[#FFB347] transition-colors leading-snug mb-1.5">
                            {campus.name}
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 mb-2">
                            <MapPin size={13} className="text-[#FF6B2C] flex-shrink-0" /> {campus.location}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[var(--border-glass)] flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[var(--text-secondary)]">
                            Pincode: <strong className="font-mono text-[var(--text-primary)]">{campus.pincode || '423603'}</strong>
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-accent-orange to-accent-amber text-white font-black text-xs shadow-lg shadow-accent-orange/30 flex items-center gap-1.5"
                          >
                            <span>Browse 5 Canteens</span>
                            <ChevronRight size={14} strokeWidth={3} />
                          </motion.button>
                        </div>
                      </SpotlightCard>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
}
