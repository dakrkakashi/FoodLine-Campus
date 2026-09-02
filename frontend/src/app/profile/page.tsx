'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Hash,
  Building2,
  Store,
  Receipt,
  Shield,
  Volume2,
  VolumeX,
  Palette,
  ExternalLink,
  LogOut,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  QrCode,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';
import { useCampus } from '@/context/CampusContext';
import { useTheme, THEMES, ThemeName } from '@/context/ThemeContext';
import { useSoundFX } from '@/hooks/useSoundFX';
import { Navbar } from '@/components/navbar';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { PageTransition } from '@/components/ui/PageTransition';

export default function ProfilePage() {
  const { user, profile, effectiveRole, signOut, loading } = useAuth();
  const { selectedCampus, selectedCanteen } = useCampus();
  const { theme, setTheme } = useTheme();
  const { muted, toggleMute, playClick } = useSoundFX();

  const [dietaryPref, setDietaryPref] = useState<'all' | 'veg' | 'jain'>('all');
  const [copiedPrn, setCopiedPrn] = useState(false);

  // Fallback student demo identity if not logged in or partial profile
  const studentPrn = profile?.prn || user?.user_metadata?.prn || '2023SUCS0142';
  const studentName = profile?.full_name || user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Campus Student');
  const studentEmail = user?.email || 'student@sanjivani.edu.in';

  const initials = studentName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const copyPrn = () => {
    navigator.clipboard.writeText(studentPrn);
    setCopiedPrn(true);
    playClick();
    setTimeout(() => setCopiedPrn(false), 2000);
  };

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Profile Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-linear-to-br from-white/[0.07] via-white/[0.02] to-transparent border border-white/10 shadow-2xl backdrop-blur-2xl"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--accent-orange,#FF6B2C)]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--accent-teal,#00D4AA)]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar Pill */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-[var(--accent-orange,#FF6B2C)] to-[var(--accent-amber,#F59E0B)] text-black font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl shadow-[var(--accent-orange)]/20 border-2 border-white/20">
                  {initials}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#07070B] flex items-center justify-center" title="Active Campus Session">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </span>
              </div>

              {/* Identity Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {studentName}
                  </h1>
                  <RoleBadge role={effectiveRole || 'student'} size="sm" />
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Mail size={13} className="text-zinc-500" />
                  <span>{studentEmail}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={copyPrn}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-bold text-[var(--accent-teal,#00D4AA)] transition cursor-pointer"
                    title="Click to copy student PRN"
                  >
                    <Hash size={11} />
                    <span>PRN: {studentPrn}</span>
                    {copiedPrn ? (
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    ) : (
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Copy</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link
                href="/orders"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
              >
                <Receipt size={14} className="text-[var(--accent-amber,#F59E0B)]" />
                <span>My Orders</span>
              </Link>

              <button
                onClick={async () => {
                  playClick();
                  await signOut();
                }}
                className="inline-flex items-center justify-center p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer"
                title="Sign out of FoodLine"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Grid: Campus Context & Account Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Campus & Outlet Affinity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wider">
                <Building2 size={16} className="text-[var(--accent-orange,#FF6B2C)]" />
                <span>Campus Location</span>
              </div>
              <Link
                href="/canteens"
                className="text-[11px] font-bold text-[var(--accent-teal,#00D4AA)] hover:underline flex items-center gap-1"
              >
                <span>Switch Outlet</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Active Campus
                </span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{selectedCampus?.name || 'Sanjivani University'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                    Kopargaon
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{selectedCampus?.location || 'Post Box No 1, Sanjivani Factory Road'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Primary Canteen Outlet
                </span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Store size={14} className="text-[var(--accent-amber,#F59E0B)]" />
                  <span>{selectedCanteen?.name || 'Cafe @7 (Main Academic)'}</span>
                </div>
                <p className="text-xs text-zinc-400">Express pickup counter with automated 60-order capacity limits.</p>
              </div>
            </div>

            {/* Quick QR Pickup Tip */}
            <div className="p-3.5 rounded-2xl bg-linear-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-center gap-3">
              <QrCode size={20} className="text-emerald-400 shrink-0" />
              <div className="text-[11px] text-zinc-300 leading-snug">
                Show your <strong>4-Digit Pickup OTP</strong> or order token at the counter for contactless express handoff.
              </div>
            </div>
          </motion.div>

          {/* Column 2: App & Dining Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 space-y-5"
          >
            <div className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-3">
              <Sparkles size={16} className="text-[var(--accent-teal,#00D4AA)]" />
              <span>Dining & App Preferences</span>
            </div>

            {/* Dietary Preference Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">Dietary Filter Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'All Items', icon: '🍽️' },
                  { id: 'veg', label: 'Pure Veg', icon: '🌱' },
                  { id: 'jain', label: 'Jain Friendly', icon: '🌿' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setDietaryPref(d.id as any);
                      playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      dietaryPref === d.id
                        ? 'bg-[var(--accent-orange,#FF6B2C)] text-black border-[var(--accent-orange)] shadow-lg shadow-[var(--accent-orange)]/20 font-black'
                        : 'bg-black/30 border-white/10 text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{d.icon}</span>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound FX Settings */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  {muted ? <VolumeX size={14} className="text-zinc-500" /> : <Volume2 size={14} className="text-emerald-400" />}
                  <span>Web Audio Sound FX</span>
                </div>
                <p className="text-[11px] text-zinc-400">Order chimes, button clicks, and kitchen notifications.</p>
              </div>

              <button
                onClick={toggleMute}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  muted
                    ? 'bg-white/5 text-zinc-400 border-white/10'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {muted ? 'Muted' : 'Active'}
              </button>
            </div>

            {/* Campus Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Palette size={13} className="text-[var(--accent-amber,#F59E0B)]" />
                <span>Active Campus Theme</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id as ThemeName);
                      playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      theme === t.id
                        ? 'bg-white/15 text-white border-white/40 shadow-inner'
                        : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Database & Student Welfare Support Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wider">
              <Shield size={16} className="text-purple-400" />
              <span>Campus Registration & Security</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Google Sheets Database Sync</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Lock size={13} className="text-[var(--accent-orange,#FF6B2C)]" />
                <span>Student Data & DPDP Compliance</span>
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Your PRN and student orders are secured with encrypted session tokens and synchronized to the university's central ledger spreadsheet.
              </p>
              <Link
                href="/terms"
                className="inline-flex items-center gap-1 text-[var(--accent-teal,#00D4AA)] hover:underline font-bold text-[11px]"
              >
                <span>Read Student Terms & Privacy</span>
                <ExternalLink size={10} />
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <HelpCircle size={13} className="text-[var(--accent-amber,#F59E0B)]" />
                <span>Student Support & Ombudsman</span>
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Need help with a disputed transaction, meal refund, or slot timing? Contact the FoodLine campus support desk:
              </p>
              <a
                href="mailto:foodlinecampus07@gmail.com"
                className="inline-flex items-center gap-1 text-white font-bold bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg text-[11px] transition"
              >
                <Mail size={12} className="text-[var(--accent-teal,#00D4AA)]" />
                <span>foodlinecampus07@gmail.com</span>
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
