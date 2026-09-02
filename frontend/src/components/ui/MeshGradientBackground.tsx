'use client';

import React from 'react';

interface MeshGradientBackgroundProps {
  opacity?: number;
  className?: string;
}

export function MeshGradientBackground({ opacity = 0.65, className = '' }: MeshGradientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      {/* Primary Warm Core Blob */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full blur-[110px] animate-blob-slow"
        style={{
          background: 'radial-gradient(circle, var(--accent-orange, #FF6B2C) 0%, transparent 70%)',
          opacity: 0.28,
        }}
      />

      {/* Secondary Ambient Aura Blob */}
      <div
        className="absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full blur-[120px] animate-blob-slow-reverse"
        style={{
          background: 'radial-gradient(circle, var(--accent-amber, #FFB347) 0%, transparent 68%)',
          opacity: 0.22,
        }}
      />

      {/* Tertiary Cool Mint / Accent Glow Blob */}
      <div
        className="absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[100px] animate-blob-drift"
        style={{
          background: 'radial-gradient(circle, var(--accent-teal, #00D4AA) 0%, transparent 70%)',
          opacity: 0.2,
        }}
      />

      {/* Subtle Micro-Grid Overlay for Depth */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
