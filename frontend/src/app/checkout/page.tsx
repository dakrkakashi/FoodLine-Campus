'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  Clock,
  Sparkles,
  QrCode,
  AlertTriangle,
  Receipt,
  Trash2,
  Wallet,
  Zap,
  PartyPopper,
  Calendar,
  Lock,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { Stepper, ProgressBar, PageTransition, SpotlightCard, fireConfettiSuccess, fireFireworks, Magnetic } from '@/components/ui';
import { Meteors } from '@/components/magicui/meteors';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { EmptyCartIllustration, SlotClockIllustration, CampusExpressIllustration } from '@/components/illustrations';
import { saveOrderToHistory } from '@/lib/order-history-store';
import { getCampusTimeIST, parseTimeToMinutes } from '@/lib/campus-time';

interface Slot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBooked: number;
  availableSlots: number;
  isFull: boolean;
  isPast?: boolean;
  isClosed?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, totalCount, addItem, removeItem, deleteItem, updateQuantity, clearCart } = useCart();
  const { getEffectiveAvailability, getStockQuantity } = useInventory();
  const paymentMethod = 'UPI' as const;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [daySelection, setDaySelection] = useState<'TODAY' | 'TOMORROW'>('TODAY');
  const [campusClock, setCampusClock] = useState(() => getCampusTimeIST());
  const [allTodayPassed, setAllTodayPassed] = useState(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [studentPrn, setStudentPrn] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [celebrationData, setCelebrationData] = useState<{
    orderToken: string;
    pickupOtp?: string;
    totalAmount: number;
    slotLabel?: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(3);

  // Live campus clock updater (auto-detects IST campus time every 1s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCampusClock(getCampusTimeIST());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unavailableItems = items.filter((item) => !getEffectiveAvailability(item));

  // Auto-clamp cart quantities if stock drops below current cart count
  useEffect(() => {
    for (const item of items) {
      const stock = getStockQuantity(item.id);
      if (stock !== null && stock !== undefined && item.quantity > stock) {
        updateQuantity(item.id, stock, stock);
      }
    }
  }, [items, getStockQuantity, updateQuantity]);

  // Countdown timer for post-order celebration burst redirect
  useEffect(() => {
    if (!celebrationData) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/order/${celebrationData.orderToken}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [celebrationData, router]);

  useEffect(() => {
    async function loadSlots() {
      try {
        const res = await fetch('/api/slots');
        const json = await res.json();
        if (json.success && json.data) {
          const fetchedSlots: Slot[] = json.data;
          setSlots(fetchedSlots);
          const currentClock = getCampusTimeIST();
          setCampusClock(currentClock);

          const todayPassed =
            json.meta?.allTodaySlotsPassed ??
            fetchedSlots.every((s) => {
              const startMins = parseTimeToMinutes(s.startTime);
              return currentClock.totalMinutes >= startMins;
            });
          setAllTodayPassed(todayPassed);

          // If all today's slots have passed, auto-select Tomorrow for pre-order!
          const activeDay: 'TODAY' | 'TOMORROW' = todayPassed ? 'TOMORROW' : 'TODAY';
          setDaySelection(activeDay);

          if (fetchedSlots.length > 0) {
            const firstAvailable =
              fetchedSlots.find((s: Slot) => {
                const startMins = parseTimeToMinutes(s.startTime);
                const isPast = activeDay === 'TODAY' && currentClock.totalMinutes >= startMins;
                return !s.isFull && !isPast;
              }) || fetchedSlots[0];
            setSelectedSlotId(firstAvailable.id);
          }
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      }
    }
    loadSlots();
  }, []);

  const handleDayChange = (newDay: 'TODAY' | 'TOMORROW') => {
    setDaySelection(newDay);
    const currentSlot = slots.find((s) => s.id === selectedSlotId);
    const isCurrentClosed = currentSlot
      ? (newDay === 'TODAY' && campusClock.totalMinutes >= parseTimeToMinutes(currentSlot.startTime)) || currentSlot.isFull
      : true;

    if (isCurrentClosed) {
      const openSlot = slots.find((s) => {
        const isPast = newDay === 'TODAY' && campusClock.totalMinutes >= parseTimeToMinutes(s.startTime);
        return !s.isFull && !isPast;
      });
      if (openSlot) {
        setSelectedSlotId(openSlot.id);
      }
    }
  };

  const subtotal = totalAmount;
  const platformMarginRate = 0.035; // 3.5% FoodLine Fast-Pass Convenience Fee
  const platformFee = Number((subtotal * platformMarginRate).toFixed(2));
  const finalPayable = Number((subtotal + platformFee).toFixed(2));

  const upiId = '9960091371@slc';
  const upiLink = `upi://pay?pa=${upiId}&pn=Cafe7Sanjivani&am=${finalPayable.toFixed(2)}&cu=INR&tn=FoodLineOrder`;
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=2&data=${encodeURIComponent(upiLink)}`;

  // Determine checkout step for stepper
  const getStep = () => {
    if (items.length === 0) return 0;
    if (!selectedSlotId) return 1;
    if (paymentMethod === 'UPI' && utrNumber.length < 12) return 2;
    return 3;
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your tray is empty! Please add some dishes from the menu.');
      return;
    }

    if (unavailableItems.length > 0) {
      setErrorMsg(`❌ "${unavailableItems[0].name}" is currently sold out. Please remove it from your tray.`);
      return;
    }

    if (!selectedSlotId) {
      setErrorMsg('Please select a pickup break slot.');
      return;
    }

    const selectedSlot = slots.find((s) => s.id === selectedSlotId);
    if (!selectedSlot) {
      setErrorMsg('Please select a valid pickup break slot.');
      return;
    }

    if (daySelection === 'TODAY') {
      const startMins = parseTimeToMinutes(selectedSlot.startTime);
      const isPast = campusClock.totalMinutes >= startMins;
      if (isPast) {
        setErrorMsg(`Slot "${selectedSlot.label}" has closed because its pickup time has passed. Please select an open slot or pre-order for Tomorrow.`);
        return;
      }
    }

    if (selectedSlot.isFull) {
      setErrorMsg(`Slot "${selectedSlot.label}" is fully booked (60/60). Please select another slot.`);
      return;
    }

    if (utrNumber.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit UPI Bank Reference / UTR Number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlotId,
          pickupDate: daySelection,
          isTomorrow: daySelection === 'TOMORROW',
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          paymentMethod: 'UPI',
          utrNumber,
          notes,
          studentName,
          studentPrn,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || json.error || 'Failed to place order. Please try again.');
      }

      // Persist in local order history for students
      const displaySlotLabel = daySelection === 'TOMORROW'
        ? `Tomorrow • ${selectedSlot?.label || ''}`
        : (selectedSlot?.label || '');

      saveOrderToHistory({
        orderId: json.data.orderId,
        orderToken: json.data.orderToken,
        totalAmount: json.data.totalAmount,
        pickupOtp: json.data.pickupOtp,
        status: json.data.status,
        paymentMethod,
        slotLabel: displaySlotLabel,
        slotTime: selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : '',
        notes,
        studentPrn,
        studentName,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        createdAt: json.data.createdAt || new Date().toISOString(),
      });

      // Clear local cart
      clearCart();

      // Trigger Confetti & Fireworks Celebration Burst!
      fireConfettiSuccess();
      fireFireworks();

      // Set celebration modal data
      setCelebrationData({
        orderToken: json.data.orderToken,
        pickupOtp: json.data.pickupOtp,
        totalAmount: json.data.totalAmount || finalPayable,
        slotLabel: displaySlotLabel || 'Cafe @7 Counter',
      });
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please retry.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !celebrationData) {
    return (
      <PageTransition className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-24 transition-colors duration-500">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 pt-20 text-center">
          <SpotlightCard className="p-8 sm:p-10 rounded-[2.5rem] text-center border-dashed border-[var(--border-glass)]">
            <EmptyCartIllustration size={180} className="mx-auto mb-2" />
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">Your Tray is Empty</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
              Explore 44+ freshly prepared campus dishes from Cafe @7 and reserve your express pickup slot.
            </p>
            <Link href="/menu">
              <Magnetic strength={0.25}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-sm shadow-xl shadow-accent-orange/30 cursor-pointer"
                >
                  Browse Cafe @7 Menu →
                </motion.button>
              </Magnetic>
            </Link>
          </SpotlightCard>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-40 transition-colors duration-500">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)]"
          >
            <ArrowLeft size={14} /> Back to Menu
          </Link>
        </div>

        {/* Stepper Header */}
        <div className="glass-card-heavy rounded-[2rem] p-6 mb-8 border border-[var(--border-glass)] shadow-xl">
          <Stepper steps={['Tray Review', 'Break Slot', 'UPI Scan', 'Submit UTR']} currentStep={getStep()} />
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-700 dark:text-red-300 text-xs sm:text-sm font-bold mb-6 flex items-center gap-3 shadow-sm"
            >
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Unavailable Stock Alert Banner */}
        <AnimatePresence>
          {unavailableItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-800 dark:text-red-200 text-xs sm:text-sm font-bold mb-6 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
                  <span className="font-extrabold text-red-700 dark:text-red-300">
                    ⚠️ {unavailableItems.length} dish{unavailableItems.length > 1 ? 'es are' : ' is'} currently sold out:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    for (const un of unavailableItems) {
                      deleteItem(un.id);
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 text-xs font-black transition cursor-pointer border border-red-500/30"
                >
                  Remove Sold Out Items
                </button>
              </div>
              <ul className="text-xs text-red-700/90 dark:text-red-300/90 pl-6 list-disc space-y-1 font-medium">
                {unavailableItems.map((un) => (
                  <li key={un.id}>
                    <strong>{un.name}</strong> — Out of stock for today
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Cart items + Slot selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tray Summary */}
            <SpotlightCard className="p-5 sm:p-6 md:p-7">
              <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-[var(--border-glass)]">
                <div className="flex items-center gap-2.5">
                  <Receipt size={20} className="text-accent-orange" />
                  <h2 className="text-lg font-black text-[var(--text-primary)]">Your Tray Summary</h2>
                </div>
                <span className="text-xs font-extrabold text-accent-amber bg-accent-orange/10 border border-accent-orange/25 px-3 py-1 rounded-full">
                  {totalCount} {totalCount === 1 ? 'Dish' : 'Dishes'}
                </span>
              </div>

              <div className="space-y-3.5 divide-y divide-[var(--border-glass)]">
                {items.map((item) => {
                  const stockQty = getStockQuantity(item.id);
                  const isMaxStockReached = stockQty !== null && stockQty !== undefined && item.quantity >= stockQty;

                  return (
                    <div key={item.id} className="pt-3.5 first:pt-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-extrabold text-[var(--text-primary)] truncate">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[var(--text-secondary)] font-bold">₹{item.price} each</span>
                          {stockQty !== null && stockQty !== undefined && stockQty <= 5 && (
                            <span className="text-[10px] font-extrabold text-accent-amber">
                              (Only {stockQty} in stock)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-xl p-1 shadow-inner">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-primary)] font-bold text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-black text-xs text-accent-amber">{item.quantity}</span>
                          <button
                            type="button"
                            disabled={isMaxStockReached}
                            onClick={() =>
                              !isMaxStockReached &&
                              addItem({ id: item.id, name: item.name, price: item.price, maxStock: stockQty })
                            }
                            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                              isMaxStockReached
                                ? 'bg-black/10 dark:bg-zinc-800 text-[var(--text-muted)] cursor-not-allowed opacity-40'
                                : 'bg-accent-orange hover:bg-accent-orange/90 text-black font-black cursor-pointer shadow-sm'
                            }`}
                            title={isMaxStockReached ? `Maximum available stock (${stockQty}) reached` : 'Add one more'}
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-black text-[var(--text-primary)] w-14 text-right">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>

                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="text-[var(--text-muted)] hover:text-red-500 p-1 transition cursor-pointer"
                          title="Remove dish"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-glass)] flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Total Payable (0% Fee)</span>
                <span className="text-2xl font-black text-[var(--text-primary)]">₹{totalAmount.toFixed(0)}</span>
              </div>
            </SpotlightCard>

            {/* Campus Break Slot Selection */}
            <SpotlightCard className="p-5 sm:p-6 md:p-7 relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-accent-amber/15 border border-accent-amber/30 flex items-center justify-center text-accent-amber shadow-inner flex-shrink-0">
                    <Clock size={22} strokeWidth={2.4} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[var(--text-primary)] leading-tight">Campus Break Pickup Slot</h2>
                    <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">Reserve your 15-min express collection window to avoid queue delays</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>60-Order Cap Safe</span>
                </div>
              </div>

              {/* Live Campus Clock & Real-Time Sync Bar */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[var(--border-glass)] mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-[var(--text-primary)]">
                    Campus Clock: <span className="font-mono text-accent-orange font-black">{campusClock.displayWithSeconds || campusClock.displayTime12h} IST</span>
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] font-medium hidden sm:inline-block">
                  Sanjivani Kopargaon • Auto-Time Sync
                </span>
              </div>

              {/* Day Selection Segmented Control: Today vs Tomorrow Pre-Order */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-2xl mb-4 border border-[var(--border-glass)]">
                <button
                  type="button"
                  onClick={() => handleDayChange('TODAY')}
                  className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    daySelection === 'TODAY'
                      ? 'bg-accent-orange text-black shadow-md shadow-accent-orange/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Calendar size={14} />
                  <span>Today</span>
                  {allTodayPassed && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/20 text-black font-extrabold uppercase">
                      Ended
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDayChange('TOMORROW')}
                  className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    daySelection === 'TOMORROW'
                      ? 'bg-accent-orange text-black shadow-md shadow-accent-orange/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>Tomorrow (Pre-Order)</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                    Open
                  </span>
                </button>
              </div>

              {/* Contextual notice if today is passed */}
              {daySelection === 'TODAY' && allTodayPassed && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 mb-4 text-xs text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Today's campus breaks have ended.</p>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      The cafe has closed for today's pickup windows. Switch to <strong>Tomorrow</strong> to pre-order for tomorrow morning or lunch.
                    </p>
                  </div>
                </div>
              )}

              {daySelection === 'TOMORROW' && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 mb-4 text-xs text-emerald-600 dark:text-emerald-400">
                  <Sparkles size={15} className="flex-shrink-0" />
                  <span className="font-semibold text-[11px]">
                    Pre-ordering for <strong>Tomorrow</strong>. Your food will be freshly prepared for tomorrow's break window!
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {slots.map((slot) => {
                  const startMins = parseTimeToMinutes(slot.startTime);
                  const isPast = daySelection === 'TODAY' && campusClock.totalMinutes >= startMins;
                  const isFull = slot.isFull;
                  const isClosed = isPast || isFull;
                  const isSelected = selectedSlotId === slot.id && !isClosed;

                  return (
                    <motion.button
                      whileTap={!isClosed ? { scale: 0.99 } : {}}
                      key={slot.id}
                      type="button"
                      disabled={isClosed}
                      onClick={() => {
                        if (!isClosed) setSelectedSlotId(slot.id);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? 'bg-accent-orange/15 border-accent-orange shadow-md shadow-accent-orange/15 cursor-pointer ring-1 ring-accent-orange/50'
                          : isClosed
                          ? 'bg-black/[0.02] dark:bg-white/[0.02] border-[var(--border-glass)] opacity-40 cursor-not-allowed'
                          : 'bg-black/[0.03] dark:bg-white/5 border-[var(--border-glass)] hover:border-accent-orange/40 hover:bg-black/[0.06] dark:hover:bg-white/10 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-accent-orange bg-accent-orange'
                                : isClosed
                                ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800'
                                : 'border-zinc-400 dark:border-zinc-500'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                            {isClosed && <Lock size={8} className="text-zinc-500 dark:text-zinc-400" />}
                          </div>
                          <div>
                            <span
                              className={`text-sm font-extrabold ${
                                isClosed ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-[var(--text-primary)]'
                              }`}
                            >
                              {slot.label}
                            </span>
                            {isPast && (
                              <span className="text-[10px] text-red-500 font-semibold block sm:inline-block sm:ml-2">
                                (Passed at {slot.startTime})
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                            isPast
                              ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                              : slot.isFull
                              ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                              : slot.availableSlots <= 10
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isPast ? (
                            <>
                              <Lock size={10} />
                              <span>CLOSED • TIME PASSED</span>
                            </>
                          ) : slot.isFull ? (
                            'FULL'
                          ) : (
                            `${slot.availableSlots} left`
                          )}
                        </span>
                      </div>
                      <ProgressBar
                        value={isPast ? slot.maxCapacity : slot.currentBooked}
                        max={slot.maxCapacity}
                        showPercent={false}
                        size="sm"
                      />
                    </motion.button>
                  );
                })}
              </div>
            </SpotlightCard>
          </div>

          {/* Right Column: Payment Options (100% Online UPI Payment) */}
          <div className="lg:col-span-5 space-y-6">
            <SpotlightCard spotlightColor="var(--accent-teal-glow, rgba(0, 212, 170, 0.25))" className="p-6 md:p-7">
              {/* Online Direct UPI Header Banner */}
              <div className="flex items-center justify-between gap-3 mb-6 p-3.5 rounded-2xl bg-black/5 dark:bg-black/50 border border-[var(--border-glass)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-accent-orange/15 border border-accent-orange/30 flex items-center justify-center text-accent-orange">
                    <Zap size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[var(--text-primary)] block">⚡ DirectPay UPI</span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-medium">100% Online Bank Settlement</span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-accent-teal bg-accent-teal/10 border border-accent-teal/30 px-2.5 py-1 rounded-full">
                  0% Surcharge
                </span>
              </div>

              {/* UPI Mode View */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={22} className="text-accent-teal" />
                    <h2 className="text-lg font-black text-[var(--text-primary)]">Direct UPI Payment</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-accent-teal bg-accent-teal/10 border border-accent-teal/30 px-2.5 py-1 rounded-full">
                    Instant Fast-Pass
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-6 font-medium">
                  Pay directly to Cafe @7 merchant account via any UPI App.
                </p>

                {/* QR Code Container */}
                <div className="relative bg-white p-4 rounded-3xl mx-auto w-fit shadow-2xl flex flex-col items-center border-2 border-black/10 dark:border-white/20">
                  <img src={upiQrUrl} alt="UPI QR Code" className="w-48 h-48 object-contain rounded-xl" />
                  <div className="mt-3 text-center">
                    <div className="text-[10px] font-black text-black tracking-widest uppercase">
                      Scan with PhonePe, GPay, Paytm
                    </div>
                    <div className="text-xs font-black text-accent-orange mt-0.5">
                      Pay ₹{finalPayable.toFixed(2)} to {upiId}
                    </div>
                  </div>
                </div>

                {/* Copy UPI ID Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={copyUpiId}
                  type="button"
                  className="w-full mt-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {copiedUpi ? (
                    <>
                      <Check size={14} className="text-accent-teal" />
                      <span className="text-accent-teal">UPI ID Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy UPI: {upiId}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Order Form (UTR for UPI) */}
              <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    12-Digit Bank UTR / Reference No. <span className="text-accent-orange">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    inputMode="numeric"
                    placeholder="e.g. 423891827364"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl px-5 py-4 text-sm text-[var(--text-primary)] font-mono tracking-widest placeholder-[var(--text-muted)] focus:outline-none focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all shadow-inner"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">Found in your UPI transaction receipt</span>
                    <span className={`text-[11px] font-mono font-bold ${utrNumber.length === 12 ? 'text-accent-teal' : 'text-[var(--text-muted)]'}`}>
                      {utrNumber.length}/12
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Student Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Shivam"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-accent-orange transition shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">PRN / Roll No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 23BBA042"
                      value={studentPrn}
                      onChange={(e) => setStudentPrn(e.target.value.toUpperCase())}
                      className="w-full bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] font-mono uppercase placeholder-[var(--text-muted)] focus:outline-none focus:border-accent-orange transition shadow-inner"
                    />
                  </div>
                </div>

                {/* Transparent Financial & Fee Breakdown Box */}
                <div className="bg-black/[0.03] dark:bg-white/5 border border-[var(--border-glass)] rounded-2xl p-4 my-4 space-y-2.5 shadow-inner">
                  <div className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>💳</span>
                      <span>Transparent Fee Breakdown</span>
                    </span>
                    <span className="text-[10px] font-black text-accent-teal uppercase tracking-wider bg-accent-teal/10 border border-accent-teal/30 px-2 py-0.5 rounded-full">
                      DirectPay UPI (Online)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Dish Subtotal (Actual Canteen Menu Price)</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Restaurant Menu Markup</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹0.00 (Zero Markup)</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      FoodLine Fast-Pass Convenience Fee
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-black">3.5%</span>
                    </span>
                    <span className="font-mono font-bold text-accent-amber">+₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Payment Gateway Surcharge</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      0.0% (Free Direct Bank Pay)
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-[var(--border-glass)] flex justify-between text-sm font-black text-[var(--text-primary)]">
                    <span>Total Amount Payable</span>
                    <span className="text-accent-orange font-mono text-xl font-black">₹{finalPayable.toFixed(2)}</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-medium pt-1.5 border-t border-[var(--border-glass)] flex items-start gap-1.5 leading-relaxed">
                    <span className="text-accent-teal text-xs">⚡</span>
                    <span>
                      <strong className="text-[var(--text-primary)] font-bold">100% Direct Settlement:</strong> 100% of your payment lands directly in Cafe @7 merchant bank account (<code className="text-accent-teal font-mono">{upiId}</code>) with zero food markup.
                    </span>
                  </div>

                  {/* Savings callout from foodline_charges_and_pricing.html */}
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                    <span>🎉</span>
                    <span>
                      You save ₹{Math.max(0, (subtotal * 1.2 + 15 + 45 + 9) - finalPayable).toFixed(2)} vs external delivery apps!
                    </span>
                  </div>
                </div>

                {/* Terms & Conditions & FSSAI Consent Checkbox */}
                <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-[var(--border-glass)] space-y-2 mb-4">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dpdpConsent}
                      onChange={(e) => setDpdpConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-zinc-400 dark:border-zinc-600 bg-black/5 dark:bg-black text-accent-orange focus:ring-accent-orange cursor-pointer"
                    />
                    <span className="text-[11px] text-[var(--text-secondary)] leading-snug">
                      I agree to the <Link href="/terms" target="_blank" className="text-accent-teal font-bold hover:underline">Terms & Conditions</Link>, 20-min express slot pickup SLA, DPDP Act 2023 data telemetry protection, and Cafe @7 FSSAI 100% Pure Veg standards.
                    </span>
                  </label>
                  <div className="text-[9px] text-[var(--text-muted)] flex items-center gap-2 pl-6">
                    <span>🍲 FSSAI Lic. #11522036000142</span>
                    <span>•</span>
                    <span>🔒 AES-256 Encrypted</span>
                  </div>
                </div>

                {utrNumber.length === 12 && dpdpConsent && !isSubmitting ? (
                  <ShimmerButton
                    shimmerColor="#FFFFFF"
                    shimmerDuration="2.5s"
                    background="linear-gradient(to right, #FF6B2C, #FF8A3D, #FFB347)"
                    borderRadius="1rem"
                    className="w-full py-4.5 font-black text-sm md:text-base text-black shadow-2xl shadow-[#FF6B2C]/35 mt-4 mb-4 cursor-pointer"
                    type="submit"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Submit Payment & Get Pickup Pass</span>
                      <ArrowLeft size={16} className="rotate-180" />
                    </span>
                  </ShimmerButton>
                ) : (
                  <motion.button
                    whileHover={utrNumber.length === 12 && dpdpConsent && !isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={utrNumber.length === 12 && dpdpConsent && !isSubmitting ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={isSubmitting || utrNumber.length !== 12 || !dpdpConsent}
                    className={`w-full py-4.5 rounded-2xl font-black text-sm md:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl mt-4 mb-4 ${
                      isSubmitting || utrNumber.length !== 12 || !dpdpConsent
                        ? 'bg-black/10 dark:bg-zinc-800 text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-glass)]'
                        : 'bg-linear-to-r from-accent-orange via-accent-amber to-accent-amber text-black shadow-accent-orange/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Payment & Issuing Pass...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Payment & Get Pickup Pass</span>
                        <ArrowLeft size={16} className="rotate-180" />
                      </>
                    )}
                  </motion.button>
                )}
              </form>
            </SpotlightCard>
          </div>
        </div>
      </main>

      {/* High-Impact Celebration Burst Overlay */}
      <AnimatePresence>
        {celebrationData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl overflow-hidden"
          >
            {/* Background Meteors */}
            <div className="absolute inset-0 pointer-events-none">
              <Meteors number={25} />
            </div>

            {/* Glowing Ambient Radials */}
            <div className="absolute w-96 h-96 bg-accent-orange/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute w-80 h-80 bg-accent-teal/20 rounded-full blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              className="relative max-w-md w-full rounded-[2.5rem] border-2 border-accent-teal/50 p-6 sm:p-8 text-center bg-[var(--bg-card)] text-[var(--text-primary)] shadow-[0_0_60px_rgba(0,212,170,0.3)] overflow-hidden"
            >
              {/* Dynamic Campus Express Station Illustration */}
              <div className="flex justify-center -mt-2 mb-2">
                <CampusExpressIllustration size={135} />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-teal/15 border border-accent-teal/30 text-accent-teal text-xs font-black uppercase tracking-wider mb-2">
                <CheckCircle2 size={14} className="text-accent-teal" />
                Payment & Slot Confirmed!
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight mb-2">
                Order <span className="text-accent-amber font-mono">#{celebrationData.orderToken}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 font-medium">
                Your order is locked for <strong className="text-[var(--text-primary)]">{celebrationData.slotLabel}</strong>. Kitchen ticket dispatched!
              </p>

              {/* OTP Preview Card */}
              {celebrationData.pickupOtp && (
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-black/60 border border-[var(--border-glass)] mb-6 shadow-inner">
                  <span className="text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-wider block mb-1">
                    Pickup Verification OTP
                  </span>
                  <div className="text-3xl font-black font-mono tracking-widest text-accent-teal">
                    {celebrationData.pickupOtp}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                    Flash optical QR or recite this PIN at Cafe @7 Express Counter
                  </span>
                </div>
              )}

              {/* Action & Auto-Redirect Bar */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => router.push(`/order/${celebrationData.orderToken}`)}
                  className="w-full py-4 rounded-2xl bg-linear-to-r from-accent-orange via-accent-amber to-accent-amber text-black font-black text-sm shadow-xl shadow-accent-orange/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <span>View Express Digital Pass Now</span>
                  <span className="text-lg">→</span>
                </button>

                <div className="text-[11px] text-[var(--text-muted)] font-medium flex items-center justify-center gap-1.5">
                  <Clock size={13} className="text-[var(--text-muted)]" />
                  <span>Auto-navigating to pass in <strong className="text-[var(--text-primary)] font-mono">{countdown}s</strong>...</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
