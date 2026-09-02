'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      // Lightweight ping to check real connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/telemetry', {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setIsOffline(false);
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 4000);
      } else {
        setIsOffline(true);
      }
    } catch {
      setIsOffline(true);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-[100] pointer-events-none flex flex-col items-center">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto w-full max-w-2xl px-4 pt-2.5 pb-1"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#1A1110]/95 border border-red-500/30 text-white backdrop-blur-xl shadow-[0_8px_30px_rgba(239,68,68,0.2)]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400">
                  <WifiOff size={16} className="animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wide text-red-300">
                      Campus Network Offline
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Cart &amp; pass cached locally. Auto-syncing upon Wi-Fi / LTE restore.
                  </p>
                </div>
              </div>

              <button
                onClick={handleManualCheck}
                disabled={isChecking}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-zinc-200 transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
                <span>{isChecking ? 'Checking...' : 'Check'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReconnected && !isOffline && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto w-full max-w-md px-4 pt-2.5 pb-1"
          >
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 backdrop-blur-xl shadow-[0_8px_30px_rgba(16,185,129,0.2)]">
              <Wifi size={15} className="text-emerald-400" />
              <span className="text-xs font-black tracking-wide">
                ⚡ Back Online! Connected to FoodLine Campus
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
