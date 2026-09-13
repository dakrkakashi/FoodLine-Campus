'use client';

import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function StudentAuthIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dynamic Lanyard Glow */}
      <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#8B5CF6]/20 via-[#FF6B2C]/20 to-transparent blur-2xl" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
      >
        <defs>
          <linearGradient id="cardGrad" x1="45" y1="50" x2="155" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2E2824" />
            <stop offset="100%" stopColor="#151210" />
          </linearGradient>

          <linearGradient id="hologramGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#FF6B2C" />
          </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="178" rx="55" ry="8" fill="black" opacity="0.45" />

        {/* Lanyard Strap Dropping from Top */}
        <path
          d="M 88 10 Q 94 36 96 46"
          stroke="#FF6B2C"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 112 10 Q 106 36 104 46"
          stroke="#FFB347"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lanyard Metal Clasp Clip */}
        <rect x="94" y="44" width="12" height="12" rx="3" fill="#D4D4D8" stroke="#71717A" strokeWidth="1" />
        <circle cx="100" cy="50" r="2.5" fill="#18181B" />

        {/* Floating Student ID Smart Card */}
        <g className="animate-[float_3.5s_ease-in-out_infinite]">
          <rect
            x="48"
            y="56"
            width="104"
            height="114"
            rx="14"
            fill="url(#cardGrad)"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="2"
          />

          {/* Holographic Top Banner (Sanjivani Campus) */}
          <rect x="52" y="60" width="96" height="24" rx="10" fill="url(#hologramGrad)" opacity="0.85" />
          <text x="100" y="75" fill="#0C0A09" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            SANJIVANI CAMPUS
          </text>

          {/* Student Avatar Silhouette */}
          <circle cx="72" cy="108" r="14" fill="#3D3530" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="72" cy="104" r="5.5" fill="#FAF9F6" />
          <path d="M 64 118 C 64 113, 67 111, 72 111 C 77 111, 80 113, 80 118 Z" fill="#FAF9F6" />

          {/* ID Information Lines */}
          <rect x="94" y="98" width="46" height="5" rx="2.5" fill="#FAF9F6" opacity="0.9" />
          <rect x="94" y="107" width="34" height="4" rx="2" fill="#8E8EA0" />
          <rect x="94" y="115" width="26" height="4" rx="2" fill="#8E8EA0" />

          {/* Smart Chip Gold Contact */}
          <rect x="56" y="132" width="16" height="12" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
          <line x1="64" y1="132" x2="64" y2="144" stroke="#B45309" strokeWidth="0.8" />
          <line x1="56" y1="138" x2="72" y2="138" stroke="#B45309" strokeWidth="0.8" />

          {/* NFC Wireless Wave Indicator */}
          <g transform="translate(126, 132)">
            <path d="M 2 10 A 10 10 0 0 1 12 0" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 5 10 A 6 6 0 0 1 12 3" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="11" cy="9" r="1.5" fill="#00D4AA" />
          </g>
        </g>
      </svg>
    </div>
  );
}
