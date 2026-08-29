'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Coffee,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Save,
  CheckCircle2,
  ArrowLeft,
  Sliders,
  Flame,
  ChefHat,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';
import { InventoryStatus } from '@/lib/types';
import { fetchInventoryStatus, postMorningPrep, patchPersistentStock } from '@/lib/api';

const COMMON_BREAKFAST_KEYWORDS = [
  'poha',
  'dosa',
  'uttapam',
  'samosa',
  'kachori',
  'vada pav',
  'dabeli',
  'tea',
  'coffee',
];

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<'fresh' | 'persistent'>('fresh');
  const [inventoryList, setInventoryList] = useState<InventoryStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFreshIds, setSelectedFreshIds] = useState<Set<string>>(new Set());
  const [persistentQuantities, setPersistentQuantities] = useState<Map<string, number>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchInventoryStatus();
      if (Array.isArray(data) && data.length > 0) {
        setInventoryList(data);

        // Pre-fill active fresh items
        const activeFresh = new Set<string>();
        const qtyMap = new Map<string, number>();

        for (const item of data) {
          if (item.inventoryType === 'daily_fresh' && item.isAvailable) {
            activeFresh.add(item.itemId);
          } else if (item.inventoryType === 'persistent') {
            qtyMap.set(item.itemId, item.stockQuantity ?? 30);
          }
        }

        setSelectedFreshIds(activeFresh);
        setPersistentQuantities(qtyMap);
      }
    } catch (e) {
      console.error('Failed to load inventory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const freshItems = useMemo(() => {
    return inventoryList.filter((item) => item.inventoryType === 'daily_fresh');
  }, [inventoryList]);

  const persistentItems = useMemo(() => {
    return inventoryList.filter((item) => item.inventoryType === 'persistent');
  }, [inventoryList]);

  const filteredFreshItems = useMemo(() => {
    return freshItems.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tag || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [freshItems, searchQuery]);

  const filteredPersistentItems = useMemo(() => {
    return persistentItems.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tag || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [persistentItems, searchQuery]);

  // Fresh items grouped by category
  const categorizedFreshItems = useMemo(() => {
    const map = new Map<string, InventoryStatus[]>();
    for (const item of filteredFreshItems) {
      const cat = item.category || 'Kitchen Specials';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return map;
  }, [filteredFreshItems]);

  const toggleFreshItem = (itemId: string) => {
    setSelectedFreshIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleSelectAllBreakfast = () => {
    setSelectedFreshIds((prev) => {
      const next = new Set(prev);
      for (const item of freshItems) {
        const name = (item.name || '').toLowerCase();
        if (COMMON_BREAKFAST_KEYWORDS.some((kw) => name.includes(kw))) {
          next.add(item.itemId);
        }
      }
      return next;
    });
  };

  const handleSelectAllFresh = () => {
    setSelectedFreshIds(new Set(freshItems.map((i) => i.itemId)));
  };

  const handleClearAllFresh = () => {
    setSelectedFreshIds(new Set());
  };

  const handleSaveFreshBatch = async () => {
    try {
      setIsSaving(true);
      setSaveSuccessMsg('');
      const date = new Date().toISOString().split('T')[0];
      const res = await postMorningPrep({
        date,
        dailyFreshItemIds: Array.from(selectedFreshIds),
      });
      if (res.success) {
        setSaveSuccessMsg(`✓ Saved ${selectedFreshIds.size} fresh dishes for today's active menu!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        await loadData();
      }
    } catch (e) {
      console.error('Failed to save morning prep:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuantityChange = (itemId: string, val: number) => {
    setPersistentQuantities((prev) => {
      const next = new Map(prev);
      next.set(itemId, Math.max(0, val));
      return next;
    });
  };

  const handleRestockAllBeverages = (qty: number = 30) => {
    setPersistentQuantities((prev) => {
      const next = new Map(prev);
      for (const item of persistentItems) {
        next.set(item.itemId, qty);
      }
      return next;
    });
  };

  const handleSavePersistentStock = async () => {
    try {
      setIsSaving(true);
      setSaveSuccessMsg('');
      const updates = Array.from(persistentQuantities.entries()).map(([itemId, stockQuantity]) => ({
        itemId,
        stockQuantity,
      }));

      const res = await patchPersistentStock(updates);
      if (res.success) {
        setSaveSuccessMsg(`✓ Successfully updated stock quantities for ${updates.length} beverage & dessert items!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        await loadData();
      }
    } catch (e) {
      console.error('Failed to save persistent stock:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const lowStockCount = useMemo(() => {
    let count = 0;
    for (const [id, qty] of persistentQuantities.entries()) {
      if (qty <= 5 && qty > 0) count++;
    }
    return count;
  }, [persistentQuantities]);

  const soldOutBeveragesCount = useMemo(() => {
    let count = 0;
    for (const [id, qty] of persistentQuantities.entries()) {
      if (qty <= 0) count++;
    }
    return count;
  }, [persistentQuantities]);

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-[#F5F5F7] pb-24 relative overflow-hidden">
      <Navbar />

      {/* Ambient Glows */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#FF6B2C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#00D4AA]/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 pt-28">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/admin" className="hover:text-white transition flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Admin
            </Link>
            <span>/</span>
            <span className="text-[var(--accent-orange)] font-bold">Dual Inventory Management</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/kds"
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
            >
              <ChefHat size={14} />
              <span>Open Kitchen KDS</span>
            </Link>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="glass-card-heavy rounded-3xl p-6 md:p-8 border border-white/10 mb-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 text-[var(--accent-orange)] text-xs font-black uppercase tracking-wider mb-3">
                <Package size={14} />
                <span>Cafe @7 Dual Inventory Hub</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Campus Stock & Morning Prep Controls
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
                1-tap morning fresh batch dispatcher for 50 cooked dishes, plus live inventory meters and low-stock alerts for beverages and shakes.
              </p>
            </div>

            {/* Quick Metrics Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-black/50 border border-white/10 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Dishes</span>
                <span className="text-xl font-black text-white">{inventoryList.length}</span>
              </div>
              <div className="bg-black/50 border border-emerald-500/20 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Fresh Active</span>
                <span className="text-xl font-black text-emerald-400">{selectedFreshIds.size}</span>
              </div>
              <div className="bg-black/50 border border-amber-500/20 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Low Stock</span>
                <span className="text-xl font-black text-amber-400">{lowStockCount}</span>
              </div>
              <div className="bg-black/50 border border-red-500/20 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-red-400 block">Sold Out</span>
                <span className="text-xl font-black text-red-400">{soldOutBeveragesCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert Toast */}
        <AnimatePresence>
          {saveSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs mb-6 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>{saveSuccessMsg}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Sync Broadcasted Live</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Selector & Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                setActiveTab('fresh');
                setSearchQuery('');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'fresh'
                  ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black shadow-lg shadow-[#FF6B2C]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ChefHat size={15} />
              <span>Today&apos;s Fresh Batch ({freshItems.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('persistent');
                setSearchQuery('');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'persistent'
                  ? 'bg-gradient-to-r from-[#00D4AA] to-[#38BDF8] text-black shadow-lg shadow-[#00D4AA]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Coffee size={15} />
              <span>Persistent Stock & Beverages ({persistentItems.length})</span>
            </button>
          </div>

          {/* Live Search */}
          <div className="relative min-w-[260px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search dishes or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: DAILY FRESH BATCH */}
        {activeTab === 'fresh' && (
          <div className="space-y-6">
            {/* Quick Action Helpers */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/30">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-400">1-Tap Batch Helpers:</span>
                <button
                  onClick={handleSelectAllBreakfast}
                  className="px-3 py-1.5 rounded-lg bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 text-[var(--accent-orange)] text-xs font-black hover:bg-[var(--accent-orange)] hover:text-black transition cursor-pointer flex items-center gap-1"
                >
                  <Flame size={13} />
                  <span>Select Common Breakfast</span>
                </button>
                <button
                  onClick={handleSelectAllFresh}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold hover:bg-white/10 transition cursor-pointer"
                >
                  Select All ({freshItems.length})
                </button>
                <button
                  onClick={handleClearAllFresh}
                  className="px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-950/50 transition cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <button
                onClick={handleSaveFreshBatch}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black font-black text-xs shadow-lg shadow-[#FF6B2C]/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-2 ml-auto"
              >
                <Save size={15} />
                <span>{isSaving ? 'Broadcasting...' : `Save Today's Batch (${selectedFreshIds.size} Active)`}</span>
              </button>
            </div>

            {/* Categorized Fresh Dishes Grid */}
            {Array.from(categorizedFreshItems.entries()).map(([category, items]) => (
              <div key={category} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-orange)]" />
                    <span>{category}</span>
                    <span className="text-[10px] text-zinc-400 font-bold">({items.length} dishes)</span>
                  </h3>
                  <span className="text-[10px] text-zinc-400">
                    {items.filter((i) => selectedFreshIds.has(i.itemId)).length} active today
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item) => {
                    const isSelected = selectedFreshIds.has(item.itemId);
                    return (
                      <div
                        key={item.itemId}
                        onClick={() => toggleFreshItem(item.itemId)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between select-none ${
                          isSelected
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                            : 'bg-black/30 border-white/5 text-zinc-400 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isSelected ? (
                            <CheckSquare size={18} className="text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square size={18} className="text-zinc-600 flex-shrink-0" />
                          )}
                          <div>
                            <div className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                              {item.name}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-medium">
                              ₹{item.price} • {item.tag || 'Standard'}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/5 text-zinc-400'
                          }`}
                        >
                          {isSelected ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PERSISTENT STOCK & BEVERAGES */}
        {activeTab === 'persistent' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/30">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-400">Quick Stock Presets:</span>
                <button
                  onClick={() => handleRestockAllBeverages(30)}
                  className="px-3 py-1.5 rounded-lg bg-[#00D4AA]/15 border border-[#00D4AA]/30 text-[#00D4AA] text-xs font-black hover:bg-[#00D4AA] hover:text-black transition cursor-pointer"
                >
                  Set All to 30 (Standard Shift)
                </button>
                <button
                  onClick={() => handleRestockAllBeverages(50)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold hover:bg-white/10 transition cursor-pointer"
                >
                  Set All to 50 (Peak Rush)
                </button>
              </div>

              <button
                onClick={handleSavePersistentStock}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#38BDF8] text-black font-black text-xs shadow-lg shadow-[#00D4AA]/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-2 ml-auto"
              >
                <Save size={15} />
                <span>{isSaving ? 'Updating...' : 'Save All Stock Levels'}</span>
              </button>
            </div>

            {/* Beverage & Dessert Stock Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPersistentItems.map((item) => {
                const qty = persistentQuantities.get(item.itemId) ?? item.stockQuantity ?? 30;
                const isLow = qty <= 5 && qty > 0;
                const isOut = qty <= 0;

                return (
                  <div
                    key={item.itemId}
                    className={`glass-card rounded-2xl p-5 border transition ${
                      isOut
                        ? 'border-red-500/30 bg-red-950/10'
                        : isLow
                        ? 'border-amber-500/30 bg-amber-950/10'
                        : 'border-white/10 bg-[#16161E]/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-white">{item.name}</h3>
                          {isOut && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/40">
                              Out of Stock
                            </span>
                          )}
                          {isLow && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                              <AlertTriangle size={10} /> Low Stock
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">
                          ₹{item.price} • {item.tag || item.category}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 font-bold block uppercase">Live Units</span>
                        <span
                          className={`text-2xl font-black font-mono ${
                            isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-[#00D4AA]'
                          }`}
                        >
                          {qty}
                        </span>
                      </div>
                    </div>

                    {/* Slider & Stepper Controls */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={qty}
                          onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value))}
                          className="flex-1 accent-[#00D4AA] h-2 bg-black/50 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuantityChange(item.itemId, qty - 5)}
                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-400 hover:text-white transition"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleQuantityChange(item.itemId, qty - 1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-black text-zinc-300 hover:text-white transition"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-mono font-black text-xs text-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.itemId, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-black text-zinc-300 hover:text-white transition"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleQuantityChange(item.itemId, qty + 5)}
                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-400 hover:text-white transition"
                          >
                            +5
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleQuantityChange(item.itemId, 0)}
                            className="px-2.5 py-1 rounded-lg bg-red-950/40 text-red-400 text-[10px] font-bold hover:bg-red-950/70 transition"
                          >
                            Zero
                          </button>
                          <button
                            onClick={() => handleQuantityChange(item.itemId, 30)}
                            className="px-2.5 py-1 rounded-lg bg-[#00D4AA]/15 text-[#00D4AA] text-[10px] font-bold hover:bg-[#00D4AA]/30 transition"
                          >
                            Reset 30
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
}
