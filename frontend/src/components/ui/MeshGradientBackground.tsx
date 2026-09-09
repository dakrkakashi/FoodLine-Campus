'use client';

import React from 'react';

interface MeshGradientBackgroundProps {
  opacity?: number;
  className?: string;
}

export function MeshGradientBackground({ opacity = 1, className = '' }: MeshGradientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      {/* 1. Primary Zenith Radiance (Illuminates Header & Hero Title) */}
      <div
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[130vw] h-[70vh] max-w-[1500px] pointer-events-none transition-all duration-1000 ease-out animate-ambient-breathe dark:mix-blend-screen"
        style={{
          background: `radial-gradient(ellipse 75% 55% at 50% 0%, 
            color-mix(in srgb, var(--accent-orange, #FF6B2C) 16%, transparent) 0%, 
            color-mix(in srgb, var(--accent-orange, #FF6B2C) 7%, transparent) 40%, 
            color-mix(in srgb, var(--accent-orange, #FF6B2C) 1.5%, transparent) 70%, 
            transparent 100%)`,
        }}
      />

      {/* 2. Secondary Ambient Warmth (Mid-Right Flank Glow) */}
      <div
        className="absolute top-[20%] -right-[15%] w-[75vw] h-[75vw] max-w-[950px] max-h-[950px] pointer-events-none transition-all duration-1000 ease-out animate-ambient-drift dark:mix-blend-screen"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 65% 50%, 
            color-mix(in srgb, var(--accent-amber, #FFB347) 11%, transparent) 0%, 
            color-mix(in srgb, var(--accent-amber, #FFB347) 3.5%, transparent) 50%, 
            transparent 85%)`,
        }}
      />

      {/* 3. Tertiary Accent Depth (Lower-Left Flank Glow) */}
      <div
        className="absolute bottom-[0%] -left-[12%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] pointer-events-none transition-all duration-1000 ease-out animate-ambient-float dark:mix-blend-screen"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 35% 50%, 
            color-mix(in srgb, var(--accent-teal, #00D4AA) 9%, transparent) 0%, 
            color-mix(in srgb, var(--accent-teal, #00D4AA) 2.5%, transparent) 50%, 
            transparent 80%)`,
        }}
      />

      {/* 4. Tactile Dot Matrix Grid with Smooth Radial Vignette (Linear / Raycast Elegance) */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 35%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 35%, black 30%, transparent 85%)',
        }}
      />

      {/* 5. Velvet Micro-Grain Texture (Eliminates Monitor Color Banding) */}
      <div
        className="absolute inset-0 opacity-[0.018] dark:opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
