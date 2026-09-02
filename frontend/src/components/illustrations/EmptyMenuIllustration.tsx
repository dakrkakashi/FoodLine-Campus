'use client';

import React from 'react';

interface EmptyMenuIllustrationProps {
  className?: string;
  size?: number;
}

export function EmptyMenuIllustration({ className = '', size = 180 }: EmptyMenuIllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[var(--accent-orange,#FF6B2C)]/20 to-[var(--accent-teal,#00D4AA)]/15 blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <linearGradient id="lensGradient" x1="45" y1="45" x2="115" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF6B2C" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="rimGradient" x1="40" y1="40" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B2C" />
            <stop offset="100%" stopColor="#FFB347" />
          </linearGradient>
        </defs>

        <ellipse cx="100" cy="175" rx="55" ry="8" fill="black" opacity="0.4" />

        {/* Floating Magnifying Glass over Cloche Silhouette */}
        <g className="animate-[float_4s_ease-in-out_infinite]">
          {/* Dinner Plate Base */}
          <ellipse cx="100" cy="140" rx="60" ry="18" fill="#181824" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <ellipse cx="100" cy="140" rx="44" ry="12" fill="#12121A" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

          {/* Dotted Cloche Dome Outline */}
          <path
            d="M52 136 C52 90 148 90 148 136"
            stroke="#FFB347"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            fill="none"
            opacity="0.6"
          />
          <circle cx="100" cy="90" r="5" fill="#FFB347" opacity="0.8" />

          {/* Large Magnifying Glass Scan Lens */}
          <circle
            cx="96"
            cy="110"
            r="38"
            fill="url(#lensGradient)"
            stroke="url(#rimGradient)"
            strokeWidth="3.5"
          />

          {/* Lens Glare Reflection */}
          <path
            d="M74 95 A 30 30 0 0 1 118 95"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Radar scan concentric ripple */}
          <circle cx="96" cy="110" r="22" stroke="#00D4AA" strokeWidth="1.5" opacity="0.4" className="animate-ping" />

          {/* Magnifying Glass Handle */}
          <rect
            x="122"
            y="136"
            width="42"
            height="12"
            rx="6"
            transform="rotate(45 122 136)"
            fill="#272738"
            stroke="#FF6B2C"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    </div>
  );
}
