'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  GraduationCap,
  Store,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';
import { useSoundFX } from '@/hooks/useSoundFX';
import { useAuth } from '@/lib/auth/useAuth';

export default function IntroductionPage() {
  const { playClick } = useSoundFX();
  const { user } = useAuth();

  return (
    <PageTransition className="min-h-screen flex flex-col justify-between bg-[var(--bg-canvas)] text-[var(--text-primary)] relative overflow-hidden transition-colors duration-500">
      {/* Subtle Aurora Ambient Mesh */}
      <div className="aurora-mesh">
        <div
          className="aurora-blob w-[36rem] h-[36rem] bg-accent-orange -top-24 -left-20"
          style={{ animationDuration: '22s' }}
        />
        <div
          className="aurora-blob w-[38rem] h-[38rem] bg-accent-teal top-1/2 -right-28"
          style={{ animationDuration: '26s', animationDelay: '-8s' }}
        />
      </div>

      <Navbar />

      {/* Main Introduction Hero */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-16 flex-1 flex flex-col justify-center items-center text-center">
        {/* Campus Live Pilot Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-orange/15 border border-accent-orange/30 text-xs font-black text-accent-amber uppercase tracking-wider mb-8 shadow-xl backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-teal" />
          </span>
          <span>Sanjivani University • Campus Dining Fast-Pass</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6 max-w-3xl"
        >
          Skip the 25-Min Line.{' '}
          <span className="bg-linear-to-r from-accent-orange via-accent-amber to-accent-teal bg-clip-text text-transparent">
            Grab Hot Food in 30s.
          </span>
        </motion.h1>

        {/* Concise Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          FoodLine connects college students with on-campus canteens. Pre-order fresh meals straight from your lecture hall, skip long break lines, and pick up hot food at the dedicated express counter.
        </motion.p>

        {/* Single Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center w-full max-w-md mx-auto mb-14"
        >
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="w-full"
          >
            <Link
              href={user ? "/menu" : "/login"}
              onClick={() => playClick()}
              className="w-full px-8 py-5 bg-linear-to-r from-accent-orange via-accent-amber to-accent-amber text-black font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-accent-orange/30 flex items-center justify-center gap-3 cursor-pointer group transition-all"
            >
              {user ? (
                <>
                  <Store size={22} className="text-black" />
                  <span>Enter Cafe @7 & Order</span>
                </>
              ) : (
                <>
                  <GraduationCap size={22} className="text-black" />
                  <span>Student PRN Login</span>
                </>
              )}
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* 3 Simple Value Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto text-left"
        >
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] backdrop-blur-xl flex items-start gap-3.5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-accent-orange/15 border border-accent-orange/30 flex items-center justify-center text-accent-amber flex-shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-[var(--text-primary)] mb-1">30-Second Express</h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                Skip the crowded rush and grab hot food with your optical QR pass in 30 seconds.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] backdrop-blur-xl flex items-start gap-3.5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-accent-teal/15 border border-accent-teal/30 flex items-center justify-center text-accent-teal flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-[var(--text-primary)] mb-1">Break Bell Sync</h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                Batch cooked for your exact 10-minute break. Ready hot upon bell ring.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] backdrop-blur-xl flex items-start gap-3.5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center text-accent-purple flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-[var(--text-primary)] mb-1">0% Student Fee</h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                Pay direct canteen prices via UPI with instant 12-digit UTR verification.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 border-t border-[var(--border-glass)] py-6 px-4 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-canvas)]/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-accent-orange to-accent-amber flex items-center justify-center text-black font-black text-xs">
              🍽
            </div>
            <span className="font-extrabold text-[var(--text-primary)] text-xs">FoodLine Campus</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-[var(--text-secondary)] font-medium">
            {user && (
              <Link href="/canteens" className="hover:text-[var(--text-primary)] transition">
                Canteens
              </Link>
            )}
            <Link href={user ? "/profile" : "/login"} className="hover:text-[var(--text-primary)] transition">
              {user ? "My Profile" : "Student Login"}
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-primary)] transition">Terms</Link>
          </div>

          <span className="text-[var(--text-muted)] text-[11px]">Sanjivani University, Kopargaon</span>
        </div>
      </footer>
    </PageTransition>
  );
}
