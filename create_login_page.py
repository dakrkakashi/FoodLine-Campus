import os

APP_DIR = r"C:\Users\Shivam Manoj Nirmal\Desktop\FoodLine App"

LOGIN_PAGE_TSX = """
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    // Simulating Google OAuth with @sanjivani.edu.in domain
    setTimeout(() => {
      setIsLoading(false);
      router.push('/menu');
    }, 1200);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prn || !phone) {
      alert('Please enter both your Student PRN and registered phone number.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      alert('Please enter a 4-digit OTP.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/menu');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col justify-between px-4 py-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#FF6B2C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#00D4AA]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between z-10 mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] flex items-center justify-center font-black text-black text-sm">
            ⚡
          </div>
          <span className="font-extrabold text-lg text-white">FoodLine</span>
        </Link>
        <div className="text-[11px] font-semibold bg-[#16161E] border border-white/10 px-3 py-1 rounded-full text-[#00D4AA]">
          🏫 Sanjivani University
        </div>
      </header>

      {/* Login Card Container */}
      <main className="max-w-md mx-auto w-full z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#16161E] border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#20202C] border border-white/10 flex items-center justify-center text-2xl mb-3 shadow-inner">
              🎓
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Student Campus Login</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Sign in with your verified Sanjivani University credentials to unlock classroom pre-ordering.
            </p>
          </div>

          {/* Auth Method Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#20202C] border border-white/5 mb-6">
            <button
              type="button"
              onClick={() => { setAuthMethod('GOOGLE_SSO'); setStep('INPUT'); }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                authMethod === 'GOOGLE_SSO'
                  ? 'bg-[#FF6B2C] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Google SSO
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('PRN_LOGIN')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                authMethod === 'PRN_LOGIN'
                  ? 'bg-[#FF6B2C] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Student PRN
            </button>
          </div>

          {/* Method 1: Google SSO (@sanjivani.edu.in) */}
          {authMethod === 'GOOGLE_SSO' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSSO}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                {isLoading ? 'Verifying Sanjivani OAuth...' : 'Continue with @sanjivani.edu.in'}
              </button>

              <div className="p-3 rounded-xl bg-[#20202C] border border-white/5 text-[11px] text-zinc-400 text-center leading-relaxed">
                🔒 Requires active college email. Verifies your roll number and department automatically.
              </div>
            </div>
          )}

          {/* Method 2: PRN / Roll Number + OTP */}
          {authMethod === 'PRN_LOGIN' && (
            <div>
              {step === 'INPUT' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Student PRN / Roll Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2023SUCS0142"
                      value={prn}
                      onChange={(e) => setPrn(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl bg-[#20202C] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Registered Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#20202C] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] text-sm font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-extrabold text-sm shadow-lg shadow-[#FF6B2C]/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'Checking PRN Registry...' : 'Send 4-Digit OTP →'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center">
                    <div className="text-xs text-zinc-400 mb-1">OTP sent to +91 {phone} (PRN: {prn})</div>
                    <button
                      type="button"
                      onClick={() => setStep('INPUT')}
                      className="text-[11px] text-[#00D4AA] hover:underline"
                    >
                      Change PRN / Phone
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5 text-center">
                      Enter 4-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="• • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#20202C] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D4AA] text-center text-xl font-mono tracking-widest"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-black font-extrabold text-sm shadow-lg shadow-[#00D4AA]/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'Verifying Session...' : 'Verify & Enter FoodLine ✨'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Persistent Session Notice */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center text-[11px] text-zinc-500">
            🍪 Stay logged in for the whole semester on this device.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-zinc-500 z-10 mt-6">
        Protected by Sanjivani University Identity Guard • FoodLine 2026
      </footer>
    </div>
  );
}
"""

def main():
    target_path = os.path.join(APP_DIR, "src", "app", "login", "page.tsx")
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(LOGIN_PAGE_TSX.strip() + "\n")
    print(f"Created: {target_path}")

if __name__ == "__main__":
    main()
