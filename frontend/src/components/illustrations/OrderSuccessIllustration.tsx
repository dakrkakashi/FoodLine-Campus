'use client';

import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function OrderSuccessIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dynamic Celebration Ambient Underglow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#00C261]/25 via-[#FF6B2C]/20 to-[#FFB347]/20 blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
      >
        <defs>
          <linearGradient id="orderTrayGrad" x1="30" y1="90" x2="170" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A2421" />
            <stop offset="100%" stopColor="#141110" />
          </linearGradient>

          <linearGradient id="successCircleGrad" x1="70" y1="40" x2="130" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E575" />
            <stop offset="100%" stopColor="#00A850" />
          </linearGradient>

          <linearGradient id="samosaGrad" x1="80" y1="100" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="100%" stopColor="#E67E22" />
          </linearGradient>

          <filter id="successGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base shadow oval */}
        <ellipse cx="100" cy="176" rx="64" ry="10" fill="black" opacity="0.45" />

        {/* Canteen Tray Base */}
        <rect
          x="32"
          y="130"
          width="136"
          height="32"
          rx="10"
          fill="url(#orderTrayGrad)"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="1.5"
        />
        {/* Tray Inner Ridge */}
        <rect
          x="40"
          y="135"
          width="120"
          height="22"
          rx="6"
          fill="#1C1816"
          stroke="rgba(255, 107, 44, 0.25)"
          strokeWidth="1"
        />

        {/* Samosa Pav on Tray */}
        <g transform="translate(68, 112)">
          {/* Pav Bun */}
          <path
            d="M 6 22 C 6 14, 18 10, 32 10 C 46 10, 58 14, 58 22 Z"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="1"
          />
          {/* Samosa Corner */}
          <polygon
            points="24,18 40,8 48,22"
            fill="url(#samosaGrad)"
            stroke="#B45309"
            strokeWidth="1"
          />
        </g>

        {/* Steaming aroma curls */}
        <path
          d="M 92 110 Q 88 100 94 92 T 90 80"
          stroke="#FFB347"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 108 108 Q 112 98 106 90 T 110 78"
          stroke="#FF6B2C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />

        {/* Floating Emerald Success Check Shield */}
        <g className="animate-[bounce_3s_ease-in-out_infinite]" filter="url(#successGlow)">
          <circle cx="100" cy="56" r="30" fill="url(#successCircleGrad)" />
          <circle cx="100" cy="56" r="34" stroke="#00C261" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          {/* Checkmark */}
          <path
            d="M 88 56 L 96 64 L 114 46"
            stroke="#0C0A09"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Sparkling Stars */}
        <path d="M 44 54 L 46 60 L 52 62 L 46 64 L 44 70 L 42 64 L 36 62 L 42 60 Z" fill="#FFB347" opacity="0.9" />
        <path d="M 156 68 L 158 72 L 162 74 L 158 76 L 156 80 L 154 76 L 150 74 L 154 72 Z" fill="#00D4AA" opacity="0.85" />
        <circle cx="146" cy="44" r="3" fill="#FF6B2C" />
        <circle cx="58" cy="98" r="2.5" fill="#00C261" />
      </svg>
    </div>
  );
}
