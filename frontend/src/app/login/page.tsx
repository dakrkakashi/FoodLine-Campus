'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { GraduationCap, Shield, Lock, Mail, KeyRound, ArrowRight, Loader2, Sparkles, User as UserIcon, CheckCircle2, Eye, EyeOff, Building2 } from 'lucide-react';
import { PageTransition, SpotlightCard, fireConfettiSuccess } from '@/components/ui';
import { useAuth } from '@/lib/auth/useAuth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/menu';

  const { signInWithPassword, signInWithPrnPassword, signUpWithPrnPassword, signInWithGoogle } = useAuth();

  // Tabs: STUDENT_PRN (Default), STAFF_ADMIN, GOOGLE_SSO
  const [authTab, setAuthTab] = useState<'STUDENT_PRN' | 'STAFF_ADMIN' | 'GOOGLE_SSO'>('STUDENT_PRN');
  
  // Student PRN auth states
  const [studentMode, setStudentMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [studentFullName, setStudentFullName] = useState('');
  const [studentPrn, setStudentPrn] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Staff / Admin auth states (Sign in only)
  const [staffEmail, setStaffEmail] = useState('foodlinecampus07@gmail.com');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Student PRN + Password Login & Sign Up
  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentPrn.trim() || !studentPassword) {
      setErrorMessage('Please enter your PRN and password.');
      return;
    }

    if (studentMode === 'SIGN_UP' && !studentFullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (studentPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (studentMode === 'SIGN_UP') {
        const { error } = await signUpWithPrnPassword(studentPrn.trim(), studentPassword, studentFullName.trim());
        if (error) {
          setErrorMessage(error.message || 'Failed to create student account. Please check if PRN is already registered.');
          setIsLoading(false);
          return;
        }

        fireConfettiSuccess();
        setSuccessMessage('Student account created successfully! Taking you to the menu...');
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 800);
      } else {
        const { error } = await signInWithPrnPassword(studentPrn.trim(), studentPassword);
        if (error) {
          setErrorMessage(error.message || 'Invalid PRN or password. Please try again or create an account.');
          setIsLoading(false);
          return;
        }

        fireConfettiSuccess();
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  // 2. Staff & Admin Sign In Only (Created via Supabase / Staff Engine)
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmail || !staffPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { error } = await signInWithPassword(staffEmail.trim(), staffPassword);
      if (error) {
        setErrorMessage(error.message || 'Invalid staff credentials. Default key: foodline2026');
        setIsLoading(false);
        return;
      }

      fireConfettiSuccess();
      setSuccessMessage('Staff verified! Redirecting to station...');
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during staff login.');
      setIsLoading(false);
    }
  };

  // 3. Google SSO Login
  const handleGoogleSSO = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle(redirectPath);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google SSO failed.');
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-white flex flex-col justify-between px-4 py-8 relative overflow-hidden">
      {/* Background Ambient Mesh */}
      <div className="aurora-mesh">
        <div
          className="aurora-blob w-[36rem] h-[36rem] bg-[#FF6B2C] -top-20 -left-20"
          style={{ animationDuration: '16s' }}
        />
        <div
          className="aurora-blob w-[34rem] h-[34rem] bg-[#9333EA] -bottom-20 -right-20"
          style={{ animationDuration: '20s', animationDelay: '-8s' }}
        />
      </div>

      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between z-10 mb-6">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 6 }}
            className="w-10 h-10 rounded-xl bg-linear-to-tr from-accent-orange to-accent-amber flex items-center justify-center font-black text-black text-lg shadow-lg shadow-accent-orange/20"
          >
            🍽
          </motion.div>
          <span className="font-extrabold text-xl bg-linear-to-r from-accent-orange via-accent-amber to-white bg-clip-text text-transparent">
            FoodLine
          </span>
        </Link>
        <div className="text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[#00D4AA] flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          Sanjivani University (Cafe @7)
        </div>
      </header>

      {/* Login Card Container */}
      <main className="max-w-md mx-auto w-full z-10 flex-1 flex flex-col justify-center">
        <SpotlightCard
          spotlightColor="rgba(255, 107, 44, 0.28)"
          className="p-6 sm:p-8 rounded-[2.5rem] border-2 border-white/10 shadow-2xl shadow-black/90 bg-neutral-950/80 backdrop-blur-2xl"
        >
          {/* Card Header Icon */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
              className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#16161E] to-[#20202E] border border-white/10 flex items-center justify-center mb-3 shadow-xl text-white"
            >
              {authTab === 'STAFF_ADMIN' ? (
                <Shield size={28} className="text-purple-400" />
              ) : (
                <GraduationCap size={28} className="text-accent-amber" />
              )}
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight text-white mb-1">
              {authTab === 'STAFF_ADMIN' ? 'Staff & Admin Portal' : 'Campus Student Portal'}
            </h1>
            <p className="text-xs text-neutral-400">
              {authTab === 'STAFF_ADMIN'
                ? 'Sign in to access KDS, live inventory, and manager dashboard'
                : 'Sign in or create account with your PRN & Password'}
            </p>
          </div>

          {/* 3-Tab Selector */}
          <div className="p-1 rounded-2xl bg-black/50 border border-white/10 grid grid-cols-3 gap-1 mb-6 text-xs font-bold">
            <button
              onClick={() => { setAuthTab('STUDENT_PRN'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                authTab === 'STUDENT_PRN'
                  ? 'bg-linear-to-r from-accent-orange to-accent-amber text-black shadow-lg shadow-accent-orange/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GraduationCap size={13} />
              <span>Student PRN</span>
            </button>

            <button
              onClick={() => { setAuthTab('STAFF_ADMIN'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                authTab === 'STAFF_ADMIN'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shield size={13} />
              <span>Admin / Staff</span>
            </button>

            <button
              onClick={() => { setAuthTab('GOOGLE_SSO'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                authTab === 'GOOGLE_SSO'
                  ? 'bg-linear-to-r from-accent-orange to-accent-amber text-black shadow-lg shadow-accent-orange/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Google</span>
            </button>
          </div>

          {/* Error & Success Banners */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
              <span className="shrink-0">🎉</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: Student PRN + Password (Sign In & Sign Up) */}
          {authTab === 'STUDENT_PRN' && (
            <form onSubmit={handleStudentAuth} className="space-y-4">
              {/* Sign In vs Create Account Sub-Toggle */}
              <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center mb-2">
                <button
                  type="button"
                  onClick={() => { setStudentMode('SIGN_IN'); setErrorMessage(null); setSuccessMessage(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    studentMode === 'SIGN_IN'
                      ? 'bg-[var(--accent-orange)] text-black shadow-md font-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setStudentMode('SIGN_UP'); setErrorMessage(null); setSuccessMessage(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    studentMode === 'SIGN_UP'
                      ? 'bg-[var(--accent-orange)] text-black shadow-md font-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Full Name for Student Registration */}
              {studentMode === 'SIGN_UP' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="text"
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      required
                      placeholder="e.g. Shivam Nirmal"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Student PRN / Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Student PRN / Roll Number
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    value={studentPrn}
                    onChange={(e) => setStudentPrn(e.target.value)}
                    required
                    placeholder="e.g. 1031 or 2102001042"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all font-mono"
                  />
                </div>
                {studentPrn.trim().length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 p-2 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/25 flex items-center justify-between text-[11px]"
                  >
                    <span className="flex items-center gap-1.5 text-[#00D4AA] font-bold">
                      <CheckCircle2 size={12} />
                      <span>Sanjivani University (Auto-Detected)</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono font-bold">
                      5 Canteens
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Student Password */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Password {studentMode === 'SIGN_UP' && '(Min. 4 Characters)'}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type={showStudentPassword ? "text" : "password"}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                    aria-label={showStudentPassword ? "Hide password" : "Show password"}
                  >
                    {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent-orange/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{studentMode === 'SIGN_UP' ? 'Creating Account...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <>
                    <span>{studentMode === 'SIGN_UP' ? 'Create Student Account' : 'Sign In with PRN'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode(studentMode === 'SIGN_IN' ? 'SIGN_UP' : 'SIGN_IN');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-neutral-400 hover:text-orange-300 transition cursor-pointer block w-full"
                >
                  {studentMode === 'SIGN_IN' ? (
                    <span>New student at campus? <strong className="text-[var(--accent-orange)] underline">Create Account</strong></span>
                  ) : (
                    <span>Already have a password? <strong className="text-[var(--accent-orange)] underline">Sign In</strong></span>
                  )}
                </button>

                <div className="pt-2 border-t border-white/5">
                  <Link
                    href="/select-campus"
                    className="text-xs text-zinc-400 hover:text-white transition inline-flex items-center gap-1.5"
                  >
                    <Building2 size={13} className="text-[#FF6B2C]" />
                    <span>Not from Sanjivani? Browse other campuses →</span>
                  </Link>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Staff & Admin Sign In Only (Strictly No Public Registration) */}
          {authTab === 'STAFF_ADMIN' && (
            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 flex items-start gap-2">
                <Shield size={14} className="shrink-0 mt-0.5 text-purple-400" />
                <span>Restricted to Authorized Canteen Managers & Kitchen Staff (Assigned via Supabase).</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="email"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    required
                    placeholder="foodlinecampus07@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Staff Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type={showStaffPassword ? "text" : "password"}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                    aria-label={showStaffPassword ? "Hide password" : "Show password"}
                  >
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Helper Chip */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300">
                <span>🔑 Passkey: <code className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">foodline2026</code></span>
                <button
                  type="button"
                  onClick={() => {
                    setStaffEmail('foodlinecampus07@gmail.com');
                    setStaffPassword('foodline2026');
                    setErrorMessage(null);
                  }}
                  className="text-[var(--accent-teal,#00D4AA)] hover:underline font-bold cursor-pointer"
                >
                  Quick Fill ⚡
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Staff Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin & Kitchen</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: Google SSO */}
          {authTab === 'GOOGLE_SSO' && (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSSO}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white text-black font-bold text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-neutral-100 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with University Google Account</span>
              </button>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-neutral-400">
                <CheckCircle2 size={16} className="text-[#00D4AA] shrink-0 mt-0.5" />
                <span>Instant 1-tap sign in for students & faculty with university emails.</span>
              </div>
            </div>
          )}

          {/* Footer Security Note */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <span className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
              <Lock size={12} className="text-[#00D4AA]" />
              Secured by Sanjivani University Identity Guard
            </span>
          </div>
        </SpotlightCard>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-neutral-600 z-10 mt-6">
        FoodLine Campus Ecosystem • Pilot Outlet: Sanjivani University Cafe @7
      </footer>
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07070B] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
