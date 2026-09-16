'use client';

import React from 'react';
import { motion } from 'motion/react';

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-full min-w-0 ${className || ''}`.trim()}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
}
