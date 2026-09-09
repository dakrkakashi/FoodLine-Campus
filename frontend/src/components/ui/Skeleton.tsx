'use client';

import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  lines?: number;
}

export function Skeleton({ className, variant = 'rect', lines = 1 }: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className={clsx(
              'h-3 rounded-lg bg-zinc-800/80 shimmer-badge',
              i === lines - 1 ? 'w-3/5' : 'w-full',
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-zinc-800/80 shimmer-badge',
        variant === 'circle' ? 'rounded-full' : 'rounded-2xl',
        className
      )}
    />
  );
}

export function DishCardSkeleton() {
  return (
    <div className="rounded-3xl bg-[#16161E] border border-white/5 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4" variant="rect" />
        <Skeleton className="w-16 h-4" variant="rect" />
      </div>
      <Skeleton className="w-3/4 h-5" variant="rect" />
      <Skeleton variant="text" lines={2} />
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <Skeleton className="w-12 h-6" variant="rect" />
        <Skeleton className="w-20 h-9 rounded-2xl" variant="rect" />
      </div>
    </div>
  );
}
