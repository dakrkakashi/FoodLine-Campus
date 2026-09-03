'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Order } from '../lib/types';
import { formatINR } from '../lib/utils';

interface QrPassCardProps {
  order: Order;
}

export function QrPassCard({ order }: QrPassCardProps) {
  const qrData = JSON.stringify({
    token: order.orderToken,
    otp: order.pickupOtp,
    status: order.status,
    total: order.totalAmount
  });

  return (
    <div className="bg-gradient-to-b from-[#181826] to-[#0E0E16] border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center max-w-sm mx-auto backdrop-blur-2xl">
      {/* Glow effect */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FF6B2C]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#00D4AA]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] text-black font-black text-xs flex items-center justify-center shadow-md shadow-[#FF6B2C]/30">
            ⚡
          </div>
          <span className="font-black text-sm text-white tracking-tight">FoodLine Express Pass</span>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-ping" />
          30s Express
        </span>
      </div>

      {/* Large Token & OTP Badge */}
      <div className="mb-4 relative z-10">
        <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Order Token</div>
        <div className="text-4xl font-black font-mono tracking-widest bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-white bg-clip-text text-transparent">
          {order.orderToken}
        </div>
      </div>

      {/* Optical QR Scanner Pass Container */}
      <div className="relative z-10 inline-block p-4 rounded-2xl bg-white shadow-2xl shadow-black/60 mb-5 border-4 border-white/80">
        <QRCodeSVG value={qrData} size={160} level="H" />
        <div className="text-[9px] text-zinc-800 font-mono font-bold mt-1 text-center tracking-wider">
          SCAN AT EXPRESS LANE
        </div>
      </div>

      {/* Pickup OTP */}
      <div className="bg-[#14141E] border border-[#00D4AA]/40 rounded-2xl p-3.5 mb-5 shadow-lg shadow-[#00D4AA]/10 relative z-10">
        <div className="text-[11px] text-zinc-400 font-extrabold uppercase tracking-wider mb-1">
          Counter Verification OTP
        </div>
        <div className="text-3xl font-black font-mono tracking-widest text-[#00D4AA] drop-shadow-[0_0_16px_rgba(0,212,170,0.5)]">
          {order.pickupOtp}
        </div>
      </div>

      {/* Slot & Items Summary */}
      <div className="text-left text-xs text-zinc-300 border-t border-white/10 pt-4 space-y-2 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 font-medium">Pickup Slot</span>
          <span className="font-extrabold text-white bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
            {order.slot?.label || 'Current Break Window'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 font-medium">Total Paid</span>
          <span className="font-black text-[#00D4AA] text-sm">{formatINR(order.totalAmount || order.total_amount || 0)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 font-medium">Items</span>
          <span className="font-bold text-white truncate max-w-[180px]">
            {(order.items || []).map((i) => `${i.quantity}x ${i.name}`).join(', ') || (order.order_items || []).map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}
