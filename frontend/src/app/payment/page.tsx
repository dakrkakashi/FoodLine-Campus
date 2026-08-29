'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PaymentPage() {
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

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 max-w-md mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/checkout" className="text-xs text-zinc-400 hover:text-white">
          ← Change Slot
        </Link>
        <span className="text-xs font-bold text-[#00D4AA]">Option C (0% Fee)</span>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Direct Merchant UPI</h1>
        <p className="text-xs text-zinc-400">Pay direct to Cafe @7 with ₹0 payment gateway commission.</p>
      </div>

      {/* QR Standee Card */}
      <div className="p-6 rounded-3xl bg-[#16161E] border border-white/10 text-center mb-6 shadow-2xl relative">
        <div className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Amount Due</div>
        <div className="text-3xl font-black text-white mb-4">₹70</div>

        {/* Dummy QR Box */}
        <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-lg mb-4">
          <div className="w-full h-full border-4 border-dashed border-zinc-900 flex flex-col items-center justify-center text-zinc-800">
            <span className="text-3xl mb-1">📱</span>
            <span className="text-[10px] font-bold">UPI QR STANDEE</span>
            <span className="text-[8px] text-zinc-500">Cafe @7 Official</span>
          </div>
        </div>

        <div className="text-xs font-mono bg-[#20202C] px-3 py-1.5 rounded-xl text-[#00D4AA] inline-block mb-2">
          UPI ID: 9960091371@slc
        </div>
        <div className="text-[11px] text-zinc-400">Pay via GPay, PhonePe, Paytm or CRED</div>
      </div>

      {/* Step 2: Enter UTR */}
      <div className="p-4 rounded-2xl bg-[#16161E] border border-white/10 mb-6">
        <label className="block text-xs font-bold text-zinc-200 mb-1">
          🔑 Enter 12-Digit Bank UTR / Ref No.
        </label>
        <p className="text-[11px] text-zinc-400 mb-3">Found on your GPay/PhonePe receipt after payment.</p>
        <input
          type="text"
          maxLength={12}
          placeholder="e.g. 423819028471"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#20202C] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D4AA] font-mono text-center tracking-widest text-base"
        />
      </div>

      {/* Verify Button or Success State */}
      {!verified ? (
        <button
          onClick={handleVerify}
          disabled={isVerifying || utr.length === 0}
          className="w-full py-4 rounded-2xl bg-[#00D4AA] hover:bg-[#00D4AA]/90 disabled:opacity-50 text-black font-extrabold text-base shadow-xl shadow-[#00D4AA]/20 transition active:scale-95"
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
    </div>
  );
}
