'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useSpring } from 'motion/react';

export function CustomCursor() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [velocityAngle, setVelocityAngle] = useState(0);
  const [velocityScale, setVelocityScale] = useState(1);
  const lastPosRef = useRef({ x: -100, y: -100, time: 0 });

  // 1. Snappy Laser Core (stiffness 1200, damping 35)
  const dotX = useSpring(-100, { stiffness: 1200, damping: 35 });
  const dotY = useSpring(-100, { stiffness: 1200, damping: 35 });

  // 2. Interactive Orbital Ring (stiffness 500, damping 28)
  const ringX = useSpring(-100, { stiffness: 500, damping: 28 });
  const ringY = useSpring(-100, { stiffness: 500, damping: 28 });

  // 3. Ethereal Ambient Trailing Nebula Flare (stiffness 180, damping 22)
  const trailX = useSpring(-100, { stiffness: 180, damping: 22 });
  const trailY = useSpring(-100, { stiffness: 180, damping: 22 });

  // Do not render custom cursor on KDS tablets or Display monitors
  const isKioskMode = pathname?.startsWith('/kds') || pathname?.startsWith('/display');

  useEffect(() => {
    if (isKioskMode) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const last = lastPosRef.current;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const dt = Math.max(1, now - last.time);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt;

      if (dist > 2) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        setVelocityAngle(angle);
        setVelocityScale(Math.min(1.22, 1 + speed * 0.05));
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };

      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = !!target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
      setIsHovered((prev) => (prev === isInteractive ? prev : isInteractive));
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
  }, [dotX, dotY, ringX, ringY, trailX, trailY, isVisible, isKioskMode]);

  if (isKioskMode || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* 1. Ambient Trailing Nebula Flare (Lagging soft ethereal glow) */}
      <motion.div
        style={{ x: trailX, y: trailY }}
        animate={{
          scale: isClicking ? 0.6 : isHovered ? 1.7 : 1,
          opacity: isVisible ? 0.35 : 0,
        }}
        transition={{ duration: 0.25 }}
        className="fixed top-0 left-0 w-14 h-14 -ml-7 -mt-7 rounded-full bg-gradient-to-tr from-[var(--accent-orange,#FF6B2C)] via-[var(--accent-amber,#FFB347)] to-[var(--accent-teal,#00D4AA)] blur-xl pointer-events-none"
      />

      {/* 2. Interactive Orbital Magnetic Ring with Satellite Particles */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          scale: isClicking ? 0.72 : isHovered ? 1.75 : 1,
          opacity: isVisible ? 0.9 : 0,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 24 }}
        className="fixed top-0 left-0 w-9 h-9 -ml-4.5 -mt-4.5 rounded-full pointer-events-none"
      >
        {/* Outer Ring Border with Velocity Squash & Glassmorphic Backdrop */}
        <div
          style={{
            transform: `rotate(${velocityAngle}deg) scale(${velocityScale}, ${2 - velocityScale})`,
            transition: 'transform 0.12s ease-out',
          }}
          className={`w-full h-full rounded-full transition-colors duration-200 ${
            isHovered
              ? 'border-2 border-dashed border-[var(--accent-amber,#FFB347)] bg-[var(--accent-orange,#FF6B2C)]/20 shadow-[0_0_24px_var(--accent-orange,#FF6B2C)]'
              : 'border-[1.75px] border-[var(--accent-orange,#FF6B2C)] bg-[var(--accent-orange,#FF6B2C)]/10 shadow-[0_0_16px_var(--accent-orange,#FF6B2C)]'
          } backdrop-blur-[1.5px]`}>
        </div>

        {/* Orbiting Satellite Micro-Particles */}
        <div className={`absolute inset-0 m-auto w-full h-full pointer-events-none ${isHovered ? 'animate-cursor-orbit-fast' : 'animate-cursor-orbit'}`}>
          <span className="absolute -top-1 left-1/2 -ml-1 w-2 h-2 rounded-full bg-[var(--accent-amber,#FFB347)] shadow-[0_0_8px_var(--accent-amber,#FFB347)]" />
          <span className="absolute -bottom-1 left-1/2 -ml-0.75 w-1.5 h-1.5 rounded-full bg-[var(--accent-teal,#00D4AA)] shadow-[0_0_6px_var(--accent-teal,#00D4AA)]" />
        </div>
      </motion.div>

      {/* 3. Center High-Precision Core Laser Dot */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: isClicking ? 1.6 : isHovered ? 0.45 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.12 }}
        className="fixed top-0 left-0 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-white shadow-[0_0_12px_#FFF,0_0_6px_var(--accent-amber,#FFB347)] pointer-events-none"
      />
    </div>
  );
}
