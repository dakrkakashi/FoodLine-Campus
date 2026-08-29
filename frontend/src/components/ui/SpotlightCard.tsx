'use client';

import React, { useRef, useState } from 'react';
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
  spotlightColor = 'rgba(255, 107, 44, 0.18)',
  delay = 0,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={clsx(
        'relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#16161E]/80 backdrop-blur-xl transition-colors duration-300',
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {/* Card Border Accent Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/20 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          maskImage: `radial-gradient(280px circle at ${position.x}px ${position.y}px, black 30%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(280px circle at ${position.x}px ${position.y}px, black 30%, transparent 80%)`,
        }}
      />
      {/* Content wrapper with isolation */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
