'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export function GlobalClickEffect() {
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    // Only primary clicks / taps
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const newRipple: ClickRipple = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
    };

    setRipples((prev) => [...prev.slice(-8), newRipple]); // max 8 active ripples

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 500);
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [handlePointerDown]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
    >
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute pointer-events-none"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            transform: 'translate3d(-50%, -50%, 0)',
            willChange: 'transform, opacity',
          }}
        >
          {/* Main Expanding Wave Ring */}
          <span className="block w-6 h-6 rounded-full border-2 border-[var(--accent-orange,#FF6B2C)] animate-click-ring" />

          {/* Inner Glowing Flash Center */}
          <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[var(--accent-amber,#FFB347)] animate-click-dot shadow-[0_0_12px_var(--accent-orange,#FF6B2C)]" />

          {/* 4 Micro Spark Particles radiating outwards */}
          <span className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-teal,#00D4AA)] animate-click-spark-1" />
          <span className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-orange,#FF6B2C)] animate-click-spark-2" />
          <span className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-amber,#FFB347)] animate-click-spark-3" />
          <span className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-purple,#8B5CF6)] animate-click-spark-4" />
        </div>
      ))}
    </div>
  );
}
