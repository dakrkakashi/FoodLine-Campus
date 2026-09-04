'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useSoundFX } from '@/hooks/useSoundFX';
import { ThemeCustomizerModal } from './ThemeCustomizerModal';

export function FloatingThemeTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const { config } = useTheme();
  const { playClick } = useSoundFX();

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            playClick();
            setIsOpen(true);
          }}
          className="p-3 rounded-2xl bg-[#12121A]/90 hover:bg-[#1A1A26] border border-white/15 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 cursor-pointer text-white transition-all group"
          title={`Active Theme: ${config.name} (Click to change)`}
        >
          <span className="text-lg group-hover:rotate-12 transition-transform">{config.emoji}</span>
          <span className="hidden sm:inline-block text-xs font-black tracking-wide">
            {config.name}
          </span>
          <Palette size={14} className="text-(--accent-orange)" />
        </motion.button>
      </div>

      <ThemeCustomizerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
