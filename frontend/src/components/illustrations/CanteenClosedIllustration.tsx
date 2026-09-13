'use client';

import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export function CanteenClosedIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Night Moon Glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#3B82F6]/15 via-[#8B5CF6]/15 to-transparent blur-2xl" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="shutterGrad" x1="40" y1="50" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2D2926" />
            <stop offset="100%" stopColor="#171412" />
          </linearGradient>

          <linearGradient id="moonGrad" x1="130" y1="20" x2="165" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <filter id="lanternGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="178" rx="68" ry="8" fill="black" opacity="0.5" />

        {/* Rolling Shutter Counter Frame */}
        <rect
          x="34"
          y="56"
          width="132"
          height="112"
          rx="12"
          fill="url(#shutterGrad)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="2"
        />

        {/* Shutter Horizontal Slats */}
        {[72, 86, 100, 114, 128, 142].map((y) => (
          <line
            key={y}
            x1="38"
            y1={y}
            x2="162"
            y2={y}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2"
          />
        ))}

        {/* Padlock on Bottom Latch */}
        <g transform="translate(93, 140)">
          <rect x="2" y="8" width="12" height="10" rx="2" fill="#E5E7EB" stroke="#6B7280" strokeWidth="1" />
          <path d="M 5 8 V 4 C 5 2.5 6 1 8 1 C 10 1 11 2.5 11 4 V 8" stroke="#E5E7EB" strokeWidth="2" fill="none" />
          <circle cx="8" cy="13" r="1.5" fill="#111827" />
        </g>

        {/* "Opens Next Slot" Signboard */}
        <g transform="translate(62, 88)">
          <rect x="0" y="0" width="76" height="26" rx="6" fill="#1E1A17" stroke="#F59E0B" strokeWidth="1.2" />
          <text x="38" y="16" fill="#F59E0B" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            OPENS 08:30 AM
          </text>
        </g>

        {/* Crescent Moon in Sky */}
        <path
          d="M 152 26 A 14 14 0 1 0 166 48 A 17 17 0 0 1 152 26 Z"
          fill="url(#moonGrad)"
        />

        {/* Twinkling Night Stars */}
        <circle cx="48" cy="38" r="1.5" fill="#FDE68A" opacity="0.8" />
        <circle cx="78" cy="24" r="1" fill="#FFFFFF" opacity="0.7" />
        <circle cx="120" cy="32" r="1.5" fill="#FDE68A" opacity="0.9" />

        {/* Cozy Resting Glass of Cutting Chai on side ledge */}
        <g transform="translate(42, 146)">
          <path d="M 4 2 L 6 16 L 12 16 L 14 2 Z" fill="#D97706" opacity="0.7" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
