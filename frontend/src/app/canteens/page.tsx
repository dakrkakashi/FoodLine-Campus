'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Clock,
  Coffee,
  Sparkles,
  ArrowRight,
  Store,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  Flame,
  Search,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition, SpotlightCard } from '@/components/ui';
import { useCampus } from '@/context/CampusContext';
import { Canteen } from '@/lib/types';

const CANTEEN_ICONS: Record<string, string> = {
  'cafe7': '☕',
  'south-corner': '🥞',
  'nescafe-kiosk': '🥤',
  'mba-cafeteria': '🥪',
  'hostel-mess': '🍲',
};

export default function CanteensPage() {
  const router = useRouter();
  const { selectedCampus, availableCanteens, selectCanteen, isLoadingCanteens } = useCampus();
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCanteens = useMemo(() => {
    return availableCanteens.filter((canteen) => {
      const matchesSearch =
        canteen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (canteen.tagline && canteen.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        canteen.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filterTag === 'ALL') return true;
      if (filterTag === 'QUICK' && (canteen.prepTimeMins || 5) <= 3) return true;
      if (filterTag === 'SNACKS' && canteen.slug !== 'hostel-mess') return true;
      if (filterTag === 'THALI' && canteen.slug === 'hostel-mess') return true;
      return true;
    });
  }, [availableCanteens, searchQuery, filterTag]);

  const handleOpenCanteen = (canteen: Canteen) => {
    selectCanteen(canteen);
    router.push(`/menu?canteenId=${canteen.id}`);
  };

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-[#F5F5F7] pb-32 relative overflow-hidden">
      {/* Background Aurora Mesh */}
      <div className="aurora-mesh">
        <div className="aurora-blob w-[36rem] h-[36rem] bg-[#FF6B2C] -top-24 -right-20" style={{ animationDuration: '22s' }} />
        <div className="aurora-blob w-[38rem] h-[38rem] bg-[#00D4AA] top-1/2 -left-32" style={{ animationDuration: '26s', animationDelay: '-8s' }} />
      </div>

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 relative z-10">
        {/* Campus Header & Change Campus Trigger */}
        <div className="glass-card-heavy rounded-[2.5rem] p-6 md:p-8 mb-8 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-40 h-40 bg-[#FF6B2C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 text-[#FFB347] text-xs font-black uppercase tracking-wider mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4AA]" />
              </span>
              Campus Verified Outlets Active
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{selectedCampus.name}</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 flex items-center gap-1.5 font-medium">
              <MapPin size={13} className="text-[#FF6B2C]" /> {selectedCampus.location} • {availableCanteens.length} Registered Canteens
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
            <Link href="/select-campus">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <Building2 size={15} className="text-[#FFB347]" />
                <span>Change Campus</span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Quick Search & Canteen Type Pills */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search canteens (e.g. Dosa, Cafe 7, Nescafe)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12121A] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {[
                { id: 'ALL', label: 'All 5 Outlets' },
                { id: 'QUICK', label: '⚡ Fast Grab (≤3m)' },
                { id: 'SNACKS', label: '🥪 Snacks & Sips' },
                { id: 'THALI', label: '🍲 Hostel Thali' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilterTag(pill.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide flex-shrink-0 transition-all cursor-pointer ${
                    filterTag === pill.id
                      ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black shadow-lg shadow-[#FF6B2C]/25'
                      : 'bg-[#12121A] border border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5-Canteen Grid */}
        {filteredCanteens.length === 0 ? (
          <SpotlightCard className="p-10 rounded-[2.5rem] text-center border-dashed border-white/15">
            <Store className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No canteens matched your search</h3>
            <p className="text-xs text-zinc-400 mb-4">Try clearing your search query or view all available campus outlets.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterTag('ALL');
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCanteens.map((canteen, idx) => {
              const icon = CANTEEN_ICONS[canteen.slug] || '🍽️';
              const isOpen = canteen.isOpen !== false;

              return (
                <motion.div
                  key={canteen.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                  className="h-full"
                >
                  <SpotlightCard
                    spotlightColor="rgba(255, 107, 44, 0.22)"
                    className={`h-full p-6 md:p-7 rounded-[2.5rem] border border-white/10 hover:border-[#FF6B2C]/50 hover:shadow-[0_0_35px_rgba(255,107,44,0.22)] transition-all duration-300 bg-[#16161E]/85 backdrop-blur-xl flex flex-col justify-between group cursor-pointer ${
                      !isOpen ? 'opacity-60 grayscale' : ''
                    }`}
                    onClick={() => isOpen && handleOpenCanteen(canteen)}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B2C]/20 to-[#FFB347]/20 border border-[#FF6B2C]/30 text-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            {icon}
                          </span>
                          <div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/30 px-2 py-0.5 rounded-full">
                              ● 100% Pure Veg
                            </span>
                            {canteen.slug === 'cafe7' && (
                              <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#FFB347] bg-[#FFB347]/10 border border-[#FFB347]/30 px-2 py-0.5 rounded-full">
                                🔥 Central Hub
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-xl">
                            <Clock size={12} className="text-[#FFB347]" /> {canteen.prepTimeMins || 5} min prep
                          </span>
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <h2 className="text-xl md:text-2xl font-black text-white group-hover:text-[#FFB347] transition-colors leading-tight mb-1.5">
                        {canteen.name}
                      </h2>
                      <p className="text-xs font-bold text-[#00D4AA] mb-2">{canteen.tagline}</p>
                      <p className="text-xs text-zinc-400 flex items-start gap-1.5 mb-4 leading-relaxed">
                        <MapPin size={13} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                        <span>{canteen.location}</span>
                      </p>
                    </div>

                    {/* Footer Metrics & Open Action */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4 mt-4">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Live Inventory</span>
                        <span className="text-sm font-black text-white font-mono">
                          {canteen.dishesCount || (canteen.slug === 'cafe7' ? 44 : 16)} Dishes Available
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!isOpen}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B2C] via-[#FF8A3D] to-[#FFB347] text-black font-black text-xs shadow-xl shadow-[#FF6B2C]/30 flex items-center gap-2 cursor-pointer border border-white/20 uppercase tracking-wider"
                      >
                        <span>Enter Menu</span>
                        <ArrowRight size={14} strokeWidth={3} className="text-black" />
                      </motion.button>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </PageTransition>
  );
}
