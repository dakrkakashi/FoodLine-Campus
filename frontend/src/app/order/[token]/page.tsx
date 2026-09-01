'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ChefHat,
  CheckCircle2,
  Utensils,
  Receipt,
  CheckCircle,
  PackageCheck,
  AlertCircle,
  Sparkles,
  Timer,
  QrCode,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition, SpotlightCard, fireFireworks } from '@/components/ui';
import { BorderBeam } from '@/components/magicui';
import { createClient } from '@/utils/supabase/client';

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  subtotal: number;
}

interface OrderData {
  id: string;
  order_token: string;
  status: string;
  total_amount: number;
  pickup_otp: string;
  utr_number: string;
  notes: string;
  pickup_slots?: {
    label: string;
    start_time: string;
    end_time: string;
  };
  order_items?: OrderItem[];
}

const steps = [
  { key: 'PENDING_PAYMENT', label: 'Payment Verifying', desc: 'Syncing 12-digit UTR with bank network...', icon: <AlertCircle size={18} /> },
  { key: 'CONFIRMED', label: 'Order Sent to Kitchen', desc: 'Chef received your ticket at Cafe @7.', icon: <Receipt size={18} /> },
  { key: 'PREPARING', label: 'Chef is Cooking', desc: 'Hot & fresh on the kitchen pan.', icon: <ChefHat size={18} /> },
  { key: 'READY', label: 'Ready for Pickup', desc: 'Head to the Cafe @7 express counter now!', icon: <PackageCheck size={18} /> },
  { key: 'COLLECTED', label: 'Collected', desc: 'Enjoy your meal at Sanjivani University!', icon: <CheckCircle2 size={18} /> },
];

export default function OrderTrackingPage(props: { params: Promise<{ token: string }> }) {
  const params = use(props.params);
  const token = params.token;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'live' | 'disconnected'>('connecting');

  useEffect(() => {
    const supabase = createClient();

    async function loadOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items (*), pickup_slots (*)')
          .eq('order_token', token)
          .single();

        if (data) {
          setOrder(data);
          setConnectionStatus('live');
        }
      } catch (err) {
        console.error('Failed to load initial order data:', err);
      }
    }

    loadOrder();

    // Supabase Realtime Channel
    const channel = supabase
      .channel(`order-live-channel-${token}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `order_token=eq.${token}`,
        },
        (payload: any) => {
          if (payload.new) {
            setOrder((prev) => ({
              ...(prev || {}),
              ...payload.new,
              order_items: prev?.order_items || [],
              pickup_slots: prev?.pickup_slots,
            }));
            if (payload.new.status === 'READY') {
              fireFireworks();
              try {
                new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play();
              } catch (e) {}
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnectionStatus('live');
      });

    // Also connect to SSE stream
    const sse = new EventSource(`/api/order/${token}/stream`);
    sse.onopen = () => setConnectionStatus('live');
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const incoming = data.payload || data.order;
        if (incoming) {
          setOrder((prev) => ({
            ...(prev || {}),
            ...incoming,
            order_items: incoming.order_items || prev?.order_items || [],
            pickup_slots: incoming.pickup_slots || prev?.pickup_slots,
          }));
          if (incoming.status === 'READY') {
            fireFireworks();
            try {
              new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play();
            } catch (e) {}
          }
        }
      } catch (e) {}
    };

    return () => {
      supabase.removeChannel(channel);
      sse.close();
    };
  }, [token]);

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 0;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'READY': return 3;
      case 'COLLECTED': return 4;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order?.status);
  const isReady = order?.status === 'READY';
  const isCollected = order?.status === 'COLLECTED';

  const qrPassUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=1&data=${encodeURIComponent(
    `FOODLINE-PASS:${token}:OTP-${order?.pickup_otp || '0000'}`
  )}`;

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-[#F5F5F7] pb-24 relative overflow-hidden">
      {/* Dynamic Aurora Mesh */}
      <div className="aurora-mesh">
        <div
          className={`aurora-blob w-[36rem] h-[36rem] -top-20 -left-20 transition-colors duration-1000 ${
            isReady ? 'bg-[#00D4AA]' : 'bg-[#FF6B2C]'
          }`}
          style={{ animationDuration: '18s' }}
        />
        <div
          className="aurora-blob w-[38rem] h-[38rem] top-1/2 -right-32 bg-[#8B5CF6]"
          style={{ animationDuration: '22s', animationDelay: '-6s' }}
        />
      </div>

      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-6 relative z-10">
        {/* Navigation & Live Sync Pill */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Link
              href="/menu"
              className="text-xs font-bold text-zinc-400 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Menu</span>
            </Link>
            <Link
              href="/orders"
              className="text-xs font-bold text-[var(--accent-orange)] hover:text-white px-3.5 py-2 rounded-xl bg-[var(--accent-orange)]/10 hover:bg-[var(--accent-orange)]/20 border border-[var(--accent-orange)]/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Receipt size={14} />
              <span>My Orders</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === 'live' ? 'bg-[#00D4AA] animate-pulse shadow-[0_0_10px_#00D4AA]' : 'bg-amber-400'
              }`}
            />
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
              {connectionStatus === 'live' ? 'Kitchen Live Sync' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Digital Pickup Pass Card */}
        <SpotlightCard
          spotlightColor={isReady ? 'rgba(0, 212, 170, 0.35)' : 'rgba(255, 107, 44, 0.3)'}
          className={`p-6 md:p-8 rounded-[2.5rem] border-2 shadow-2xl mb-8 transition-all duration-700 ${
            isReady
              ? 'bg-gradient-to-b from-[#00D4AA]/20 via-[#12121A] to-[#07070B] border-[#00D4AA]/70 shadow-[#00D4AA]/30'
              : isCollected
              ? 'bg-gradient-to-b from-zinc-800/40 via-[#12121A] to-[#07070B] border-zinc-700 opacity-75'
              : 'bg-gradient-to-b from-[#FF6B2C]/15 via-[#12121A] to-[#07070B] border-[#FF6B2C]/40 shadow-black/90'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div
                className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                  isReady ? 'text-[#00D4AA]' : 'text-[#FFB347]'
                }`}
              >
                {isCollected ? 'Pass Completed • Cafe @7' : 'Express Pickup Pass • Cafe @7'}
              </div>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                {token}
                {isReady && (
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-2xl"
                  >
                    🔥
                  </motion.span>
                )}
              </div>
            </div>

            <div className="relative overflow-hidden text-left sm:text-right bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-lg">
              <BorderBeam
                size={140}
                duration={8}
                colorFrom={isReady ? "#00D4AA" : "#FF6B2C"}
                colorTo={isReady ? "#3B82F6" : "#FFB347"}
                borderWidth={2}
              />
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Pickup OTP</div>
              <div
                className={`text-4xl font-black font-mono tracking-widest ${
                  isCollected ? 'text-zinc-500 line-through' : isReady ? 'text-[#00D4AA] animate-pulse' : 'text-white'
                }`}
              >
                {order?.pickup_otp || '----'}
              </div>
            </div>
          </div>

          {/* QR Code Pass */}
          <AnimatePresence>
            {!isCollected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="py-8 flex flex-col items-center justify-center text-center overflow-hidden"
              >
                <div
                  className={`relative p-3.5 bg-white rounded-3xl inline-block mb-4 transition-all duration-500 ${
                    isReady ? 'scale-105 shadow-2xl shadow-[#00D4AA]/40' : 'shadow-2xl shadow-[#FF6B2C]/20'
                  }`}
                >
                  {isReady && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -inset-2 border-4 border-[#00D4AA] rounded-[28px] pointer-events-none"
                    />
                  )}
                  <img
                    src={qrPassUrl}
                    alt={`QR Pass for ${token}`}
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-2xl relative z-10"
                  />
                </div>
                <div className="max-w-xs mx-auto">
                  {isReady ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-5 py-2.5 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/50 text-[#00D4AA] text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00D4AA]/20"
                    >
                      Food is Ready! Flash QR at Counter 🚀
                    </motion.div>
                  ) : (
                    <p className="text-xs font-bold text-zinc-400">
                      Flash this QR at the Cafe @7 Express Lane for instant 30-sec handover
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slot Info */}
          {order?.pickup_slots && (
            <div className="mt-2 bg-[#16161E]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">
                    Reserved Break Slot
                  </div>
                  <div className="text-sm font-black text-white">{order.pickup_slots.label}</div>
                </div>
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  isCollected
                    ? 'bg-zinc-800 text-zinc-400'
                    : 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
                }`}
              >
                {isCollected ? 'Completed' : 'Slot Confirmed'}
              </span>
            </div>
          )}

          {/* Cash on Counter Reminder Banner */}
          {order?.notes?.includes('COD') && !isCollected && (
            <div className="mt-3 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-base">💵</span>
                <span>Pay Cash at Counter:</span>
              </div>
              <span className="font-mono text-sm font-black text-amber-200">₹{order.total_amount?.toFixed(2)}</span>
            </div>
          )}
        </SpotlightCard>

        {/* Live Stepper Tracker */}
        <SpotlightCard className="p-6 md:p-8 rounded-[2.5rem] shadow-2xl mb-8">
          <h2 className="text-base font-black text-white mb-6 flex items-center gap-2.5">
            <Utensils size={18} className="text-[#FF6B2C]" />
            <span>Live Kitchen Status Tracker</span>
          </h2>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const isPassed = currentStep > index;
              const isCurrent = currentStep === index;

              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  {/* Vertical connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 bottom-[-20px] w-0.5 rounded-full transition-colors duration-500 ${
                        isPassed ? 'bg-[#00D4AA]' : 'bg-white/10'
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg z-10 transition-all duration-500 shadow-md ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] text-black shadow-lg shadow-[#FF6B2C]/40 ring-2 ring-[#FF6B2C] ring-offset-2 ring-offset-[#12121A]'
                        : isPassed
                        ? 'bg-[#00D4AA] text-black shadow-[#00D4AA]/20'
                        : 'bg-[#16161E] border border-white/10 text-zinc-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle size={18} strokeWidth={3} /> : step.icon}
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm md:text-base font-extrabold transition-colors duration-500 ${
                          isCurrent ? 'text-[#FFB347]' : isPassed ? 'text-white' : 'text-zinc-500'
                        }`}
                      >
                        {step.label}
                      </h3>
                      <AnimatePresence>
                        {isCurrent && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FF6B2C]/20 border border-[#FF6B2C]/40 text-[#FFB347]"
                          >
                            Active
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 font-medium">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SpotlightCard>

        {/* Legal, FSSAI & Grievance Redressal Assurance Card */}
        <div className="bg-[#12121A]/90 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black">
                🍲
              </span>
              <div>
                <div className="text-xs font-black text-white">Cafe @7 FSSAI Certified Pure Veg Kitchen</div>
                <div className="text-[10px] text-zinc-400">License #11522036000142 • Freshly cooked in 60-order break batches</div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-lg bg-white/5 text-zinc-400 border border-white/10">
              20-Min Express Hold SLA
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-400">
            <div>
              <span>Need help or wrong item? </span>
              <span className="text-zinc-300 font-bold">Ask Level 1 Counter Lead</span> or email <a href="mailto:foodlinecampus@gmail.com" className="text-[#00D4AA] font-bold hover:underline">foodlinecampus@gmail.com</a>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <Link href="/terms" className="text-zinc-400 hover:text-[var(--accent-orange)] transition">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
