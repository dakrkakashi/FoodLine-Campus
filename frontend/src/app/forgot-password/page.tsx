'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PageTransition, SpotlightCard } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugUrl, setDebugUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your Student PRN or College Email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);
    setDebugUrl(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId }),
      });

      const data = await res.json();

      if (!res.ok && res.status === 429) {
        setErrorMessage(
          'Too many password recovery attempts from this device. Please wait 15 minutes before trying again.'
        );
        setIsLoading(false);
        return;
      }

      if (data.success) {
        setStatusMessage(
          data.message ||
            'If this account exists in our campus records, a password reset link has been dispatched to your registered address.'
        );
        if (data.resetUrl) {
          setDebugUrl(data.resetUrl);
        }
      } else {
        setErrorMessage(data.error || 'Unable to request password reset. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'A network error occurred while contacting the campus auth service.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-(--bg-canvas) text-(--text-primary) flex flex-col justify-between px-4 py-8 relative overflow-hidden transition-colors duration-500">
      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between z-10 mb-6">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 6 }}
            className="w-10 h-10 rounded-xl bg-linear-to-tr from-accent-orange to-accent-amber flex items-center justify-center font-black text-white text-lg shadow-lg shadow-accent-orange/20"
          >
            🍽️
          </motion.div>
          <span className="font-extrabold text-xl bg-linear-to-r from-accent-orange via-accent-amber to-(--text-primary) bg-clip-text text-transparent">
            FoodLine
          </span>
        </Link>
        <div className="text-[10px] font-black uppercase tracking-wider bg-black/5 dark:bg-white/5 border border-(--border-glass) px-3 py-1.5 rounded-full text-[#00D4AA] flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          Sanjivani University (Cafe @7)
        </div>
      </header>

      {/* Main Card */}
      <main className="max-w-md mx-auto w-full z-10 flex-1 flex flex-col justify-center">
        <SpotlightCard
          spotlightColor="rgba(255, 107, 44, 0.28)"
          className="p-6 sm:p-8 rounded-[2.5rem] border-2 border-(--border-glass) shadow-2xl bg-(--bg-card) backdrop-blur-2xl"
        >
          {/* Top Title & Icon */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-accent-orange/15 to-accent-amber/15 border border-accent-orange/30 flex items-center justify-center mb-3 shadow-md text-accent-orange"
            >
              <ShieldCheck size={28} />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight text-(--text-primary) mb-1">
              Recover Password
            </h1>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Enter your registered Student PRN or College Email to receive a 15-minute single-use secure reset link.
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs font-medium flex items-start gap-2.5"
            >
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {statusMessage ? (
            /* Success confirmation panel */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center py-2"
            >
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs text-left space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                  <span>Request Dispatched</span>
                </div>
                <p className="text-xs text-(--text-secondary) leading-relaxed">
                  {statusMessage}
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono text-(--text-muted)">
                  <Clock size={12} />
                  <span>The reset link remains active for exactly 15 minutes.</span>
                </div>
              </div>

              {/* Instant Developer / Test Link if returned by backend in dev */}
              {debugUrl && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-500 uppercase tracking-wider">
                    <Sparkles size={13} />
                    <span>Pilot Testing Recovery Link</span>
                  </div>
                  <p className="text-[11px] text-(--text-secondary)">
                    Click below to proceed directly to the secure password update form:
                  </p>
                  <a
                    href={debugUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition shadow-sm w-full justify-center"
                  >
                    <span>Proceed to Reset Password</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <Link
                  href="/login"
                  className="w-full py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-xs font-bold text-(--text-primary) hover:bg-black/10 dark:hover:bg-white/10 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Student Login</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1.5">
                  Student PRN / Roll Number or College Email
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="e.g. 1031 or student@sanjivani.edu.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-(--text-primary) placeholder-(--text-muted) text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-(--text-muted) mt-1.5 flex items-center gap-1">
                  <Mail size={11} />
                  <span>We match against the Sanjivani University student registry.</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent-orange/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Secure Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center border-t border-(--border-glass)">
                <Link
                  href="/login"
                  className="text-xs text-(--text-secondary) hover:text-(--accent-orange) transition inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <ArrowLeft size={13} />
                  <span>Remembered your password? Back to Login</span>
                </Link>
              </div>
            </form>
          )}

          {/* Footer Security Note */}
          <div className="mt-6 pt-4 border-t border-(--border-glass) text-center">
            <span className="text-[11px] text-(--text-muted) flex items-center justify-center gap-1.5">
              <Clock size={12} className="text-[#00D4AA]" />
              Single-use tokens expire after 15 minutes • Rate limit: 3/15m
            </span>
          </div>
        </SpotlightCard>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-(--text-muted) z-10 mt-6">
        FoodLine Campus • Cafe @7, Sanjivani University, Kopargaon
      </footer>
    </PageTransition>
  );
}
