'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 40, className = '', showText = false }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Main Brand Gradient */}
          <linearGradient id="flPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-orange, #FF6B2C)" />
            <stop offset="50%" stopColor="var(--accent-amber, #FFB347)" />
            <stop offset="100%" stopColor="var(--accent-teal, #00D4AA)" />
          </linearGradient>

          {/* Accent Flame Glow */}
          <linearGradient id="flGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB347" stopOpacity="0.2" />
          </linearGradient>

          {/* Plate Shadow Filter */}
          <filter id="flNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FF6B2C" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Squircle App Icon Background */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="26"
          fill="#12121A"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="2"
        />

        {/* Ambient Subtle Plate Circle Base */}
        <circle cx="50" cy="50" r="34" fill="url(#flGlowGrad)" opacity="0.15" />

        {/* Stylized Food Cloche Dome (Speed Curve 1) */}
        <path
          d="M 28 58 C 28 38 72 38 72 58 Z"
          fill="none"
          stroke="url(#flPrimaryGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#flNeonGlow)"
        />

        {/* Cloche Top Handle Knob */}
        <circle cx="50" cy="35" r="4.5" fill="url(#flPrimaryGrad)" />

        {/* Express Speed Lines (The 'Line' & 'F' in FoodLine) */}
        <path
          d="M 22 66 L 78 66"
          stroke="url(#flPrimaryGrad)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Trailing Velocity Dash 1 */}
        <path
          d="M 32 74 L 68 74"
          stroke="var(--accent-amber, #FFB347)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Trailing Velocity Dash 2 */}
        <path
          d="M 42 80 L 58 80"
          stroke="var(--accent-teal, #00D4AA)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Lightning Spark Accent */}
        <path
          d="M 50 43 L 47 50 L 53 50 L 49 57"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-[var(--accent-orange,#FF6B2C)] via-[var(--accent-amber,#FFB347)] to-white bg-clip-text text-transparent">
          FoodLine
        </span>
      )}
    </div>
  );
}
