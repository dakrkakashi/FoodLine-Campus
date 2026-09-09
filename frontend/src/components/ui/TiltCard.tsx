'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  steam?: boolean;
}

export function TiltCard({
  children,
  className,
  maxTilt = 12,
  steam = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * maxTilt;
    const rotY = (x / (rect.width / 2)) * maxTilt;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div style={{ perspective: '1000px' }} className="relative">
      {steam && (
        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 opacity-70">
          <span className="w-1.5 h-6 bg-gradient-to-t from-white/30 to-transparent rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '1.8s' }} />
          <span className="w-2 h-8 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-[1.5px] animate-pulse" style={{ animationDuration: '2.4s', animationDelay: '0.4s' }} />
          <span className="w-1.5 h-6 bg-gradient-to-t from-white/30 to-transparent rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.8s' }} />
        </div>
      )}

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className={clsx(
          'relative rounded-[2.5rem] border border-white/10 bg-[#16161E]/80 backdrop-blur-xl shadow-2xl transition-shadow duration-300',
          isHovered && 'shadow-[0_20px_40px_-15px_rgba(255,107,44,0.35)]',
          className
        )}
      >
        <div style={{ transform: 'translateZ(30px)' }}>{children}</div>
      </motion.div>
    </div>
  );
}
