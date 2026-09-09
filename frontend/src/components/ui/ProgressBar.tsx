'use client';

import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;       // 0-100
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({ value, max = 100, label, showPercent = true, size = 'md', className }: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = percent > 80 ? 'bg-red-500' : percent > 50 ? 'bg-[#FFB347]' : 'bg-[#00D4AA]';
  const glowColor = percent > 80 ? 'shadow-red-500/30' : percent > 50 ? 'shadow-[#FFB347]/30' : 'shadow-[#00D4AA]/30';
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-[11px] font-bold text-[var(--text-secondary)]">{label}</span>}
          {showPercent && <span className="text-[11px] font-black text-[var(--text-primary)]">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-black/[0.08] dark:bg-white/10 rounded-full overflow-hidden', heights[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-700 ease-out shadow-md', barColor, glowColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
