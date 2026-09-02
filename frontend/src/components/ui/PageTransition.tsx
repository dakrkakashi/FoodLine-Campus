'use client';

import React from 'react';
import { motion } from 'motion/react';

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: 'translateZ(0)',
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
