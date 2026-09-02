'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useSpring } from 'motion/react';

export function CustomCursor() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // High-performance hardware-accelerated spring physics
  const cursorX = useSpring(-100, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(-100, { stiffness: 500, damping: 28 });

  const dotX = useSpring(-100, { stiffness: 1000, damping: 40 });
  const dotY = useSpring(-100, { stiffness: 1000, damping: 40 });

  // Do not render custom cursor on KDS tablets or Display monitors
  const isKioskMode = pathname?.startsWith('/kds') || pathname?.startsWith('/display');

  useEffect(() => {
    if (isKioskMode) return;
    // Only enable for pointer devices (mouse/trackpad, not coarse touchscreens)
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('mouseover', checkHover, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', checkHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible]);

  if (isKioskMode || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Outer Glowing Magnetic Aura Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.7 : 1,
          opacity: isVisible ? 0.85 : 0,
        }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-[var(--accent-orange,#FF6B2C)] bg-[var(--accent-orange,#FF6B2C)]/15 backdrop-blur-[2px] shadow-[0_0_20px_var(--accent-orange,#FF6B2C)]"
      />

      {/* Center High-Precision Core Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          scale: isClicking ? 1.4 : isHovered ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[var(--accent-amber,#FFB347)] shadow-[0_0_10px_white]"
      />
    </div>
  );
}
