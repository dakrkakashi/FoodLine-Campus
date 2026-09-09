'use client';

import React from 'react';
import { motion } from 'motion/react';

const PARTICLES = [
  { emoji: '🥟', top: '15%', left: '8%', delay: 0, duration: 14, scale: 0.9 },
  { emoji: '🥞', top: '28%', right: '10%', delay: 2, duration: 18, scale: 1.1 },
  { emoji: '☕', top: '55%', left: '5%', delay: 4, duration: 16, scale: 0.8 },
  { emoji: '🥪', top: '75%', right: '7%', delay: 1, duration: 20, scale: 1.0 },
  { emoji: '🍲', top: '88%', left: '12%', delay: 3, duration: 17, scale: 0.9 },
];

export function FoodParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {PARTICLES.map((p, idx) => (
        <motion.div
          key={idx}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            right: p.right,
          }}
          animate={{
            y: [-12, 14, -12],
            rotate: [-8, 10, -8],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          className="text-2xl sm:text-3xl select-none filter blur-[0.5px]"
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
