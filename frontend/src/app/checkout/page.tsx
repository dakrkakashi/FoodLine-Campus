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
  Banknote,
  Wallet,
  Zap,
  PartyPopper,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { Stepper, ProgressBar, PageTransition, SpotlightCard, fireConfettiSuccess, fireFireworks } from '@/components/ui';
import { Meteors } from '@/components/magicui/meteors';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { saveOrderToHistory } from '@/lib/order-history-store';

interface Slot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBooked: number;
  availableSlots: number;
  isFull: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, totalCount, addItem, removeItem, deleteItem, updateQuantity, clearCart } = useCart();
  const { getEffectiveAvailability, getStockQuantity } = useInventory();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
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
          setSlots(json.data);
          if (json.data.length > 0) {
            const firstAvailable = json.data.find((s: Slot) => !s.isFull) || json.data[0];
            setSelectedSlotId(firstAvailable.id);
          }
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      }
    }
    loadSlots();
  }, []);

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
    if (paymentMethod === 'UPI' && utrNumber.length !== 12) {
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
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          paymentMethod,
          utrNumber: paymentMethod === 'UPI' ? utrNumber : undefined,
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
      const selectedSlot = slots.find((s) => s.id === selectedSlotId);
      saveOrderToHistory({
        orderId: json.data.orderId,
        orderToken: json.data.orderToken,
        totalAmount: json.data.totalAmount,
        pickupOtp: json.data.pickupOtp,
        status: json.data.status,
        paymentMethod,
        slotLabel: selectedSlot?.label || '',
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
        slotLabel: selectedSlot?.label || 'Cafe @7 Counter',
      });
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please retry.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !celebrationData) {
    return (
      <PageTransition className="min-h-screen bg-[#07070B] text-[#F5F5F7] pb-24">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 pt-20 text-center">
          <SpotlightCard className="p-10 rounded-[2.5rem] text-center border-dashed border-white/20">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-6 shadow-inner">
              🍽
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Your Tray is Empty</h1>
            <p className="text-sm text-zinc-400 mb-8 max-w-sm mx-auto">
              Explore 44+ freshly prepared campus dishes from Cafe @7 and reserve your express pickup slot.
            </p>
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black font-black text-sm shadow-xl shadow-[#FF6B2C]/30 cursor-pointer"
              >
                Browse Cafe @7 Menu →
              </motion.button>
            </Link>
          </SpotlightCard>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-[#F5F5F7] pb-40">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
          >
            <ArrowLeft size={14} /> Back to Menu
          </Link>
        </div>

        {/* Stepper Header */}
        <div className="glass-card-heavy rounded-[2rem] p-6 mb-8 border border-white/10 shadow-2xl">
          <Stepper steps={['Tray Review', 'Break Slot', 'UPI Scan', 'Submit UTR']} currentStep={getStep()} />
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs sm:text-sm font-bold mb-6 flex items-center gap-3 shadow-lg"
            >
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
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
              className="p-4 rounded-2xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs sm:text-sm font-bold mb-6 space-y-2 shadow-xl shadow-red-950/40"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
                  <span className="font-extrabold text-red-300">
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
                  className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white text-xs font-black transition cursor-pointer border border-red-500/30"
                >
                  Remove Sold Out Items
                </button>
              </div>
              <ul className="text-xs text-red-300/90 pl-6 list-disc space-y-1 font-medium">
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
            <SpotlightCard className="p-6 md:p-7">
              <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Receipt size={20} className="text-[#FF6B2C]" />
                  <h2 className="text-lg font-black text-white">Your Tray Summary</h2>
                </div>
                <span className="text-xs font-extrabold text-[#FFB347] bg-[#FF6B2C]/10 border border-[#FF6B2C]/25 px-3 py-1 rounded-full">
                  {totalCount} {totalCount === 1 ? 'Dish' : 'Dishes'}
                </span>
              </div>

              <div className="space-y-3.5 divide-y divide-white/5">
                {items.map((item) => {
                  const stockQty = getStockQuantity(item.id);
                  const isMaxStockReached = stockQty !== null && stockQty !== undefined && item.quantity >= stockQty;

                  return (
                    <div key={item.id} className="pt-3.5 first:pt-0 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-white truncate">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-zinc-400 font-bold">₹{item.price} each</span>
                          {stockQty !== null && stockQty !== undefined && stockQty <= 5 && (
                            <span className="text-[10px] font-extrabold text-[#FFB347]">
                              (Only {stockQty} in stock)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1 shadow-inner">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center transition cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-black text-xs text-[#FFB347]">{item.quantity}</span>
                          <button
                            type="button"
                            disabled={isMaxStockReached}
                            onClick={() =>
                              !isMaxStockReached &&
                              addItem({ id: item.id, name: item.name, price: item.price, maxStock: stockQty })
                            }
                            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                              isMaxStockReached
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
                                : 'bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white cursor-pointer'
                            }`}
                            title={isMaxStockReached ? `Maximum available stock (${stockQty}) reached` : 'Add one more'}
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-black text-white w-14 text-right">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>

                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 transition cursor-pointer"
                          title="Remove dish"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Payable (0% Fee)</span>
                <span className="text-2xl font-black text-white">₹{totalAmount.toFixed(0)}</span>
              </div>
            </SpotlightCard>

            {/* Campus Break Slot Selection */}
            <SpotlightCard className="p-6 md:p-7">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2.5">
                  <Clock size={20} className="text-[#FFB347]" />
                  <h2 className="text-lg font-black text-white">Campus Break Pickup Slot</h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  60-Order Cap
                </span>
              </div>
              <p className="text-xs text-zinc-400 mb-5 font-medium">
                Reserve your 15-minute express collection window to avoid queue delays.
              </p>

              <div className="space-y-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <motion.button
                      whileTap={{ scale: 0.99 }}
                      key={slot.id}
                      type="button"
                      disabled={slot.isFull}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF6B2C]/15 border-[#FF6B2C] shadow-lg shadow-[#FF6B2C]/15'
                          : slot.isFull
                          ? 'bg-black/30 border-white/5 opacity-40 cursor-not-allowed'
                          : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-[#FF6B2C] bg-[#FF6B2C]' : 'border-zinc-500'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <span className="text-sm font-extrabold text-white">{slot.label}</span>
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                            slot.isFull
                              ? 'bg-red-950 text-red-400 border border-red-500/30'
                              : slot.availableSlots <= 10
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {slot.isFull ? 'FULL' : `${slot.availableSlots} left`}
                        </span>
                      </div>
                      <ProgressBar value={slot.currentBooked} max={slot.maxCapacity} showPercent={false} size="sm" />
                    </motion.button>
                  );
                })}
              </div>
            </SpotlightCard>
          </div>

          {/* Right Column: Payment Options (UPI & Cash on Delivery) */}
          <div className="lg:col-span-5 space-y-6">
            <SpotlightCard spotlightColor={paymentMethod === 'UPI' ? 'rgba(0, 212, 170, 0.25)' : 'rgba(255, 179, 71, 0.25)'} className="p-6 md:p-7">
              {/* Payment Mode Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 mb-6 p-1.5 bg-black/50 border border-white/10 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black shadow-lg shadow-[#FF6B2C]/25'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Zap size={15} className={paymentMethod === 'UPI' ? 'text-black' : 'text-[#FF6B2C]'} />
                  <span>⚡ DirectPay UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'bg-gradient-to-r from-[#00D4AA] to-[#00B4D8] text-black shadow-lg shadow-[#00D4AA]/25'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Banknote size={15} className={paymentMethod === 'COD' ? 'text-black' : 'text-[#00D4AA]'} />
                  <span>💵 Cash on Counter</span>
                </button>
              </div>

              {/* UPI Mode View */}
              {paymentMethod === 'UPI' ? (
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={22} className="text-[#00D4AA]" />
                      <h2 className="text-lg font-black text-white">Direct UPI Payment</h2>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/30 px-2.5 py-1 rounded-full">
                      0% Surcharge
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-6 font-medium">
                    Pay directly to Cafe @7 merchant account via any UPI App.
                  </p>

                  {/* QR Code Container */}
                  <div className="relative bg-white p-4 rounded-3xl mx-auto w-fit shadow-2xl flex flex-col items-center border-2 border-white/20">
                    <img src={upiQrUrl} alt="UPI QR Code" className="w-48 h-48 object-contain rounded-xl" />
                    <div className="mt-3 text-center">
                      <div className="text-[10px] font-black text-black tracking-widest uppercase">
                        Scan with PhonePe, GPay, Paytm
                      </div>
                      <div className="text-xs font-black text-[#FF6B2C] mt-0.5">
                        Pay ₹{finalPayable.toFixed(2)} to {upiId}
                      </div>
                    </div>
                  </div>

                  {/* Copy UPI ID Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={copyUpiId}
                    type="button"
                    className="w-full mt-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    {copiedUpi ? (
                      <>
                        <Check size={14} className="text-[#00D4AA]" />
                        <span className="text-[#00D4AA] font-black">Copied UPI ID!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy UPI: <span className="font-mono text-white">{upiId}</span></span>
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                /* Cash on Counter (COD) View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Banknote size={22} className="text-[#00D4AA]" />
                      <h2 className="text-lg font-black text-white">Cash on Delivery / Counter</h2>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/30 px-2.5 py-1 rounded-full">
                      Pay at Pickup
                    </span>
                  </div>

                  <div className="p-6 rounded-3xl bg-gradient-to-b from-[#00D4AA]/15 to-transparent border border-[#00D4AA]/30 text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/30 flex items-center justify-center text-3xl shadow-inner">
                      💵
                    </div>
                    <div>
                      <div className="text-base font-black text-white">Pay Cash at Cafe @7 Counter</div>
                      <div className="text-xs text-zinc-300 mt-1 max-w-xs mx-auto leading-relaxed">
                        Hand over exact cash <strong className="text-[#00D4AA] font-black font-mono text-sm">₹{finalPayable.toFixed(2)}</strong> to the Counter Lead when collecting your food.
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-[11px] text-zinc-300 flex items-center justify-center gap-2">
                      <Clock size={14} className="text-[#FFB347]" />
                      <span>Instant Kitchen Booking — No Advance Payment Needed!</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Form (UTR for UPI, direct submit for COD) */}
              <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
                {paymentMethod === 'UPI' && (
                  <div>
                    <label className="block text-[11px] font-black text-zinc-300 uppercase tracking-wider mb-2">
                      12-Digit Bank UTR / Reference No. <span className="text-[#FF6B2C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      inputMode="numeric"
                      placeholder="e.g. 423891827364"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black/50 border border-white/15 rounded-2xl px-5 py-4 text-sm text-white font-mono tracking-widest placeholder-zinc-600 focus:outline-none focus:border-[#FF6B2C] focus:ring-2 focus:ring-[#FF6B2C]/20 transition-all"
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-zinc-500 font-medium">Found in your UPI transaction receipt</span>
                      <span className={`text-[11px] font-mono font-bold ${utrNumber.length === 12 ? 'text-[#00D4AA]' : 'text-zinc-500'}`}>
                        {utrNumber.length}/12
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Student Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Shivam"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B2C] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">PRN / Roll No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 23BBA042"
                      value={studentPrn}
                      onChange={(e) => setStudentPrn(e.target.value.toUpperCase())}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B2C] transition font-mono"
                    />
                  </div>
                </div>

                {/* Transparent Financial & Fee Breakdown Box */}
                <div className="bg-[#16161E]/90 border border-white/10 rounded-2xl p-4 my-4 space-y-2.5 shadow-inner">
                  <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>💳</span>
                      <span>Transparent Fee Breakdown</span>
                    </span>
                    <span className="text-[10px] font-black text-[#00D4AA] uppercase tracking-wider bg-[#00D4AA]/10 border border-[#00D4AA]/30 px-2 py-0.5 rounded-full">
                      {paymentMethod === 'UPI' ? 'DirectPay UPI' : 'Cash on Counter'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Dish Subtotal (Actual Canteen Menu Price)</span>
                    <span className="font-mono font-bold text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Restaurant Menu Markup</span>
                    <span className="font-mono font-bold text-emerald-400">₹0.00 (Zero Markup)</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span className="flex items-center gap-1">
                      FoodLine Fast-Pass Convenience Fee
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-black">3.5%</span>
                    </span>
                    <span className="font-mono font-bold text-[#FFB347]">+₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-300">
                    <span>Payment Gateway Surcharge</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {paymentMethod === 'UPI' ? '0.0% (Free Direct Bank Pay)' : '₹0.00 (Cash on Delivery)'}
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-white/10 flex justify-between text-sm font-black text-white">
                    <span>Total Amount Payable</span>
                    <span className="text-[#FF6B2C] font-mono text-xl font-black">₹{finalPayable.toFixed(2)}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-medium pt-1.5 border-t border-white/5 flex items-start gap-1.5 leading-relaxed">
                    <span className="text-[#00D4AA] text-xs">⚡</span>
                    <span>
                      {paymentMethod === 'UPI' ? (
                        <>
                          <strong className="text-white font-bold">100% Direct Settlement:</strong> 100% of your payment lands directly in Cafe @7 merchant bank account (<code className="text-[#00D4AA] font-mono">{upiId}</code>) with zero food markup.
                        </>
                      ) : (
                        <>
                          <strong className="text-white font-bold">Cash on Counter:</strong> Please bring exact change (<strong className="text-white font-mono">₹{finalPayable.toFixed(2)}</strong>) to the counter for fast 1-minute pickup.
                        </>
                      )}
                    </span>
                  </div>

                  {/* Savings callout from foodline_charges_and_pricing.html */}
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300 font-bold flex items-center gap-2">
                    <span>🎉</span>
                    <span>
                      You save ₹{Math.max(0, (subtotal * 1.2 + 15 + 45 + 9) - finalPayable).toFixed(2)} vs external delivery apps!
                    </span>
                  </div>
                </div>

                {/* Terms & Conditions & FSSAI Consent Checkbox */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 mb-4">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dpdpConsent}
                      onChange={(e) => setDpdpConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-zinc-600 bg-black text-[#FF6B2C] focus:ring-[#FF6B2C] cursor-pointer"
                    />
                    <span className="text-[11px] text-zinc-300 leading-snug">
                      I agree to the <Link href="/terms" target="_blank" className="text-[#00D4AA] font-bold hover:underline">Terms & Conditions</Link>, 20-min express slot pickup SLA, DPDP Act 2023 data telemetry protection, and Cafe @7 FSSAI 100% Pure Veg standards.
                    </span>
                  </label>
                  <div className="text-[9px] text-zinc-500 flex items-center gap-2 pl-6">
                    <span>🍲 FSSAI Lic. #11522036000142</span>
                    <span>•</span>
                    <span>🔒 AES-256 Encrypted</span>
                  </div>
                </div>

                {paymentMethod === 'UPI' && utrNumber.length === 12 && dpdpConsent && !isSubmitting ? (
                  <ShimmerButton
                    shimmerColor="#FFFFFF"
                    shimmerDuration="2.5s"
                    background="linear-gradient(to right, #FF6B2C, #FF8A3D, #FFB347)"
                    borderRadius="1rem"
                    className="w-full py-4.5 font-black text-sm md:text-base text-black shadow-2xl shadow-[#FF6B2C]/35 mt-4 mb-4"
                    type="submit"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Submit Payment & Get Pickup Pass</span>
                      <ArrowLeft size={16} className="rotate-180" />
                    </span>
                  </ShimmerButton>
                ) : (
                  <motion.button
                    whileHover={(paymentMethod === 'COD' || utrNumber.length === 12) && dpdpConsent && !isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={(paymentMethod === 'COD' || utrNumber.length === 12) && dpdpConsent && !isSubmitting ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={isSubmitting || (paymentMethod === 'UPI' && utrNumber.length !== 12) || !dpdpConsent}
                    className={`w-full py-4.5 rounded-2xl font-black text-sm md:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl mt-4 mb-4 ${
                      isSubmitting || (paymentMethod === 'UPI' && utrNumber.length !== 12) || !dpdpConsent
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                        : paymentMethod === 'COD'
                        ? 'bg-gradient-to-r from-[#00D4AA] via-[#00E5BC] to-[#00B4D8] text-black shadow-[#00D4AA]/30'
                        : 'bg-gradient-to-r from-[#FF6B2C] via-[#FF8A3D] to-[#FFB347] text-black shadow-[#FF6B2C]/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>{paymentMethod === 'COD' ? 'Reserving Slot & Issuing Pass...' : 'Verifying Payment & Issuing Pass...'}</span>
                      </>
                    ) : paymentMethod === 'COD' ? (
                      <>
                        <span>Place Cash on Delivery Order</span>
                        <ArrowLeft size={16} className="rotate-180" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl overflow-hidden"
          >
            {/* Background Meteors */}
            <div className="absolute inset-0 pointer-events-none">
              <Meteors number={25} />
            </div>

            {/* Glowing Ambient Radials */}
            <div className="absolute w-96 h-96 bg-[#FF6B2C]/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute w-80 h-80 bg-[#00D4AA]/20 rounded-full blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              className="relative max-w-md w-full glass-card-heavy rounded-[2.5rem] border-2 border-[#00D4AA]/50 p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(0,212,170,0.3)] overflow-hidden"
            >
              {/* Party Popper Badge with Spring Bounce */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 450, damping: 18 }}
                className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#00D4AA] to-[#00E5BC] text-black flex items-center justify-center shadow-2xl shadow-[#00D4AA]/40 mb-5"
              >
                <PartyPopper size={38} strokeWidth={2.5} />
              </motion.div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/30 text-[#00D4AA] text-xs font-black uppercase tracking-wider mb-2">
                <CheckCircle2 size={14} className="text-[#00D4AA]" />
                Payment & Slot Confirmed!
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Order <span className="text-[#FFB347] font-mono">#{celebrationData.orderToken}</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6 font-medium">
                Your order is locked for <strong className="text-white">{celebrationData.slotLabel}</strong>. Kitchen ticket dispatched!
              </p>

              {/* OTP Preview Card */}
              {celebrationData.pickupOtp && (
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 mb-6 shadow-inner">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block mb-1">
                    Pickup Verification OTP
                  </span>
                  <div className="text-3xl font-black font-mono tracking-widest text-[#00D4AA]">
                    {celebrationData.pickupOtp}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Flash optical QR or recite this PIN at Cafe @7 Express Counter
                  </span>
                </div>
              )}

              {/* Action & Auto-Redirect Bar */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => router.push(`/order/${celebrationData.orderToken}`)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B2C] via-[#FF8A3D] to-[#FFB347] text-black font-black text-sm shadow-xl shadow-[#FF6B2C]/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <span>View Express Digital Pass Now</span>
                  <span className="text-lg">→</span>
                </button>

                <div className="text-[11px] text-zinc-500 font-medium flex items-center justify-center gap-1.5">
                  <Clock size={13} className="text-zinc-400" />
                  <span>Auto-navigating to pass in <strong className="text-white font-mono">{countdown}s</strong>...</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
