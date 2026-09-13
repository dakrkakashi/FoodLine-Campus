'use client';

import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function UPIWaitingIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient UPI Emerald & Blue Radiance */}
      <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#3B82F6]/20 via-[#00D4AA]/25 to-transparent blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
      >
        <defs>
          <linearGradient id="phoneGrad" x1="60" y1="30" x2="140" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#25211E" />
            <stop offset="100%" stopColor="#12100F" />
          </linearGradient>

          <linearGradient id="upiRingGrad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="176" rx="55" ry="8" fill="black" opacity="0.45" />

        {/* Pulsing Outer Radar Rings */}
        <circle cx="100" cy="95" r="75" stroke="#00D4AA" strokeWidth="1" opacity="0.2" strokeDasharray="6 6" />
        <circle cx="100" cy="95" r="62" stroke="#3B82F6" strokeWidth="1" opacity="0.35" />

        {/* Smartphone Shell */}
        <rect
          x="66"
          y="35"
          width="68"
          height="124"
          rx="16"
          fill="url(#phoneGrad)"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="2"
        />

        {/* Screen Bezel */}
        <rect
          x="71"
          y="42"
          width="58"
          height="110"
          rx="11"
          fill="#161311"
          stroke="rgba(0, 212, 170, 0.2)"
          strokeWidth="1"
        />

        {/* Dynamic Island Pill Notch */}
        <rect x="91" y="47" width="18" height="4" rx="2" fill="#2E2825" />

        {/* QR Code Grid Graphic on Screen */}
        <g transform="translate(82, 60)">
          {/* Top-Left QR Eye */}
          <rect x="0" y="0" width="14" height="14" rx="2" fill="none" stroke="#00D4AA" strokeWidth="2" />
          <rect x="4" y="4" width="6" height="6" fill="#00D4AA" />

          {/* Top-Right QR Eye */}
          <rect x="22" y="0" width="14" height="14" rx="2" fill="none" stroke="#00D4AA" strokeWidth="2" />
          <rect x="26" y="4" width="6" height="6" fill="#00D4AA" />

          {/* Bottom-Left QR Eye */}
          <rect x="0" y="22" width="14" height="14" rx="2" fill="none" stroke="#00D4AA" strokeWidth="2" />
          <rect x="4" y="26" width="6" height="6" fill="#00D4AA" />

          {/* Center Data Matrix Pixels */}
          <rect x="16" y="8" width="4" height="4" fill="#FAF9F6" />
          <rect x="18" y="16" width="4" height="4" fill="#FFB347" />
          <rect x="10" y="16" width="4" height="4" fill="#00D4AA" />
          <rect x="24" y="24" width="4" height="4" fill="#3B82F6" />
          <rect x="30" y="30" width="4" height="4" fill="#FAF9F6" />
        </g>

        {/* Scanning Laser Beam */}
        <line x1="72" y1="78" x2="128" y2="78" stroke="#FF6B2C" strokeWidth="2" filter="drop-shadow(0 0 4px #FF6B2C)" />

        {/* Orbiting ₹ Rupee Particle */}
        <g transform="translate(138, 54)">
          <circle cx="12" cy="12" r="14" fill="#00D4AA" />
          <text x="12" y="17" fill="#0C0A09" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            ₹
          </text>
        </g>

        {/* Waiting dots spinner at bottom of screen */}
        <circle cx="92" cy="138" r="2.5" fill="#00D4AA" className="animate-ping" />
        <circle cx="100" cy="138" r="2.5" fill="#FFB347" />
        <circle cx="108" cy="138" r="2.5" fill="#3B82F6" />
      </svg>
    </div>
  );
}
