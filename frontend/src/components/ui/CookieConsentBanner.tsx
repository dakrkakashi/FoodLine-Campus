'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldCheck, X, Cookie } from 'lucide-react';

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

  const handleConsent = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem(STORAGE_KEY, type);
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
          className="fixed bottom-24 inset-x-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-40 p-4 rounded-2xl bg-[var(--bg-card,#12121A)]/95 backdrop-blur-2xl border border-[var(--border-glass)] shadow-2xl text-(--text-primary) text-xs print:hidden"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-accent-orange/15 text-accent-orange shrink-0 mt-0.5">
              <Cookie className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-bold text-(--text-primary) flex items-center gap-1.5">
                <span>Cookie & Storage Preferences</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent-orange/15 text-accent-orange font-mono">DPDP</span>
              </p>
              <p className="text-(--text-secondary) leading-relaxed text-[11px]">
                We use strictly essential cookies and local device storage to secure your student PRN session, active tray, and UI preferences. No invasive advertising trackers.{' '}
                <Link href="/privacy" className="text-accent-orange hover:underline font-semibold">
                  Privacy Policy
                </Link>
                {' '}&bull;{' '}
                <Link href="/terms" className="text-accent-orange hover:underline font-semibold">
                  Terms
                </Link>
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleConsent('all')}
                  className="px-3 py-1.5 rounded-xl bg-accent-orange text-white text-[11px] font-bold hover:bg-accent-orange/90 active:scale-95 transition cursor-pointer"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={() => handleConsent('essential')}
                  className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-(--text-primary) text-[11px] font-bold active:scale-95 transition cursor-pointer"
                >
                  Essential Only
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleConsent('essential')}
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
