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

export default function IntroductionPage() {
  const { playClick } = useSoundFX();

  return (
    <PageTransition className="min-h-screen flex flex-col justify-between bg-[#07070B] text-[#F5F5F7] relative overflow-hidden">
      {/* Subtle Aurora Ambient Mesh */}
      <div className="aurora-mesh">
        <div
          className="aurora-blob w-[36rem] h-[36rem] bg-[#FF6B2C] -top-24 -left-20"
          style={{ animationDuration: '22s' }}
        />
        <div
          className="aurora-blob w-[38rem] h-[38rem] bg-[#00D4AA] top-1/2 -right-28"
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
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 text-xs font-black text-[#FFB347] uppercase tracking-wider mb-8 shadow-xl backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D4AA]" />
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
          <span className="bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-[#00D4AA] bg-clip-text text-transparent">
            Grab Hot Food in 30s.
          </span>
        </motion.h1>

        {/* Concise Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          FoodLine connects college students with all on-campus canteens. Pre-order fresh meals straight from your lecture hall, skip long break lines, and pick up hot food at the dedicated express counter.
        </motion.p>

        {/* Primary Action Buttons (2 Clear Entry Paths) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto mb-14"
        >
          <Link href="/select-campus" onClick={playClick} className="w-full sm:w-auto flex-1">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="w-full px-7 py-4.5 bg-gradient-to-r from-[#FF6B2C] via-[#FF8A3D] to-[#FFB347] text-black font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-[#FF6B2C]/30 flex items-center justify-center gap-2.5 cursor-pointer group transition-all"
            >
              <MapPin size={18} className="text-black" />
              <span>Select Campus & Canteen</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          <Link href="/login" onClick={playClick} className="w-full sm:w-auto flex-1">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="w-full px-7 py-4.5 bg-[#16161E]/90 hover:bg-[#1C1C26] border border-white/15 hover:border-[#FF6B2C]/50 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all"
            >
              <GraduationCap size={18} className="text-[#00D4AA]" />
              <span>Student PRN Login</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* 3 Simple Value Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto text-left"
        >
          <div className="p-5 rounded-2xl bg-[#12121A]/80 border border-white/10 backdrop-blur-xl flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 flex items-center justify-center text-[#FFB347] flex-shrink-0">
              <Store size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white mb-1">5 Campus Canteens</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Cafe @7, South Corner Dosa Bar, Nescafe Kiosk, MBA Cafe & Hostel Mess.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12121A]/80 border border-white/10 backdrop-blur-xl flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/15 border border-[#00D4AA]/30 flex items-center justify-center text-[#00D4AA] flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white mb-1">Break Bell Sync</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Batch cooked for your exact 10-minute break. Ready hot upon bell ring.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12121A]/80 border border-white/10 backdrop-blur-xl flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white mb-1">0% Student Fee</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Pay direct canteen prices via UPI with instant 12-digit UTR verification.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Menu Shortcut */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Link
            href="/canteens"
            onClick={playClick}
            className="text-xs text-zinc-400 hover:text-white transition inline-flex items-center gap-1.5 font-bold"
          >
            <span>Or browse all 5 canteens and live menus directly →</span>
          </Link>
        </motion.div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 px-4 text-center text-xs text-zinc-500 bg-[#07070B]/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] flex items-center justify-center text-black font-black text-xs">
              🍽
            </div>
            <span className="font-extrabold text-white text-xs">FoodLine Campus</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-zinc-400 font-medium">
            <Link href="/canteens" className="hover:text-white transition">5 Canteens</Link>
            <Link href="/select-campus" className="hover:text-white transition">Campuses</Link>
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>

          <span className="text-zinc-500 text-[11px]">Sanjivani University, Kopargaon</span>
        </div>
      </footer>
    </PageTransition>
  );
}
