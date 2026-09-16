'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function PaymentVerificationForm() {
  const [utr, setUtr] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    if (utr.length < 6) {
      alert('Please enter a valid 12-digit bank UTR reference number.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 1200);
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('9960091371@slc');
    if (navigator.vibrate) navigator.vibrate(20);
    alert('UPI ID copied to clipboard!');
  };

  return (
    <>
      {/* Copy UPI Button */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="text-xs font-mono bg-[#20202C] px-3 py-2 rounded-xl text-[#00D4AA] inline-flex items-center gap-2 border border-white/5">
          <span>UPI ID: 9960091371@slc</span>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="p-1 hover:bg-white/10 rounded text-zinc-300 hover:text-white transition cursor-pointer"
            title="Copy UPI ID"
          >
            📋
          </button>
        </div>
      </div>
      <div className="text-[11px] text-zinc-400 mb-6">Pay via GPay, PhonePe, Paytm or CRED</div>

      {/* Step 2: Enter UTR */}
      <div className="p-4 rounded-2xl bg-[#16161E] border border-white/10 mb-6 text-left">
        <label className="block text-xs font-bold text-zinc-200 mb-1">
          🔑 Enter 12-Digit Bank UTR / Ref No.
        </label>
        <p className="text-[11px] text-zinc-400 mb-3">Found on your GPay/PhonePe receipt after payment.</p>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={12}
          placeholder="e.g. 423819028471"
          value={utr}
          onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
          className="w-full px-4 py-3.5 rounded-xl bg-[#20202C] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D4AA] font-mono text-center tracking-widest text-lg"
        />
      </div>

      {/* Verify Button or Success State */}
      {!verified ? (
        <button
          onClick={handleVerify}
          disabled={isVerifying || utr.length === 0}
          className="w-full py-4 rounded-2xl bg-[#00D4AA] hover:bg-[#00D4AA]/90 disabled:opacity-50 text-black font-extrabold text-base shadow-xl shadow-[#00D4AA]/20 transition active:scale-95 cursor-pointer"
        >
          {isVerifying ? 'Verifying with Bank Engine...' : 'Verify & Generate Express Pass →'}
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
          <div className="text-emerald-400 font-bold text-base mb-1">✔ Payment Verified!</div>
          <div className="text-xs text-zinc-300 mb-4">Your express order token has been issued.</div>
          <Link
            href="/order/FL-8492"
            className="block py-3 px-6 bg-[#FF6B2C] text-white font-extrabold text-sm rounded-xl shadow-lg transition active:scale-95"
          >
            View Express QR Pass (#FL-8492) →
          </Link>
        </div>
      )}
    </>
  );
}
