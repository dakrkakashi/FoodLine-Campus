'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 40, className = '', showText = false }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/logo.png"
          alt="FoodLine Campus Logo"
          width={size}
          height={size}
          className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(255,107,44,0.3)]"
          priority
        />
      </div>

      {showText && (
        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-[var(--accent-orange,#FF6B2C)] via-[var(--accent-amber,#FFB347)] to-white bg-clip-text text-transparent">
          FoodLine
        </span>
      )}
    </div>
  );
}
