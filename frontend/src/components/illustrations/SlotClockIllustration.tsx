'use client';

import React from 'react';

interface SlotClockIllustrationProps {
  className?: string;
  size?: number;
}

export function SlotClockIllustration({ className = '', size = 180 }: SlotClockIllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[var(--accent-orange,#FF6B2C)]/25 via-[var(--accent-amber,#FFB347)]/20 to-transparent blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="clockBg" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#252538" />
            <stop offset="100%" stopColor="#101018" />
          </linearGradient>

          <linearGradient id="meterArc" x1="40" y1="40" x2="160" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="50%" stopColor="#FFB347" />
            <stop offset="100%" stopColor="#FF6B2C" />
          </linearGradient>
        </defs>

        <ellipse cx="100" cy="180" rx="55" ry="8" fill="black" opacity="0.45" />

        <g className="animate-[float_4s_ease-in-out_infinite]">
          {/* Clock Outer Rim */}
          <circle
            cx="100"
            cy="100"
            r="68"
            fill="url(#clockBg)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="3"
          />

          {/* Slot Capacity Meter Ring Track */}
          <circle
            cx="100"
            cy="100"
            r="56"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="8"
            fill="none"
          />

          {/* Filled Slot Progress Arc (60 slots capacity visual) */}
          <circle
            cx="100"
            cy="100"
            r="56"
            stroke="url(#meterArc)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="351.8"
            strokeDashoffset="110"
            fill="none"
            transform="rotate(-90 100 100)"
          />

          {/* Minute Ticks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="38"
              x2="100"
              y2="44"
              stroke="white"
              strokeWidth={deg % 90 === 0 ? '2.5' : '1.5'}
              opacity={deg % 90 === 0 ? '0.7' : '0.3'}
              transform={`rotate(${deg} 100 100)`}
            />
          ))}

          {/* Center Hub */}
          <circle cx="100" cy="100" r="14" fill="#00D4AA" filter="drop-shadow(0 0 10px rgba(0,212,170,0.6))" />
          <circle cx="100" cy="100" r="6" fill="#0E1715" />

          {/* Clock Hands: 15-Min Break Indicator */}
          {/* Hour Hand pointing towards 10 */}
          <line
            x1="100"
            y1="100"
            x2="78"
            y2="82"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Minute Hand pointing towards break slot */}
          <line
            x1="100"
            y1="100"
            x2="132"
            y2="75"
            stroke="#FFB347"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Lightning Rush Badge */}
          <g transform="translate(86, 122)">
            <rect x="0" y="0" width="28" height="18" rx="6" fill="#FF6B2C" />
            <path
              d="M15 3 L10 10 L14 10 L13 15 L18 8 L14 8 Z"
              fill="white"
              filter="drop-shadow(0 0 4px rgba(255,255,255,0.8))"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
