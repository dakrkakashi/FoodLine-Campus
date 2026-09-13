'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Receipt,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';
import { useSoundFX } from '@/hooks/useSoundFX';
import { useAuth } from '@/lib/auth/useAuth';
import {
  DotPattern,
  ShineBorder,
  Android,
  CoolMode,
  SparklesText,
  AnimatedGradientText,
} from '@/components/magicui';

export default function HowItWorksPage() {
  const { playClick, playTab } = useSoundFX();
  const { user } = useAuth();

  return (
    <PageTransition className="relative min-h-screen flex flex-col justify-between bg-(--bg-canvas) text-(--text-primary) font-sans antialiased selection:bg-accent-orange/20 selection:text-accent-orange overflow-x-hidden">
      {/* Background Dot Matrix Pattern with deterministic ID */}
      <DotPattern
        id="how-it-works-dot-pattern"
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
        className="opacity-30 [mask-image:radial-gradient(ellipse_at_top,white,transparent_75%)]"
      />

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 sm:pb-28 flex-1 flex flex-col items-center text-center">
        {/* Breadcrumb / Tag Pill */}
        <div className="mb-6">
          <AnimatedGradientText className="cursor-default">
            <Sparkles size={14} className="text-accent-orange mr-1.5 inline" />
            <span>The FoodLine Campus System &bull; Sanjivani University</span>
          </AnimatedGradientText>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-5 max-w-3xl text-neutral-900 dark:text-white">
          Engineered for High-Density{' '}
          <SparklesText
            text="Campus Hallways"
            colors={{ first: '#FF6B2C', second: '#00D4AA' }}
            className="text-accent-orange inline-block"
          />
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed font-normal">
          How FoodLine eliminates canteen lines, guarantees 32-second pickups, and saves your 15-minute lecture break at Cafe @7.
        </p>

        {/* 3 Steps: How It Works */}
        <section className="w-full max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-accent-orange">Step-by-Step Flow</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1 text-neutral-900 dark:text-white">
              Three Simple Steps to Save Your Break
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center font-black text-base mb-4 border border-accent-orange/20">
                1
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Smartphone size={16} className="text-accent-orange" />
                <span>Pick & Pre-Pay</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Order before your lecture finishes. Choose your exact break time slot and pay instantly via UPI (GPay, PhonePe, Paytm).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center font-black text-base mb-4 border border-accent-teal/20">
                2
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Zap size={16} className="text-accent-teal" />
                <span>Tray Pre-Packed</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The kitchen display queues your meal. Canteen staff pack and tag your tray with your order number before the campus bell rings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-accent-amber/10 text-accent-amber flex items-center justify-center font-black text-base mb-4 border border-accent-amber/20">
                3
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-accent-amber" />
                <span>Show 4-Digit OTP</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Walk straight to the FoodLine Express counter at Cafe @7, recite your 4 digits, grab your food, and enjoy your break.
              </p>
            </div>
          </div>
        </section>

        {/* Real Measured Results */}
        <section className="w-full max-w-4xl mx-auto space-y-12 text-left mb-20">
          <div>
            <div className="text-center mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-accent-teal">Audited Campus Metrics</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 text-neutral-900 dark:text-white">
                Measured In-Field at Cafe @7
              </h2>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
                <div className="text-3xl sm:text-4xl font-black text-accent-orange mb-1">32s</div>
                <div className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400">Average Pickup</div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
                <div className="text-3xl sm:text-4xl font-black text-accent-teal mb-1">0 min</div>
                <div className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400">Standing in Line</div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
                <div className="text-3xl sm:text-4xl font-black text-accent-amber mb-1">100%</div>
                <div className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400">Digital Receipts</div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm text-center">
                <div className="text-3xl sm:text-4xl font-black text-indigo-400 mb-1">4-Digit</div>
                <div className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400">Anti-Theft OTP</div>
              </div>
            </div>
          </div>

          {/* Actual Product Pass Wrapped with ShineBorder */}
          <div className="pt-4">
            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-accent-orange">Live Product Preview</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
                The Express Pickup Pass
              </h3>
            </div>

            <ShineBorder
              borderRadius={20}
              borderWidth={1.5}
              duration={9}
              color={['#FF6B2C', '#FFB347', '#00D4AA']}
              className="bg-white dark:bg-neutral-900/90 border-0 p-6 sm:p-8 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-orange/10 text-accent-orange flex items-center justify-center font-bold">
                    FL
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-neutral-900 dark:text-white">Cafe @7 Pickup Pass</h4>
                    <p className="text-xs text-neutral-500">Order #FL-4512 &bull; Verified via UPI</p>
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
          </div>

          {/* Android Mobile Frame Showcase */}
          <div className="pt-10 flex flex-col items-center">
            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-accent-teal">Mobile-First Interface</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
                Live Kitchen Sync on Your Phone
              </h3>
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
                    <span>2&times; Vada Pav (Hot)</span>
                    <span className="font-bold">&inr;40</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>1&times; Masala Chai</span>
                    <span className="font-bold">&inr;15</span>
                  </div>
                </div>
              </div>
            </Android>
          </div>
        </section>

        {/* Call to Action Bar */}
        <section className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 shadow-xl flex flex-col items-center text-center">
          <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">
            Ready to Skip the Canteen Line?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
            Order your snacks now and pick them up hot the second your lecture bell rings.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <CoolMode options={{ particleCount: 20 }}>
              <Link
                href={user ? '/menu' : '/login'}
                onClick={playClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-accent-orange hover:bg-accent-orange/90 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-accent-orange/25 hover:shadow-accent-orange/40 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>{user ? 'Open Cafe @7 Menu' : 'Sign In with PRN'}</span>
                <ArrowRight size={16} />
              </Link>
            </CoolMode>

            <Link
              href="/faq"
              onClick={playTab}
              className="w-full sm:w-auto px-6 py-3.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
            >
              <HelpCircle size={16} />
              <span>Campus FAQ</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400">
        <p>Built exclusively for Sanjivani University campus community.</p>
        <div className="flex justify-center gap-4 mt-3 font-medium">
          <Link href="/" className="hover:text-accent-orange transition">Home</Link>
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
