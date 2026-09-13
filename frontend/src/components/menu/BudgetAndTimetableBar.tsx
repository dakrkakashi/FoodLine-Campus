'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IndianRupee, Clock, Sun, Sparkles, Filter } from 'lucide-react';

interface BudgetAndTimetableBarProps {
  onBudgetFilterChange?: (underFifty: boolean) => void;
  isBudgetFilterActive?: boolean;
  className?: string;
}

export function BudgetAndTimetableBar({
  onBudgetFilterChange,
  isBudgetFilterActive = false,
  className = '',
}: BudgetAndTimetableBarProps) {
  const [isSunlightMode, setIsSunlightMode] = useState(false);

  // Toggle sunlight contrast mode by toggling data-contrast on root html
  const toggleSunlightMode = () => {
    const next = !isSunlightMode;
    setIsSunlightMode(next);
    if (typeof document !== 'undefined') {
      if (next) {
        document.documentElement.setAttribute('data-contrast', 'sunlight');
      } else {
        document.documentElement.removeAttribute('data-contrast');
      }
    }
  };

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2.5 select-none ${className}`}>
      {/* Left: Quick Ergonomic Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* "Hungry Under ₹50" Pocket-Money Filter */}
        <button
          type="button"
          onClick={() => onBudgetFilterChange?.(!isBudgetFilterActive)}
          aria-pressed={isBudgetFilterActive}
          className={`px-3.5 py-2 rounded-2xl text-xs font-black tracking-wide cursor-pointer transition-all flex items-center gap-1.5 border shadow-sm ${
            isBudgetFilterActive
              ? 'bg-[#00D4AA] text-black border-[#00D4AA] ring-2 ring-[#00D4AA]/30 shadow-[#00D4AA]/20'
              : 'bg-[#191614]/80 text-[#FAF9F6] border-white/10 hover:border-white/20 hover:bg-[#24201D]'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5 text-[#0C0A09] dark:text-inherit" strokeWidth={3} />
          <span>Hungry Under ₹50</span>
          {isBudgetFilterActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-black ml-0.5" />
          )}
        </button>

        {/* Timetable Sync Pill */}
        <div className="px-3 py-1.5 rounded-2xl bg-black/20 dark:bg-white/5 border border-white/10 text-[11px] font-semibold text-[#B4B4C0] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#FFB347]" />
          <span>Next Lecture: <strong className="text-[#FAF9F6] font-bold">12:45 PM</strong> (Break Slot)</span>
        </div>
      </div>

      {/* Right: Sunlight High-Contrast Mode Toggle for Outdoor Walkway */}
      <button
        type="button"
        onClick={toggleSunlightMode}
        title="Toggle High-Contrast Outdoor Sunlight Mode for bright campus sun"
        className={`px-3 py-1.5 rounded-2xl text-[11px] font-bold tracking-wide transition-all border cursor-pointer flex items-center gap-1.5 ${
          isSunlightMode
            ? 'bg-amber-400 text-black border-amber-300 ring-2 ring-amber-400/40'
            : 'bg-black/20 text-[#8E8EA0] hover:text-[#FAF9F6] border-white/5 hover:border-white/15'
        }`}
      >
        <Sun className={`w-3.5 h-3.5 ${isSunlightMode ? 'text-black' : 'text-amber-400'}`} />
        <span>{isSunlightMode ? 'Sunlight On' : 'Outdoor Mode'}</span>
      </button>
    </div>
  );
}
