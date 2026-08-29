'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, BellRing, PackageCheck, ShieldCheck } from 'lucide-react';
import { DisplayOrder } from '@/lib/types';
import { getCounterLabel } from '@/lib/display-utils';
import { PaymentBadge } from './PaymentBadge';

interface ReadyColumnProps {
  orders: DisplayOrder[];
}

export function ReadyColumn({ orders }: ReadyColumnProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-black/40 rounded-3xl p-5 border-2 border-[#00D4AA]/40 backdrop-blur-2xl relative overflow-hidden shadow-2xl shadow-[#00D4AA]/10">
      {/* Ambient Flare */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#00D4AA]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#00D4AA]/30 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00D4AA]/20 border border-[#00D4AA]/40 flex items-center justify-center text-[#00D4AA] shadow-lg shadow-[#00D4AA]/20">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#00D4AA] tracking-tight font-['Outfit',sans-serif] flex items-center gap-2">
              <span>READY FOR PICKUP</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D4AA]" />
              </span>
            </h2>
            <span className="text-xs text-zinc-400 font-medium">
              Please present your 4-digit OTP at counter
            </span>
          </div>
        </div>

        <span className="px-4 py-1.5 rounded-2xl bg-[#00D4AA] text-black font-black text-base font-mono shadow-lg shadow-[#00D4AA]/30">
          {orders.length} Ready
        </span>
      </div>

      {/* Hero Token Cards Grid */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-600 mb-3">
                <PackageCheck size={28} />
              </div>
              <h3 className="font-extrabold text-sm text-zinc-400">No Pickup Orders Waiting</h3>
              <p className="text-xs text-zinc-600 max-w-xs mt-1">
                Dishes currently on stove will flash here in green as soon as kitchen staff packages them.
              </p>
            </motion.div>
          ) : (
            orders.map((order) => {
              const isCod = (order as any).payment_mode === 'COD' || 
                (order as any).notes?.includes('COD') || 
                (order as any).notes?.includes('Cash on Delivery');
              const counterInfo = getCounterLabel(isCod ? 1 : (order.counter || 1));
              const itemsSummary = (order.order_items || [])
                .map((i) => `${i.quantity}x ${i.item_name || 'Item'}`)
                .join(', ');
              const isCollected = order.status === 'COLLECTED';

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ scale: 0.88, opacity: 0, y: 25 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ type: 'spring', stiffness: 320, damping: 25 }}
                  className={`display-card-ready rounded-3xl p-5 shadow-2xl relative overflow-hidden transition-all ${
                    order.isJustReady ? 'spotlight-flare' : ''
                  } ${isCollected ? 'opacity-40 grayscale border-zinc-700' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Giant Token Display */}
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-5xl md:text-7xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_25px_rgba(0,212,170,0.5)]">
                          {order.order_token}
                        </span>

                        <PaymentBadge isCod={isCod} />

                        {order.isJustReady && (
                          <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-[#FF6B2C]/30 animate-pulse">
                            <Sparkles size={12} />
                            <span>JUST READY</span>
                          </span>
                        )}

                        {isCollected && (
                          <span className="px-2.5 py-1 rounded-xl bg-zinc-800 text-zinc-400 font-black text-[11px] uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            <span>Collected</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs md:text-sm text-zinc-300 font-medium line-clamp-1 mt-1.5">
                        {itemsSummary || 'Standard Chef Platter'}
                      </p>
                    </div>

                    {/* Right: Counter Destination Badge */}
                    <div className="flex flex-col md:items-end gap-1.5 flex-shrink-0">
                      <div className="px-4 py-2 rounded-2xl bg-[#00D4AA]/20 border border-[#00D4AA]/40 text-[#00D4AA] flex flex-col md:items-end shadow-md">
                        <span className="font-black text-base md:text-lg uppercase tracking-tight">
                          {counterInfo.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          {counterInfo.subtitle}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                        <span>Show 4-digit OTP</span>
                        <span className="text-[#00D4AA] font-mono font-black">
                          {order.pickup_otp || '****'}
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
