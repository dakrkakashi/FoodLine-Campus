'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 40, className = '', showText = false }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 transition-transform duration-300 hover:scale-105 flex items-center justify-center"
      >
        {!hasError ? (
          <Image
            src="/logo.png"
            alt="FoodLine Campus Logo"
            width={size}
            height={size}
            className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(255,107,44,0.3)]"
            priority
            onError={() => setHasError(true)}
          />
        ) : (
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,107,44,0.35)]"
          >
            <defs>
              <linearGradient id="flLogoGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B2C" />
                <stop offset="50%" stopColor="#FFB347" />
                <stop offset="100%" stopColor="#00D4AA" />
              </linearGradient>
              <linearGradient id="flLogoGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFB347" stopOpacity="0.2" />
              </linearGradient>
              <filter id="flLogoNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FF6B2C" floodOpacity="0.4" />
              </filter>
            </defs>
            <rect
              x="4"
              y="4"
              width="92"
              height="92"
              rx="26"
              fill="#0E0E15"
              stroke="rgba(255, 107, 44, 0.3)"
              strokeWidth="2"
            />
            <circle cx="50" cy="50" r="34" fill="url(#flLogoGlowGrad)" opacity="0.18" />
            <path
              d="M 28 58 C 28 38 72 38 72 58 Z"
              fill="none"
              stroke="url(#flLogoGradPrimary)"
              strokeWidth="5.5"
              strokeLinecap="round"
              filter="url(#flLogoNeonGlow)"
            />
            <circle cx="50" cy="35" r="4.5" fill="url(#flLogoGradPrimary)" />
            <path
              d="M 22 66 L 78 66"
              stroke="url(#flLogoGradPrimary)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              d="M 32 74 L 68 74"
              stroke="#FFB347"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 42 81 L 58 81"
              stroke="#00D4AA"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M 50 43 L 47 50 L 53 50 L 49 57"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {showText && (
        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-[var(--accent-orange,#FF6B2C)] via-[var(--accent-amber,#FFB347)] to-white bg-clip-text text-transparent">
          FoodLine
        </span>
      )}
    </div>
  );
}
