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
import { VoiceAnnouncer, AnnouncementLanguage } from '@/lib/voice-announcer';

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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [announcementLang, setAnnouncementLang] = useState<AnnouncementLanguage>('mr');
  const [loading, setLoading] = useState(true);
  const [stockSearch, setStockSearch] = useState('');
  const [stockFilterTab, setStockFilterTab] = useState<'all' | 'instock' | 'soldout'>('all');
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  // KDS Audio Chime & Speech Suite
  const { playKitchenReadyChime, playPop, playClick, unlockAudio } = useSoundFX();
  const readyChimePlayedTokensRef = React.useRef<Set<string>>(new Set());
  const isInitialLoadRef = React.useRef<boolean>(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    VoiceAnnouncer.init();
  }, []);

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

    // Natural multilingual spoken announcement
    if (orderToken && voiceEnabled) {
      setTimeout(() => {
        VoiceAnnouncer.announceOrderReady(orderToken, { lang: announcementLang });
      }, 750);
    }
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

  // 3-Window Mobile & KDS Navigation
  const [mobileWindow, setMobileWindow] = useState<'pending' | 'making' | 'done'>('pending');
  const [doneSubTab, setDoneSubTab] = useState<'ready' | 'collected'>('ready');

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
      const [kdsOrdersRes, menuApiRes] = await Promise.all([
        fetch('/api/kds/orders').then((r) => r.json()).catch(() => null),
        fetch('/api/menu').then((r) => r.json()).catch(() => null)
      ]);

      let incomingOrders: any[] = [];
      if (kdsOrdersRes?.success && Array.isArray(kdsOrdersRes.data)) {
        incomingOrders = kdsOrdersRes.data;
      } else {
        const supabase = createClient();
        const ordersRes = await supabase
          .from('orders')
          .select('*, order_items (*), pickup_slots (*)')
          .in('status', ['CONFIRMED', 'PREPARING', 'READY', 'COLLECTED'])
          .order('created_at', { ascending: false })
          .limit(60);
        if (ordersRes.data) incomingOrders = ordersRes.data;
      }

      if (incomingOrders && incomingOrders.length > 0) {
        if (isInitialLoadRef.current) {
          // On first load, seed deduplication set with existing READY orders to prevent startup chime blast
          incomingOrders.forEach((o: any) => {
            if (o.status === 'READY') {
              readyChimePlayedTokensRef.current.add(o.order_token || o.id);
            }
          });
          isInitialLoadRef.current = false;
        } else {
          // On background polling/refresh, check for newly transitioned READY orders
          incomingOrders.forEach((o: any) => {
            const token = o.order_token || o.id;
            if (o.status === 'READY' && !readyChimePlayedTokensRef.current.has(token)) {
              triggerReadyChime(token);
            }
          });
        }
        setOrders(incomingOrders);
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
        const supabase = createClient();
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
    }, 3000);

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
    // 1. Optimistic UI update for instantaneous chef touch responsiveness
    const prevOrders = [...orders];
    setOrders((prev) => prev.map((o) => (o.id === orderId || o.order_token === orderId ? { ...o, status: newStatus } : o)));

    try {
      const targetOrder = orders.find((o) => o.id === orderId || o.order_token === orderId);
      if (newStatus === 'READY' && targetOrder) {
        triggerReadyChime(targetOrder.order_token);
      }

      // 2. Network API dispatch with fallback identifier
      const idToSend = targetOrder?.id || orderId;
      const res = await fetch(`/api/kds/orders/${encodeURIComponent(idToSend)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Fallback: update directly via Supabase client if API route fails
        const supabase = createClient();
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .or(`id.eq.${idToSend},order_token.eq.${idToSend}`);
      }
    } catch (err) {
      console.warn('Network update failed, attempting direct database fallback:', err);
      try {
        const supabase = createClient();
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .or(`id.eq.${orderId},order_token.eq.${orderId}`);
      } catch (fallbackErr) {
        console.error('All update paths failed:', fallbackErr);
        // Revert on total failure
        setOrders(prevOrders);
      }
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

  const pendingOrders = filteredOrders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PENDING');
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
    <div className="min-h-screen bg-(--bg-canvas) text-(--text-primary) flex flex-col h-screen overflow-hidden select-none transition-colors duration-300">
      {/* Compact Autoplay Audio Unlock Warning Banner */}
      {!audioUnlocked && (
        <div
          onClick={unlockAudioContext}
          className="flex-none bg-linear-to-r from-amber-600/30 via-orange-600/30 to-amber-600/30 border-b border-amber-500/40 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 cursor-pointer hover:bg-amber-600/40 transition backdrop-blur-md z-50"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-200 truncate">
            <span className="text-base animate-bounce shrink-0">🔔</span>
            <span className="truncate">
              <strong>Tablet Audio Muted:</strong> Tap to enable kitchen order chimes.
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              unlockAudioContext();
            }}
            className="flex-none px-3 py-1 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black text-xs font-black rounded-lg transition shadow-md cursor-pointer"
          >
            Enable Sound
          </button>
        </div>
      )}

      {/* Top Staff & Kiosk Header */}
      <header className="flex-none bg-(--bg-card)/95 backdrop-blur-xl border-b border-(--border-glass) px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 flex-wrap transition-colors duration-300">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-accent-orange to-accent-amber flex items-center justify-center font-black text-lg sm:text-xl text-black shadow-lg shadow-accent-orange/25 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
          >
            🍽️
          </Link>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-xl font-black text-(--text-primary) leading-tight">Cafe @7 KDS</h1>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-(--text-secondary) flex items-center gap-1.5 sm:gap-2 mt-0.5">
              <span className="hidden sm:inline">Sanjivani University</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-mono text-(--text-primary) font-bold">{currentTime || '12:00:00 AM'}</span>
            </div>
          </div>
        </div>

        {/* Center: Shift Order Metrics Strip (visible on large screens) */}
        <div className="hidden xl:flex items-center gap-2 bg-black/20 dark:bg-black/40 border border-(--border-glass) rounded-2xl p-1.5 px-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 px-2.5 py-1 rounded-xl bg-amber-500/10">
            <span>⏳</span>
            <span>{pendingOrders.length} Pending</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-accent-orange px-2.5 py-1 rounded-xl bg-accent-orange/10">
            <span>🍳</span>
            <span>{preparingOrders.length} Making</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-accent-teal px-2.5 py-1 rounded-xl bg-accent-teal/10">
            <span>✅</span>
            <span>{readyOrders.length} Ready</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-(--text-secondary) px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5">
            <span>📦</span>
            <span>{collectedOrders.length} Done</span>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search */}
          <div className="relative w-28 sm:w-44">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              placeholder="Search..."
              value={kdsSearch}
              onChange={(e) => setKdsSearch(e.target.value)}
              className="w-full bg-(--bg-canvas) border border-(--border-glass) rounded-xl pl-7 pr-2.5 py-1.5 text-xs text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-accent-orange transition-colors"
            />
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-(--border-glass) flex items-center justify-center text-(--text-secondary) hover:text-(--text-primary) transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Kiosk Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer border ${
              soundEnabled ? 'bg-black/5 dark:bg-white/10 text-(--text-primary) border-(--border-glass)' : 'bg-red-950/30 text-red-400 border-red-500/30'
            }`}
            title={soundEnabled ? 'Mute Kitchen Audio' : 'Unmute Kitchen Audio'}
          >
            {soundEnabled ? <Volume2 size={14} className="text-accent-teal" /> : <VolumeX size={14} className="text-red-400" />}
            <span className="hidden md:inline">{soundEnabled ? 'Sound' : 'Muted'}</span>
          </button>

          {/* Multilingual Voice Announcer Toggle */}
          <button
            onClick={() => {
              const langCycle: Record<AnnouncementLanguage, AnnouncementLanguage> = {
                mr: 'hi',
                hi: 'en',
                en: 'mr',
              };
              const next = langCycle[announcementLang];
              setAnnouncementLang(next);
              VoiceAnnouncer.announceOrderReady('FL-DEMO', { lang: next });
            }}
            className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs font-black flex items-center gap-1 sm:gap-1.5 transition cursor-pointer border bg-black/5 dark:bg-white/10 text-(--text-primary) border-(--border-glass) hover:bg-black/10 dark:hover:bg-white/15"
            title="Cycle Kitchen Voice Language (मराठी -> हिन्दी -> English)"
          >
            <span>🗣️</span>
            <span className="text-accent-amber font-bold text-[11px] sm:text-xs">
              {announcementLang === 'mr' ? 'मराठी' : announcementLang === 'hi' ? 'हिन्दी' : 'ENG'}
            </span>
          </button>

          {/* Stock Manager */}
          <button
            onClick={() => setShowStockoutModal(true)}
            className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-black text-xs font-black shadow-lg shadow-accent-orange/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>📦</span>
            <span className="hidden sm:inline">Stock</span>
            {soldOutCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-white text-[10px] font-black">
                {soldOutCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile 3-Window Segmented Control (Pinned on Mobile screens < lg) */}
      <div className="flex-none flex items-center gap-1.5 p-2 bg-(--bg-card) border-b border-(--border-glass) lg:hidden">
        <button
          type="button"
          onClick={() => {
            playClick();
            setMobileWindow('pending');
          }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileWindow === 'pending'
              ? 'bg-linear-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 scale-102'
              : 'text-(--text-secondary) hover:text-(--text-primary) bg-black/5 dark:bg-white/5'
          }`}
        >
          <span>⏳ Pending</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
            mobileWindow === 'pending' ? 'bg-black/25 text-black' : 'bg-black/10 dark:bg-white/15 text-(--text-primary)'
          }`}>
            {pendingOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClick();
            setMobileWindow('making');
          }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileWindow === 'making'
              ? 'bg-linear-to-r from-accent-orange to-accent-amber text-black shadow-lg shadow-accent-orange/25 scale-102'
              : 'text-(--text-secondary) hover:text-(--text-primary) bg-black/5 dark:bg-white/5'
          }`}
        >
          <span>🍳 Making</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
            mobileWindow === 'making' ? 'bg-black/25 text-black' : 'bg-black/10 dark:bg-white/15 text-(--text-primary)'
          }`}>
            {preparingOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClick();
            setMobileWindow('done');
          }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileWindow === 'done'
              ? 'bg-linear-to-r from-accent-teal to-emerald-400 text-black shadow-lg shadow-accent-teal/25 scale-102'
              : 'text-(--text-secondary) hover:text-(--text-primary) bg-black/5 dark:bg-white/5'
          }`}
        >
          <span>✅ Done</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
            mobileWindow === 'done' ? 'bg-black/25 text-black' : 'bg-black/10 dark:bg-white/15 text-(--text-primary)'
          }`}>
            {readyOrders.length}
          </span>
        </button>
      </div>

      {/* 3-Window Board Layout (1 full window on Mobile, 3 columns on Desktop) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 p-2 sm:p-4 overflow-hidden h-full">
        {/* ========================================================= */}
        {/* WINDOW 1: ⏳ PENDING (Incoming Orders)                     */}
        {/* ========================================================= */}
        <div className={`flex-col bg-(--bg-card) rounded-2xl border border-(--border-glass) overflow-hidden shadow-xl transition-all duration-300 ${
          mobileWindow === 'pending' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="p-3 bg-linear-to-r from-amber-500/20 to-transparent border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">⏳</span>
              <span className="font-black text-xs text-amber-500 uppercase tracking-wider">
                1. Pending Orders
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-xs font-black shadow-sm">
              {pendingOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
            {pendingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-(--border-glass) flex items-center justify-center text-xl">
                  ✨
                </div>
                <div className="text-sm font-bold text-(--text-primary)">All Clear</div>
                <p className="text-xs text-(--text-muted)">No pending incoming orders waiting</p>
              </div>
            ) : (
              pendingOrders.map((order) => {
                const urgency = getUrgencyBadge(order.created_at);

                return (
                  <div
                    key={order.id}
                    className="bg-(--bg-glass-heavy) border border-(--border-glass) hover:border-amber-500/50 p-4 rounded-2xl shadow-lg space-y-3 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between border-b border-(--border-glass) pb-2.5">
                      <div>
                        <span className="font-black text-xl text-(--text-primary) tracking-tight">{order.order_token}</span>
                        <div className="text-[10px] text-(--text-secondary) font-bold mt-0.5">
                          {order.pickup_slots?.label || 'Next Break'}
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 text-xs text-(--text-primary)">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center font-bold">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/15 text-(--text-primary) font-black text-[11px]">
                              {item.quantity}x
                            </span>
                            <span>{item.item_name}</span>
                          </div>
                          <span className="text-(--text-muted) font-mono text-[11px]">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    {/* Paid Online UPI Badge */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2 text-emerald-600 dark:text-emerald-300 flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">⚡</span>
                        <span>PAID ONLINE (UPI)</span>
                      </div>
                      <span className="font-mono text-xs font-black text-emerald-500 dark:text-emerald-400">
                        ₹{order.total_amount?.toFixed(2)}
                      </span>
                    </div>

                    {order.notes && (
                      <div className="text-[11px] bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20 font-medium">
                        Note: {order.notes}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        playClick();
                        handleUpdateStatus(order.id, 'PREPARING');
                      }}
                      className="w-full py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:opacity-95 active:scale-98 text-black font-black text-xs shadow-lg shadow-amber-500/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Start Making</span>
                      <span>➔</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* WINDOW 2: 🍳 MAKING (On Stove / In Preparation)           */}
        {/* ========================================================= */}
        <div className={`flex-col bg-(--bg-card) rounded-2xl border border-(--border-glass) overflow-hidden shadow-xl transition-all duration-300 ${
          mobileWindow === 'making' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="p-3 bg-linear-to-r from-accent-orange/20 to-transparent border-b border-accent-orange/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🍳</span>
              <span className="font-black text-xs text-accent-orange uppercase tracking-wider">
                2. Making / On Stove
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-accent-orange text-black text-xs font-black shadow-sm">
              {preparingOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
            {preparingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ChefExpressIllustration size={120} />
                <div className="text-sm font-black text-(--text-primary)">Stoves Are Free</div>
                <p className="text-xs text-(--text-secondary) max-w-50 leading-relaxed">
                  Tap <strong className="text-accent-orange">"Start Making ➔"</strong> on pending tickets to queue cooking.
                </p>
              </div>
            ) : (
              preparingOrders.map((order) => {
                const urgency = getUrgencyBadge(order.created_at);

                return (
                  <div
                    key={order.id}
                    className="bg-(--bg-glass-heavy) border-2 border-accent-orange/40 p-4 rounded-2xl shadow-lg space-y-3 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between border-b border-(--border-glass) pb-2.5">
                      <div>
                        <span className="font-black text-xl text-(--text-primary) tracking-tight">{order.order_token}</span>
                        <div className="text-[10px] text-accent-orange font-bold mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" />
                          <span>Active on Stove</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 text-xs text-(--text-primary)">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center font-bold">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-accent-orange/20 text-accent-orange font-black text-[11px]">
                              {item.quantity}x
                            </span>
                            <span>{item.item_name}</span>
                          </div>
                          <span className="text-(--text-muted) font-mono text-[11px]">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="text-[11px] bg-accent-orange/10 text-accent-orange p-2 rounded-lg border border-accent-orange/20 font-medium">
                        Note: {order.notes}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        playClick();
                        handleUpdateStatus(order.id, 'READY');
                      }}
                      className="w-full py-3 rounded-xl bg-linear-to-r from-accent-teal to-emerald-500 hover:opacity-95 active:scale-98 text-black font-black text-xs shadow-lg shadow-accent-teal/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Mark as Done (Ready)</span>
                      <span>✓</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* WINDOW 3: ✅ DONE (Ready at Counter + Shift Completed)    */}
        {/* ========================================================= */}
        <div className={`flex-col bg-(--bg-card) rounded-2xl border border-(--border-glass) overflow-hidden shadow-xl transition-all duration-300 ${
          mobileWindow === 'done' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Header with Sub-tabs for Ready vs Completed History */}
          <div className="p-3 bg-linear-to-r from-accent-teal/20 to-transparent border-b border-accent-teal/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">✅</span>
              <span className="font-black text-xs text-accent-teal uppercase tracking-wider">
                3. Done
              </span>
            </div>

            {/* Sub-Tab Selector */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-black/40 p-1 rounded-xl border border-(--border-glass)">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setDoneSubTab('ready');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  doneSubTab === 'ready'
                    ? 'bg-accent-teal text-black shadow-sm'
                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                }`}
              >
                <span>Ready</span>
                <span className={`px-1 py-0.2 text-[10px] rounded-full font-black ${
                  doneSubTab === 'ready' ? 'bg-black/20 text-black' : 'bg-black/10 dark:bg-white/10'
                }`}>
                  {readyOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setDoneSubTab('collected');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  doneSubTab === 'collected'
                    ? 'bg-accent-orange text-black shadow-sm'
                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                }`}
              >
                <span>History</span>
                <span className={`px-1 py-0.2 text-[10px] rounded-full font-black ${
                  doneSubTab === 'collected' ? 'bg-black/20 text-black' : 'bg-black/10 dark:bg-white/10'
                }`}>
                  {collectedOrders.length}
                </span>
              </button>
            </div>
          </div>

          {/* Subtab Content: Ready for Pickup */}
          {doneSubTab === 'ready' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {readyOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <CampusExpressIllustration size={120} />
                  <div className="text-sm font-black text-(--text-primary)">Counter Clear</div>
                  <p className="text-xs text-(--text-secondary) max-w-50 leading-relaxed">
                    All ready food trays have been collected by students.
                  </p>
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-(--bg-glass-heavy) border-2 border-accent-teal/40 p-4 rounded-2xl shadow-lg space-y-3 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between border-b border-(--border-glass) pb-2.5">
                      <div>
                        <span className="font-black text-2xl text-accent-teal tracking-tight">{order.order_token}</span>
                        <div className="text-[10px] text-(--text-secondary) font-bold mt-0.5">
                          Slot: {order.pickup_slots?.label || 'General'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-(--text-muted) block font-bold uppercase tracking-wider">
                          Required OTP
                        </span>
                        <span className="font-mono text-base font-black text-(--text-primary) px-2.5 py-0.5 bg-black/10 dark:bg-black/60 rounded-lg border border-accent-teal/30 tracking-widest">
                          {order.pickup_otp || '----'}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1 text-xs text-(--text-secondary)">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="font-bold text-(--text-primary)">{item.quantity}x {item.item_name}</span>
                          <span className="text-(--text-muted) font-mono text-[11px]">₹{item.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setVerifyingOrder(order);
                          setEnteredOtp('');
                          setOtpError('');
                        }}
                        className="col-span-2 py-2.5 rounded-xl bg-linear-to-r from-accent-teal to-emerald-500 hover:opacity-95 active:scale-98 text-black font-black text-xs shadow-lg shadow-accent-teal/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>🔐</span>
                        <span>Verify OTP & Release</span>
                      </button>

                      <button
                        onClick={() => handleDirectRelease(order.id, order.order_token)}
                        className="col-span-1 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-98 border border-(--border-glass) text-(--text-secondary) hover:text-(--text-primary) font-bold text-[11px] transition cursor-pointer"
                        title="Direct release if student phone died"
                      >
                        Direct ➔
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Subtab Content: Shift History / Collected Orders */}
          {doneSubTab === 'collected' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Revenue and summary ticker */}
              <div className="px-3 py-2.5 bg-black/10 dark:bg-black/40 border-b border-(--border-glass) flex items-center justify-between text-xs font-bold">
                <span className="text-(--text-secondary)">Total Shift Revenue:</span>
                <span className="font-mono font-black text-emerald-500 dark:text-emerald-400 text-sm">
                  ₹{totalCollectedAmount.toFixed(0)}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
                {collectedOrders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-(--text-muted)">
                    <div className="text-sm font-bold">No completed orders yet</div>
                    <p className="text-xs text-(--text-secondary) mt-1">Orders verified with OTP will appear here.</p>
                  </div>
                ) : (
                  collectedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-(--bg-glass-heavy) border border-(--border-glass) p-3 rounded-xl flex items-center justify-between hover:opacity-100 transition"
                    >
                      <div>
                        <span className="font-bold text-(--text-primary) text-sm">{order.order_token}</span>
                        <div className="text-[10px] text-(--text-muted) font-medium">₹{order.total_amount}</div>
                      </div>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400">
                        Collected ✓
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 🔐 1-Tap OTP Verification Modal */}
      {verifyingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl max-w-md w-full p-6 shadow-2xl border border-accent-teal/40 bg-(--bg-card) text-(--text-primary) relative transition-colors duration-300">
            <button
              onClick={() => setVerifyingOrder(null)}
              className="absolute top-4 right-4 text-(--text-muted) hover:text-(--text-primary) p-2 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <span className="text-4xl">🔐</span>
              <h3 className="text-xl font-black text-(--text-primary) mt-2">Counter Handover OTP</h3>
              <p className="text-xs text-(--text-secondary) mt-1">
                Ask student for the 4-digit OTP shown on their screen for order{' '}
                <span className="font-mono text-accent-orange font-bold">{verifyingOrder.order_token}</span>
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
                className="w-full text-center tracking-[0.5em] text-3xl font-mono font-black py-3 rounded-2xl bg-black/10 dark:bg-black/50 border border-(--border-glass) text-(--text-primary) focus:border-accent-teal focus:outline-none"
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
                  className="py-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-(--border-glass) text-(--text-primary) font-mono text-xl font-bold transition cursor-pointer"
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
                className="py-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-(--border-glass) text-(--text-primary) font-mono text-xl font-bold transition cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnteredOtp((prev) => prev.slice(0, -1));
                  setOtpError('');
                }}
                className="py-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-(--border-glass) text-(--text-secondary) font-bold text-sm transition cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Quick Match Helper */}
            <div className="mb-5 flex justify-center">
              <button
                type="button"
                onClick={() => setEnteredOtp(verifyingOrder.pickup_otp || '')}
                className="text-xs text-(--text-muted) hover:text-accent-teal font-bold underline cursor-pointer"
              >
                Auto-fill student OTP ({verifyingOrder.pickup_otp || '----'})
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVerifyingOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-(--border-glass) text-(--text-muted) hover:text-(--text-primary) text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isVerifyingOtp || enteredOtp.length !== 4}
                onClick={() => handleConfirmOtp(verifyingOrder.order_token, enteredOtp)}
                className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-accent-teal to-emerald-500 hover:opacity-95 disabled:opacity-50 text-black text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isVerifyingOtp ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Handover ➔'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Stockout Manager Modal */}
      {showStockoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-accent-orange/30 bg-(--bg-card) text-(--text-primary) transition-colors duration-300">
            {/* Modal Header */}
            <div className="flex-none p-5 sm:p-6 border-b border-(--border-glass) flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-(--text-primary) flex items-center gap-2">
                  <span>📦</span> Live Menu & Stockout Manager
                </h3>
                <p className="text-xs text-(--text-secondary) mt-1">
                  1-tap stockout toggle • Instant price & dish details editor • Real-time student sync
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingDish(!isAddingDish)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                    isAddingDish
                      ? 'bg-zinc-800 text-white border border-(--border-glass)'
                      : 'bg-linear-to-r from-accent-orange to-accent-amber text-black hover:scale-105 active:scale-95'
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
                  className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-(--text-muted) hover:text-(--text-primary) flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Add New Dish Expandable Drawer */}
            {isAddingDish && (
              <div className="flex-none p-5 bg-(--bg-canvas) border-b border-accent-orange/30 space-y-4 animate-in slide-in-from-top duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-orange/20 border border-accent-orange/40 flex items-center justify-center text-accent-orange">
                      <Plus size={16} />
                    </div>
                    <span className="text-sm font-black text-(--text-primary)">Create New Menu Item</span>
                  </div>
                  <span className="text-[11px] text-(--text-muted)">Instantly available on campus student menu</span>
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
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-orange)"
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
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-orange) font-mono font-bold"
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
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-orange) font-mono font-bold"
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
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-orange)"
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
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-orange)"
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
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-orange) font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-end justify-end gap-2 pt-2">
                    <button
                      onClick={handleAddNewDish}
                      disabled={isSavingDish || !newDishForm.name.trim()}
                      className="py-2.5 px-6 rounded-xl bg-accent-teal text-black font-black text-xs hover:bg-accent-teal/90 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Check size={14} />
                      <span>{isSavingDish ? 'Adding...' : 'Save & Publish to Menu'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Filter Bar & Search */}
            <div className="flex-none p-4 border-b border-(--border-glass) space-y-3 bg-black/10 dark:bg-black/30">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="Search dishes (e.g. 'Burger', 'Sandwich', 'Tea')..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/10 dark:bg-black/50 border border-(--border-glass) text-xs text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-accent-orange"
                  />
                  {stockSearch && (
                    <button
                      onClick={() => setStockSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-(--text-muted) hover:text-(--text-primary)"
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
                        ? 'bg-(--text-primary) text-(--text-inverse)'
                        : 'bg-black/5 dark:bg-white/5 text-(--text-muted) hover:text-(--text-primary)'
                    }`}
                  >
                    All ({menuItems.length})
                  </button>
                  <button
                    onClick={() => setStockFilterTab('instock')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      stockFilterTab === 'instock'
                        ? 'bg-accent-teal text-black font-black'
                        : 'bg-black/5 dark:bg-white/5 text-(--text-muted) hover:text-(--text-primary)'
                    }`}
                  >
                    In Stock ({inStockCount})
                  </button>
                  <button
                    onClick={() => setStockFilterTab('soldout')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      stockFilterTab === 'soldout'
                        ? 'bg-red-500 text-white font-black'
                        : 'bg-black/5 dark:bg-white/5 text-(--text-muted) hover:text-(--text-primary)'
                    }`}
                  >
                    Sold Out ({soldOutCount})
                  </button>
                </div>
              </div>

              {/* 1-Tap Quick Bulk Controls */}
              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-(--border-glass)">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleBulkKdsStock('ALL_IN_STOCK')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-500 dark:text-emerald-400 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                    title="Mark ALL dishes in stock (30 units)"
                  >
                    <CheckCircle2 size={13} />
                    <span>All In Stock</span>
                  </button>

                  <button
                    onClick={() => handleBulkKdsStock('ALL_OUT_OF_STOCK')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-500 dark:text-rose-400 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                    title="Mark ALL dishes out of stock (0 units)"
                  >
                    <Ban size={13} />
                    <span>All Out of Stock</span>
                  </button>

                  <button
                    onClick={() => handleMorningPrepBatch(50)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-500 dark:text-amber-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                    title="Reset all dishes to 50 morning batch units"
                  >
                    <SunMedium size={13} />
                    <span>Morning Prep (50 Qty)</span>
                  </button>

                  {/* 💾 PRIMARY SAVE INVENTORY BUTTON */}
                  <button
                    onClick={handleSaveAllInventory}
                    disabled={isSavingAll}
                    className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-accent-teal to-emerald-500 hover:scale-105 active:scale-95 text-black font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accent-teal/25 disabled:opacity-50"
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
                          ? 'bg-(--bg-glass-heavy) border-(--border-glass) hover:border-accent-orange/30'
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
                                dish.is_available ? 'text-(--text-primary)' : 'text-(--text-muted) line-through'
                              }`}
                            >
                              {dish.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-(--text-secondary) text-[10px] font-bold border border-(--border-glass)">
                              {dish.tag || dish.category || 'Standard'}
                            </span>
                            {dish.prep_time_mins && (
                              <span className="text-[10px] text-(--text-muted) font-mono flex items-center gap-0.5">
                                <Clock size={10} />
                                {dish.prep_time_mins}m
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls: Quick Price Stepper, Stock Qty Stepper, Edit Button, Stock Toggle */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          {/* Quick Price Adjust Stepper */}
                          <div className="flex items-center bg-black/10 dark:bg-black/60 rounded-xl border border-(--border-glass) px-1 py-0.5 shadow-inner">
                            <button
                              onClick={() => handleQuickPriceChange(dish.id, -5)}
                              className="px-1.5 py-1 text-(--text-muted) hover:text-(--text-primary) font-mono text-xs font-black transition cursor-pointer"
                              title="Decrease price by ₹5"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-black text-xs text-accent-teal">
                              ₹{dish.price}
                            </span>
                            <button
                              onClick={() => handleQuickPriceChange(dish.id, 5)}
                              className="px-1.5 py-1 text-(--text-muted) hover:text-(--text-primary) font-mono text-xs font-black transition cursor-pointer"
                              title="Increase price by ₹5"
                            >
                              +
                            </button>
                          </div>

                          {/* Quick Stock Quantity Stepper */}
                          <div className="flex items-center bg-black/10 dark:bg-black/60 rounded-xl border border-(--border-glass) px-1 py-0.5 shadow-inner">
                            <button
                              onClick={() => handleQuickStockChange(dish.id, -5)}
                              className="px-1.5 py-1 text-(--text-muted) hover:text-(--text-primary) font-mono text-xs font-black transition cursor-pointer"
                              title="Decrease stock by 5 portions"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleQuickStockChange(dish.id, -1)}
                              className="px-1.5 py-1 text-(--text-muted) hover:text-(--text-primary) font-mono text-[11px] font-black transition cursor-pointer"
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
                              className="px-1.5 py-1 text-(--text-muted) hover:text-(--text-primary) font-mono text-[11px] font-black transition cursor-pointer"
                              title="Add 1 fresh portion"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleQuickStockChange(dish.id, 5)}
                              className="px-1.5 py-1 text-(--text-muted) hover:text-(--text-primary) font-mono text-xs font-black transition cursor-pointer"
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
                                : 'bg-black/5 dark:bg-white/5 text-(--text-secondary) border-(--border-glass) hover:bg-black/10 dark:hover:bg-white/10 hover:text-(--text-primary)'
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
                              className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-(--text-muted) text-xs font-bold transition cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(dish.id)}
                              disabled={isSavingDish}
                              className="px-4 py-1.5 rounded-lg bg-accent-teal hover:bg-accent-teal/90 text-black text-xs font-black transition cursor-pointer flex items-center gap-1 shadow"
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
            <div className="flex-none p-4 border-t border-(--border-glass) bg-black/10 dark:bg-black/40 rounded-b-3xl flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-(--text-muted)">
                {saveSuccessMsg ? (
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">✅ {saveSuccessMsg}</span>
                ) : (
                  'Changes take effect in real-time across all student menus.'
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAllInventory}
                  disabled={isSavingAll}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-accent-teal to-emerald-500 hover:scale-105 active:scale-95 text-black font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accent-teal/25 disabled:opacity-50"
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
                  className="px-6 py-2.5 rounded-xl bg-(--text-primary) text-(--text-inverse) font-black text-xs hover:opacity-90 transition cursor-pointer active:scale-95"
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
