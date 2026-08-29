'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, LogIn, Lock, CheckCircle2, ChevronRight, Mail, Phone, Hash, Sparkles } from 'lucide-react';
import { PageTransition, SpotlightCard, fireConfettiSuccess } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'GOOGLE_SSO' | 'PRN_LOGIN'>('GOOGLE_SSO');
  const [prn, setPrn] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSSO = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      fireConfettiSuccess();
      setTimeout(() => {
        router.push('/menu');
      }, 500);
    }, 1000);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prn || !phone) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      fireConfettiSuccess();
      setTimeout(() => {
        router.push('/menu');
      }, 500);
    }, 800);
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
          className="aurora-blob w-[34rem] h-[34rem] bg-[#00D4AA] -bottom-20 -right-20"
          style={{ animationDuration: '20s', animationDelay: '-8s' }}
        />
      </div>

      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between z-10 mb-8">
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
          Sanjivani University
        </div>
      </header>

      {/* Login Card Container */}
      <main className="max-w-md mx-auto w-full z-10 flex-1 flex flex-col justify-center">
        <SpotlightCard
          spotlightColor="rgba(255, 107, 44, 0.28)"
          className="p-7 sm:p-9 rounded-[2.5rem] border-2 border-[#FF6B2C]/25 shadow-2xl shadow-black/90"
        >
          {/* Card Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
              className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#16161E] to-[#20202E] border border-white/10 flex items-center justify-center mb-4 shadow-xl text-white"
            >
              <GraduationCap size={32} strokeWidth={2} className="text-[#FFB347]" />
            </motion.div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1.5">Campus Login</h1>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              Sign in with your verified Sanjivani credentials to unlock classroom pre-ordering.
            </p>
          </div>

          {/* Auth Method Switcher Tabs */}
          <div className="relative grid grid-cols-2 p-1 rounded-2xl bg-black/50 border border-white/10 mb-8 overflow-hidden z-0">
            <motion.div
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] rounded-xl -z-10 shadow-lg shadow-[#FF6B2C]/25"
              initial={false}
              animate={{ x: authMethod === 'GOOGLE_SSO' ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            <button
              type="button"
              onClick={() => { setAuthMethod('GOOGLE_SSO'); setStep('INPUT'); }}
              className={`py-2.5 text-xs font-black rounded-xl transition-colors cursor-pointer ${
                authMethod === 'GOOGLE_SSO' ? 'text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Google SSO
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('PRN_LOGIN')}
              className={`py-2.5 text-xs font-black rounded-xl transition-colors cursor-pointer ${
                authMethod === 'PRN_LOGIN' ? 'text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Student PRN
            </button>
          </div>

          {/* Forms Area */}
          <div className="relative min-h-[220px]">
            <AnimatePresence mode="wait">
              {/* Method 1: Google SSO */}
              {authMethod === 'GOOGLE_SSO' && (
                <motion.div
                  key="google"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 absolute inset-0"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleGoogleSSO}
                    disabled={isLoading}
                    className="w-full py-4 px-4 rounded-2xl bg-white text-black font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    {isLoading ? 'Verifying Sanjivani OAuth...' : 'Continue with @sanjivani.edu.in'}
                  </motion.button>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-zinc-400 font-medium leading-relaxed flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-[#00D4AA] flex-shrink-0 mt-0.5" />
                    <p>Requires active college email. Verifies your roll number and department automatically.</p>
                  </div>
                </motion.div>
              )}

              {/* Method 2: PRN / Roll Number */}
              {authMethod === 'PRN_LOGIN' && step === 'INPUT' && (
                <motion.div
                  key="prn-input"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div className="relative">
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">
                        Student PRN / Roll Number
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="e.g. 2023SUCS0142"
                          value={prn}
                          onChange={(e) => setPrn(e.target.value.toUpperCase())}
                          className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B2C] focus:ring-2 focus:ring-[#FF6B2C]/20 text-sm font-mono tracking-widest transition-all"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">
                        Registered Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B2C] focus:ring-2 focus:ring-[#FF6B2C]/20 text-sm font-mono tracking-widest transition-all"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || !prn || !phone}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B2C] via-[#FF8A3D] to-[#FFB347] text-black font-black text-sm shadow-xl shadow-[#FF6B2C]/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Checking PRN Registry...
                        </>
                      ) : (
                        <>
                          Send 4-Digit OTP <ChevronRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Method 2: OTP Verification */}
              {authMethod === 'PRN_LOGIN' && step === 'OTP' && (
                <motion.div
                  key="prn-otp"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="text-center bg-black/40 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-300 mb-1">
                        <Mail size={14} className="text-[#00D4AA]" /> OTP sent to +91 {phone}
                      </div>
                      <div className="text-[10px] text-zinc-500 mb-3">PRN: {prn}</div>
                      <button
                        type="button"
                        onClick={() => setStep('INPUT')}
                        className="text-[11px] font-black text-[#FFB347] hover:text-[#FF6B2C] uppercase tracking-wider transition cursor-pointer"
                      >
                        Change Details
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-white text-center mb-3">
                        Enter Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="• • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-4 rounded-2xl bg-black/70 border border-[#00D4AA]/40 text-[#00D4AA] placeholder-zinc-700 focus:outline-none focus:border-[#00D4AA] focus:ring-2 focus:ring-[#00D4AA]/30 text-center text-3xl font-mono tracking-[1em] transition-all"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || otp.length < 4}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00D4AA] to-emerald-400 text-black font-black text-sm shadow-xl shadow-[#00D4AA]/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Verifying Session...
                        </>
                      ) : (
                        <>
                          Verify & Enter FoodLine <LogIn size={18} />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SpotlightCard>

        {/* Persistent Session Notice */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          <Lock size={12} className="text-[#00D4AA]" />
          Stay logged in for the whole semester
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] font-bold text-zinc-600 z-10 mt-6 tracking-wide">
        Protected by Sanjivani University Identity Guard • FoodLine 2026
      </footer>
    </PageTransition>
  );
}
