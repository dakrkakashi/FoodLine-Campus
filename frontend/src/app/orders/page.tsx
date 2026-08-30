'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Receipt,
  QrCode,
  RotateCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  Sparkles,
  RefreshCw,
  Utensils,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition, SpotlightCard } from '@/components/ui';
import { getLocalOrderHistory, SavedOrder } from '@/lib/order-history-store';
import { useCart } from '@/context/CartContext';
import { useSoundFX } from '@/hooks/useSoundFX';

type FilterTab = 'all' | 'active' | 'completed';

export default function OrdersHistoryPage() {
  const router = useRouter();
  const { addItem, clearCart } = useCart();
  const { playClick, playSuccess, playTab } = useSoundFX();

  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadOrders = async () => {
    setIsRefreshing(true);
    try {
      // 1. Load from local storage
      const localHistory = getLocalOrderHistory();

      // 2. Fetch latest statuses from backend API if available
      try {
        const res = await fetch('/api/orders?limit=30');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const apiOrders: SavedOrder[] = json.data.map((o: any) => ({
              orderId: o.id,
              orderToken: o.order_token,
              totalAmount: Number(o.total_amount),
              pickupOtp: o.pickup_otp,
              status: o.status,
              paymentMethod: (o.notes && o.notes.includes('COD')) ? 'COD' : 'UPI',
              slotLabel: o.pickup_slots?.label || 'Campus Break Slot',
              slotTime: o.pickup_slots ? `${o.pickup_slots.start_time} - ${o.pickup_slots.end_time}` : '',
              notes: o.notes,
              items: (o.order_items || []).map((oi: any) => ({
                id: oi.menu_item_id || oi.id,
                name: oi.item_name,
                price: Number(oi.unit_price),
                quantity: oi.quantity,
              })),
              createdAt: o.created_at,
            }));

            // Merge API orders with local orders (deduplicating by token)
            const tokenMap = new Map<string, SavedOrder>();
            for (const o of localHistory) tokenMap.set(o.orderToken, o);
            for (const o of apiOrders) {
              const existing = tokenMap.get(o.orderToken);
              tokenMap.set(o.orderToken, { ...existing, ...o });
            }

            const merged = Array.from(tokenMap.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(merged);
            setIsLoading(false);
            setIsRefreshing(false);
            return;
          }
        }
      } catch (apiErr) {
        console.warn('API order fetch fallback to local history:', apiErr);
      }

      // Fallback: local history only
      setOrders(localHistory);
    } catch (err) {
      console.error('Failed to load order history:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleReorder = (order: SavedOrder) => {
    playSuccess();
    clearCart();
    for (const item of order.items) {
      addItem({
        id: item.id || `reorder_${item.name}`,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    }
    router.push('/checkout');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return {
          label: 'Awaiting Payment',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <AlertCircle size={14} className="animate-pulse" />,
        };
      case 'AWAITING_VERIFICATION':
        return {
          label: 'Payment Verifying',
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: <RefreshCw size={14} className="animate-spin" />,
        };
      case 'CONFIRMED':
        return {
          label: 'Order Sent to Kitchen',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <Receipt size={14} />,
        };
      case 'PREPARING':
        return {
          label: 'Chef is Cooking',
          color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          icon: <ChefHat size={14} className="animate-bounce" />,
        };
      case 'READY':
        return {
          label: 'Ready for Pickup!',
          color: 'bg-green-500/20 text-green-300 border-green-400/40 shadow-lg shadow-green-500/20',
          icon: <PackageCheck size={14} className="animate-pulse" />,
        };
      case 'COLLECTED':
        return {
          label: 'Collected',
          color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
          icon: <CheckCircle2 size={14} />,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: <AlertCircle size={14} />,
        };
      default:
        return {
          label: status,
          color: 'bg-white/5 text-zinc-300 border-white/10',
          icon: <Clock size={14} />,
        };
    }
  };

  const isActiveOrder = (status: string) => {
    return ['PENDING_PAYMENT', 'AWAITING_VERIFICATION', 'CONFIRMED', 'PREPARING', 'READY'].includes(status);
  };

  const filteredOrders = orders.filter((order) => {
    // 1. Tab Filter
    if (activeTab === 'active' && !isActiveOrder(order.status)) return false;
    if (activeTab === 'completed' && isActiveOrder(order.status)) return false;

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchToken = order.orderToken?.toLowerCase().includes(q);
      const matchOtp = order.pickupOtp?.includes(q);
      const matchItem = order.items.some((i) => i.name.toLowerCase().includes(q));
      const matchSlot = order.slotLabel?.toLowerCase().includes(q);
      return matchToken || matchOtp || matchItem || matchSlot;
    }

    return true;
  });

  const activeOrdersCount = orders.filter((o) => isActiveOrder(o.status)).length;

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-[#F5F5F7] pb-28">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/20 text-[var(--accent-orange)] text-[10px] font-black tracking-wider uppercase">
                Student Portal
              </span>
              {activeOrdersCount > 0 && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {activeOrdersCount} Active {activeOrdersCount === 1 ? 'Order' : 'Orders'}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Receipt className="text-[var(--accent-orange)]" size={32} />
              My Orders & History
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Track active break pickups, view optical QR passes, and 1-tap reorder your favorites.
            </p>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={() => {
              playClick();
              loadOrders();
            }}
            disabled={isRefreshing}
            className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-200 hover:text-white transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[var(--accent-teal)]' : ''} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10">
            <button
              onClick={() => {
                setActiveTab('all');
                playTab();
              }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[var(--accent-orange)] text-black shadow-md shadow-[var(--accent-orange)]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('active');
                playTab();
              }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-[var(--accent-orange)] text-black shadow-md shadow-[var(--accent-orange)]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Active</span>
              {activeOrdersCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === 'active' ? 'bg-black text-white' : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {activeOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('completed');
                playTab();
              }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-[var(--accent-orange)] text-black shadow-md shadow-[var(--accent-orange)]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Past / Completed
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by token, dish or OTP..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Orders List Container */}
        {isLoading ? (
          <div className="py-20 text-center">
            <RefreshCw size={28} className="animate-spin text-[var(--accent-orange)] mx-auto mb-3" />
            <p className="text-sm text-zinc-400 font-bold">Loading your order history...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <SpotlightCard className="p-12 text-center rounded-[2.5rem] border-dashed border-white/15 my-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-4 shadow-inner">
              🥡
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {searchQuery
                ? 'No matching orders found'
                : activeTab === 'active'
                ? 'No Active Orders'
                : 'No Orders Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
              {searchQuery
                ? `No orders matching "${searchQuery}". Try searching by another token or dish.`
                : activeTab === 'active'
                ? 'You currently have no orders in the cooking or pickup queue.'
                : 'Your campus dining history is empty. Browse the Cafe @7 menu and pre-order your first break snack!'}
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-amber)] text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-[var(--accent-orange)]/25 hover:brightness-110 transition cursor-pointer"
            >
              <Utensils size={16} />
              <span>Browse Menu</span>
            </Link>
          </SpotlightCard>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, idx) => {
              const badge = getStatusBadge(order.status);
              const isActive = isActiveOrder(order.status);

              return (
                <motion.div
                  key={order.orderToken || order.orderId || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                >
                  <SpotlightCard
                    className={`p-5 sm:p-6 rounded-[2rem] border transition-all duration-300 ${
                      isActive
                        ? 'border-[var(--accent-orange)]/40 bg-[#0F0F16] shadow-xl shadow-[var(--accent-orange)]/5'
                        : 'border-white/10 bg-[#0C0C12] hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                      {/* Token & OTP Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner font-black text-[var(--accent-orange)]">
                          🏷
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-lg text-white tracking-tight">
                              {order.orderToken}
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-extrabold text-zinc-300">
                              OTP: <strong className="text-white tracking-wider">{order.pickupOtp}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                            <Calendar size={12} />
                            <span>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                  })
                                : 'Recent Order'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-2 ${badge.color}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Item List */}
                      <div>
                        <div className="text-[10px] uppercase font-black tracking-wider text-zinc-500 mb-2">
                          Ordered Dishes ({order.items?.length || 0})
                        </div>
                        <ul className="space-y-1.5">
                          {order.items?.map((item, iIdx) => (
                            <li key={iIdx} className="flex items-center justify-between text-zinc-300">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)]"></span>
                                <strong className="text-white font-bold">{item.quantity}x</strong> {item.name}
                              </span>
                              <span className="font-mono text-zinc-400">
                                ₹{(item.price * item.quantity).toFixed(0)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Slot & Break Details */}
                      <div className="sm:border-l sm:border-white/5 sm:pl-4 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-black tracking-wider text-zinc-500 mb-2">
                            Break Pickup Slot
                          </div>
                          <div className="flex items-center gap-2 text-zinc-300 font-bold bg-white/5 p-2.5 rounded-xl border border-white/5">
                            <Clock size={15} className="text-[var(--accent-teal)]" />
                            <div>
                              <div>{order.slotLabel || 'Break Slot'}</div>
                              {order.slotTime && (
                                <div className="text-[10px] text-zinc-400 font-mono">{order.slotTime}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Total & Payment Method */}
                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                          <span className="text-zinc-400 text-xs">
                            Payment:{' '}
                            <strong className="text-white font-bold">
                              {order.paymentMethod === 'COD' ? '💵 Cash at Counter' : '⚡ DirectPay UPI'}
                            </strong>
                          </span>
                          <span className="text-base font-black text-white font-mono">
                            ₹{order.totalAmount ? order.totalAmount.toFixed(0) : '0'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                      {/* Optical Pass Button */}
                      <Link
                        href={`/order/${order.orderToken}`}
                        onClick={playClick}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-amber)] text-black shadow-lg shadow-[var(--accent-orange)]/20 hover:brightness-110'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        <QrCode size={15} />
                        <span>{isActive ? 'Open Optical QR Pass' : 'View Pass & Receipt'}</span>
                        <ChevronRight size={14} />
                      </Link>

                      {/* 1-Tap Reorder Button */}
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                      >
                        <RotateCw size={14} className="text-[var(--accent-teal)]" />
                        <span>1-Tap Reorder to Tray</span>
                      </button>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </PageTransition>
  );
}
