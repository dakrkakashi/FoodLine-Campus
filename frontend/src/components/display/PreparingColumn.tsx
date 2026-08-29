'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import { DisplayOrder } from '@/lib/types';
import { calculateRemainingPrepTime } from '@/lib/display-utils';
import { PaymentBadge } from './PaymentBadge';

interface PreparingColumnProps {
  orders: DisplayOrder[];
}

export function PreparingColumn({ orders }: PreparingColumnProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-black/30 rounded-3xl p-5 border border-amber-500/20 backdrop-blur-xl relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-amber-500/20 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-amber-300 tracking-tight">
              PREPARING
            </h2>
            <p className="text-xs text-zinc-400 font-medium">In the kitchen now</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-sm shadow-inner">
          {orders.length}
        </span>
      </div>

      {/* Order Cards List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-3xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-3">
                <ChefHat size={24} />
              </div>
              <h3 className="font-extrabold text-sm text-zinc-400">Kitchen Counter Clear</h3>
              <p className="text-xs text-zinc-600 max-w-xs mt-1">
                All pre-orders have been prepared. New orders from class will appear here automatically.
              </p>
            </motion.div>
          ) : (
            orders.map((order) => {
              const prepInfo = calculateRemainingPrepTime(order.created_at, 5);
              const itemsSummary = (order.order_items || [])
                .map((i) => `${i.quantity}x ${i.item_name || 'Item'}`)
                .join(', ');
              const isCod = (order as any).payment_mode === 'COD' || 
                (order as any).notes?.includes('COD') || 
                (order as any).notes?.includes('Cash on Delivery');

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="display-card-preparing rounded-2xl p-4 shadow-xl hover:border-amber-400/50 transition-all flex flex-col justify-between gap-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl font-black text-amber-300 font-mono tracking-tight">
                          {order.order_token}
                        </span>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                        <PaymentBadge isCod={isCod} />
                      </div>
                      <p className="text-xs md:text-sm text-zinc-300 font-medium line-clamp-2 mt-1">
                        {itemsSummary || 'Standard Chef Platter'}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black font-mono flex items-center gap-1">
                        <Clock size={12} />
                        <span>{prepInfo.formatted}</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">
                        Counter {order.counter || 1}
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
