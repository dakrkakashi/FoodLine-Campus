'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY = 'foodline_privacy_acknowledged';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const acknowledged = localStorage.getItem(STORAGE_KEY);
      if (!acknowledged) {
        // Small delay so it doesn't jarringly block initial render
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage blocked
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-20 inset-x-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-40 p-4 rounded-2xl bg-[var(--bg-card,#12121A)]/95 backdrop-blur-2xl border border-[var(--border-glass)] shadow-2xl text-(--text-primary) text-xs print:hidden"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-accent-orange/15 text-accent-orange shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-bold text-(--text-primary)">
                Campus Privacy & Session Storage
              </p>
              <p className="text-(--text-secondary) leading-relaxed">
                FoodLine uses secure device storage for your student PRN session & meal tray. We do not use invasive third-party ad trackers.{' '}
                <Link href="/terms" className="text-accent-orange hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-3 py-1.5 rounded-xl bg-accent-orange text-white font-bold hover:bg-accent-orange/90 active:scale-95 transition cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss privacy banner"
              className="p-1 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
