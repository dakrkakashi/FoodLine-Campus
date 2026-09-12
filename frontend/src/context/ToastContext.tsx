'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, ShoppingCart, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'cart';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  cart: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', durationMs = 3200) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, durationMs);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);
  const cart = useCallback((msg: string) => showToast(msg, 'cart'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, cart }}>
      {children}
      {/* Floating Toast Portal */}
      <div
        aria-live="polite"
        className="fixed top-5 inset-x-0 sm:top-auto sm:bottom-20 sm:right-6 sm:left-auto z-50 flex flex-col items-center sm:items-end gap-2.5 pointer-events-none px-4 sm:px-0 max-w-sm ml-auto"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            let icon = <Info className="w-4 h-4 text-accent-teal shrink-0" />;
            let borderColor = 'border-accent-teal/40';
            let bgGlow = 'rgba(0, 212, 170, 0.12)';

            if (toast.type === 'success') {
              icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
              borderColor = 'border-emerald-500/40';
              bgGlow = 'rgba(16, 185, 129, 0.15)';
            } else if (toast.type === 'error') {
              icon = <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
              borderColor = 'border-red-500/40';
              bgGlow = 'rgba(239, 68, 68, 0.15)';
            } else if (toast.type === 'cart') {
              icon = <ShoppingCart className="w-4 h-4 text-accent-orange shrink-0" />;
              borderColor = 'border-accent-orange/40';
              bgGlow = 'rgba(255, 107, 44, 0.18)';
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[var(--bg-card,#12121A)]/95 backdrop-blur-xl border ${borderColor} text-(--text-primary) shadow-2xl shadow-black/50 text-xs font-semibold w-full sm:w-auto min-w-[260px]`}
                style={{ boxShadow: `0 8px 30px ${bgGlow}` }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {icon}
                  <span className="truncate">{toast.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Close notification"
                  className="p-1 rounded-lg hover:bg-white/10 text-(--text-muted) hover:text-(--text-primary) transition cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
