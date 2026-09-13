'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';

interface MorphingStepperProps {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  isMaxReached?: boolean;
  disabled?: boolean;
  itemName?: string;
  size?: 'sm' | 'md';
}

export function MorphingStepper({
  quantity,
  onAdd,
  onRemove,
  isMaxReached = false,
  disabled = false,
  itemName = 'dish',
  size = 'md',
}: MorphingStepperProps) {
  const { playPop, playClick } = useSoundFX();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isMaxReached) return;
    playPop();
    onAdd();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    playClick();
    onRemove();
  };

  if (disabled) {
    return (
      <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 select-none">
        Sold Out
      </span>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-end select-none">
      <AnimatePresence mode="wait" initial={false}>
        {quantity === 0 ? (
          <motion.button
            key="add-btn"
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${itemName} to tray`}
            whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className={`cursor-pointer rounded-xl font-black uppercase tracking-wider text-black flex items-center gap-1.5 bg-gradient-to-r from-[var(--color-primary-brand,#FF6B2C)] to-[#FFB347] shadow-lg shadow-[#FF6B2C]/25 hover:shadow-[#FF6B2C]/40 focus-visible:ring-2 focus-visible:ring-[#FF6B2C] focus-visible:outline-hidden ${
              size === 'sm' ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs min-h-[40px]'
            }`}
          >
            <Plus className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} strokeWidth={3} />
            <span>Add</span>
          </motion.button>
        ) : (
          <motion.div
            key="stepper-controls"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            className="flex items-center gap-1 bg-[#12121A]/80 dark:bg-white/5 border border-[#FF6B2C]/45 rounded-2xl p-1 shadow-md shadow-[#FF6B2C]/15 backdrop-blur-md"
          >
            {/* Decrement Button */}
            <motion.button
              type="button"
              onClick={handleRemove}
              whileTap={{ scale: 0.88 }}
              aria-label={`Remove one ${itemName}`}
              className="w-8 h-8 rounded-xl bg-black/20 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/20 text-[#FAF9F6] font-black text-sm flex items-center justify-center cursor-pointer transition focus-visible:ring-2 focus-visible:ring-[#FF6B2C] focus-visible:outline-hidden"
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
            </motion.button>

            {/* Rolling Digital Counter */}
            <div className="w-6 overflow-hidden flex items-center justify-center text-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={quantity}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="font-mono font-black text-sm text-[#00D4AA] inline-block select-none"
                  aria-label={`Quantity: ${quantity}`}
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Increment Button */}
            <motion.button
              type="button"
              disabled={isMaxReached}
              onClick={handleAdd}
              whileTap={!isMaxReached ? { scale: 0.88 } : undefined}
              aria-label={`Add one more ${itemName}`}
              title={isMaxReached ? 'Maximum available stock reached' : 'Add one more'}
              className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-[#FF6B2C] focus-visible:outline-hidden ${
                isMaxReached
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
                  : 'bg-[#FF6B2C] hover:brightness-110 text-black cursor-pointer shadow-sm active:scale-95'
              }`}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
