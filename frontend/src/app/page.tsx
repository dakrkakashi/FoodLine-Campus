'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock3, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';
import { useSoundFX } from '@/hooks/useSoundFX';
import { useAuth } from '@/lib/auth/useAuth';
import {
  DotPattern,
  AnimatedGradientText,
  CoolMode,
  ScrollBasedVelocity,
  SparklesText,
} from '@/components/magicui';

export default function IntroductionPage() {
  const { playClick, playTab } = useSoundFX();
  const { user, profile } = useAuth();

  return (
    <PageTransition className="relative min-h-screen flex flex-col justify-between bg-(--bg-canvas) text-(--text-primary) font-sans antialiased selection:bg-accent-orange/20 selection:text-accent-orange overflow-x-hidden">
      {/* Background Dot Matrix Pattern with deterministic ID */}
      <DotPattern
        id="landing-dot-pattern"
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
        className="opacity-30 [mask-image:radial-gradient(ellipse_at_top,white,transparent_75%)]"
      />

      <Navbar />

      {/* Main Clean Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 flex-1 flex flex-col items-center text-center">
        {/* Campus Pilot Status Pill */}
        <div className="mb-6 sm:mb-8">
          <AnimatedGradientText className="cursor-default">
            <span className="inline-block mr-2 text-emerald-400 animate-pulse">&bull;</span>
            <span>Sanjivani University &mdash; Cafe @7 is live on FoodLine</span>
          </AnimatedGradientText>
        </div>

        {/* Hero Title with Sparkles */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6 max-w-3xl text-neutral-900 dark:text-white">
          Order before class ends.{' '}
          <SparklesText
            text="Pick up the minute"
            colors={{ first: '#FF6B2C', second: '#FFB347' }}
            className="text-accent-orange inline-block"
          />{' '}
          break starts.
        </h1>

        {/* Body Copy */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
          Pick your food, choose your break time, and show your phone at the counter. Food is already packed and waiting for you. No crowds. No payment delays.
        </p>

        {/* Live Welcome Banner for Logged-In Users */}
        {user && profile && (
          <div className="mb-8 p-3.5 px-5 bg-accent-orange/10 border border-accent-orange/20 rounded-2xl text-accent-orange text-sm font-semibold flex items-center justify-center gap-2">
            <span>Welcome back, {profile.full_name || 'Student'}!</span>
            <span className="text-neutral-400">&bull;</span>
            <span className="text-neutral-500 dark:text-neutral-400 font-mono">PRN: {profile.prn}</span>
          </div>
        )}

        {/* Dual Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto mb-14 sm:mb-16">
          <CoolMode
            options={{
              particleCount: 22,
            }}
          >
            <Link
              href={user ? '/menu' : '/login'}
              onClick={playClick}
              className="w-full sm:w-auto px-8 py-4 bg-accent-orange hover:bg-accent-orange/90 text-white font-black text-base rounded-2xl transition shadow-lg shadow-accent-orange/25 hover:shadow-accent-orange/40 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>{user ? 'Open Cafe @7 Menu' : 'Sign In with PRN'}</span>
              <ArrowRight size={18} />
            </Link>
          </CoolMode>

          <Link
            href="/how-it-works"
            onClick={playTab}
            className="w-full sm:w-auto px-6 py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] font-bold text-base rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} className="text-accent-teal" />
            <span>See How It Works</span>
          </Link>
        </div>

        {/* Infinite Velocity Marquee Banner */}
        <div className="w-full py-4 mb-12 border-y border-neutral-200/60 dark:border-white/5 overflow-hidden bg-black/5 dark:bg-white/[0.02] rounded-2xl">
          <ScrollBasedVelocity
            text="&bull; ZERO COUNTER QUEUES &bull; SAMOSA PAV &bull; CUTTING CHAI &bull; INSTANT UPI PASS &bull; 32-SEC PICKUP &bull; "
            default_velocity={1.5}
            numRows={1}
            className="text-xs sm:text-sm font-black uppercase tracking-widest text-accent-orange/80"
          />
        </div>

        {/* Compact Clean Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center mb-3">
              <Clock3 size={18} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">Guaranteed Slot</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Order ahead for your exact 15-minute break slot.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center mb-3">
              <Zap size={18} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">32-Sec Pickup</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Tray pre-packed and waiting for you at the counter.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-accent-amber/10 text-accent-amber flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">Anti-Theft OTP</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Secure 4-digit code verifies your meal in seconds.</p>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full py-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400">
        <p>Built exclusively for Sanjivani University campus community.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-3 font-medium">
          <Link href="/how-it-works" className="hover:text-accent-orange transition">How It Works</Link>
          <span>&bull;</span>
          <Link href="/faq" className="hover:text-accent-orange transition">Campus FAQ</Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:text-accent-orange transition">Terms of Service</Link>
          <span>&bull;</span>
          <Link href="/privacy" className="hover:text-accent-orange transition">Privacy Policy</Link>
          <span>&bull;</span>
          <Link href="/refund-policy" className="hover:text-accent-orange transition">Refund Policy</Link>
        </div>
      </footer>
    </PageTransition>
  );
}
