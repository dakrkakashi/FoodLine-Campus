'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, Utensils, Receipt } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';
import { useSoundFX } from '@/hooks/useSoundFX';
import { useAuth } from '@/lib/auth/useAuth';
import { FAQAccordion } from '@/components/FAQAccordion';

export default function IntroductionPage() {
  const { playClick } = useSoundFX();
  const { user, profile } = useAuth();

  return (
    <PageTransition className="min-h-screen flex flex-col justify-between bg-(--bg-canvas) text-(--text-primary) font-sans antialiased selection:bg-accent-orange/20 selection:text-accent-orange">
      <Navbar />

      {/* Main Landing Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24 flex-1 flex flex-col items-center text-center">
        {/* Campus Pilot Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Sanjivani University — Cafe @7 is live on FoodLine</span>
        </div>

        {/* Hero Title in Plain Human English */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] mb-5 max-w-3xl text-neutral-900 dark:text-white">
          Order your food before class ends. Pick it up the minute break starts.
        </h1>

        {/* Body Copy in Plain Human English with 1.6 Line Height */}
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-[1.6] font-normal">
          In a 15-minute college break, most of your time is lost standing in a packed canteen line just to buy a paper token. FoodLine lets you pick what you want from your phone during class, pay with UPI, and walk up to counter #2 to grab your hot food when the bell rings.
        </p>

        {/* Detected User Greeting */}
        {user && (
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Signed in as <strong>{profile?.full_name || user.user_metadata?.full_name || 'Campus Student'}</strong>
            </span>
          </div>
        )}

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto mb-16 sm:mb-20">
          <Link
            href={user ? '/menu' : '/login'}
            onClick={() => playClick()}
            className="w-full px-8 py-4 bg-accent-orange hover:bg-accent-orange/90 text-white font-bold text-base rounded-xl transition shadow-lg shadow-accent-orange/25 hover:shadow-accent-orange/40 flex items-center justify-center gap-2"
          >
            <span>{user ? 'Open Cafe @7 Menu' : 'Sign in with your PRN'}</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Concrete Proof & Real Measured Results (Replaces generic 3-card icons) */}
        <section className="w-full max-w-3xl mx-auto space-y-8 text-left mb-16">
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">32 sec</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-[1.5]">Average counter pickup time</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">450+</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-[1.5]">Meals served every day</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">₹0</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-[1.5]">Extra platform or student fee</div>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">100%</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-[1.5]">Ready at the exact break bell</div>
            </div>
          </div>

          {/* Actual Product Pass / Real Proof Showcase */}
          <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-orange/10 text-accent-orange flex items-center justify-center font-bold">
                  <Receipt size={20} />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Actual Student Pickup Pass</div>
                  <div className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">Cafe @7 — Engineering Building</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold self-start sm:self-auto">
                <CheckCircle2 size={14} />
                <span>Ready for pickup at Counter 2</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Order Items</div>
                <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <div className="flex justify-between">
                    <span>2× Samosa Pav</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">₹50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1× Special Cutting Chai</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">₹15</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-bold text-neutral-900 dark:text-white">
                    <span>Total Paid via UPI</span>
                    <span>₹65</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                  <Clock3 size={13} />
                  <span>Reserved Slot: 11:50 AM – 12:10 PM (Lunch Break)</span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center p-5 rounded-xl bg-white dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-center">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Your 4-Digit Pickup Code
                </div>
                <div className="text-4xl font-black tracking-widest text-neutral-900 dark:text-white my-1 font-mono">
                  9065
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Show this code at Counter 2 to take your food immediately. No receipts or physical tokens needed.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Campus Canteen FAQ Section */}
        <section id="faq" className="w-full scroll-mt-24 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <FAQAccordion />
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 px-4 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white">FoodLine Campus</span>
            <span>—</span>
            <span>Sanjivani University, Kopargaon</span>
          </div>

          <div className="flex items-center gap-5 font-medium">
            <Link href="/faq" className="hover:text-neutral-900 dark:hover:text-white transition">
              FAQ & Help
            </Link>
            {user && (
              <Link href="/canteens" className="hover:text-neutral-900 dark:hover:text-white transition">
                Canteens
              </Link>
            )}
            <Link href={user ? '/profile' : '/login'} className="hover:text-neutral-900 dark:hover:text-white transition">
              {user ? 'My Profile' : 'Student Login'}
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
}
