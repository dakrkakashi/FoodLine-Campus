'use client';

import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function ChaiBotEmptyIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Warm Mascot Halo Underglow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#FF6B2C]/20 via-[#FFB347]/20 to-transparent blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
      >
        <defs>
          <linearGradient id="chaiBotBody" x1="60" y1="60" x2="140" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2E2824" />
            <stop offset="100%" stopColor="#181412" />
          </linearGradient>

          <linearGradient id="kettleSpout" x1="30" y1="90" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B2C" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="174" rx="55" ry="8" fill="black" opacity="0.45" />

        {/* Floating Mascot Group */}
        <g className="animate-[float_4s_ease-in-out_infinite]">
          {/* Chef Cap on Top */}
          <g transform="translate(85, 34)">
            <path
              d="M 6 18 C 2 12, 6 4, 15 4 C 20 0, 28 2, 28 8 C 34 8, 36 14, 32 18 Z"
              fill="#FAF9F6"
              stroke="#D4D4D8"
              strokeWidth="1.2"
            />
            <rect x="7" y="18" width="24" height="6" rx="2" fill="#FF6B2C" />
          </g>

          {/* Spherical Kettle Bot Body */}
          <circle
            cx="100"
            cy="104"
            r="46"
            fill="url(#chaiBotBody)"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="2"
          />

          {/* Kettle Spout (Left) */}
          <path
            d="M 58 98 C 44 94, 36 82, 34 76 C 34 74, 38 74, 42 78 C 48 84, 56 86, 60 90 Z"
            fill="url(#kettleSpout)"
          />

          {/* Kettle Handle (Right) */}
          <path
            d="M 142 82 C 160 88, 160 120, 142 126"
            stroke="#FFB347"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Digital Face Visor Screen */}
          <rect
            x="76"
            y="84"
            width="48"
            height="26"
            rx="8"
            fill="#0C0A09"
            stroke="rgba(0, 212, 170, 0.4)"
            strokeWidth="1.5"
          />

          {/* Cute LED Pixel Eyes (Blinking curved smiling or curious eyes) */}
          <circle cx="88" cy="97" r="3.5" fill="#00D4AA" />
          <circle cx="112" cy="97" r="3.5" fill="#00D4AA" />
          {/* Blush Dots */}
          <circle cx="82" cy="103" r="2" fill="#FF6B2C" opacity="0.75" />
          <circle cx="118" cy="103" r="2" fill="#FF6B2C" opacity="0.75" />

          {/* Center FoodLine Badge */}
          <circle cx="100" cy="132" r="6" fill="#FF6B2C" />
          <path d="M 98 132 L 102 132" stroke="#FAF9F6" strokeWidth="1.5" strokeLinecap="round" />

          {/* Empty Cutting Chai Glass Held in Front */}
          <g transform="translate(92, 126)">
            {/* Glass Outline */}
            <polygon
              points="2,4 4,24 12,24 14,4"
              fill="rgba(255, 255, 255, 0.08)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1"
            />
            {/* Cut glass vertical grooves */}
            <line x1="6" y1="6" x2="7" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <line x1="10" y1="6" x2="9" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
          </g>

          {/* Single Tiny Floating Steam Ring */}
          <ellipse cx="100" cy="68" rx="8" ry="3" stroke="#FFB347" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
