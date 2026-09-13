'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Zap, Coffee, Utensils, Sparkles, CheckCircle2 } from 'lucide-react';

interface CounterInfo {
  id: string;
  name: string;
  categoryFilter: string;
  badge: string;
  waitMins: number;
  status: 'fast' | 'moderate' | 'busy';
  x: number;
  y: number;
}

const COUNTERS: CounterInfo[] = [
  {
    id: 'counter-1',
    name: 'Counter 1: South Indian Griddle',
    categoryFilter: 'South Indian Specials',
    badge: 'Dosa & Idli',
    waitMins: 4,
    status: 'moderate',
    x: 45,
    y: 75,
  },
  {
    id: 'counter-2',
    name: 'Counter 2: Fast Grab Express',
    categoryFilter: 'Snacks & Quick Bites',
    badge: 'Samosa & Vada Pav',
    waitMins: 1,
    status: 'fast',
    x: 155,
    y: 75,
  },
  {
    id: 'counter-3',
    name: 'Counter 3: Cutting Chai & Coffee',
    categoryFilter: 'Beverages & Chai',
    badge: 'Chai Bar',
    waitMins: 2,
    status: 'fast',
    x: 45,
    y: 155,
  },
  {
    id: 'counter-4',
    name: 'Counter 4: Student Thalis & Meals',
    categoryFilter: 'Student Meals & Thalis',
    badge: 'Rajma & Thali',
    waitMins: 6,
    status: 'busy',
    x: 155,
    y: 155,
  },
];

interface CampusCounterMapProps {
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
  className?: string;
}

export function CampusCounterMap({
  onSelectCategory,
  selectedCategory,
  className = '',
}: CampusCounterMapProps) {
  const [activeCounter, setActiveCounter] = useState<CounterInfo | null>(null);

  const getStatusColor = (status: CounterInfo['status']) => {
    switch (status) {
      case 'fast':
        return '#00D4AA';
      case 'moderate':
        return '#FFB347';
      case 'busy':
        return '#FF6B2C';
    }
  };

  return (
    <div className={`relative rounded-3xl bg-[#191614]/90 border border-white/10 p-4 sm:p-6 overflow-hidden shadow-2xl ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 flex items-center justify-center text-[#FF6B2C]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#FAF9F6] tracking-tight">
              Sanjivani University · Cafe @7 Counter Map
            </h3>
            <p className="text-[11px] text-[#8E8EA0] font-medium">
              Tap any live counter station to filter menu dishes & check wait times
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00C261]/10 border border-[#00C261]/30 text-[#00C261] text-[10px] font-black uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C261] animate-ping" />
          Live Canteen Map
        </span>
      </div>

      {/* 2.5D Isometric SVG Map Grid */}
      <div className="relative w-full aspect-[2/1] min-h-[190px] rounded-2xl bg-[#0C0A09]/80 border border-white/5 p-2 overflow-hidden flex items-center justify-center">
        {/* Floor Isometric Grid Lines */}
        <svg
          viewBox="0 0 200 100"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="tileGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#25201C" />
              <stop offset="100%" stopColor="#14110F" />
            </linearGradient>
            <linearGradient id="expressPickup" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF6B2C" />
              <stop offset="100%" stopColor="#FFB347" />
            </linearGradient>
          </defs>

          {/* Perspective Floor */}
          <polygon points="100,8 190,48 100,92 10,48" fill="url(#tileGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <polygon points="100,18 174,50 100,84 26,50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />

          {/* Central FoodLine Express Digital Pickup Zone (The Star Area!) */}
          <polygon points="100,38 128,52 100,66 72,52" fill="url(#expressPickup)" opacity="0.88" />
          <text x="100" y="54" fill="#0C0A09" fontSize="4.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            FOODLINE EXPRESS
          </text>
          <text x="100" y="60" fill="#0C0A09" fontSize="3.5" fontWeight="800" textAnchor="middle" fontFamily="monospace">
            ZERO-WAIT PICKUP
          </text>

          {/* Isometric Counter 1: South Indian (Top Left) */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => {
              setActiveCounter(COUNTERS[0]);
              onSelectCategory?.(COUNTERS[0].categoryFilter);
            }}
          >
            <polygon points="56,32 76,42 62,49 42,39" fill="#1F1B18" stroke="#FFB347" strokeWidth="0.8" />
            <polygon points="42,39 62,49 62,56 42,46" fill="#151210" stroke="#FFB347" strokeWidth="0.5" />
            <polygon points="62,49 76,42 76,49 62,56" fill="#2E2722" stroke="#FFB347" strokeWidth="0.5" />
            <circle cx="58" cy="40" r="2.5" fill="#FFB347" />
            <text x="58" y="47" fill="#FAF9F6" fontSize="3.8" fontWeight="800" textAnchor="middle">C1: Dosa</text>
          </g>

          {/* Isometric Counter 2: Fast Grab (Top Right) */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => {
              setActiveCounter(COUNTERS[1]);
              onSelectCategory?.(COUNTERS[1].categoryFilter);
            }}
          >
            <polygon points="124,42 144,32 158,39 138,49" fill="#1F1B18" stroke="#00D4AA" strokeWidth="0.8" />
            <polygon points="138,49 158,39 158,46 138,56" fill="#2E2722" stroke="#00D4AA" strokeWidth="0.5" />
            <polygon points="124,42 138,49 138,56 124,49" fill="#151210" stroke="#00D4AA" strokeWidth="0.5" />
            <circle cx="142" cy="40" r="2.5" fill="#00D4AA" />
            <text x="142" y="47" fill="#FAF9F6" fontSize="3.8" fontWeight="800" textAnchor="middle">C2: Snacks</text>
          </g>

          {/* Isometric Counter 3: Chai Bar (Bottom Left) */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => {
              setActiveCounter(COUNTERS[2]);
              onSelectCategory?.(COUNTERS[2].categoryFilter);
            }}
          >
            <polygon points="42,57 62,67 48,74 28,64" fill="#1F1B18" stroke="#00D4AA" strokeWidth="0.8" />
            <polygon points="28,64 48,74 48,81 28,71" fill="#151210" stroke="#00D4AA" strokeWidth="0.5" />
            <polygon points="48,74 62,67 62,74 48,81" fill="#2E2722" stroke="#00D4AA" strokeWidth="0.5" />
            <circle cx="44" cy="65" r="2.5" fill="#00D4AA" />
            <text x="44" y="72" fill="#FAF9F6" fontSize="3.8" fontWeight="800" textAnchor="middle">C3: Chai</text>
          </g>

          {/* Isometric Counter 4: Thalis (Bottom Right) */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => {
              setActiveCounter(COUNTERS[3]);
              onSelectCategory?.(COUNTERS[3].categoryFilter);
            }}
          >
            <polygon points="138,67 158,57 172,64 152,74" fill="#1F1B18" stroke="#FF6B2C" strokeWidth="0.8" />
            <polygon points="152,74 172,64 172,71 152,81" fill="#2E2722" stroke="#FF6B2C" strokeWidth="0.5" />
            <polygon points="138,67 152,74 152,81 138,74" fill="#151210" stroke="#FF6B2C" strokeWidth="0.5" />
            <circle cx="156" cy="65" r="2.5" fill="#FF6B2C" />
            <text x="156" y="72" fill="#FAF9F6" fontSize="3.8" fontWeight="800" textAnchor="middle">C4: Thali</text>
          </g>
        </svg>
      </div>

      {/* Counter Quick Pills Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {COUNTERS.map((counter) => {
          const isSelected = selectedCategory === counter.categoryFilter;
          const statusColor = getStatusColor(counter.status);

          return (
            <button
              key={counter.id}
              type="button"
              onClick={() => {
                setActiveCounter(counter);
                onSelectCategory?.(counter.categoryFilter);
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FF6B2C]/15 border-[#FF6B2C] ring-2 ring-[#FF6B2C]/30'
                  : 'bg-black/20 hover:bg-black/30 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#FAF9F6] truncate">
                  {counter.badge}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: statusColor }}
                  title={`${counter.status} speed`}
                />
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[#8E8EA0] font-mono">
                <Clock className="w-3 h-3 text-[#FFB347]" />
                <span>~{counter.waitMins}m wait</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
