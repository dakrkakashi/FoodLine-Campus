'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, Receipt } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';
import { useSoundFX } from '@/hooks/useSoundFX';
import { useAuth } from '@/lib/auth/useAuth';
import { FAQAccordion } from '@/components/FAQAccordion';
import {
  DotPattern,
  AnimatedGradientText,
  CoolMode,
  ShineBorder,
  ScrollBasedVelocity,
  Android,
  SparklesText,
} from '@/components/magicui';

export default function IntroductionPage() {
  const { playClick } = useSoundFX();
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

      {/* Main Landing Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-24 flex-1 flex flex-col items-center text-center">
        {/* Campus Pilot Status Pill */}
        <div className="mb-6">
          <AnimatedGradientText className="cursor-pointer">
            <span className="inline-block mr-2 text-emerald-400 animate-pulse">●</span>
            <span>Sanjivani University — Cafe @7 is live on FoodLine</span>
          </AnimatedGradientText>
        </div>

        {/* Hero Title with Sparkles */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] mb-5 max-w-3xl text-neutral-900 dark:text-white">
          Order before class ends.{' '}
          <SparklesText
            text="Pick up the minute"
            colors={{ first: '#FF6B2C', second: '#FFB347' }}
            className="text-accent-orange inline-block"
          />{' '}
          break starts.
        </h1>

        {/* Body Copy in Plain Human English with 1.6 Line Height */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
          Pick your food, choose your break time, and show your phone at the counter. Food is already packed and waiting for you. No crowds. No payment delays.
        </p>

        {/* Live Welcome Banner for Logged-In Users */}
        {user && profile && (
          <div className="mb-8 p-4 bg-accent-orange/10 border border-accent-orange/20 rounded-xl text-accent-orange text-sm font-semibold flex items-center justify-center gap-2">
            <span>Welcome back, {profile.full_name || 'Student'}!</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-500 dark:text-neutral-400">PRN: {profile.prn}</span>
          </div>
        )}

        {/* Primary Call to Action with CoolMode (Food Emojis burst on click!) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto mb-14 sm:mb-16">
          <CoolMode
            options={{
              particleCount: 22,
            }}
          >
            <Link
              href={user ? '/menu' : '/login'}
              onClick={() => playClick()}
              className="w-full px-8 py-4 bg-accent-orange hover:bg-accent-orange/90 text-white font-bold text-base rounded-xl transition shadow-lg shadow-accent-orange/25 hover:shadow-accent-orange/40 flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{user ? 'Open Cafe @7 Menu' : 'Sign in with your PRN'}</span>
              <ArrowRight size={18} />
            </Link>
          </CoolMode>
        </div>

        {/* Infinite Velocity Marquee Banner */}
        <div className="w-full py-4 mb-14 border-y border-white/5 overflow-hidden bg-black/10 dark:bg-white/[0.02]">
          <ScrollBasedVelocity
            text="⚡ ZERO COUNTER QUEUES • 🥪 SAMOSA PAV • ☕ CUTTING CHAI • 📱 INSTANT UPI PASS • 🚀 32-SEC PICKUP • "
            default_velocity={1.5}
            numRows={1}
            className="text-xs sm:text-sm font-black uppercase tracking-widest text-accent-orange/80"
          />
        </div>

        {/* Concrete Proof & Real Measured Results */}
        <section className="w-full max-w-4xl mx-auto space-y-10 text-left mb-16">
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl sm:text-3xl font-black text-accent-orange mb-1">32s</div>
              <div className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">Average Pickup</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl sm:text-3xl font-black text-accent-orange mb-1">0</div>
              <div className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">Time Standing in Line</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl sm:text-3xl font-black text-accent-orange mb-1">100%</div>
              <div className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">Digital Receipts</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl sm:text-3xl font-black text-accent-orange mb-1">4-Digit</div>
              <div className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">Anti-Theft OTP</div>
            </div>
          </div>

          {/* Actual Product Pass Wrapped with ShineBorder */}
          <ShineBorder
            borderRadius={20}
            borderWidth={1.5}
            duration={9}
            color={['#FF6B2C', '#FFB347', '#00D4AA']}
            className="bg-neutral-50 dark:bg-neutral-900/90 border-0 p-6 sm:p-8 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-orange/10 text-accent-orange flex items-center justify-center font-bold">
                  FL
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">Cafe @7 Pickup Pass</h3>
                  <p className="text-xs text-neutral-500">Order #FL-4512 • Verified via UPI</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold w-fit">
                <CheckCircle2 size={14} />
                <span>Ready for Pickup</span>
              </div>
            </div>

            <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Your 4-Digit Pickup OTP</p>
                <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-accent-orange">
                  4 1 8 8
                </div>
                <p className="text-xs text-neutral-500 mt-2">Show this to the counter staff to collect your tray.</p>
              </div>

              <div className="space-y-2 text-sm w-full sm:w-auto">
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <Clock3 size={16} className="text-neutral-400" />
                  <span>Pickup Slot: <strong className="text-neutral-900 dark:text-white">11:15 AM - 11:20 AM</strong></span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <Receipt size={16} className="text-neutral-400" />
                  <span>Items: <strong className="text-neutral-900 dark:text-white">1x Samosa Pav, 1x Cutting Chai</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-500">
              <span>Student PRN: 2024BCSE0042</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Kitchen Screen Notified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Tray Pre-Packed</span>
                </div>
              </div>
            </div>
          </ShineBorder>

          {/* Android Mobile Frame Showcase */}
          <div className="pt-8 flex flex-col items-center">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-orange">Native Mobile Experience</span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
                Engineered for High-Density Campus Hallways
              </h2>
            </div>

            <Android width={320} height={520} time="11:48">
              <div className="p-4 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-xs text-stone-400 font-medium">Pickup In</div>
                    <div className="text-lg font-black text-accent-orange">2m : 14s</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Counter #2
                  </span>
                </div>

                <div className="rounded-xl bg-stone-900/90 border border-white/10 p-3.5 space-y-2">
                  <div className="text-xs font-bold text-white">Cafe @7 Pickup Pass</div>
                  <div className="text-2xl font-mono font-black tracking-widest text-amber-400 text-center py-2 bg-black/40 rounded-lg">
                    9065
                  </div>
                  <div className="text-[11px] text-stone-400 text-center">
                    Tap to show UPI Verification & QR
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>2× Vada Pav (Hot)</span>
                    <span className="font-bold">₹40</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>1× Masala Chai</span>
                    <span className="font-bold">₹15</span>
                  </div>
                </div>
              </div>
            </Android>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full max-w-3xl mx-auto pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              How FoodLine works at Sanjivani
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Three simple steps to save your 15-minute break
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="w-8 h-8 rounded-lg bg-accent-orange text-white flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">Pick & Pre-Pay</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Order before your lecture finishes. Pay directly via UPI (GPay, PhonePe, Paytm).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="w-8 h-8 rounded-lg bg-accent-orange text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">Tray Pre-Packed</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The kitchen screen queues your meal. Canteen staff pack and tag your tray before the bell rings.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80">
              <div className="w-8 h-8 rounded-lg bg-accent-orange text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">Show 4-Digit OTP</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Walk straight to the FoodLine Express counter, recite your 4 digits, grab your food, and eat.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="w-full max-w-3xl mx-auto pt-16">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              Got Questions?
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Everything you need to know about FoodLine at Cafe @7
            </p>
          </div>
          <FAQAccordion />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400">
        <p>Built exclusively for Sanjivani University campus community.</p>
        <div className="flex justify-center gap-4 mt-3 font-medium">
          <Link href="/terms" className="hover:text-accent-orange transition">Terms of Service</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-accent-orange transition">Privacy Policy</Link>
          <span>•</span>
          <Link href="/refund-policy" className="hover:text-accent-orange transition">Refund Policy</Link>
        </div>
      </footer>
    </PageTransition>
  );
}
