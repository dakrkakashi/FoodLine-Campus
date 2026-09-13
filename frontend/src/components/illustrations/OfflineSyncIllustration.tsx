'use client';

import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function OfflineSyncIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Teal Sync Glow */}
      <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-[#00D4AA]/20 via-[#3B82F6]/20 to-transparent blur-2xl" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
      >
        <defs>
          <linearGradient id="vaultBoxGrad" x1="40" y1="80" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#292421" />
            <stop offset="100%" stopColor="#141110" />
          </linearGradient>

          <linearGradient id="shieldGrad" x1="80" y1="90" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#00A884" />
          </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="176" rx="60" ry="8" fill="black" opacity="0.45" />

        {/* Antenna Mast in Background */}
        <line x1="100" y1="64" x2="100" y2="28" stroke="#8E8EA0" strokeWidth="2.5" />
        <circle cx="100" cy="28" r="4" fill="#FF6B2C" />

        {/* Wi-Fi Radiation Arcs with Slash (Indicating Offline / Low Signal) */}
        <path d="M 82 22 A 24 24 0 0 1 118 22" stroke="#8E8EA0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M 74 14 A 34 34 0 0 1 126 14" stroke="#8E8EA0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3" />
        {/* Offline Diagonal Cut */}
        <line x1="72" y1="10" x2="128" y2="34" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />

        {/* Campus Offline Safe Box */}
        <rect
          x="44"
          y="68"
          width="112"
          height="92"
          rx="14"
          fill="url(#vaultBoxGrad)"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="2"
        />

        {/* Vault Dial / Shield Lock in Center */}
        <circle cx="100" cy="114" r="28" fill="#1B1715" stroke="rgba(0, 212, 170, 0.3)" strokeWidth="2" />
        <circle cx="100" cy="114" r="22" fill="url(#shieldGrad)" />

        {/* Offline Safe Checkmark & QR Icon */}
        <path
          d="M 92 114 L 97 120 L 109 108"
          stroke="#0C0A09"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cached QR Pass indicator pill */}
        <g transform="translate(64, 138)">
          <rect x="0" y="0" width="72" height="18" rx="9" fill="#141110" stroke="#00D4AA" strokeWidth="1" />
          <text x="36" y="12.5" fill="#00D4AA" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            OFFLINE QR READY
          </text>
        </g>
      </svg>
    </div>
  );
}
