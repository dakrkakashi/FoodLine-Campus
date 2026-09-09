'use client';
 
import React, { useEffect, useRef } from 'react';
 
export function GlobalClickEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Only primary clicks / taps
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (!containerRef.current) return;

      const ripple = document.createElement('div');
      ripple.className = 'absolute pointer-events-none';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.transform = 'translate3d(-50%, -50%, 0)';
      ripple.style.willChange = 'transform, opacity';
      ripple.innerHTML = `
        <!-- Outer Atmospheric Shockwave -->
        <span class="block w-10 h-10 -ml-5 -mt-5 rounded-full border border-[var(--accent-orange,#FF6B2C)]/40 bg-[var(--accent-orange,#FF6B2C)]/10 animate-click-ring-outer"></span>
        <!-- Inner High-Voltage Shockwave -->
        <span class="absolute inset-0 m-auto w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 border-[var(--accent-amber,#FFB347)] animate-click-ring-inner shadow-[0_0_18px_var(--accent-orange,#FF6B2C)]"></span>
        <!-- Center Star Flash -->
        <span class="absolute inset-0 m-auto w-3 h-3 -ml-1.5 -mt-1.5 bg-white rounded-sm rotate-45 animate-click-star-flash shadow-[0_0_14px_#FFF]"></span>
        <!-- 8-Direction Radial Cosmic Fireworks -->
        <span class="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[var(--accent-amber,#FFB347)] animate-click-spark-1 shadow-[0_0_8px_var(--accent-amber,#FFB347)]"></span>
        <span class="absolute w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full bg-[var(--accent-orange,#FF6B2C)] animate-click-spark-2 shadow-[0_0_6px_var(--accent-orange,#FF6B2C)]"></span>
        <span class="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[var(--accent-teal,#00D4AA)] animate-click-spark-3 shadow-[0_0_8px_var(--accent-teal,#00D4AA)]"></span>
        <span class="absolute w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full bg-[var(--accent-amber,#FFB347)] animate-click-spark-4 shadow-[0_0_6px_var(--accent-amber,#FFB347)]"></span>
        <span class="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[var(--accent-purple,#8B5CF6)] animate-click-spark-5 shadow-[0_0_8px_var(--accent-purple,#8B5CF6)]"></span>
        <span class="absolute w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full bg-[var(--accent-teal,#00D4AA)] animate-click-spark-6 shadow-[0_0_6px_var(--accent-teal,#00D4AA)]"></span>
        <span class="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[var(--accent-orange,#FF6B2C)] animate-click-spark-7 shadow-[0_0_8px_var(--accent-orange,#FF6B2C)]"></span>
        <span class="absolute w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full bg-white animate-click-spark-8 shadow-[0_0_8px_#FFF]"></span>
      `;

      containerRef.current.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
    />
  );
}
