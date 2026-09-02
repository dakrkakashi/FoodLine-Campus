'use client';

import React from 'react';
import { motion } from 'motion/react';

interface SteamEffectProps {
  count?: number;
  className?: string;
}

export function SteamEffect({ count = 3, className = '' }: SteamEffectProps) {
  return (
    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none flex gap-1.5 justify-center z-10 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          animate={{
            y: [-2, -22, -34],
            x: [0, (i % 2 === 0 ? 4 : -4), (i % 2 === 0 ? -6 : 6)],
            opacity: [0, 0.75, 0],
            scale: [0.6, 1.2, 1.8],
          }}
          transition={{
            duration: 2.2 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
          className="w-1.5 h-3 rounded-full bg-gradient-to-t from-white/40 via-white/20 to-transparent blur-[1.5px]"
        />
      ))}
    </div>
  );
}
