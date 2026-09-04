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
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 shadow-xs" title="100% Pure Vegetarian">
        <div className="w-3 h-3 rounded-[3px] border border-emerald-600 dark:border-emerald-400 flex items-center justify-center p-[2px]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        </div>
        <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">VEG</span>
      </div>
    );
  }

  const variantStyles = {
    bestseller: 'bg-accent-orange/15 border-accent-orange/40 text-accent-orange',
    studentFav: 'bg-accent-amber/15 border-accent-amber/40 text-accent-amber',
    fastGrab: 'bg-accent-teal/15 border-accent-teal/40 text-accent-teal',
    spicy: 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400',
    live: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
    full: 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400',
    available: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
    custom: 'bg-black/5 dark:bg-white/5 border-[var(--border-glass)] text-[var(--text-secondary)]',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variantStyles[variant], className))}>
      {icon}
      {children}
    </span>
  );
}
