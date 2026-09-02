'use client';

import React, { useRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx } from 'clsx';

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  delay?: number;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(255, 107, 44, 0.2)',
  delay = 0,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
      cardRef.current.style.setProperty('--spotlight-opacity', '1');
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--spotlight-opacity', '0');
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(delay, 0.15),
      }}
      className={clsx(
        'relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#16161E]/80 backdrop-blur-md transition-colors duration-200 group gpu-layer',
        className
      )}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform, opacity',
      }}
      {...props}
    >
      {/* Zero-Re-render Cursor Spotlight Radial Glow via CSS custom properties */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200"
        style={{
          opacity: 'var(--spotlight-opacity, 0)',
          background: `radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 80%)`,
        }}
      />
      {/* Content wrapper with isolation */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
