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
  Sun,
  Moon,
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
  const { theme, setTheme, mode, setMode } = useTheme();
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
    <PageTransition className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-500 pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Profile Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-glass)] shadow-xl backdrop-blur-2xl"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent-orange/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Avatar Pill */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-accent-orange to-accent-amber text-black font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-accent-orange/25 border-2 border-white/20">
                  {initials}
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[var(--bg-card)] flex items-center justify-center" title="Active Campus Session">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </span>
              </div>

              {/* Identity Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                    {studentName}
                  </h1>
                  <RoleBadge role={effectiveRole || 'student'} size="sm" />
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Mail size={13} className="text-accent-orange" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{studentEmail}</span>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={copyPrn}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-glass)] text-[11px] font-mono font-bold text-accent-teal transition cursor-pointer"
                    title="Click to copy student PRN"
                  >
                    <Hash size={11} />
                    <span>PRN: {studentPrn}</span>
                    {copiedPrn ? (
                      <CheckCircle2 size={12} className="text-emerald-500" />
                    ) : (
                      <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">Copy</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
              <Link
                href="/orders"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-[var(--border-glass)] text-xs font-bold text-[var(--text-primary)] transition active:scale-95 cursor-pointer shadow-xs"
              >
                <Receipt size={14} className="text-accent-amber" />
                <span>My Orders</span>
              </Link>

              <button
                onClick={async () => {
                  playClick();
                  await signOut();
                }}
                className="inline-flex items-center justify-center p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 transition cursor-pointer"
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
            className="rounded-3xl p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-glass)] space-y-5 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
                <Building2 size={16} className="text-accent-orange" />
                <span>Campus Location</span>
              </div>
              <Link
                href="/canteens"
                className="text-[11px] font-bold text-accent-teal hover:underline flex items-center gap-1"
              >
                <span>Switch Outlet</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-[var(--border-glass)] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  Active Campus
                </span>
                <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span>{selectedCampus?.name || 'Sanjivani University'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold">
                    Kopargaon
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{selectedCampus?.location || 'Post Box No 1, Sanjivani Factory Road'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-[var(--border-glass)] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  Primary Canteen Outlet
                </span>
                <div className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Store size={14} className="text-accent-amber" />
                  <span>{selectedCanteen?.name || 'Cafe @7 (Main Academic)'}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Express pickup counter with automated 60-order capacity limits.</p>
              </div>
            </div>

            {/* Quick QR Pickup Tip */}
            <div className="p-3.5 rounded-2xl bg-linear-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-center gap-3">
              <QrCode size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="text-[11px] text-[var(--text-secondary)] leading-snug">
                Show your <strong className="text-[var(--text-primary)]">4-Digit Pickup OTP</strong> or order token at the counter for contactless express handoff.
              </div>
            </div>
          </motion.div>

          {/* Column 2: App & Dining Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-glass)] space-y-5 shadow-xs"
          >
            <div className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-glass)] pb-3">
              <Sparkles size={16} className="text-accent-teal" />
              <span>Dining & App Preferences</span>
            </div>

            {/* Dietary Preference Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)]">Dietary Filter Preference</label>
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
                        ? 'bg-accent-orange text-black border-accent-orange shadow-md shadow-accent-orange/20 font-black'
                        : 'bg-black/[0.03] dark:bg-white/5 border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="text-base">{d.icon}</span>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound FX Settings */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-[var(--border-glass)]">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  {muted ? <VolumeX size={14} className="text-[var(--text-muted)]" /> : <Volume2 size={14} className="text-emerald-500" />}
                  <span>Web Audio Sound FX</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">Order chimes, button clicks, and kitchen notifications.</p>
              </div>

              <button
                onClick={toggleMute}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  muted
                    ? 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border-[var(--border-glass)]'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                }`}
              >
                {muted ? 'Muted' : 'Active'}
              </button>
            </div>

            {/* Display Mode (Day / Night) */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-[var(--border-glass)]">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  {mode === 'light' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-400" />}
                  <span>Display Mode</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">Switch between Sunlit Day and OLED Night modes.</p>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--border-glass)]">
                <button
                  onClick={() => { setMode('light'); playClick(); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    mode === 'light' ? 'bg-white text-black font-black shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  ☀️ Day
                </button>
                <button
                  onClick={() => { setMode('dark'); playClick(); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    mode === 'dark' ? 'bg-zinc-800 text-white font-black shadow-xs border border-white/10' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  🌙 Night
                </button>
              </div>
            </div>

            {/* Campus Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                <Palette size={13} className="text-accent-amber" />
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
                    className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      theme === t.id
                        ? 'bg-accent-orange text-black border-accent-orange font-black shadow-xs'
                        : 'bg-black/[0.03] dark:bg-white/5 border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5'
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
          className="rounded-3xl p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-glass)] space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-3">
            <div className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
              <Shield size={16} className="text-purple-500" />
              <span>Campus Registration & Security</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Google Sheets Database Sync</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-[var(--border-glass)] space-y-2">
              <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Lock size={13} className="text-accent-orange" />
                <span>Student Data & DPDP Compliance</span>
              </span>
              <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                Your PRN and student orders are secured with encrypted session tokens and synchronized to the university's central ledger spreadsheet.
              </p>
              <Link
                href="/terms"
                className="inline-flex items-center gap-1 text-accent-teal hover:underline font-bold text-[11px]"
              >
                <span>Read Student Terms & Privacy</span>
                <ExternalLink size={10} />
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-[var(--border-glass)] space-y-2">
              <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <HelpCircle size={13} className="text-accent-amber" />
                <span>Student Support & Ombudsman</span>
              </span>
              <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                Need help with a disputed transaction, meal refund, or slot timing? Contact the FoodLine campus support desk:
              </p>
              <a
                href="mailto:foodlinecampus07@gmail.com"
                className="inline-flex items-center gap-1 text-[var(--text-primary)] font-bold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 px-2.5 py-1.5 rounded-lg text-[11px] transition"
              >
                <Mail size={12} className="text-accent-teal" />
                <span>foodlinecampus07@gmail.com</span>
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
