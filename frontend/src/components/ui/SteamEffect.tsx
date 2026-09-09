'use client';

import React from 'react';

interface SteamEffectProps {
  count?: number;
  className?: string;
}

export function SteamEffect({ count = 2, className = '' }: SteamEffectProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none flex gap-1.5 justify-center z-10 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            animationDelay: `${i * 0.6}s`,
            willChange: 'transform, opacity',
            transform: 'translate3d(0,0,0)',
          }}
          className="w-1.5 h-3 rounded-full bg-gradient-to-t from-white/35 via-white/15 to-transparent blur-[1px] animate-steam"
        />
      ))}
    </div>
  );
}
