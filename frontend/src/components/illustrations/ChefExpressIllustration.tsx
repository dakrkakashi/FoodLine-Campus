'use client';

import React from 'react';

interface ChefExpressIllustrationProps {
  className?: string;
  size?: number;
}

export function ChefExpressIllustration({ className = '', size = 180 }: ChefExpressIllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Radiant Orange/Flame Backdrop */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[var(--accent-orange,#FF6B2C)]/30 via-[#EF4444]/20 to-transparent blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="wokGradient" x1="40" y1="100" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3A3A4A" />
            <stop offset="100%" stopColor="#14141E" />
          </linearGradient>

          <linearGradient id="flameGradient" x1="100" y1="150" x2="100" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#FF6B2C" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          <linearGradient id="hatGradient" x1="70" y1="10" x2="130" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="tealSparkle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="180" rx="60" ry="8" fill="black" opacity="0.45" />

        {/* Chef Hat atop */}
        <g className="animate-[float_3s_ease-in-out_infinite]">
          {/* Hat Puff Base */}
          <path
            d="M74 54 C66 42 74 22 90 24 C95 14 115 14 120 25 C132 20 142 38 134 54 Z"
            fill="url(#hatGradient)"
            stroke="#CBD5E1"
            strokeWidth="2"
          />
          {/* Hat Band */}
          <rect x="74" y="52" width="58" height="14" rx="4" fill="#00D4AA" />
          {/* Hat Star Accent */}
          <circle cx="103" cy="59" r="2.5" fill="#14141E" />
        </g>

        {/* Express Wok & Fiery Wok Hei */}
        <g>
          {/* Leaping Wok Hei Flame Tongue */}
          <path
            d="M100 120 C90 100 70 85 92 65 C105 85 125 75 118 60 C135 80 120 105 100 120 Z"
            fill="url(#flameGradient)"
            opacity="0.9"
            className="animate-pulse"
          />

          {/* Sizzling Wok Pan */}
          <path
            d="M36 125 C42 165 158 165 164 125 Z"
            fill="url(#wokGradient)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="3"
          />

          {/* Left Wooden Handle */}
          <rect
            x="12"
            y="120"
            width="28"
            height="10"
            rx="5"
            transform="rotate(-15 12 120)"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="1.5"
          />

          {/* Tossed Veggies & Spices */}
          {/* Herb leaf */}
          <ellipse cx="78" cy="98" rx="7" ry="4" fill="#10B981" transform="rotate(-35 78 98)" />
          {/* Chili pepper flake */}
          <path d="M125 90 Q130 95 128 102 Q124 96 125 90 Z" fill="#EF4444" />
          {/* Golden corn/spice nugget */}
          <circle cx="106" cy="94" r="3.5" fill="#FBBF24" />
          {/* Magic spark */}
          <path
            d="M60 85 L62 89 L66 90 L62 91 L60 95 L58 91 L54 90 L58 89 Z"
            fill="url(#tealSparkle)"
            className="animate-ping"
            style={{ animationDuration: '2.5s' }}
          />
          <path
            d="M148 80 L149 83 L152 84 L149 85 L148 88 L147 85 L144 84 L147 83 Z"
            fill="url(#tealSparkle)"
            className="animate-ping"
            style={{ animationDuration: '2s' }}
          />

          {/* Fast Motion Speed Trail Lines */}
          <line x1="25" y1="145" x2="45" y2="145" stroke="#FFB347" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <line x1="155" y1="145" x2="178" y2="145" stroke="#FF6B2C" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <line x1="162" y1="153" x2="175" y2="153" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
