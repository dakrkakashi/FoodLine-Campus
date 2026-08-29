'use client';

import React from 'react';
import { motion } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  gradient?: boolean;
  delay?: number;
  type?: 'words' | 'letters';
}

export function AnimatedText({
  text,
  className = '',
  gradient = false,
  delay = 0,
  type = 'words',
}: AnimatedTextProps) {
  if (type === 'words') {
    const words = text.split(' ');
    return (
      <span className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}>
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={gradient ? 'bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-[#00D4AA] bg-clip-text text-transparent' : ''}
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  }

  const letters = Array.from(text);
  return (
    <span className={`inline-block ${className}`}>
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.35,
            delay: delay + index * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={char === ' ' ? 'inline-block w-[0.25em]' : 'inline-block'}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
