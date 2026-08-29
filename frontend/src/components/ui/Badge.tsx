'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'veg' | 'bestseller' | 'studentFav' | 'fastGrab' | 'spicy' | 'live' | 'full' | 'available' | 'custom';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'custom', className, icon }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase border';

  if (variant === 'veg') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/40" title="100% Pure Vegetarian">
        <div className="w-3 h-3 rounded-[3px] border border-emerald-400 flex items-center justify-center p-[2px]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">VEG</span>
      </div>
    );
  }

  const variantStyles = {
    bestseller: 'bg-[#FF6B2C]/15 border-[#FF6B2C]/40 text-[#FF8A3D]',
    studentFav: 'bg-[#FFB347]/15 border-[#FFB347]/40 text-[#FFB347]',
    fastGrab: 'bg-[#00D4AA]/15 border-[#00D4AA]/40 text-[#00D4AA]',
    spicy: 'bg-rose-950/60 border-rose-500/40 text-rose-400',
    live: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
    full: 'bg-red-950/80 border-red-500/40 text-red-300',
    available: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400',
    custom: 'bg-white/5 border-white/10 text-zinc-300',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variantStyles[variant], className))}>
      {icon}
      {children}
    </span>
  );
}
