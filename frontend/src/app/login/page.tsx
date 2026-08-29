'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Shield, Lock, CheckCircle2, Mail, KeyRound, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { PageTransition, SpotlightCard, fireConfettiSuccess } from '@/components/ui';
import { useAuth } from '@/lib/auth/useAuth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/menu';

  const { signInWithPassword, signInWithGoogle, signInWithPrn } = useAuth();

  const [authTab, setAuthTab] = useState<'STAFF_ADMIN' | 'GOOGLE_SSO' | 'STUDENT_PRN'>('STAFF_ADMIN');
  const [email, setEmail] = useState('foodlinecampus@gmail.com');
  const [password, setPassword] = useState('');
  const [prn, setPrn] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Staff & Admin Email/Password Login
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await signInWithPassword(email.trim(), password);
      if (error) {
        setErrorMessage(error.message || 'Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      fireConfettiSuccess();
      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  // 2. Google SSO Login
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

  // 3. PRN + OTP Login
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prn || !phone) return;
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 700);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithPrn(prn, phone);
      fireConfettiSuccess();
      setTimeout(() => {
        // If the redirect path was a staff/admin only path like /admin or /kds, redirect student to /menu
        const targetPath = redirectPath.startsWith('/admin') || redirectPath.startsWith('/kds') ? '/menu' : redirectPath;
        window.location.href = targetPath;
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
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
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] flex items-center justify-center font-black text-black text-lg shadow-lg shadow-[#FF6B2C]/20"
          >
            🍽
          </motion.div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-white bg-clip-text text-transparent">
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
                <GraduationCap size={28} className="text-[#FFB347]" />
              )}
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight text-white mb-1">
              {authTab === 'STAFF_ADMIN' ? 'Staff & Admin Portal' : 'Campus Student Login'}
            </h1>
            <p className="text-xs text-neutral-400">
              {authTab === 'STAFF_ADMIN'
                ? 'Sign in to access KDS, live inventory, and executive management'
                : 'Sign in to place express classroom pre-orders'}
            </p>
          </div>

          {/* 3-Tab Selector */}
          <div className="p-1 rounded-2xl bg-black/50 border border-white/10 grid grid-cols-3 gap-1 mb-6 text-xs font-bold">
            <button
              onClick={() => { setAuthTab('STAFF_ADMIN'); setErrorMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 ${
                authTab === 'STAFF_ADMIN'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shield size={13} />
              <span>Admin / Staff</span>
            </button>

            <button
              onClick={() => { setAuthTab('GOOGLE_SSO'); setErrorMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 ${
                authTab === 'GOOGLE_SSO'
                  ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FF8C42] text-white shadow-lg shadow-[#FF6B2C]/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Google</span>
            </button>

            <button
              onClick={() => { setAuthTab('STUDENT_PRN'); setErrorMessage(null); }}
              className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 ${
                authTab === 'STUDENT_PRN'
                  ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FF8C42] text-white shadow-lg shadow-[#FF6B2C]/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>PRN+OTP</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tab 1: Staff & Admin Email/Password */}
          {authTab === 'STAFF_ADMIN' && (
            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="foodlinecampus@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 2: Google SSO */}
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
                <span>Continue with @sanjivani.edu.in</span>
              </button>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-neutral-400">
                <CheckCircle2 size={16} className="text-[#00D4AA] shrink-0 mt-0.5" />
                <span>Automatically syncs your PRN, batch roll, and student profile.</span>
              </div>
            </div>
          )}

          {/* Tab 3: PRN + OTP */}
          {authTab === 'STUDENT_PRN' && (
            <div>
              {step === 'INPUT' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Student PRN / Roll No
                    </label>
                    <input
                      type="text"
                      value={prn}
                      onChange={(e) => setPrn(e.target.value)}
                      required
                      placeholder="e.g. 2102001042"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FF8C42] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B2C]/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>Send SMS OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Enter 4-Digit OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      placeholder="• • • •"
                      className="w-full text-center tracking-[0.5em] text-lg font-bold py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4AA] to-emerald-500 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00D4AA]/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer note */}
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
