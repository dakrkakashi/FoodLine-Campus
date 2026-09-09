'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { GraduationCap, Shield, Lock, Mail, KeyRound, ArrowRight, Loader2, Sparkles, User as UserIcon, CheckCircle2, Eye, EyeOff, Building2, Copy, Check, X, HelpCircle } from 'lucide-react';
import { PageTransition, SpotlightCard, fireConfettiSuccess } from '@/components/ui';
import { useAuth } from '@/lib/auth/useAuth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/menu';

  const { user, profile, signOut, signInWithPassword, signInWithPrnPassword, signUpWithPrnPassword, signInWithGoogle } = useAuth();

  // Tabs: STUDENT_PRN (Default), STAFF_ADMIN, GOOGLE_SSO
  const [authTab, setAuthTab] = useState<'STUDENT_PRN' | 'STAFF_ADMIN' | 'GOOGLE_SSO'>('STUDENT_PRN');
  
  // Student PRN auth states
  const [studentMode, setStudentMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [studentFullName, setStudentFullName] = useState('');
  const [studentPrn, setStudentPrn] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [detectedAccount, setDetectedAccount] = useState<{
    studentName: string;
    prn: string;
    exists: boolean;
  } | null>(null);
  const [isResolvingPrn, setIsResolvingPrn] = useState(false);

  // Pre-load last PRN from storage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrn = localStorage.getItem('foodline_last_prn');
      if (savedPrn && !studentPrn) {
        setStudentPrn(savedPrn);
      }
    }
  }, []);

  // Real-time PRN auto-detector
  React.useEffect(() => {
    const clean = studentPrn.trim().toUpperCase();
    if (clean.length < 3) {
      setDetectedAccount(null);
      return;
    }

    // Quick local storage check for instantaneous UI response
    if (typeof window !== 'undefined') {
      const savedPrn = localStorage.getItem('foodline_last_prn');
      const savedName = localStorage.getItem('foodline_last_name');
      if (savedPrn) {
        const sClean = savedPrn.trim().toUpperCase();
        if (sClean === clean || sClean.replace(/^0+/, '') === clean.replace(/^0+/, '')) {
          setDetectedAccount({
            studentName: savedName || 'Student',
            prn: clean,
            exists: true,
          });
        }
      }
    }

    const timer = setTimeout(async () => {
      setIsResolvingPrn(true);
      try {
        const res = await fetch(`/api/auth/resolve-student?prn=${encodeURIComponent(clean)}`);
        const json = await res.json();
        if (json.success && json.exists && json.data) {
          setDetectedAccount({
            studentName: json.data.studentName,
            prn: json.data.prn,
            exists: true,
          });
          // Account confirmed: ensure user is in SIGN_IN mode to log in easily
          setStudentMode('SIGN_IN');
        } else if (json.success && !json.exists) {
          setDetectedAccount({
            studentName: '',
            prn: clean,
            exists: false,
          });
          // Never force switch to SIGN_UP! Respect student's manual tab choice
        }
      } catch {} finally {
        setIsResolvingPrn(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [studentPrn]);

  // Staff / Admin auth states (Sign in only)
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotTarget, setForgotTarget] = useState<'student' | 'staff'>('student');
  const [forgotPrn, setForgotPrn] = useState('');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [copiedPasskey, setCopiedPasskey] = useState(false);

  const openForgotModal = (target: 'student' | 'staff') => {
    setForgotTarget(target);
    setForgotPrn(studentPrn || '');
    setForgotIdentifier('');
    setForgotNewPass('');
    setForgotConfirmPass('');
    setForgotError(null);
    setForgotSuccess(null);
    setCopiedPasskey(false);
    setIsForgotModalOpen(true);
  };

  const handleCopyPasskey = () => {
    navigator.clipboard.writeText('foodline2026');
    setCopiedPasskey(true);
    setTimeout(() => setCopiedPasskey(false), 2000);
  };

  const handleAutofillStaffPasskey = () => {
    if (!staffEmail.trim()) {
      setStaffEmail('foodlinecampus07@gmail.com');
    }
    setStaffPassword('foodline2026');
    setIsForgotModalOpen(false);
    setSuccessMessage('Staff passkey "foodline2026" applied! Click "Sign In to Admin & Kitchen" below.');
    setErrorMessage(null);
  };

  const handleStudentPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPrn.trim()) {
      setForgotError('Please enter your Student PRN.');
      return;
    }
    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your registered College Email or Phone.');
      return;
    }
    if (!forgotNewPass || forgotNewPass.length < 4) {
      setForgotError('New password must be at least 4 characters.');
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsForgotSubmitting(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'student',
          prn: forgotPrn.trim(),
          identifier: forgotIdentifier.trim(),
          newPassword: forgotNewPass,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setForgotError(data.error || 'Password reset failed.');
        setIsForgotSubmitting(false);
        return;
      }

      setForgotSuccess('Password reset successfully! Redirecting to campus menu...');
      fireConfettiSuccess();
      setStudentPrn(forgotPrn.trim().toUpperCase());
      setStudentPassword(forgotNewPass);

      setTimeout(() => {
        setIsForgotModalOpen(false);
        window.location.href = redirectPath;
      }, 1200);
    } catch (err: any) {
      setForgotError(err.message || 'An unexpected error occurred during password reset.');
      setIsForgotSubmitting(false);
    }
  };

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
        setErrorMessage(error.message || 'Invalid staff email or password.');
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
    <PageTransition className="min-h-screen bg-(--bg-canvas) text-(--text-primary) flex flex-col justify-between px-4 py-8 relative overflow-hidden transition-colors duration-500">
      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between z-10 mb-6">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 6 }}
            className="w-10 h-10 rounded-xl bg-linear-to-tr from-accent-orange to-accent-amber flex items-center justify-center font-black text-white text-lg shadow-lg shadow-accent-orange/20"
          >
            🍽
          </motion.div>
          <span className="font-extrabold text-xl bg-linear-to-r from-accent-orange via-accent-amber to-(--text-primary) bg-clip-text text-transparent">
            FoodLine
          </span>
        </Link>
        <div className="text-[10px] font-black uppercase tracking-wider bg-black/5 dark:bg-white/5 border border-(--border-glass) px-3 py-1.5 rounded-full text-[#00D4AA] flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          Sanjivani University (Cafe @7)
        </div>
      </header>

      {/* Login Card Container */}
      <main className="max-w-md mx-auto w-full z-10 flex-1 flex flex-col justify-center">
        <SpotlightCard
          spotlightColor="rgba(255, 107, 44, 0.28)"
          className="p-6 sm:p-8 rounded-[2.5rem] border-2 border-(--border-glass) shadow-2xl bg-(--bg-card) backdrop-blur-2xl"
        >
          {user ? (
            /* Active Student Account Detected Panel */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-tr from-accent-orange to-accent-amber flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-accent-orange/30">
                🎓
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                  <CheckCircle2 size={13} /> Active Account Detected
                </span>
                <h1 className="text-2xl font-black text-(--text-primary)">
                  Welcome back, {profile?.full_name || user.user_metadata?.full_name || 'Campus Student'}!
                </h1>
                <p className="text-xs text-(--text-secondary) font-mono mt-1">
                  PRN: {profile?.prn || user.user_metadata?.prn} • Role: {profile?.role || 'student'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-xs text-(--text-secondary) space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Student Name:</span>
                  <span className="font-bold text-(--text-primary)">{profile?.full_name || user.user_metadata?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campus PRN:</span>
                  <span className="font-mono font-bold text-accent-teal">{profile?.prn || user.user_metadata?.prn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Outlet Station:</span>
                  <span className="font-bold text-accent-orange">Cafe @7 (Sanjivani)</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    fireConfettiSuccess();
                    window.location.href = redirectPath;
                  }}
                  className="w-full py-3.5 rounded-xl bg-linear-to-r from-accent-orange via-accent-amber to-accent-amber text-black font-black text-sm shadow-xl shadow-accent-orange/25 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⚡ Continue to Menu & Canteen</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    setDetectedAccount(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-xs font-bold text-(--text-secondary) hover:text-red-500 transition cursor-pointer"
                >
                  Switch Account / Sign In with Another PRN
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Card Header Icon */}
              <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
              className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-black/5 to-black/10 dark:from-[#16161E] dark:to-[#20202E] border border-(--border-glass) flex items-center justify-center mb-3 shadow-sm text-(--text-primary)"
            >
              {authTab === 'STAFF_ADMIN' ? (
                <Shield size={28} className="text-purple-500 dark:text-purple-400" />
              ) : (
                <GraduationCap size={28} className="text-accent-amber" />
              )}
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight text-(--text-primary) mb-1">
              {authTab === 'STAFF_ADMIN' ? 'Staff & Admin Portal' : 'Campus Student Portal'}
            </h1>
            <p className="text-xs text-(--text-secondary)">
              {authTab === 'STAFF_ADMIN'
                ? 'Sign in to access KDS, live inventory, and manager dashboard'
                : 'Sign in or create account with your PRN & Password'}
            </p>
          </div>

          {/* 3-Tab Selector */}
          <div className="p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-(--border-glass) grid grid-cols-3 gap-1 mb-6 text-xs font-bold">
            <button
              onClick={() => { setAuthTab('STUDENT_PRN'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                authTab === 'STUDENT_PRN'
                  ? 'bg-linear-to-r from-accent-orange to-accent-amber text-white shadow-lg shadow-accent-orange/30 font-black'
                  : 'text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              <GraduationCap size={13} />
              <span>Student PRN</span>
            </button>

            <button
              onClick={() => { setAuthTab('STAFF_ADMIN'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                authTab === 'STAFF_ADMIN'
                  ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-black'
                  : 'text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              <Shield size={13} />
              <span>Admin / Staff</span>
            </button>

            <button
              onClick={() => { setAuthTab('GOOGLE_SSO'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                authTab === 'GOOGLE_SSO'
                  ? 'bg-linear-to-r from-accent-orange to-accent-amber text-white shadow-lg shadow-accent-orange/30 font-black'
                  : 'text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              <span>Google</span>
            </button>
          </div>

          {/* Error & Success Banners */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs font-medium flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
              <span className="shrink-0">🎉</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: Student PRN + Password (Sign In & Sign Up) */}
          {authTab === 'STUDENT_PRN' && (
            <form onSubmit={handleStudentAuth} className="space-y-4">
              {/* Sign In vs Create Account Sub-Toggle */}
              <div className="p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) flex items-center mb-2">
                <button
                  type="button"
                  onClick={() => { setStudentMode('SIGN_IN'); setErrorMessage(null); setSuccessMessage(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    studentMode === 'SIGN_IN'
                      ? 'bg-(--accent-orange) text-white shadow-md font-black'
                      : 'text-(--text-secondary) hover:text-(--text-primary)'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setStudentMode('SIGN_UP'); setErrorMessage(null); setSuccessMessage(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    studentMode === 'SIGN_UP'
                      ? 'bg-(--accent-orange) text-white shadow-md font-black'
                      : 'text-(--text-secondary) hover:text-(--text-primary)'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Full Name for Student Registration */}
              {studentMode === 'SIGN_UP' && (
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1.5">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                    <input
                      type="text"
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      required
                      placeholder="e.g. Shivam Nirmal"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-(--text-primary) placeholder-(--text-muted) text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Student PRN / Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1.5">
                  Student PRN / Roll Number
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                  <input
                    type="text"
                    value={studentPrn}
                    onChange={(e) => setStudentPrn(e.target.value)}
                    required
                    placeholder="e.g. 1031 or 2102001042"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-(--text-primary) placeholder-(--text-muted) text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all font-mono"
                  />
                </div>
                {/* Real-Time PRN Auto-Detection Feedback */}
                {isResolvingPrn && (
                  <div className="mt-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 flex items-center gap-2 text-xs text-(--text-secondary)">
                    <Loader2 size={13} className="animate-spin text-accent-orange" />
                    <span>Verifying PRN on Campus Master...</span>
                  </div>
                )}
                {!isResolvingPrn && detectedAccount?.exists && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>Welcome back, <strong>{detectedAccount.studentName}</strong>! Account detected.</span>
                    </span>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                      Registered
                    </span>
                  </motion.div>
                )}
                {!isResolvingPrn && detectedAccount && !detectedAccount.exists && studentPrn.trim().length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500 shrink-0" />
                      <span>
                        {studentMode === 'SIGN_IN'
                          ? 'PRN not found on master yet.'
                          : 'New Student PRN! Fill name & password below.'}
                      </span>
                    </span>
                    {studentMode === 'SIGN_IN' ? (
                      <button
                        type="button"
                        onClick={() => { setStudentMode('SIGN_UP'); setErrorMessage(null); }}
                        className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-300 transition cursor-pointer"
                      >
                        Create Account →
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                        New Student
                      </span>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Student Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-(--text-primary)">
                    Password {studentMode === 'SIGN_UP' && '(Min. 4 Characters)'}
                  </label>
                  {studentMode === 'SIGN_IN' && (
                    <button
                      type="button"
                      onClick={() => openForgotModal('student')}
                      className="text-[11px] font-semibold text-accent-orange hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                  <input
                    type={showStudentPassword ? "text" : "password"}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-(--text-primary) placeholder-(--text-muted) text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer p-1"
                    aria-label={showStudentPassword ? "Hide password" : "Show password"}
                  >
                    {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent-orange/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
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
                  className="text-xs text-(--text-secondary) hover:text-(--accent-orange) transition cursor-pointer block w-full"
                >
                  {studentMode === 'SIGN_IN' ? (
                    <span>New student at campus? <strong className="text-(--accent-orange) underline">Create Account</strong></span>
                  ) : (
                    <span>Already have a password? <strong className="text-(--accent-orange) underline">Sign In</strong></span>
                  )}
                </button>

                <div className="pt-2 border-t border-(--border-glass)">
                  <Link
                    href="/select-campus"
                    className="text-xs text-(--text-secondary) hover:text-(--text-primary) transition inline-flex items-center gap-1.5"
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
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-600 dark:text-purple-300 flex items-start gap-2">
                <Shield size={14} className="shrink-0 mt-0.5 text-purple-500 dark:text-purple-400" />
                <span>Restricted to Authorized Canteen Managers & Kitchen Staff (Assigned via Supabase).</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1.5">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                  <input
                    type="email"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    required
                    placeholder="foodlinecampus07@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-(--text-primary) placeholder-(--text-muted) text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-(--text-primary)">
                    Staff Password
                  </label>
                  <button
                    type="button"
                    onClick={() => openForgotModal('staff')}
                    className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                  <input
                    type={showStaffPassword ? "text" : "password"}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-(--text-primary) placeholder-(--text-muted) text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer p-1"
                    aria-label={showStaffPassword ? "Hide password" : "Show password"}
                  >
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
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
                className="w-full py-3.5 px-4 rounded-2xl bg-black/5 dark:bg-white border border-(--border-glass) text-(--text-primary) dark:text-black font-bold text-xs flex items-center justify-center gap-3 shadow-sm hover:bg-black/10 dark:hover:bg-neutral-100 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-current" />
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

              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) flex items-start gap-2.5 text-xs text-(--text-secondary)">
                <CheckCircle2 size={16} className="text-[#00D4AA] shrink-0 mt-0.5" />
                <span>Instant 1-tap sign in for students & faculty with university emails.</span>
              </div>
            </div>
          )}

          {/* Footer Security Note */}
          <div className="mt-6 pt-4 border-t border-(--border-glass) text-center">
            <span className="text-[11px] text-(--text-muted) flex items-center justify-center gap-1.5">
              <Lock size={12} className="text-[#00D4AA]" />
              Secured by Sanjivani University Identity Guard
            </span>
          </div>
            </>
          )}
        </SpotlightCard>
      </main>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md rounded-2xl bg-[#12121A] border border-(--border-glass) shadow-2xl p-6 overflow-hidden text-(--text-primary)"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Target Switcher inside modal */}
            <div className="flex items-center gap-2 mb-5">
              <button
                type="button"
                onClick={() => { setForgotTarget('student'); setForgotError(null); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  forgotTarget === 'student'
                    ? 'bg-linear-to-r from-accent-orange to-accent-amber text-white shadow-md'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                <GraduationCap size={14} />
                <span>Student PRN</span>
              </button>
              <button
                type="button"
                onClick={() => { setForgotTarget('staff'); setForgotError(null); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  forgotTarget === 'staff'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                <Shield size={14} />
                <span>Admin / Staff</span>
              </button>
            </div>

            {/* MODAL VIEW 1: STAFF & ADMIN PASSKEY */}
            {forgotTarget === 'staff' ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Shield className="text-purple-400" size={20} />
                    <span>Staff & Admin Password</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Default authorized passkey for Canteen Managers and Kitchen Terminals at Cafe @7.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
                    <span>Authorized Master Passkey:</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      Standard Default
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-purple-500/20">
                    <span className="font-mono text-base font-black tracking-wider text-purple-200">
                      foodline2026
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPasskey}
                      className="px-2.5 py-1 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedPasskey ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedPasskey ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-neutral-400 space-y-1 pt-1">
                    <div>• <strong>Primary Staff Account:</strong> foodlinecampus07@gmail.com</div>
                    <div>• <strong>Campus Outlets:</strong> admin@sanjivani.edu.in, kitchen@sanjivani.edu.in</div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAutofillStaffPasskey}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
                  >
                    <KeyRound size={15} />
                    <span>Autofill & Prepare Staff Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* MODAL VIEW 2: STUDENT PRN PASSWORD RESET */
              <form onSubmit={handleStudentPasswordReset} className="space-y-3.5">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <GraduationCap className="text-accent-orange" size={20} />
                    <span>Reset Student Password</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Verify your PRN and registered contact info to update your password.
                  </p>
                </div>

                {forgotError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{forgotError}</span>
                  </div>
                )}

                {forgotSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <span>🎉</span>
                    <span>{forgotSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Student PRN / Roll Number
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                    <input
                      type="text"
                      value={forgotPrn}
                      onChange={(e) => setForgotPrn(e.target.value)}
                      required
                      placeholder="e.g. 1031 or 2102001042"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:ring-2 focus:ring-accent-orange transition font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Registered College Email or Mobile
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      required
                      placeholder="e.g. student@sanjivani.edu.in or 9876543210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:ring-2 focus:ring-accent-orange transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    New Password (Min. 4 Characters)
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                    <input
                      type={showForgotPass ? "text" : "password"}
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:ring-2 focus:ring-accent-orange transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotPass(!showForgotPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      {showForgotPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                    <input
                      type={showForgotPass ? "text" : "password"}
                      value={forgotConfirmPass}
                      onChange={(e) => setForgotConfirmPass(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:ring-2 focus:ring-accent-orange transition"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isForgotSubmitting}
                    className="w-full py-2.5 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent-orange/30 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
                  >
                    {isForgotSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password & Sign In</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-[10px] text-(--text-muted) z-10 mt-6">
        FoodLine Campus Ecosystem • Pilot Outlet: Sanjivani University Cafe @7
      </footer>
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-(--bg-canvas) flex items-center justify-center text-(--text-primary)"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
