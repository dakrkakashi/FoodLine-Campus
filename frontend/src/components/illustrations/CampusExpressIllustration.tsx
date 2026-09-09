'use client';

import React from 'react';

interface CampusExpressIllustrationProps {
  className?: string;
  size?: number;
}

export function CampusExpressIllustration({ className = '', size = 190 }: CampusExpressIllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dynamic Cyber/Mint Glow */}
      <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[var(--accent-teal,#00D4AA)]/25 via-[var(--accent-orange,#FF6B2C)]/15 to-transparent blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="lockerGradient" x1="40" y1="40" x2="160" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#252536" />
            <stop offset="100%" stopColor="#101018" />
          </linearGradient>

          <linearGradient id="bagGradient" x1="75" y1="100" x2="135" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B2C" />
            <stop offset="100%" stopColor="#D9531E" />
          </linearGradient>

          <linearGradient id="screenGradient" x1="120" y1="50" x2="155" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#00A884" />
          </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="180" rx="65" ry="10" fill="black" opacity="0.45" />

        {/* Smart Locker Bay Frame */}
        <rect
          x="35"
          y="35"
          width="130"
          height="140"
          rx="20"
          fill="url(#lockerGradient)"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="2.5"
        />

        {/* Top Header Canopy with Neon Status Bar */}
        <rect x="42" y="42" width="116" height="24" rx="8" fill="#161622" />
        <circle cx="54" cy="54" r="4" fill="#00D4AA" className="animate-pulse" />
        <text x="64" y="58" fill="#FFFFFF" fontSize="9" fontWeight="800" letterSpacing="0.8">
          EXPRESS PICKUP
        </text>

        {/* Large Central Locker Chamber (Open / Active) */}
        <rect
          x="44"
          y="72"
          width="112"
          height="94"
          rx="14"
          fill="#0D0D14"
          stroke="rgba(0, 212, 170, 0.35)"
          strokeWidth="2"
        />

        {/* Steaming Food Bag inside chamber */}
        <g className="animate-[float_3.5s_ease-in-out_infinite]">
          {/* Paper Bag Body */}
          <path
            d="M74 105 L126 105 L132 152 C132 156 128 158 124 158 L76 158 C72 158 68 156 68 152 Z"
            fill="url(#bagGradient)"
            stroke="#FFB347"
            strokeWidth="1.5"
          />

          {/* Bag Fold Top Creases */}
          <path d="M72 105 L82 98 L100 102 L118 98 L128 105 Z" fill="#FFB347" opacity="0.9" />

          {/* Bag Handles */}
          <path
            d="M86 98 C86 86 114 86 114 98"
            stroke="#FFE4C4"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* FoodLine Stamp Logo on Bag */}
          <circle cx="100" cy="130" r="12" fill="white" opacity="0.9" />
          <path
            d="M94 130 L98 126 L104 126 L106 130 L103 134 L97 134 Z"
            fill="#FF6B2C"
          />
          <line x1="97" y1="130" x2="103" y2="130" stroke="white" strokeWidth="1.5" />

          {/* Fresh Aroma Vapor Wisps */}
          <path
            d="M93 84 Q88 74 94 66 Q99 58 95 50"
            stroke="#00D4AA"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
            className="animate-pulse"
          />
          <path
            d="M107 82 Q112 72 106 64 Q101 56 105 48"
            stroke="#FFB347"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </g>

        {/* Digital OTP Verification Badge on top right */}
        <g transform="translate(130, 78)">
          <rect x="0" y="0" width="28" height="18" rx="5" fill="#00D4AA" filter="drop-shadow(0 2px 8px rgba(0,212,170,0.5))" />
          <text x="5" y="12" fill="#000000" fontSize="8" fontWeight="900">
            OTP
          </text>
        </g>
      </svg>
    </div>
  );
}
