'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../lib/utils';
import { useSoundFX } from '../../hooks/useSoundFX';

interface DockedFloatingCartProps {
  className?: string;
}

export function DockedFloatingCart({ className = '' }: DockedFloatingCartProps) {
  const { totalCount, totalAmount, items } = useCart();
  const { playPop } = useSoundFX();

  return (
    <AnimatePresence>
      {totalCount > 0 && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className={`fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:w-[420px] z-40 select-none ${className}`}
        >
          <div className="relative rounded-2xl bg-[#191614]/95 backdrop-blur-2xl border border-white/12 p-3.5 sm:p-4 shadow-[0_16px_48px_rgba(0,0,0,0.7)] flex items-center justify-between gap-3.5 overflow-hidden">
            {/* Ambient Brand Accent Glow */}
            <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-[#FF6B2C]/20 blur-2xl pointer-events-none" />

            {/* Left: Cart Info & Quantity Badge */}
            <div className="relative flex items-center gap-3">
              <motion.div
                key={totalCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.25, 1] }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] flex items-center justify-center text-black font-black shadow-md shadow-[#FF6B2C]/30 shrink-0"
              >
                <ShoppingCart className="w-5 h-5 text-black" strokeWidth={2.5} />
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#00D4AA] text-black font-mono font-black text-[10px] ring-2 ring-[#191614]">
                  {totalCount}
                </span>
              </motion.div>

              <div className="flex flex-col">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#8E8EA0] flex items-center gap-1">
                  <span>Your Break Tray</span>
                  <span className="text-[10px] text-[#FFB347]">· {items.length} {items.length === 1 ? 'item' : 'items'}</span>
                </span>
                <span className="font-mono font-black text-lg text-[#FAF9F6] tracking-tight">
                  {formatINR(totalAmount)}
                </span>
              </div>
            </div>

            {/* Right: Glowing Checkout CTA Button */}
            <Link
              href="/cart"
              onClick={() => playPop()}
              className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FF8C38] text-black font-black text-sm shadow-[0_0_24px_rgba(255,107,44,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
