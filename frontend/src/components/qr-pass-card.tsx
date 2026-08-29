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
    <div className="bg-[#16161E] border border-white/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center max-w-sm mx-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FF6B2C] text-black font-black text-xs flex items-center justify-center">
            ⚡
          </div>
          <span className="font-extrabold text-sm text-white">FoodLine Pass</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 uppercase">
          30s Express Grab
        </span>
      </div>

      {/* Large Token & OTP Badge */}
      <div className="mb-4">
        <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Order Token</div>
        <div className="text-4xl font-black font-mono tracking-widest text-[#FF6B2C]">
          {order.orderToken}
        </div>
      </div>

      {/* Optical QR Scanner Pass */}
      <div className="bg-white p-3 rounded-2xl inline-block shadow-lg mb-4">
        <QRCodeSVG value={qrData} size={150} level="M" />
      </div>

      {/* Pickup OTP */}
      <div className="bg-[#1C1C28] border border-white/10 rounded-2xl p-3 mb-4">
        <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">
          Counter Verification OTP
        </div>
        <div className="text-3xl font-black font-mono tracking-widest text-[#00D4AA] drop-shadow-[0_0_12px_rgba(0,212,170,0.4)]">
          {order.pickupOtp}
        </div>
      </div>

      {/* Slot & Items Summary */}
      <div className="text-left text-xs text-zinc-300 border-t border-white/10 pt-3 space-y-1.5">
        <div className="flex justify-between">
          <span className="text-zinc-400">Pickup Slot:</span>
          <span className="font-bold text-white">{order.slot?.label || 'Current Window'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Total Paid:</span>
          <span className="font-bold text-emerald-400">{formatINR(order.totalAmount || order.total_amount || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Items:</span>
          <span className="font-medium text-white truncate max-w-[180px]">
            {(order.items || []).map((i) => `${i.quantity}x ${i.name}`).join(', ') || (order.order_items || []).map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}
