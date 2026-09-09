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
  const { user, profile } = useAuth();

  return (
    <PageTransition className="min-h-screen flex flex-col justify-between bg-(--bg-canvas) text-(--text-primary) relative overflow-hidden transition-colors duration-500">
      <Navbar />

      {/* Main Introduction Hero */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10 sm:pb-16 flex-1 flex flex-col justify-center items-center text-center">
        {/* Campus Live Pilot Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-accent-orange/15 border border-accent-orange/30 text-[10px] sm:text-xs font-black text-accent-amber uppercase tracking-wider mb-6 sm:mb-8 shadow-xl backdrop-blur-md max-w-[95vw]"
        >
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-accent-teal" />
          </span>
          <span className="truncate">Sanjivani University • Campus Dining Fast-Pass</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[26px] min-[360px]:text-[30px] sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] sm:leading-[1.08] mb-4 sm:mb-6 max-w-3xl px-1"
        >
          Skip the 25-Min Line.{' '}
          <br className="sm:hidden" />
          <span className="bg-linear-to-r from-accent-orange via-accent-amber to-accent-teal bg-clip-text text-transparent">
            Grab Hot Food in 30s.
          </span>
        </motion.h1>

        {/* Concise Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[13px] sm:text-base md:text-lg text-(--text-secondary) max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-medium px-2 sm:px-0"
        >
          FoodLine connects college students with on-campus canteens. Pre-order fresh meals straight from your lecture hall, skip long break lines, and pick up hot food at the dedicated express counter.
        </motion.p>

        {/* Welcome Back Banner for Auto-Detected Student */}
        {user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 font-bold shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              👋 Welcome back, <strong>{profile?.full_name || user.user_metadata?.full_name || 'Campus Student'}</strong>! Account Detected
            </span>
          </motion.div>
        )}

        {/* Single Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center w-full max-w-md mx-auto mb-10 sm:mb-14 px-2 sm:px-0"
        >
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="w-full"
          >
            <Link
              href={user ? "/menu" : "/login"}
              onClick={() => playClick()}
              className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-linear-to-r from-accent-orange via-accent-amber to-accent-amber text-black font-black text-sm sm:text-lg rounded-2xl shadow-xl shadow-accent-orange/30 flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer group transition-all active:scale-[0.97]"
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl mx-auto text-left"
        >
          <div className="p-5 rounded-2xl bg-(--bg-card) border border-(--border-glass) backdrop-blur-xl flex items-start gap-3.5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-accent-orange/15 border border-accent-orange/30 flex items-center justify-center text-accent-amber shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-(--text-primary) mb-1">30-Second Express</h2>
              <p className="text-xs text-(--text-secondary) leading-relaxed font-medium">
                Skip the crowded rush and grab hot food with your optical QR pass in 30 seconds.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-(--bg-card) border border-(--border-glass) backdrop-blur-xl flex items-start gap-3.5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-accent-teal/15 border border-accent-teal/30 flex items-center justify-center text-accent-teal shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-(--text-primary) mb-1">Break Bell Sync</h2>
              <p className="text-xs text-(--text-secondary) leading-relaxed font-medium">
                Batch cooked for your exact 10-minute break. Ready hot upon bell ring.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-(--bg-card) border border-(--border-glass) backdrop-blur-xl flex items-start gap-3.5 shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center text-accent-purple shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-(--text-primary) mb-1">0% Student Fee</h2>
              <p className="text-xs text-(--text-secondary) leading-relaxed font-medium">
                Pay direct canteen prices via UPI with instant 12-digit UTR verification.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 border-t border-(--border-glass) py-6 px-4 text-center text-xs text-(--text-muted) bg-(--bg-canvas)/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-accent-orange to-accent-amber flex items-center justify-center text-black font-black text-xs">
              🍽
            </div>
            <span className="font-extrabold text-(--text-primary) text-xs">FoodLine Campus</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-(--text-secondary) font-medium">
            {user && (
              <Link href="/canteens" className="hover:text-(--text-primary) transition">
                Canteens
              </Link>
            )}
            <Link href={user ? "/profile" : "/login"} className="hover:text-(--text-primary) transition">
              {user ? "My Profile" : "Student Login"}
            </Link>
            <Link href="/terms" className="hover:text-(--text-primary) transition">Terms</Link>
          </div>

          <span className="text-(--text-muted) text-[11px]">Sanjivani University, Kopargaon</span>
        </div>
      </footer>
    </PageTransition>
  );
}
