import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PaymentVerificationForm } from '@/components/payment/PaymentVerificationForm';

export const metadata: Metadata = {
  title: 'Direct UPI Payment | FoodLine Campus',
  description: 'Pay direct to Cafe @7 via UPI with zero gateway fee.',
};

export default function PaymentPage() {
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

        <PaymentVerificationForm />
      </div>
    </div>
  );
}
