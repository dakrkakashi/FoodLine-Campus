'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/navbar';
import { createClient } from '@/utils/supabase/client';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { HourlyChart } from '@/components/analytics/HourlyChart';
import {
  Store,
  Zap,
  DollarSign,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Clock,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Plus,
  Check,
  RotateCcw,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  Hash,
  Calendar,
  UtensilsCrossed,
  Save,
} from 'lucide-react';

interface SlotData {
  id: string;
  label: string;
  max_capacity: number;
  current_booked: number;
  start_time?: string;
  end_time?: string;
}

interface TopDish {
  name: string;
  qty: number;
  revenue: string;
  share: string;
  rawRevenue: number;
}

interface MenuItemData {
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

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'financial' | 'orders' | 'menu' | 'slots' | 'settlements'>('financial');
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Orders Tab Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');
  const [orderSlotFilter, setOrderSlotFilter] = useState('ALL');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Menu Tab Filters & Edit State
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('ALL');
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

  const fetchAnalytics = async () => {
    try {
      setIsRefreshing(true);
      const supabase = createClient();

      const [ordersRes, itemsRes, slotsRes, menuRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*, pickup_slots (*)')
          .neq('status', 'CANCELLED')
          .order('created_at', { ascending: false }),
        supabase
          .from('order_items')
          .select('*'),
        supabase
          .from('pickup_slots')
          .select('*')
          .order('start_time', { ascending: true }),
        fetch('/api/menu').then((r) => r.json()).catch(() => null),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (itemsRes.data) setOrderItems(itemsRes.data);
      if (slotsRes.data) setSlots(slotsRes.data);

      if (menuRes?.success && menuRes.data?.items?.length > 0) {
        setMenuItems(menuRes.data.items);
      } else {
        const menuDbRes = await supabase.from('menu_items').select('*').order('name');
        if (menuDbRes.data) setMenuItems(menuDbRes.data);
      }
    } catch (e) {
      console.error('Error loading manager data:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const supabase = createClient();
    const channel = supabase
      .channel('admin-analytics-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchAnalytics();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_slots' }, () => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 1. Calculations: Financial Split (Canteen Income vs Founder Income)
  const totalOrders = orders.length;

  const totalGrossGMV = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  }, [orders]);

  // Canteen Income: 100% pure food subtotal (total / 1.035)
  const canteenIncome = useMemo(() => {
    return orders.reduce((sum, o) => {
      const total = Number(o.total_amount) || 0;
      const foodSubtotal = total / 1.035;
      return sum + foodSubtotal;
    }, 0);
  }, [orders]);

  // Founder Income: 3.5% Fast-Pass platform take rate
  const founderIncome = useMemo(() => {
    return Math.max(0, totalGrossGMV - canteenIncome);
  }, [totalGrossGMV, canteenIncome]);

  // Payment Mode Split: UPI vs COD
  const { upiCount, codCount, upiRevenue, codRevenue } = useMemo(() => {
    let uCount = 0, cCount = 0, uRev = 0, cRev = 0;
    orders.forEach((o) => {
      const isCod = o.notes?.includes('COD');
      const amt = Number(o.total_amount) || 0;
      if (isCod) {
        cCount++;
        cRev += amt;
      } else {
        uCount++;
        uRev += amt;
      }
    });
    return { upiCount: uCount, codCount: cCount, upiRevenue: uRev, codRevenue: cRev };
  }, [orders]);

  // 2. Calculations: Top Dishes
  const topDishes = useMemo<TopDish[]>(() => {
    if (orderItems.length === 0) return [];

    const activeOrderIds = new Set(orders.map((o) => o.id));
    const dishMap: Record<string, { qty: number; revenue: number }> = {};

    orderItems.forEach((item) => {
      if (!activeOrderIds.has(item.order_id)) return;
      const name = item.item_name || 'Dish Item';
      if (!dishMap[name]) {
        dishMap[name] = { qty: 0, revenue: 0 };
      }
      dishMap[name].qty += Number(item.quantity) || 1;
      dishMap[name].revenue += Number(item.subtotal) || (Number(item.unit_price) * (Number(item.quantity) || 1)) || 0;
    });

    const totalItemSales = Object.values(dishMap).reduce((s, d) => s + d.revenue, 0) || 1;

    return Object.entries(dishMap)
      .map(([name, data]) => ({
        name,
        qty: data.qty,
        revenue: `₹${data.revenue.toLocaleString()}`,
        share: `${Math.round((data.revenue / totalItemSales) * 100)}%`,
        rawRevenue: data.revenue,
      }))
      .sort((a, b) => b.rawRevenue - a.rawRevenue)
      .slice(0, 5);
  }, [orders, orderItems]);

  // 3. Calculations: Hourly Distribution
  const hourlyData = useMemo(() => {
    const bucketMap: Record<string, number> = {
      '10 AM': 0,
      '11 AM': 0,
      '12 PM': 0,
      '1 PM': 0,
      '2 PM': 0,
      '3 PM': 0,
      '4 PM': 0,
    };

    orders.forEach((o) => {
      if (!o.created_at) return;
      const hour = new Date(o.created_at).getHours();
      if (hour === 10) bucketMap['10 AM']++;
      else if (hour === 11) bucketMap['11 AM']++;
      else if (hour === 12) bucketMap['12 PM']++;
      else if (hour === 13) bucketMap['1 PM']++;
      else if (hour === 14) bucketMap['2 PM']++;
      else if (hour === 15) bucketMap['3 PM']++;
      else if (hour >= 16) bucketMap['4 PM']++;
    });

    return Object.entries(bucketMap).map(([time, count]) => ({
      time,
      orders: count,
    }));
  }, [orders]);

  const canteenPercent = totalGrossGMV > 0 ? ((canteenIncome / totalGrossGMV) * 100).toFixed(1) : '96.6';
  const founderPercent = totalGrossGMV > 0 ? ((founderIncome / totalGrossGMV) * 100).toFixed(1) : '3.4';

  // Group order items by order ID for fast lookup
  const itemsByOrderId = useMemo(() => {
    const map = new Map<string, any[]>();
    orderItems.forEach((it) => {
      const list = map.get(it.order_id) || [];
      list.push(it);
      map.set(it.order_id, list);
    });
    return map;
  }, [orderItems]);

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const isCod = order.notes?.includes('COD');
      const orderToken = (order.order_token || '').toLowerCase();
      const notes = (order.notes || '').toLowerCase();
      const searchMatch =
        !orderSearch ||
        orderToken.includes(orderSearch.toLowerCase()) ||
        notes.includes(orderSearch.toLowerCase()) ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase());

      const statusMatch = orderStatusFilter === 'ALL' || order.status === orderStatusFilter;
      const paymentMatch =
        orderPaymentFilter === 'ALL' ||
        (orderPaymentFilter === 'COD' && isCod) ||
        (orderPaymentFilter === 'UPI' && !isCod);

      const slotMatch = orderSlotFilter === 'ALL' || order.slot_id === orderSlotFilter;

      return searchMatch && statusMatch && paymentMatch && slotMatch;
    });
  }, [orders, orderSearch, orderStatusFilter, orderPaymentFilter, orderSlotFilter]);

  // Status Updater
  const handleOrderStatusUpdate = async (orderId: string, nextStatus: string) => {
    try {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
      await fetch(`/api/kds/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  };

  // Menu Categories
  const menuCategories = useMemo(() => {
    const set = new Set<string>();
    menuItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [menuItems]);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch =
        !menuSearch ||
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        (item.tag && item.tag.toLowerCase().includes(menuSearch.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(menuSearch.toLowerCase()));

      const matchCategory = menuCategoryFilter === 'ALL' || item.category === menuCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [menuItems, menuSearch, menuCategoryFilter]);

  // Stock Stepper & Quick Price Steppers in Menu Tab
  const handleQuickStockChange = async (dishId: string, delta: number) => {
    const target = menuItems.find((m) => m.id === dishId);
    if (!target) return;
    const currentQty = target.stock_quantity ?? target.stockQuantity ?? 30;
    const newQty = Math.max(0, currentQty + delta);
    const newAvailability = newQty > 0;

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

  const handleQuickPriceChange = async (dishId: string, delta: number) => {
    const target = menuItems.find((m) => m.id === dishId);
    if (!target) return;
    const newPrice = Math.max(5, (target.price || 0) + delta);

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

  const handleToggleStock = async (dishId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const target = menuItems.find((m) => m.id === dishId);
    const currentQty = target?.stock_quantity ?? target?.stockQuantity ?? 30;
    const nextQty = nextStatus ? (currentQty === 0 ? 25 : currentQty) : 0;

    setMenuItems((prev) =>
      prev.map((d) =>
        d.id === dishId
          ? {
              ...d,
              is_available: nextStatus,
              isAvailable: nextStatus,
              stock_quantity: nextQty,
              stockQuantity: nextQty,
            }
          : d
      )
    );

    try {
      await fetch(`/api/kds/inventory/${dishId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: nextStatus, stock_quantity: nextQty }),
      });
    } catch (e) {
      console.error('Stock toggle failed:', e);
    }
  };

  const handleStartEdit = (dish: MenuItemData) => {
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
      const newDish: MenuItemData = {
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

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F5F5F7] pb-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="text-[11px] font-black text-[#FFB347] uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB347]" />
              Executive Manager & Operations Center
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              Campus Manager <span className="text-[#00D4AA]">Data Hub</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-2">
              Sanjivani University (Cafe @7) • Realtime Master Data • Live Orders • Stock & Shifts
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchAnalytics}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
              title="Refresh all data"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#00D4AA]' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Live Refresh'}</span>
            </button>

            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0A0A0F] to-[#16161E] border border-white/10 shadow-inner flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D4AA]" />
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider text-[#00D4AA]">
                {totalOrders > 0 ? `${totalOrders} Orders Logged` : 'Realtime Sync Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Manager Navigation View Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer select-none whitespace-nowrap border ${
              activeTab === 'financial'
                ? 'bg-white text-black border-white shadow-lg'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <TrendingUp size={15} className={activeTab === 'financial' ? 'text-black' : 'text-[#00D4AA]'} />
            <span>📊 Financial & Revenue Waterfall</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer select-none whitespace-nowrap border ${
              activeTab === 'orders'
                ? 'bg-[#00D4AA] text-black border-[#00D4AA] shadow-lg'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText size={15} />
            <span>📑 Live Orders Master ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer select-none whitespace-nowrap border ${
              activeTab === 'menu'
                ? 'bg-[#FF6B2C] text-white border-[#FF6B2C] shadow-lg'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <UtensilsCrossed size={15} />
            <span>📦 Menu & Live Stock ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer select-none whitespace-nowrap border ${
              activeTab === 'slots'
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-lg'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Clock size={15} />
            <span>⏰ Campus Break Shifts ({slots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settlements')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer select-none whitespace-nowrap border ${
              activeTab === 'settlements'
                ? 'bg-amber-400 text-black border-amber-400 shadow-lg'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Wallet size={15} />
            <span>💳 Settlement & UTR Audit</span>
          </button>
        </div>

        {/* TAB 1: FINANCIAL & REVENUE WATERFALL */}
        {activeTab === 'financial' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 4 Separated Financial Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. CANTEEN INCOME */}
              <div className="relative overflow-hidden p-6 rounded-3xl glass-card-heavy border-[#00D4AA]/30 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00D4AA]/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4AA]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="text-[10px] text-[#00D4AA] font-black uppercase tracking-widest mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Store size={14} />
                    <span>Canteen Income (Cafe @7)</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00D4AA]/20 text-[#00D4AA] font-mono font-black">
                    {canteenPercent}%
                  </span>
                </div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                  ₹{canteenIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                  <span className="text-emerald-400 font-bold">100% Food Sales</span> • 0% Food Commission
                </div>
              </div>

              {/* 2. MY INCOME (FOUNDER MARGIN) */}
              <div className="relative overflow-hidden p-6 rounded-3xl glass-card-heavy border-[#FF6B2C]/30 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF6B2C]/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B2C]/15 rounded-full blur-2xl pointer-events-none" />
                <div className="text-[10px] text-[#FF6B2C] font-black uppercase tracking-widest mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap size={14} />
                    <span>My Income (Platform Take)</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FF6B2C]/20 text-[#FF6B2C] font-mono font-black">
                    {founderPercent}%
                  </span>
                </div>
                <div className="text-3xl md:text-4xl font-black text-[#FFB347] tracking-tight mb-2">
                  ₹{founderIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-amber-300/80 font-bold flex items-center gap-1 bg-amber-500/10 w-fit px-2 py-0.5 rounded-lg border border-amber-500/20">
                  <TrendingUp size={12} className="text-[#FF6B2C]" />
                  <span>3.5% Fast-Pass Convenience Fee</span>
                </div>
              </div>

              {/* 3. GROSS GMV VOLUME */}
              <div className="relative overflow-hidden p-6 rounded-3xl glass-card border-[#8B5CF6]/30 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8B5CF6]/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={14} />
                    <span>Gross GMV Volume</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono font-black">
                    {totalOrders} Orders
                  </span>
                </div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                  ₹{totalGrossGMV.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-zinc-400 font-medium">
                  AOV: <span className="text-white font-bold">₹{totalOrders > 0 ? (totalGrossGMV / totalOrders).toFixed(1) : '0.00'}</span> • 100% Digital Pre-Orders
                </div>
              </div>

              {/* 4. PAYMENT SETTLEMENT MIX */}
              <div className="relative overflow-hidden p-6 rounded-3xl glass-card border-white/15 shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Wallet size={14} />
                  <span>Payment Mode Settlement</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-2">
                  <span>{upiCount} <span className="text-xs text-zinc-500 font-normal">UPI</span></span>
                  <span className="text-zinc-600">/</span>
                  <span>{codCount} <span className="text-xs text-zinc-500 font-normal">COD</span></span>
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center justify-between font-medium">
                  <span>UPI: <b className="text-emerald-400">₹{upiRevenue.toFixed(0)}</b></span>
                  <span>Cash: <b className="text-amber-400">₹{codRevenue.toFixed(0)}</b></span>
                </div>
              </div>
            </div>

            {/* Financial Split Waterfall Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#16161E] via-[#12121A] to-[#16161E] border border-white/10 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <ArrowUpRight size={16} className="text-[#00D4AA]" />
                  <span>Live Revenue Split Waterfall</span>
                </div>
                <p className="text-xs text-zinc-400">
                  FoodLine automatically separates food settlement from platform revenue with 0 manual reconciliation.
                </p>
              </div>

              {/* Visual Split Bar */}
              <div className="flex-1 max-w-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-black">
                  <span className="text-[#00D4AA]">🏪 Cafe @7: ₹{canteenIncome.toFixed(2)} ({canteenPercent}%)</span>
                  <span className="text-[#FF6B2C]">⚡ Founder: ₹{founderIncome.toFixed(2)} ({founderPercent}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden flex border border-white/10">
                  <div
                    style={{ width: `${canteenPercent}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#00D4AA] transition-all duration-500"
                  />
                  <div
                    style={{ width: `${founderPercent}%` }}
                    className="h-full bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Charts & Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Revenue Area Chart */}
              <div className="lg:col-span-8 glass-card rounded-3xl p-6 shadow-xl h-[400px] flex flex-col">
                <div className="flex-none mb-6">
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span>📈</span> Hourly Order Volume (Today)
                  </h2>
                </div>
                <div className="flex-1 w-full min-h-[250px] p-2">
                  <HourlyChart data={hourlyData} />
                </div>
              </div>

              {/* Top Revenue Dishes */}
              <div className="lg:col-span-4 glass-card rounded-3xl p-6 shadow-xl flex flex-col h-[400px]">
                <div className="flex-none mb-4">
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span>🏆</span> Top Performers
                  </h2>
                  <p className="text-[10px] text-zinc-400 mt-1 font-semibold">Highest GMV items today</p>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin divide-y divide-white/5">
                  {topDishes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mb-2">
                        📊
                      </div>
                      <div className="text-xs font-bold text-zinc-400">No Orders Yet Today</div>
                      <p className="text-[11px] text-zinc-600 mt-1">
                        Dishes will rank here as students place orders.
                      </p>
                    </div>
                  ) : (
                    topDishes.map((dish, i) => (
                      <div key={i} className="py-3.5 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-6 text-center text-xs font-black text-zinc-600 group-hover:text-[#FFB347] transition">#{i + 1}</div>
                          <div>
                            <div className="text-xs font-bold text-white mb-0.5">{dish.name}</div>
                            <div className="text-[10px] text-zinc-500 font-semibold">{dish.qty} units sold</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-[#00D4AA] mb-0.5">{dish.revenue}</div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold bg-white/5 px-1.5 py-0.5 rounded inline-block">{dish.share} mix</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDERS MASTER LEDGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter & Search Bar */}
            <div className="p-5 rounded-3xl bg-[#16161E] border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order Token (e.g. FL-1793), Customer Notes, or ID..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00D4AA]"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status Filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-[#00D4AA] font-bold cursor-pointer"
                  >
                    <option value="ALL">All Statuses ({orders.length})</option>
                    <option value="PENDING_PAYMENT">Pending Payment</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="READY">Ready for Pickup</option>
                    <option value="COLLECTED">Collected</option>
                  </select>

                  {/* Payment Filter */}
                  <select
                    value={orderPaymentFilter}
                    onChange={(e) => setOrderPaymentFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-[#00D4AA] font-bold cursor-pointer"
                  >
                    <option value="ALL">All Payments</option>
                    <option value="UPI">⚡ UPI Only ({upiCount})</option>
                    <option value="COD">💵 Cash (COD) Only ({codCount})</option>
                  </select>

                  {/* Slot Filter */}
                  <select
                    value={orderSlotFilter}
                    onChange={(e) => setOrderSlotFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-[#00D4AA] font-bold cursor-pointer"
                  >
                    <option value="ALL">All Campus Break Slots</option>
                    {slots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-white/5">
                <span>Showing <b>{filteredOrders.length}</b> of <b>{orders.length}</b> orders</span>
                <span className="font-mono text-[11px] text-zinc-500">Live PostgreSQL Telemetry</span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-3xl bg-[#16161E] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10 text-[10px] uppercase font-black tracking-wider text-zinc-400">
                      <th className="py-3 px-4">Order Token</th>
                      <th className="py-3 px-4">Slot & Time</th>
                      <th className="py-3 px-4">Items & Details</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Financial Split</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-zinc-500 text-xs">
                          No orders found matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const isCod = order.notes?.includes('COD');
                        const isExpanded = expandedOrderId === order.id;
                        const items = itemsByOrderId.get(order.id) || [];
                        const total = Number(order.total_amount) || 0;
                        const canteenShare = total / 1.035;
                        const founderTake = Math.max(0, total - canteenShare);
                        const slotLabel = order.pickup_slots?.label || 'Direct Counter';

                        return (
                          <React.Fragment key={order.id}>
                            <tr className="hover:bg-white/[0.02] transition">
                              {/* Order Token */}
                              <td className="py-3.5 px-4 font-mono font-black text-white text-sm">
                                <div className="flex items-center gap-1.5">
                                  <span>{order.order_token || 'FL-0000'}</span>
                                  {order.pickup_otp && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                                      OTP: {order.pickup_otp}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-zinc-500 font-sans font-normal mt-0.5">
                                  {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                </div>
                              </td>

                              {/* Slot */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-zinc-200">{slotLabel}</div>
                                <div className="text-[10px] text-zinc-500">
                                  {order.created_at ? new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today'}
                                </div>
                              </td>

                              {/* Items */}
                              <td className="py-3.5 px-4">
                                <div className="text-zinc-300 font-medium max-w-[200px] truncate">
                                  {items.length > 0
                                    ? items.map((it) => `${it.quantity}x ${it.item_name}`).join(', ')
                                    : order.notes || 'Express Order'}
                                </div>
                                {order.notes && (
                                  <div className="text-[10px] text-[#FFB347] truncate max-w-[200px]">
                                    Note: {order.notes}
                                  </div>
                                )}
                              </td>

                              {/* Payment */}
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                    isCod
                                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                                  }`}
                                >
                                  {isCod ? '💵 COD (Cash)' : '⚡ UPI Paid'}
                                </span>
                              </td>

                              {/* Financial Split */}
                              <td className="py-3.5 px-4 font-mono">
                                <div className="font-black text-white text-sm">₹{total.toFixed(2)}</div>
                                <div className="text-[10px] text-zinc-400">
                                  <span className="text-[#00D4AA]">₹{canteenShare.toFixed(1)}</span> (Canteen) +{' '}
                                  <span className="text-[#FF6B2C]">₹{founderTake.toFixed(1)}</span> (Fee)
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                                    order.status === 'READY'
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                                      : order.status === 'PREPARING'
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : order.status === 'COLLECTED'
                                      ? 'bg-zinc-800 text-zinc-400 border-white/10'
                                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  }`}
                                >
                                  {order.status === 'READY' && '🔔 '}
                                  {order.status}
                                </span>
                              </td>

                              {/* Quick Actions */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {order.status === 'CONFIRMED' && (
                                    <button
                                      onClick={() => handleOrderStatusUpdate(order.id, 'PREPARING')}
                                      className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-black transition cursor-pointer border border-amber-500/30"
                                    >
                                      Start Prep
                                    </button>
                                  )}
                                  {order.status === 'PREPARING' && (
                                    <button
                                      onClick={() => handleOrderStatusUpdate(order.id, 'READY')}
                                      className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-black transition cursor-pointer border border-emerald-500/30"
                                    >
                                      Mark Ready
                                    </button>
                                  )}
                                  {order.status === 'READY' && (
                                    <button
                                      onClick={() => handleOrderStatusUpdate(order.id, 'COLLECTED')}
                                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-black transition cursor-pointer border border-white/20"
                                    >
                                      Collect
                                    </button>
                                  )}

                                  <button
                                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                                    title="View order item details"
                                  >
                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Expanded Order Items Row */}
                            {isExpanded && (
                              <tr className="bg-black/40 border-b border-white/10">
                                <td colSpan={7} className="p-4">
                                  <div className="rounded-2xl bg-[#0A0A0F] border border-white/10 p-4 space-y-3">
                                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                                      <span className="font-bold text-[#FFB347]">
                                        📦 Order Items Breakdown ({order.order_token})
                                      </span>
                                      <span className="font-mono text-zinc-500">Order ID: {order.id}</span>
                                    </div>

                                    {items.length === 0 ? (
                                      <div className="text-xs text-zinc-500 italic">
                                        No itemized rows recorded in database (Legacy test order).
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {items.map((it, idx) => (
                                          <div
                                            key={idx}
                                            className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                                          >
                                            <div>
                                              <div className="font-bold text-white">{it.item_name}</div>
                                              <div className="text-[10px] text-zinc-400">
                                                Qty: {it.quantity} • Unit: ₹{it.unit_price}
                                              </div>
                                            </div>
                                            <div className="font-mono font-black text-[#00D4AA]">
                                              ₹{Number(it.subtotal || it.unit_price * it.quantity).toFixed(2)}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 text-zinc-400">
                                      <span>Customer Note: <b className="text-white">{order.notes || 'None'}</b></span>
                                      <span>Pickup OTP: <b className="text-emerald-400 font-mono text-sm">{order.pickup_otp || '—'}</b></span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MENU & LIVE STOCK MASTER */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Action Bar */}
            <div className="p-5 rounded-3xl bg-[#16161E] border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search menu dishes by name, tag, or category..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00D4AA]"
                  />
                  {menuSearch && (
                    <button
                      onClick={() => setMenuSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={menuCategoryFilter}
                    onChange={(e) => setMenuCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-[#00D4AA] font-bold cursor-pointer"
                  >
                    <option value="ALL">All Categories ({menuItems.length})</option>
                    {menuCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsAddingDish(!isAddingDish)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF6B2C] text-white font-black text-xs hover:bg-[#FF6B2C]/90 transition cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Plus size={14} />
                    <span>{isAddingDish ? 'Close Drawer' : 'Add New Dish'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Add Dish Drawer */}
            {isAddingDish && (
              <div className="p-5 rounded-3xl bg-[#16161E] border border-[#FF6B2C]/30 space-y-4 animate-in slide-in-from-top duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FF6B2C]/20 border border-[#FF6B2C]/40 flex items-center justify-center text-[#FF6B2C]">
                      <Plus size={16} />
                    </div>
                    <span className="text-sm font-black text-white">Create New Dish (Cafe @7)</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">Instantly publishes to student menu & KDS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-400 mb-1">Dish Name *</label>
                    <input
                      type="text"
                      value={newDishForm.name}
                      onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                      placeholder="e.g. Paneer Cheese Wrap"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00D4AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-400 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={newDishForm.price}
                      onChange={(e) => setNewDishForm({ ...newDishForm, price: Number(e.target.value) })}
                      placeholder="50"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#00D4AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-400 mb-1">Initial Stock Qty *</label>
                    <input
                      type="number"
                      value={newDishForm.stock_quantity}
                      onChange={(e) => setNewDishForm({ ...newDishForm, stock_quantity: Math.max(0, Number(e.target.value)) })}
                      placeholder="30"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#00D4AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-400 mb-1">Category</label>
                    <input
                      type="text"
                      value={newDishForm.category}
                      onChange={(e) => setNewDishForm({ ...newDishForm, category: e.target.value })}
                      placeholder="e.g. Chef Specials"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00D4AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-400 mb-1">Tag / Badge</label>
                    <input
                      type="text"
                      value={newDishForm.tag}
                      onChange={(e) => setNewDishForm({ ...newDishForm, tag: e.target.value })}
                      placeholder="e.g. Hot Grill"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00D4AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-400 mb-1">Prep Time (mins)</label>
                    <input
                      type="number"
                      value={newDishForm.prep_time_mins}
                      onChange={(e) => setNewDishForm({ ...newDishForm, prep_time_mins: Number(e.target.value) })}
                      placeholder="5"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#00D4AA]"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                    <button
                      onClick={handleAddNewDish}
                      disabled={isSavingDish || !newDishForm.name.trim()}
                      className="py-2.5 px-6 rounded-xl bg-[#00D4AA] text-black font-black text-xs hover:bg-[#00D4AA]/90 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>{isSavingDish ? 'Publishing...' : 'Save & Publish to Campus Menu'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenuItems.map((dish) => {
                const isEditing = editingDishId === dish.id;
                const currentStock = dish.stock_quantity ?? dish.stockQuantity ?? 30;

                return (
                  <div
                    key={dish.id}
                    className={`p-4 rounded-3xl border transition ${
                      dish.is_available
                        ? 'bg-[#16161E] border-white/5 hover:border-white/15'
                        : 'bg-red-950/20 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-black text-sm ${dish.is_available ? 'text-white' : 'text-zinc-500 line-through'}`}>
                            {dish.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-[10px] font-bold border border-white/5">
                            {dish.tag || dish.category || 'Standard'}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          ⏱ {dish.prep_time_mins || 5}m prep • Category: {dish.category || 'Kitchen Specials'}
                        </div>
                      </div>

                      <button
                        onClick={() => (isEditing ? setEditingDishId(null) : handleStartEdit(dish))}
                        className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 border ${
                          isEditing
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Edit3 size={13} />
                        <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                      </button>
                    </div>

                    {/* Steppers Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-white/5">
                      {/* Price Stepper */}
                      <div className="flex items-center bg-black/60 rounded-xl border border-white/10 px-1 py-0.5">
                        <button
                          onClick={() => handleQuickPriceChange(dish.id, -5)}
                          className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-xs font-black cursor-pointer"
                        >
                          -5
                        </button>
                        <span className="px-2 font-mono font-black text-xs text-[#00D4AA]">
                          ₹{dish.price}
                        </span>
                        <button
                          onClick={() => handleQuickPriceChange(dish.id, 5)}
                          className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-xs font-black cursor-pointer"
                        >
                          +5
                        </button>
                      </div>

                      {/* Stock Stepper */}
                      <div className="flex items-center bg-black/60 rounded-xl border border-white/10 px-1 py-0.5">
                        <button
                          onClick={() => handleQuickStockChange(dish.id, -5)}
                          className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-xs font-black cursor-pointer"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleQuickStockChange(dish.id, -1)}
                          className="px-1 py-1 text-zinc-400 hover:text-white font-mono text-[10px] font-black cursor-pointer"
                        >
                          -1
                        </button>
                        <span
                          className={`px-2 font-mono font-black text-xs flex items-center gap-1 ${
                            currentStock === 0 ? 'text-red-400' : currentStock <= 10 ? 'text-amber-300' : 'text-emerald-400'
                          }`}
                        >
                          <span>📦</span>
                          <span>{currentStock} left</span>
                        </span>
                        <button
                          onClick={() => handleQuickStockChange(dish.id, 1)}
                          className="px-1 py-1 text-zinc-400 hover:text-white font-mono text-[10px] font-black cursor-pointer"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleQuickStockChange(dish.id, 5)}
                          className="px-1.5 py-1 text-zinc-400 hover:text-white font-mono text-xs font-black cursor-pointer"
                        >
                          +5
                        </button>
                      </div>

                      {/* In Stock Toggle */}
                      <button
                        onClick={() => handleToggleStock(dish.id, dish.is_available)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 select-none ${
                          dish.is_available
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:bg-red-950/80 hover:text-red-300'
                            : 'bg-red-950/80 text-red-300 border border-red-500/50 hover:bg-emerald-950/60 hover:text-emerald-400'
                        }`}
                      >
                        {dish.is_available ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        <span>{dish.is_available ? 'In Stock' : 'SOLD OUT'}</span>
                      </button>
                    </div>

                    {/* Inline Editor */}
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t border-white/10 bg-black/40 -mx-4 -mb-4 p-4 rounded-b-3xl space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">Title</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">Price (₹)</label>
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">Stock Qty</label>
                            <input
                              type="number"
                              value={editForm.stock_quantity}
                              onChange={(e) => setEditForm({ ...editForm, stock_quantity: Math.max(0, Number(e.target.value)) })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">Prep Time (mins)</label>
                            <input
                              type="number"
                              value={editForm.prep_time_mins}
                              onChange={(e) => setEditForm({ ...editForm, prep_time_mins: Number(e.target.value) })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">Tag</label>
                            <input
                              type="text"
                              value={editForm.tag}
                              onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">Category</label>
                            <input
                              type="text"
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingDishId(null)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(dish.id)}
                            disabled={isSavingDish}
                            className="px-4 py-1.5 rounded-lg bg-[#00D4AA] text-black text-xs font-black flex items-center gap-1 cursor-pointer"
                          >
                            <Save size={12} />
                            <span>{isSavingDish ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SHIFT SLOTS & CAPACITY */}
        {activeTab === 'slots' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-[#16161E] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock size={16} className="text-[#8B5CF6]" />
                    <span>Campus Break Shifts & Slot Capacity Throttling</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Strict 60-order batch cap prevents counter crowding during 10-minute college breaks.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-mono font-black border border-[#8B5CF6]/30">
                  {slots.length} Defined Shifts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {slots.map((slot) => {
                const dynamicBooked = orders.filter((o) => o.slot_id === slot.id).length;
                const booked = Math.max(slot.current_booked || 0, dynamicBooked);
                const max = slot.max_capacity || 60;
                const isFull = booked >= max;
                const available = Math.max(0, max - booked);
                const percent = Math.round((booked / max) * 100);

                const slotRevenue = orders
                  .filter((o) => o.slot_id === slot.id)
                  .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

                return (
                  <div
                    key={slot.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isFull
                        ? 'bg-red-950/20 border-red-500/30'
                        : booked > 0
                        ? 'bg-amber-950/15 border-amber-500/30 shadow-lg shadow-amber-500/5'
                        : 'bg-[#16161E] border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm font-bold mb-2">
                      <span className={isFull ? 'text-red-300 font-extrabold' : 'text-zinc-200 font-black'}>
                        {slot.label}
                      </span>
                      <span className={isFull ? 'text-red-400 font-black' : booked > 0 ? 'text-[#FFB347] font-black' : 'text-zinc-400'}>
                        {booked}/{max}
                      </span>
                    </div>

                    <div className="mb-3">
                      <ProgressBar value={booked} max={max} showPercent={false} size="md" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                      <span>{available} slots remaining</span>
                      <span className={`font-mono font-bold ${isFull ? 'text-red-400' : booked > 0 ? 'text-[#00D4AA]' : 'text-zinc-500'}`}>
                        {isFull ? '100% (Exhausted)' : `${percent}% Booked`}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Slot Revenue:</span>
                      <span className="font-mono font-black text-white">₹{slotRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SETTLEMENTS & UTR AUDIT */}
        {activeTab === 'settlements' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Reconciliation KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-3xl bg-[#16161E] border border-white/10 shadow-xl">
                <div className="text-[10px] uppercase font-black tracking-wider text-zinc-400 mb-1">
                  Total Gross GMV
                </div>
                <div className="text-3xl font-black text-white font-mono">₹{totalGrossGMV.toFixed(2)}</div>
                <div className="text-[11px] text-zinc-500 mt-1">100% Pre-Orders Booked</div>
              </div>

              <div className="p-5 rounded-3xl bg-[#16161E] border border-emerald-500/30 shadow-xl">
                <div className="text-[10px] uppercase font-black tracking-wider text-[#00D4AA] mb-1">
                  Canteen Net Payout (Cafe @7)
                </div>
                <div className="text-3xl font-black text-[#00D4AA] font-mono">₹{canteenIncome.toFixed(2)}</div>
                <div className="text-[11px] text-emerald-400/80 mt-1 font-bold">100% Food Subtotal (96.6% Split)</div>
              </div>

              <div className="p-5 rounded-3xl bg-[#16161E] border border-[#FF6B2C]/30 shadow-xl">
                <div className="text-[10px] uppercase font-black tracking-wider text-[#FF6B2C] mb-1">
                  Founder Fast-Pass Platform Take
                </div>
                <div className="text-3xl font-black text-[#FFB347] font-mono">₹{founderIncome.toFixed(2)}</div>
                <div className="text-[11px] text-amber-300/80 mt-1 font-bold">3.5% Fast-Pass Tech Surcharge</div>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="rounded-3xl bg-[#16161E] border border-white/10 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#00D4AA]" />
                    <span>Payment Mode & Settlement Audit Ledger</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    12-Digit UTR Bank Reference Replay Protection & Cash Drawer Log
                  </p>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {orders.length} Verified Entries
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black/60 border-b border-white/10 text-[10px] uppercase font-black tracking-wider text-zinc-400">
                      <th className="py-3 px-4">Order Token</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Gross Amount</th>
                      <th className="py-3 px-4">Canteen Payout (96.6%)</th>
                      <th className="py-3 px-4">Platform Take (3.4%)</th>
                      <th className="py-3 px-4">UTR Reference / Notes</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {orders.map((order) => {
                      const isCod = order.notes?.includes('COD');
                      const total = Number(order.total_amount) || 0;
                      const canteenShare = total / 1.035;
                      const founderTake = Math.max(0, total - canteenShare);

                      return (
                        <tr key={order.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 font-black text-white font-sans">{order.order_token}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider font-sans ${
                                isCod ? 'bg-amber-950/80 text-amber-300' : 'bg-emerald-950/80 text-emerald-300'
                              }`}
                            >
                              {isCod ? '💵 COD Cash' : '⚡ UPI Bank'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-white">₹{total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-[#00D4AA]">₹{canteenShare.toFixed(2)}</td>
                          <td className="py-3 px-4 text-[#FF6B2C]">₹{founderTake.toFixed(2)}</td>
                          <td className="py-3 px-4 text-zinc-400 font-sans text-[11px]">
                            {order.notes || 'UPI Instant Verification'}
                          </td>
                          <td className="py-3 px-4 text-zinc-500 font-sans text-[11px]">
                            {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
