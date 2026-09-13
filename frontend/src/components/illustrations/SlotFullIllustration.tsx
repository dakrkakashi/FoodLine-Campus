'use client';

import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function SlotFullIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Rush Alert Glow */}
      <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#FF6B2C]/25 via-[#E11D48]/20 to-transparent blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
      >
        <defs>
          <linearGradient id="clockGaugeGrad" x1="50" y1="40" x2="150" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A221E" />
            <stop offset="100%" stopColor="#151110" />
          </linearGradient>

          <linearGradient id="needleGrad" x1="100" y1="90" x2="135" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="174" rx="60" ry="8" fill="black" opacity="0.4" />

        {/* Clock Gauge Face Outer Ring */}
        <circle
          cx="100"
          cy="92"
          r="62"
          fill="url(#clockGaugeGrad)"
          stroke="rgba(255, 255, 255, 0.14)"
          strokeWidth="2.5"
        />

        {/* Outer Circular Rush Progress (Red/Orange zone at 100% capacity) */}
        <circle
          cx="100"
          cy="92"
          r="54"
          fill="none"
          stroke="#E11D48"
          strokeWidth="6"
          strokeDasharray="280 80"
          strokeLinecap="round"
          transform="rotate(-90 100 92)"
        />

        {/* Inner Counter Meter Display */}
        <circle cx="100" cy="92" r="42" fill="#181412" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="1.5" />

        {/* Tick markers */}
        <line x1="100" y1="42" x2="100" y2="48" stroke="#8E8EA0" strokeWidth="2" />
        <line x1="150" y1="92" x2="144" y2="92" stroke="#E11D48" strokeWidth="2.5" />
        <line x1="50" y1="92" x2="56" y2="92" stroke="#8E8EA0" strokeWidth="2" />
        <line x1="100" y1="142" x2="100" y2="136" stroke="#8E8EA0" strokeWidth="2" />

        {/* Gauge Needle Pointing to Max Capacity */}
        <line
          x1="100"
          y1="92"
          x2="138"
          y2="64"
          stroke="url(#needleGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="100" cy="92" r="6" fill="#FF6B2C" stroke="#FAF9F6" strokeWidth="2" />

        {/* Capacity 100% Pill Badge */}
        <g transform="translate(68, 110)">
          <rect x="0" y="0" width="64" height="20" rx="10" fill="#E11D48" />
          <text x="32" y="14" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            100% FULL
          </text>
        </g>

        {/* Steam vents warning */}
        <path d="M 64 36 Q 60 26 66 18" stroke="#FF6B2C" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
        <path d="M 136 36 Q 140 26 134 18" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      </svg>
    </div>
  );
}
