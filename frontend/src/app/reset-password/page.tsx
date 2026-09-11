'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { PageTransition, SpotlightCard, fireConfettiSuccess } from '@/components/ui';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ email?: string; prn?: string; name?: string } | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // 1. Verify token on mount
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setTokenValid(false);
      setTokenError('No password reset token was provided in the recovery link.');
      return;
    }

    let isMounted = true;
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`, {
          cache: 'no-store',
        });
        const data = await res.json();

        if (!isMounted) return;

        if (data.valid) {
          setTokenValid(true);
          setUserInfo({
            email: data.email,
            prn: data.prn,
            name: data.name,
          });
        } else {
          setTokenValid(false);
          setTokenError(data.message || 'This password reset link is invalid or has expired.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setTokenValid(false);
        setTokenError(err.message || 'Failed to verify reset link with campus server.');
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    verifyToken();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // 2. Submit new password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 4) {
      setSubmitError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(
          data.message ||
            'Password has been updated successfully! Redirecting you to login...'
        );
        fireConfettiSuccess();

        // Save PRN locally for convenience if known
        if (userInfo?.prn && typeof window !== 'undefined') {
          localStorage.setItem('foodline_last_prn', userInfo.prn);
        }

        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setSubmitError(data.error || data.message || 'Password update failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'A network error occurred. Please try again.');
      setIsSubmitting(false);
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
            🍽️
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

      {/* Main Card */}
      <main className="max-w-md mx-auto w-full z-10 flex-1 flex flex-col justify-center">
        <SpotlightCard
          spotlightColor="rgba(255, 107, 44, 0.28)"
          className="p-6 sm:p-8 rounded-[2.5rem] border-2 border-(--border-glass) shadow-2xl bg-(--bg-card) backdrop-blur-2xl"
        >
          {/* STATE 1: Token verification in progress */}
          {isVerifying && (
            <div className="text-center py-10 space-y-4">
              <Loader2 className="w-10 h-10 mx-auto animate-spin text-accent-orange" />
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-(--text-primary)">
                  Validating Reset Link...
                </h2>
                <p className="text-xs text-(--text-secondary)">
                  Checking token validity and 15-minute expiration timestamp with campus database.
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: Token invalid or expired */}
          {!isVerifying && !tokenValid && (
            <div className="text-center py-4 space-y-5">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 shadow-md">
                <AlertTriangle size={28} />
              </div>
              <div>
                <h1 className="text-xl font-black text-(--text-primary)">
                  Invalid or Expired Link
                </h1>
                <p className="text-xs text-(--text-secondary) mt-1.5 leading-relaxed">
                  {tokenError ||
                    'This password reset link has either expired after 15 minutes, has already been used once, or is corrupted.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-xs text-(--text-secondary) space-y-1.5 text-left">
                <div className="flex items-center gap-2 text-amber-500 font-bold">
                  <Clock size={14} />
                  <span>Security Policy</span>
                </div>
                <p className="text-[11px] text-(--text-muted) leading-normal">
                  FoodLine Campus reset links are strictly single-use and automatically self-destruct after 15 minutes to protect student credentials.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/forgot-password"
                  className="w-full py-3.5 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-accent-orange/30 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request New Reset Link</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/login"
                  className="w-full py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-xs font-bold text-(--text-secondary) hover:text-(--text-primary) transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          )}

          {/* STATE 3: Token valid - Password Reset Form */}
          {!isVerifying && tokenValid && (
            <>
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-accent-orange/15 to-accent-amber/15 border border-accent-orange/30 flex items-center justify-center mb-3 shadow-md text-accent-orange"
                >
                  <KeyRound size={28} />
                </motion.div>
                <h1 className="text-2xl font-black tracking-tight text-(--text-primary) mb-1">
                  Create New Password
                </h1>
                <p className="text-xs text-(--text-secondary)">
                  Set a new secure password for your campus student account.
                </p>

                {/* Account identifier chip */}
                {userInfo && (userInfo.prn || userInfo.email) && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-(--border-glass) text-xs font-mono text-accent-teal">
                    <GraduationCap size={13} />
                    <span>{userInfo.prn || userInfo.email}</span>
                  </div>
                )}
              </div>

              {/* Error & Success Banners */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs font-medium flex items-center gap-2"
                >
                  <span className="shrink-0">⚠️</span>
                  <span>{submitError}</span>
                </motion.div>
              )}

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-base font-bold text-(--text-primary)">
                    Password Updated!
                  </h3>
                  <p className="text-xs text-(--text-secondary)">
                    {submitSuccess}
                  </p>
                  <div className="pt-2 flex justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-accent-orange" />
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-(--text-primary) mb-1.5">
                      New Password (Min. 4 Characters)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-(--text-primary) placeholder-(--text-muted) text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-(--text-primary) mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) text-(--text-primary) placeholder-(--text-muted) text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password strength / match indicator */}
                  {newPassword.length > 0 && (
                    <div className="text-[11px] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            newPassword.length >= 4 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className={newPassword.length >= 4 ? 'text-emerald-500' : 'text-amber-500'}>
                          {newPassword.length >= 4 ? 'Length check passed' : 'At least 4 characters required'}
                        </span>
                      </div>
                      {confirmPassword.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              newPassword === confirmPassword ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          <span className={newPassword === confirmPassword ? 'text-emerald-500' : 'text-red-500'}>
                            {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || newPassword.length < 4 || newPassword !== confirmPassword}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent-orange/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Footer Security Note */}
          <div className="mt-6 pt-4 border-t border-(--border-glass) text-center">
            <span className="text-[11px] text-(--text-muted) flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} className="text-[#00D4AA]" />
              Secured with SHA-256 token verification & salted scrypt hashing
            </span>
          </div>
        </SpotlightCard>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-(--text-muted) z-10 mt-6">
        FoodLine Campus • Cafe @7, Sanjivani University, Kopargaon
      </footer>
    </PageTransition>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-(--bg-canvas) flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B2C]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
