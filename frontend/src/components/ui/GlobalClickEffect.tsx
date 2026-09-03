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
        <span class="block w-6 h-6 rounded-full border-2 border-[var(--accent-orange,#FF6B2C)] animate-click-ring"></span>
        <span class="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[var(--accent-amber,#FFB347)] animate-click-dot shadow-[0_0_12px_var(--accent-orange,#FF6B2C)]"></span>
        <span class="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-teal,#00D4AA)] animate-click-spark-1"></span>
        <span class="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-orange,#FF6B2C)] animate-click-spark-2"></span>
        <span class="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-amber,#FFB347)] animate-click-spark-3"></span>
        <span class="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-purple,#8B5CF6)] animate-click-spark-4"></span>
      `;

      containerRef.current.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 550);
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
