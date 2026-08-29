'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatINR } from '../lib/utils';

interface UpiQrModalProps {
  amount: number;
  upiId?: string;
  orderToken?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UpiQrModal({
  amount,
  upiId = 'sanjivanicafe7@okaxis',
  orderToken = 'FL-XXXX',
  isOpen,
  onClose
}: UpiQrModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // UPI deep link standard: upi://pay?pa=...&pn=Cafe%207&am=...&cu=INR&tn=...
  const upiPayload = `upi://pay?pa=${upiId}&pn=Cafe%207%20Sanjivani&am=${amount}&cu=INR&tn=FoodLine%20${orderToken}`;

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#16161E] border border-white/15 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm"
        >
          ✕
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
            🛡️ 0% Surcharge Direct UPI
          </div>
          <h3 className="text-xl font-extrabold text-white">Scan Standee QR</h3>
          <p className="text-xs text-zinc-400">Cafe @7 Sanjivani University</p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner mx-auto mb-4 w-48 h-48">
          <QRCodeSVG value={upiPayload} size={160} level="M" />
        </div>

        {/* Amount */}
        <div className="text-center mb-4">
          <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Payable Total</div>
          <div className="text-3xl font-black text-white">{formatINR(amount)}</div>
        </div>

        {/* Copy UPI ID */}
        <div className="flex items-center justify-between bg-[#1C1C28] border border-white/10 rounded-xl px-3 py-2 text-xs mb-4">
          <span className="font-mono text-zinc-300 truncate max-w-[200px]">{upiId}</span>
          <button
            onClick={copyUpi}
            className="text-[#FF6B2C] hover:text-[#FFB347] font-bold text-xs shrink-0 cursor-pointer"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-black text-sm shadow-lg shadow-[#FF6B2C]/20 transition active:scale-98 cursor-pointer"
        >
          I have made the payment →
        </button>
      </div>
    </div>
  );
}
