'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
  Search,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Filter,
  Edit3,
  Plus,
  Check,
  X,
  Clock,
  Tag,
  Save,
  DollarSign,
  ChefHat,
  Ban,
  SunMedium,
  Loader2,
  Download,
  Upload,
  Flame,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Banknote,
  Utensils,
  ShieldCheck,
} from 'lucide-react';
import { ChefExpressIllustration, CampusExpressIllustration, EmptyCartIllustration } from '@/components/illustrations';
import { useSoundFX } from '@/hooks/useSoundFX';

interface KdsOrderItem {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface KdsOrder {
  id: string;
  order_token: string;
  status: string;
  pickup_otp: string;
  total_amount: number;
  created_at: string;
  notes?: string;
  order_items?: KdsOrderItem[];
  pickup_slots?: {
    label: string;
  };
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock_quantity?: number;
  stockQuantity?: number;
  is_available: boolean;
  isAvailable?: boolean;
  tag?: string;
  category?: string;
  prep_time_mins?: number;
  description?: string;
}

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<KdsOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showStockoutModal, setShowStockoutModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stockSearch, setStockSearch] = useState('');
  const [stockFilterTab, setStockFilterTab] = useState<'all' | 'instock' | 'soldout'>('all');
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  // KDS Audio Chime Suite (Resonant Web Audio Engine)
  const { playKitchenReadyChime, playPop, unlockAudio } = useSoundFX();
  const readyChimePlayedTokensRef = React.useRef<Set<string>>(new Set());
  const isInitialLoadRef = React.useRef<boolean>(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const unlockAudioContext = () => {
    unlockAudio()
      .then((unlocked) => {
        setAudioUnlocked(true);
        if (unlocked) {
          playPop();
        }
      })
      .catch(() => {
        setAudioUnlocked(true);
      });
  };

  useEffect(() => {
    const handleFirstGesture = () => {
      unlockAudioContext();
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  const triggerReadyChime = (orderToken?: string) => {
    if (!soundEnabled) return;
    if (orderToken) {
      if (readyChimePlayedTokensRef.current.has(orderToken)) return;
      readyChimePlayedTokensRef.current.add(orderToken);
    }
    playKitchenReadyChime();
  };

  // KDS UI State: Live Clock, Fullscreen & Ticket Search
  const [currentTime, setCurrentTime] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [kdsSearch, setKdsSearch] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const getUrgencyBadge = (createdAt: string) => {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins >= 15) {
      return { label: `🚨 ${mins}m DELAY`, color: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' };
    }
    if (mins >= 8) {
      return { label: `⚠️ ${mins}m RUSH`, color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    }
    return { label: `⏱️ ${mins < 1 ? 'Just now' : `${mins}m`}`, color: 'bg-white/10 text-zinc-300 border-white/10' };
  };

  // OTP Verification Modal State
  const [verifyingOrder, setVerifyingOrder] = useState<KdsOrder | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Edit State
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    price: number;
    stock_quantity: number;
    tag: string;
    category: string;
    prep_time_mins: number;
  }>({
    name: '',
    price: 0,
    stock_quantity: 30,
    tag: '',
    category: '',
    prep_time_mins: 5,
  });
  const [isSavingDish, setIsSavingDish] = useState(false);

  // Add Dish State
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [newDishForm, setNewDishForm] = useState<{
    name: string;
    price: number;
    stock_quantity: number;
    tag: string;
    category: string;
    prep_time_mins: number;
  }>({
    name: '',
    price: 50,
    stock_quantity: 30,
    tag: 'Kitchen Special',
    category: 'Chef Specials',
    prep_time_mins: 5,
  });

  async function loadData() {
    try {
      setLoading(true);
      const supabase = createClient();

      const [ordersRes, menuApiRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*, order_items (*), pickup_slots (*)')
          .in('status', ['CONFIRMED', 'PREPARING', 'READY', 'COLLECTED'])
          .order('created_at', { ascending: false })
          .limit(30),
        fetch('/api/menu').then((r) => r.json()).catch(() => null)
      ]);

      if (ordersRes.data && ordersRes.data.length > 0) {
        if (isInitialLoadRef.current) {
          // On first load, seed deduplication set with existing READY orders to prevent startup chime blast
          ordersRes.data.forEach((o: any) => {
            if (o.status === 'READY') {
              readyChimePlayedTokensRef.current.add(o.order_token || o.id);
            }
          });
          isInitialLoadRef.current = false;
        } else {
          // On background polling/refresh, check for newly transitioned READY orders
          ordersRes.data.forEach((o: any) => {
            const token = o.order_token || o.id;
            if (o.status === 'READY' && !readyChimePlayedTokensRef.current.has(token)) {
              triggerReadyChime(token);
            }
          });
        }
        setOrders(ordersRes.data);
      }

      if (menuApiRes?.success && menuApiRes.data?.items?.length > 0) {
        setMenuItems(
          menuApiRes.data.items.map((m: any) => ({
            id: m.id,
            name: m.name,
            price: m.price,
            stock_quantity: m.stock_quantity ?? m.stockQuantity ?? (m.is_available === false ? 0 : 30),
            stockQuantity: m.stock_quantity ?? m.stockQuantity ?? (m.is_available === false ? 0 : 30),
            is_available: m.is_available !== false && m.isAvailable !== false,
            tag: m.tag,
            category: m.category,
            prep_time_mins: m.prep_time_mins || m.prepTime || 5,
            description: m.description,
          }))
        );
      } else {
        const menuDbRes = await supabase.from('menu_items').select('*').order('name');
        if (menuDbRes.data && menuDbRes.data.length > 0) {
          setMenuItems(
            menuDbRes.data.map((m: any) => ({
              ...m,
              stock_quantity: m.stock_quantity ?? (m.is_available === false ? 0 : 30),
              stockQuantity: m.stock_quantity ?? (m.is_available === false ? 0 : 30),
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Live Supabase sync fallback:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    // 5-second resilient background polling fallback for tablet kiosk reliability
    const pollInterval = setInterval(() => {
      loadData();
    }, 5000);

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('kds-orders-live')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              loadData();
              if (soundEnabled) {
                playPop();
              }
            } else if (payload.eventType === 'UPDATE') {
              const updated = payload.new as any;
              if (updated?.status === 'READY') {
                triggerReadyChime(updated.order_token || updated.id);
              }
              setOrders((prev) =>
                prev.map((o) => (o.id === (payload.new as any).id ? { ...o, ...(payload.new as any) } : o))
              );
            }
          }
        )
        .subscribe();

      return () => {
        clearInterval(pollInterval);
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime channel error:', e);
      return () => {
        clearInterval(pollInterval);
      };
    }
  }, [soundEnabled]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const targetOrder = orders.find((o) => o.id === orderId);
      if (newStatus === 'READY' && targetOrder) {
        triggerReadyChime(targetOrder.order_token);
      }

      const res = await fetch(`/api/kds/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleConfirmOtp = async (orderToken: string, otpToTest: string) => {
    if (!otpToTest || otpToTest.trim().length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP');
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await fetch('/api/orders/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderToken, pickupOtp: otpToTest.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.order_token === orderToken ? { ...o, status: 'COLLECTED' } : o))
        );
        if (soundEnabled) {
          playKitchenReadyChime();
        }
        setVerifyingOrder(null);
        setEnteredOtp('');
      } else {
        setOtpError(data.error || 'Invalid OTP. Handover denied.');
      }
    } catch (err: any) {
      setOtpError(err.message || 'Verification network error');
    } finally {
      setIsVerifyingOtp(false);
    }
  };


  const handleToggleStock = async (dishId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const target = menuItems.find((m) => m.id === dishId);
    const currentQty = target?.stock_quantity ?? target?.stockQuantity ?? 30;
    const nextQty = nextStatus ? (currentQty === 0 ? 25 : currentQty) : 0;
    
    // 1. Optimistic instant UI update
    setMenuItems((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, is_available: nextStatus, isAvailable: nextStatus, stock_quantity: nextQty, stockQuantity: nextQty } : d))
    );

    setTogglingIds((prev) => new Set(prev).add(dishId));

    try {
      const res = await fetch(`/api/kds/inventory/${dishId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: nextStatus, stock_quantity: nextQty }),
      });

      if (!res.ok) {
        // Rollback if failed
        setMenuItems((prev) =>
          prev.map((d) => (d.id === dishId ? { ...d, is_available: currentStatus, isAvailable: currentStatus, stock_quantity: currentQty, stockQuantity: currentQty } : d))
        );
      }
    } catch (err) {
      console.error('Stock toggle failed:', err);
      // Rollback on network error
      setMenuItems((prev) =>
        prev.map((d) => (d.id === dishId ? { ...d, is_available: currentStatus, isAvailable: currentStatus, stock_quantity: currentQty, stockQuantity: currentQty } : d))
      );
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(dishId);
        return next;
      });
    }
  };

  const handleQuickPriceChange = async (dishId: string, delta: number) => {
    const target = menuItems.find((m) => m.id === dishId);
    if (!target) return;
    const newPrice = Math.max(5, (target.price || 0) + delta);

    // Optimistic UI update
    setMenuItems((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, price: newPrice } : d))
    );

    try {
      await fetch(`/api/kds/inventory/${dishId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      });
    } catch (e) {
      console.error('Quick price update failed:', e);
    }
  };

  const handleQuickStockChange = async (dishId: string, delta: number) => {
    const target = menuItems.find((m) => m.id === dishId);
    if (!target) return;
    const currentQty = target.stock_quantity ?? target.stockQuantity ?? 30;
    const newQty = Math.max(0, currentQty + delta);
    const newAvailability = newQty > 0;

    // Optimistic UI update
    setMenuItems((prev) =>
      prev.map((d) =>
        d.id === dishId
          ? {
              ...d,
              stock_quantity: newQty,
              stockQuantity: newQty,
              is_available: newAvailability,
              isAvailable: newAvailability,
            }
          : d
      )
    );

    try {
      await fetch(`/api/kds/inventory/${dishId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_quantity: newQty, isAvailable: newAvailability }),
      });
    } catch (e) {
      console.error('Quick stock update failed:', e);
    }
  };

  const handleStartEdit = (dish: MenuItem) => {
    setEditingDishId(dish.id);
    setEditForm({
      name: dish.name,
      price: dish.price,
      stock_quantity: dish.stock_quantity ?? dish.stockQuantity ?? 30,
      tag: dish.tag || '',
      category: dish.category || 'Kitchen Specials',
      prep_time_mins: dish.prep_time_mins || 5,
    });
  };

  const handleSaveEdit = async (dishId: string) => {
    try {
      setIsSavingDish(true);
      const safeQty = Math.max(0, Number(editForm.stock_quantity) || 0);
      const newAvailability = safeQty > 0;

      // Optimistic update
      setMenuItems((prev) =>
        prev.map((d) =>
          d.id === dishId
            ? {
                ...d,
                name: editForm.name,
                price: Number(editForm.price),
                stock_quantity: safeQty,
                stockQuantity: safeQty,
                is_available: newAvailability,
                isAvailable: newAvailability,
                tag: editForm.tag,
                category: editForm.category,
                prep_time_mins: Number(editForm.prep_time_mins),
              }
            : d
        )
      );

      const res = await fetch(`/api/kds/inventory/${dishId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          price: Number(editForm.price),
          stock_quantity: safeQty,
          isAvailable: newAvailability,
          tag: editForm.tag,
          category: editForm.category,
          prep_time_mins: Number(editForm.prep_time_mins),
        }),
      });

      if (res.ok) {
        setEditingDishId(null);
      }
    } catch (e) {
      console.error('Save dish edit failed:', e);
    } finally {
      setIsSavingDish(false);
    }
  };

  const handleAddNewDish = async () => {
    if (!newDishForm.name.trim()) return;

    try {
      setIsSavingDish(true);
      const newId = `dish-${Date.now()}`;
      const safeQty = Math.max(0, Number(newDishForm.stock_quantity) || 30);
      const newDish: MenuItem = {
        id: newId,
        name: newDishForm.name.trim(),
        price: Number(newDishForm.price) || 50,
        stock_quantity: safeQty,
        stockQuantity: safeQty,
        is_available: safeQty > 0,
        isAvailable: safeQty > 0,
        tag: newDishForm.tag.trim() || 'Kitchen Special',
        category: newDishForm.category.trim() || 'Chef Specials',
        prep_time_mins: Number(newDishForm.prep_time_mins) || 5,
      };

      setMenuItems((prev) => [newDish, ...prev]);

      await fetch(`/api/kds/inventory/${newId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDish,
          isAvailable: safeQty > 0,
        }),
      });

      setIsAddingDish(false);
      setNewDishForm({
        name: '',
        price: 50,
        stock_quantity: 30,
        tag: 'Kitchen Special',
        category: 'Chef Specials',
        prep_time_mins: 5,
      });
    } catch (e) {
      console.error('Add new dish failed:', e);
    } finally {
      setIsSavingDish(false);
    }
  };

  const handleBulkKdsStock = async (action: 'ALL_IN_STOCK' | 'ALL_OUT_OF_STOCK') => {
    const isAvailable = action === 'ALL_IN_STOCK';
    const targetQty = isAvailable ? 30 : 0;
    setMenuItems((prev) =>
      prev.map((d) => ({
        ...d,
        is_available: isAvailable,
        isAvailable: isAvailable,
        stock_quantity: targetQty,
        stockQuantity: targetQty,
      }))
    );
    try {
      await fetch('/api/admin/inventory/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
    } catch (e) {
      console.error('KDS bulk stock update failed:', e);
    }
  };

  const handleMorningPrepBatch = async (quantity: number = 50) => {
    setMenuItems((prev) =>
      prev.map((d) => ({
        ...d,
        is_available: true,
        isAvailable: true,
        stock_quantity: quantity,
        stockQuantity: quantity,
      }))
    );
    try {
      await fetch('/api/admin/inventory/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ALL_IN_STOCK' }),
      });
    } catch (e) {
      console.error('KDS morning prep batch failed:', e);
    }
  };

  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleSaveAllInventory = async () => {
    try {
      setIsSavingAll(true);
      const res = await fetch('/api/admin/inventory/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: menuItems }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccessMsg(`Saved ${menuItems.length} dishes!`);
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      }
    } catch (e) {
      console.error('Save all inventory failed:', e);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleResetAllStock = async () => {
    handleBulkKdsStock('ALL_IN_STOCK');
  };

  const filteredStockDishes = useMemo(() => {
    return menuItems.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
        (d.tag && d.tag.toLowerCase().includes(stockSearch.toLowerCase()));
      if (!matchesSearch) return false;

      if (stockFilterTab === 'instock') return d.is_available;
      if (stockFilterTab === 'soldout') return !d.is_available;
      return true;
    });
  }, [menuItems, stockSearch, stockFilterTab]);

  const soldOutCount = menuItems.filter((m) => !m.is_available).length;
  const inStockCount = menuItems.filter((m) => m.is_available).length;

  const filteredOrders = useMemo(() => {
    if (!kdsSearch.trim()) return orders;
    const q = kdsSearch.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.order_token?.toLowerCase().includes(q) ||
        o.pickup_otp?.includes(q) ||
        o.order_items?.some((i) => i.item_name.toLowerCase().includes(q))
    );
  }, [orders, kdsSearch]);

  const pendingOrders = filteredOrders.filter((o) => o.status === 'CONFIRMED');
  const preparingOrders = filteredOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = filteredOrders.filter((o) => o.status === 'READY');
  const collectedOrders = filteredOrders.filter((o) => o.status === 'COLLECTED');

  const totalCollectedAmount = useMemo(() => {
    return collectedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  }, [collectedOrders]);

  const handleDirectRelease = async (orderId: string, orderToken: string) => {
    if (!window.confirm(`Directly release order ${orderToken} without OTP? (Ensure student is present at counter)`)) return;
    await handleUpdateStatus(orderId, 'COLLECTED');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F5F5F7] flex flex-col h-screen overflow-hidden select-none">
      {/* Tablet Autoplay Audio Unlock Warning Banner */}
      {!audioUnlocked && (
        <div
          onClick={unlockAudioContext}
          className="flex-none bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-600/30 border-b border-amber-500/40 px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-600/40 transition backdrop-blur-md z-50"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-amber-200">
            <span className="text-base animate-bounce">🔔</span>
            <span>
              <strong>Tablet Audio Chime Muted:</strong> Tap anywhere on screen or click here to enable automatic order READY chimes for kitchen staff.
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              unlockAudioContext();
            }}
            className="flex-none px-3.5 py-1 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs font-black rounded-lg transition shadow-md cursor-pointer"
          >
            Enable Sound
          </button>
        </div>
      )}

      {/* Top Staff & Kiosk Header */}
      <header className="flex-none bg-[#14141E]/95 backdrop-blur-xl border-b border-white/10 px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] flex items-center justify-center font-black text-xl text-black shadow-lg shadow-[#FF6B2C]/25 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            🍽
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white leading-tight">Cafe @7 KDS</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync
              </span>
            </div>
            <div className="text-[11px] font-semibold text-zinc-400 flex items-center gap-2 mt-0.5">
              <span>Sanjivani University</span>
              <span>•</span>
              <span className="font-mono text-white font-bold">{currentTime || '12:00:00 AM'}</span>
            </div>
          </div>
        </div>

        {/* Center: Shift Order Metrics Strip */}
        <div className="hidden xl:flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl p-1.5 px-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 px-2.5 py-1 rounded-xl bg-amber-500/10">
            <span>🔥</span>
            <span>{pendingOrders.length} New</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF8A3D] px-2.5 py-1 rounded-xl bg-[#FF8A3D]/10">
            <span>🍳</span>
            <span>{preparingOrders.length} Cooking</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-xl bg-emerald-500/10">
            <span>⚡</span>
            <span>{readyOrders.length} Ready</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 px-2.5 py-1 rounded-xl bg-white/5">
            <span>📦</span>
            <span>{collectedOrders.length} Done</span>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative max-w-[150px] sm:max-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search token / OTP..."
              value={kdsSearch}
              onChange={(e) => setKdsSearch(e.target.value)}
              className="w-full bg-[#1A1A26] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Kiosk Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Tablet Audio Autoplay Unlock Indicator/Button */}
          {!audioUnlocked && (
            <button
              onClick={unlockAudioContext}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition cursor-pointer flex items-center gap-1.5 animate-pulse"
              title="Tap to unblock kitchen audio chime on tablet Safari/Chrome"
            >
              <span>🔔 Enable Chime</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer border ${
              soundEnabled ? 'bg-white/10 text-white border-white/20' : 'bg-red-950/50 text-red-400 border-red-500/30'
            }`}
          >
            {soundEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-red-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
          </button>

          {/* Stock Manager */}
          <button
            onClick={() => setShowStockoutModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black text-xs font-black shadow-lg shadow-[#FF6B2C]/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>📦</span>
            <span className="hidden sm:inline">Stock Manager</span>
            {soldOutCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-black">
                {soldOutCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 overflow-hidden h-full">
        {/* COLUMN 1: INCOMING CONFIRMED */}
        <div className="flex flex-col bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-3 bg-gradient-to-r from-[#FF6B2C]/20 to-transparent border-b border-[#FF6B2C]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <span className="font-black text-xs text-[#FF8A3D] uppercase tracking-wider">
                1. Incoming Confirmed
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#FF6B2C] text-black text-xs font-black">
              {pendingOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
            {pendingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                  ✨
                </div>
                <div className="text-sm font-bold text-zinc-300">All Clear</div>
                <p className="text-xs text-zinc-500">No incoming orders waiting</p>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const urgency = getUrgencyBadge(order.created_at);
                const isCod = order.notes?.includes('COD');

                return (
                  <div
                    key={order.id}
                    className="bg-[#1C1C28] border border-white/15 hover:border-[#FF6B2C]/50 p-4 rounded-2xl shadow-lg space-y-3 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div>
                        <span className="font-black text-xl text-white tracking-tight">{order.order_token}</span>
                        <div className="text-[10px] text-zinc-400 font-bold mt-0.5">
                          {order.pickup_slots?.label || 'Next Break'}
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 text-xs text-zinc-200">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center font-bold">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-white/15 text-white font-black text-[11px]">
                              {item.quantity}x
                            </span>
                            <span>{item.item_name}</span>
                          </div>
                          <span className="text-zinc-400 font-mono text-[11px]">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    {/* High-Visibility COD Alert Box */}
                    {isCod && (
                      <div className="bg-amber-950/80 border-2 border-amber-500/80 rounded-xl p-2.5 text-amber-200 flex items-center justify-between shadow-lg shadow-amber-950/60">
                        <div className="flex items-center gap-1.5 text-xs font-black">
                          <span className="text-sm">💵</span>
                          <span>COLLECT CASH:</span>
                        </div>
                        <span className="font-mono text-sm font-black text-amber-300">
                          ₹{order.total_amount?.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {order.notes && !isCod && (
                      <div className="text-[11px] bg-black/40 text-[#FFB347] p-2 rounded-lg border border-[#FFB347]/20 font-medium">
                        Note: {order.notes}
                      </div>
                    )}

                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FF8A3D] hover:opacity-95 text-black font-black text-xs shadow-lg shadow-[#FF6B2C]/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Start Preparing</span>
                      <span>➔</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: ON STOVE / PREPARATION */}
        <div className="flex flex-col bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-3 bg-gradient-to-r from-[#FFB347]/20 to-transparent border-b border-[#FFB347]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🍳</span>
              <span className="font-black text-xs text-[#FFB347] uppercase tracking-wider">
                2. On Stove / Prep
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#FFB347] text-black text-xs font-black">
              {preparingOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
            {preparingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ChefExpressIllustration size={120} />
                <div className="text-sm font-black text-white">Stoves Are Free</div>
                <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed">
                  Tap <strong className="text-[#FF6B2C]">"Start Preparing ➔"</strong> on incoming tickets to queue cooking.
                </p>
              </div>
            ) : (
              preparingOrders.map((order) => {
                const urgency = getUrgencyBadge(order.created_at);
                const isCod = order.notes?.includes('COD');

                return (
                  <div
                    key={order.id}
                    className="bg-[#1C1C28] border-2 border-[#FFB347]/40 p-4 rounded-2xl shadow-lg space-y-3 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div>
                        <span className="font-black text-xl text-white tracking-tight">{order.order_token}</span>
                        <div className="text-[10px] text-amber-400 font-bold mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span>Active on Stove</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 text-xs text-zinc-200">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center font-bold">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-black text-[11px]">
                              {item.quantity}x
                            </span>
                            <span>{item.item_name}</span>
                          </div>
                          <span className="text-zinc-400 font-mono text-[11px]">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    {isCod && (
                      <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-2 text-amber-200 flex items-center justify-between text-xs font-bold">
                        <span>💵 Cash to collect:</span>
                        <span className="font-mono font-black text-amber-300">₹{order.total_amount?.toFixed(2)}</span>
                      </div>
                    )}

                    {order.notes && !isCod && (
                      <div className="text-[11px] bg-black/40 text-[#FFB347] p-2 rounded-lg border border-[#FFB347]/20 font-medium">
                        Note: {order.notes}
                      </div>
                    )}

                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00b894] hover:opacity-95 text-black font-black text-xs shadow-lg shadow-[#00D4AA]/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Mark Ready for Pickup</span>
                      <span>✓</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: READY AT COUNTER */}
        <div className="flex flex-col bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-3 bg-gradient-to-r from-[#00D4AA]/20 to-transparent border-b border-[#00D4AA]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <span className="font-black text-xs text-[#00D4AA] uppercase tracking-wider">
                3. Ready at Counter
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#00D4AA] text-black text-xs font-black">
              {readyOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
            {readyOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <CampusExpressIllustration size={120} />
                <div className="text-sm font-black text-white">Counter Clear</div>
                <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed">
                  All prepared trays have been collected by students.
                </p>
              </div>
            ) : (
              readyOrders.map((order) => {
                const isCod = order.notes?.includes('COD');

                return (
                  <div
                    key={order.id}
                    className="bg-[#1C1C28] border-2 border-[#00D4AA]/40 p-4 rounded-2xl shadow-lg space-y-3 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div>
                        <span className="font-black text-2xl text-[#00D4AA] tracking-tight">{order.order_token}</span>
                        <div className="text-[10px] text-zinc-400 font-bold mt-0.5">
                          Slot: {order.pickup_slots?.label || 'General'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-zinc-400 block font-bold uppercase tracking-wider">
                          Required OTP
                        </span>
                        <span className="font-mono text-base font-black text-white px-2.5 py-0.5 bg-black/60 rounded-lg border border-[#00D4AA]/30 tracking-widest">
                          {order.pickup_otp || '----'}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1 text-xs text-zinc-300">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="font-bold">{item.quantity}x {item.item_name}</span>
                          <span className="text-zinc-500 font-mono text-[11px]">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    {isCod && (
                      <div className="bg-amber-950/70 border border-amber-500/50 rounded-xl p-2 text-amber-200 flex items-center justify-between text-xs font-bold">
                        <span>💵 Collect Cash:</span>
                        <span className="font-mono font-black text-amber-300">₹{order.total_amount?.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setVerifyingOrder(order);
                          setEnteredOtp('');
                          setOtpError('');
                        }}
                        className="col-span-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00b894] hover:opacity-95 text-black font-black text-xs shadow-lg shadow-[#00D4AA]/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>🔐</span>
                        <span>Verify OTP & Release</span>
                      </button>

                      <button
                        onClick={() => handleDirectRelease(order.id, order.order_token)}
                        className="col-span-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white font-bold text-[11px] transition cursor-pointer"
                        title="Direct release if student phone died"
                      >
                        Direct ➔
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 4: COMPLETED & COLLECTED */}
        <div className="flex flex-col bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <span className="font-black text-xs text-zinc-400 uppercase tracking-wider">
                4. Completed
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 text-xs font-black">
              {collectedOrders.length}
            </span>
          </div>

          {/* Revenue and summary ticker */}
          <div className="px-3 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-[11px] text-zinc-400 font-bold">
            <span>Shift Revenue:</span>
            <span className="font-mono font-black text-emerald-400">₹{totalCollectedAmount.toFixed(0)}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 opacity-75 scrollbar-thin">
            {collectedOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <div className="text-sm font-bold">No completed orders yet</div>
              </div>
            ) : (
              collectedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#16161E] border border-white/5 p-3 rounded-xl flex items-center justify-between hover:opacity-100 transition"
                >
                  <div>
                    <span className="font-bold text-white text-sm">{order.order_token}</span>
                    <div className="text-[10px] text-zinc-400 font-medium">₹{order.total_amount}</div>
                  </div>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                    Collected ✓
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* 🔐 1-Tap OTP Verification Modal */}
      {verifyingOrder && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="glass-card-heavy rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#00D4AA]/40 bg-[#0F172A] relative">
            <button
              onClick={() => setVerifyingOrder(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <span className="text-4xl">🔐</span>
              <h3 className="text-xl font-black text-white mt-2">Counter Handover OTP</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Ask student for the 4-digit OTP shown on their screen for order{' '}
                <span className="font-mono text-[#FF6B2C] font-bold">{verifyingOrder.order_token}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-4">
              <input
                type="text"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value.replace(/\D/g, ''));
                  setOtpError('');
                }}
                placeholder="• • • •"
                className="w-full text-center tracking-[0.5em] text-3xl font-mono font-black py-3 rounded-2xl bg-black/50 border border-white/20 text-white focus:border-[#00D4AA] focus:outline-none"
                autoFocus
              />
              {otpError && (
                <div className="text-rose-400 text-xs font-semibold text-center mt-2 flex items-center justify-center gap-1">
                  <AlertCircle size={14} /> {otpError}
                </div>
              )}
            </div>

            {/* Touch-Friendly Numeric Keypad for Counter Tablets */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (enteredOtp.length < 4) {
                      setEnteredOtp((prev) => prev + num);
                      setOtpError('');
                    }
                  }}
                  className="py-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white font-mono text-xl font-bold transition cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setEnteredOtp('');
                  setOtpError('');
                }}
                className="py-3 rounded-xl bg-red-950/40 hover:bg-red-950/60 active:scale-95 border border-red-500/30 text-red-400 font-bold text-xs transition cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (enteredOtp.length < 4) {
                    setEnteredOtp((prev) => prev + '0');
                    setOtpError('');
                  }
                }}
                className="py-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white font-mono text-xl font-bold transition cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnteredOtp((prev) => prev.slice(0, -1));
                  setOtpError('');
                }}
                className="py-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-zinc-300 font-bold text-sm transition cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Quick Match Helper */}
            <div className="mb-5 flex justify-center">
              <button
                type="button"
                onClick={() => setEnteredOtp(verifyingOrder.pickup_otp || '')}
                className="text-xs text-zinc-400 hover:text-[#00D4AA] font-bold underline cursor-pointer"
              >
                Auto-fill student OTP ({verifyingOrder.pickup_otp || '----'})
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVerifyingOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isVerifyingOtp || enteredOtp.length !== 4}
                onClick={() => handleConfirmOtp(verifyingOrder.order_token, enteredOtp)}
                className="flex-1 py-2.5 rounded-xl bg-[#00D4AA] hover:bg-[#00b894] disabled:opacity-50 text-black text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isVerifyingOtp ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Handover ➔'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Stockout Manager Modal */}
      {showStockoutModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="glass-card-heavy rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-[#FF6B2C]/30 bg-[#0F172A]/95 border">
            {/* Modal Header */}
            <div className="flex-none p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>📦</span> Live Menu & Stockout Manager
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  1-tap stockout toggle • Instant price & dish details editor • Real-time student sync
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingDish(!isAddingDish)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                    isAddingDish
                      ? 'bg-zinc-800 text-white border border-white/15'
                      : 'bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black hover:scale-105 active:scale-95'
                  }`}
                >
                  <Plus size={14} />
                  <span>{isAddingDish ? 'Cancel' : 'Add Dish'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowStockoutModal(false);
                    setEditingDishId(null);
                    setIsAddingDish(false);
                  }}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Add New Dish Expandable Drawer */}
            {isAddingDish && (
              <div className="flex-none p-5 bg-[#16161E] border-b border-[#FF6B2C]/30 space-y-4 animate-in slide-in-from-top duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FF6B2C]/20 border border-[#FF6B2C]/40 flex items-center justify-center text-[#FF6B2C]">
                      <Plus size={16} />
                    </div>
                    <span className="text-sm font-black text-white">Create New Menu Item</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">Instantly available on campus student menu</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-zinc-400 mb-1">
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      value={newDishForm.name}
                      onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                      placeholder="e.g. Paneer Cheese Wrap"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-zinc-400 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={newDishForm.price}
                      onChange={(e) => setNewDishForm({ ...newDishForm, price: Number(e.target.value) })}
                      placeholder="50"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)] font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-zinc-400 mb-1">
                      Initial Stock Qty *
                    </label>
                    <input
                      type="number"
                      value={newDishForm.stock_quantity}
                      onChange={(e) => setNewDishForm({ ...newDishForm, stock_quantity: Math.max(0, Number(e.target.value)) })}
                      placeholder="30"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)] font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-zinc-400 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newDishForm.category}
                      onChange={(e) => setNewDishForm({ ...newDishForm, category: e.target.value })}
                      placeholder="e.g. Chef Specials"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-zinc-400 mb-1">
                      Tag / Badge
                    </label>
                    <input
                      type="text"
                      value={newDishForm.tag}
                      onChange={(e) => setNewDishForm({ ...newDishForm, tag: e.target.value })}
                      placeholder="e.g. Special Grab, Hot Grill"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-zinc-400 mb-1">
                      Prep Time (mins)
                    </label>
                    <input
                      type="number"
                      value={newDishForm.prep_time_mins}
                      onChange={(e) => setNewDishForm({ ...newDishForm, prep_time_mins: Number(e.target.value) })}
                      placeholder="5"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)] font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-end justify-end gap-2 pt-2">
                    <button
                      onClick={handleAddNewDish}
                      disabled={isSavingDish || !newDishForm.name.trim()}
                      className="py-2.5 px-6 rounded-xl bg-[#00D4AA] text-black font-black text-xs hover:bg-[#00D4AA]/90 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Check size={14} />
                      <span>{isSavingDish ? 'Adding...' : 'Save & Publish to Menu'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Filter Bar & Search */}
            <div className="flex-none p-4 border-b border-white/10 space-y-3 bg-black/30">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search dishes (e.g. 'Burger', 'Sandwich', 'Tea')..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)]"
                  />
                  {stockSearch && (
                    <button
                      onClick={() => setStockSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setStockFilterTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      stockFilterTab === 'all'
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    All ({menuItems.length})
                  </button>
                  <button
                    onClick={() => setStockFilterTab('instock')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      stockFilterTab === 'instock'
                        ? 'bg-[#00D4AA] text-black font-black'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    In Stock ({inStockCount})
                  </button>
                  <button
                    onClick={() => setStockFilterTab('soldout')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      stockFilterTab === 'soldout'
                        ? 'bg-red-500 text-white font-black'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sold Out ({soldOutCount})
                  </button>
                </div>
              </div>

              {/* 1-Tap Quick Bulk Controls */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleBulkKdsStock('ALL_IN_STOCK')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                    title="Mark ALL dishes in stock (30 units)"
                  >
                    <CheckCircle2 size={13} />
                    <span>All In Stock</span>
                  </button>

                  <button
                    onClick={() => handleBulkKdsStock('ALL_OUT_OF_STOCK')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                    title="Mark ALL dishes out of stock (0 units)"
                  >
                    <Ban size={13} />
                    <span>All Out of Stock</span>
                  </button>

                  <button
                    onClick={() => handleMorningPrepBatch(50)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                    title="Reset all dishes to 50 morning batch units"
                  >
                    <SunMedium size={13} />
                    <span>Morning Prep (50 Qty)</span>
                  </button>

                  {/* 💾 PRIMARY SAVE INVENTORY BUTTON */}
                  <button
                    onClick={handleSaveAllInventory}
                    disabled={isSavingAll}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00b894] hover:scale-105 active:scale-95 text-black font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#00D4AA]/25 disabled:opacity-50"
                    title="Persist all dish stock changes to memory, disk and database"
                  >
                    {isSavingAll ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Save size={13} />
                    )}
                    <span>{isSavingAll ? 'Saving...' : '💾 Save Inventory'}</span>
                  </button>

                  {/* 📥📤 CSV DOWNLOAD / UPLOAD CONTROLS */}
                  <button
                    onClick={() => window.open('/api/admin/inventory/csv?action=sample', '_blank')}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Download sample CSV template"
                  >
                    <Download size={12} />
                    <span>Sample CSV</span>
                  </button>

                  <button
                    onClick={() => window.open('/api/admin/inventory/csv?action=export', '_blank')}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Export current inventory as CSV"
                  >
                    <Download size={12} />
                    <span>Export CSV</span>
                  </button>

                  <label
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Upload CSV to import dishes"
                  >
                    <Upload size={12} />
                    <span>Upload CSV</span>
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const fd = new FormData();
                          fd.append('file', file);
                          const res = await fetch('/api/admin/inventory/csv', {
                            method: 'POST',
                            body: fd,
                          });
                          const json = await res.json();
                          if (json.success) {
                            setSaveSuccessMsg(
                              `Imported ${json.data.insertedCount} dishes! ${json.data.failedCount > 0 ? `(${json.data.failedCount} failed)` : ''}`
                            );
                            setTimeout(() => setSaveSuccessMsg(null), 5000);
                            // Refresh menu list
                            const supabase = createClient();
                            const { data: freshItems } = await supabase.from('menu_items').select('*').order('name');
                            if (freshItems) setMenuItems(freshItems);
                          } else {
                            alert('Upload failed: ' + (json.error?.message || 'Unknown error'));
                          }
                        } catch (err: any) {
                          alert('Upload error: ' + err.message);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>

                {saveSuccessMsg ? (
                  <span className="text-emerald-400 font-black text-xs animate-bounce">
                    ✅ {saveSuccessMsg}
                  </span>
                ) : soldOutCount > 0 ? (
                  <span className="text-red-400 font-bold text-xs">
                    ⚠️ {soldOutCount} dish{soldOutCount > 1 ? 'es' : ''} SOLD OUT
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold text-xs">
                    ✨ All dishes in stock
                  </span>
                )}
              </div>
            </div>

            {/* Dish List with Inline Editors & Stock Qty Steppers */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
              {filteredStockDishes.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No dishes found matching &quot;{stockSearch}&quot;.
                </div>
              ) : (
                filteredStockDishes.map((dish) => {
                  const isToggling = togglingIds.has(dish.id);
                  const isEditing = editingDishId === dish.id;
                  const currentStock = dish.stock_quantity ?? dish.stockQuantity ?? 30;

                  return (
                    <div
                      key={dish.id}
                      className={`p-3.5 rounded-2xl flex flex-col gap-3 border transition ${
                        dish.is_available
                          ? 'bg-[#16161E] border-white/5 hover:border-white/15'
                          : 'bg-red-950/20 border-red-500/20'
                      }`}
                    >
                      {/* Main Dish Row */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Dish Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-extrabold text-sm ${
                                dish.is_available ? 'text-white' : 'text-zinc-500 line-through'
                              }`}
                            >
                              {dish.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-[10px] font-bold border border-white/5">
                              {dish.tag || dish.category || 'Standard'}
                            </span>
                            {dish.prep_time_mins && (
                              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-0.5">
                                <Clock size={10} />
                                {dish.prep_time_mins}m
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls: Quick Price Stepper, Stock Qty Stepper, Edit Button, Stock Toggle */}
                        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                          {/* Quick Price Adjust Stepper */}
                          <div className="flex items-center bg-black/60 rounded-xl border border-white/10 px-1 py-0.5 shadow-inner">
                            <button
                              onClick={() => handleQuickPriceChange(dish.id, -5)}
                              className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-xs font-black transition cursor-pointer"
                              title="Decrease price by ₹5"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-black text-xs text-[#00D4AA]">
                              ₹{dish.price}
                            </span>
                            <button
                              onClick={() => handleQuickPriceChange(dish.id, 5)}
                              className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-xs font-black transition cursor-pointer"
                              title="Increase price by ₹5"
                            >
                              +
                            </button>
                          </div>

                          {/* Quick Stock Quantity Stepper */}
                          <div className="flex items-center bg-black/60 rounded-xl border border-white/10 px-1 py-0.5 shadow-inner">
                            <button
                              onClick={() => handleQuickStockChange(dish.id, -5)}
                              className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-xs font-black transition cursor-pointer"
                              title="Decrease stock by 5 portions"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleQuickStockChange(dish.id, -1)}
                              className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-[11px] font-black transition cursor-pointer"
                              title="Decrease stock by 1 portion"
                            >
                              -1
                            </button>
                            <span
                              className={`px-2 font-mono font-black text-xs flex items-center gap-1 ${
                                currentStock === 0
                                  ? 'text-red-400'
                                  : currentStock <= 10
                                  ? 'text-amber-300'
                                  : 'text-emerald-400'
                              }`}
                              title="Live available portions in kitchen"
                            >
                              <span>📦</span>
                              <span>{currentStock} left</span>
                            </span>
                            <button
                              onClick={() => handleQuickStockChange(dish.id, 1)}
                              className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-[11px] font-black transition cursor-pointer"
                              title="Add 1 fresh portion"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleQuickStockChange(dish.id, 5)}
                              className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-xs font-black transition cursor-pointer"
                              title="Add 5 fresh portions"
                            >
                              +5
                            </button>
                          </div>

                          {/* Edit Details Button */}
                          <button
                            onClick={() => (isEditing ? setEditingDishId(null) : handleStartEdit(dish))}
                            className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 border ${
                              isEditing
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                            title="Edit dish name, price & stock quantity"
                          >
                            <Edit3 size={13} />
                            <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
                          </button>

                          {/* Stock Toggle Button */}
                          <button
                            onClick={() => handleToggleStock(dish.id, dish.is_available)}
                            disabled={isToggling}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 select-none ${
                              dish.is_available
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:bg-red-950/80 hover:text-red-300 hover:border-red-500/50'
                                : 'bg-red-950/80 text-red-300 border border-red-500/50 hover:bg-emerald-950/60 hover:text-emerald-400 hover:border-emerald-500/30'
                            }`}
                          >
                            {isToggling ? (
                              <span>Updating...</span>
                            ) : dish.is_available ? (
                              <>
                                <CheckCircle2 size={13} className="text-emerald-400" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle size={13} className="text-red-400" />
                                <span>SOLD OUT</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Inline Edit Form Container */}
                      {isEditing && (
                        <div className="pt-3 border-t border-white/10 bg-black/40 -mx-3.5 -mb-3.5 p-3.5 rounded-b-2xl space-y-3 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                              <Edit3 size={12} />
                              Editing Dish Details & Stock Quantity
                            </span>
                            <span className="text-[10px] text-zinc-500">Auto-saves to database & student menu</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">
                                Dish Title
                              </label>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">
                                Price (₹)
                              </label>
                              <input
                                type="number"
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">
                                Available Stock Qty (Portions)
                              </label>
                              <input
                                type="number"
                                value={editForm.stock_quantity}
                                onChange={(e) => setEditForm({ ...editForm, stock_quantity: Math.max(0, Number(e.target.value)) })}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">
                                Prep Time (mins)
                              </label>
                              <input
                                type="number"
                                value={editForm.prep_time_mins}
                                onChange={(e) => setEditForm({ ...editForm, prep_time_mins: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">
                                Tag / Badge
                              </label>
                              <input
                                type="text"
                                value={editForm.tag}
                                onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">
                                Category
                              </label>
                              <input
                                type="text"
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingDishId(null)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold transition cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(dish.id)}
                              disabled={isSavingDish}
                              className="px-4 py-1.5 rounded-lg bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-black text-xs font-black transition cursor-pointer flex items-center gap-1 shadow"
                            >
                              <Save size={12} />
                              <span>{isSavingDish ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex-none p-4 border-t border-white/10 bg-black/40 rounded-b-3xl flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-zinc-400">
                {saveSuccessMsg ? (
                  <span className="text-emerald-400 font-bold">✅ {saveSuccessMsg}</span>
                ) : (
                  'Changes take effect in real-time across all student menus.'
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAllInventory}
                  disabled={isSavingAll}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00b894] hover:scale-105 active:scale-95 text-black font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#00D4AA]/25 disabled:opacity-50"
                >
                  {isSavingAll ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{isSavingAll ? 'Saving...' : 'Save & Apply to Campus'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowStockoutModal(false);
                    setEditingDishId(null);
                    setIsAddingDish(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-black text-xs hover:bg-zinc-200 transition cursor-pointer active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
