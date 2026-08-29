'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ShoppingCart, Info, Sparkles, Flame } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { DishCardSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { InventoryBadge } from '@/components/ui/InventoryBadge';
import { PageTransition, SpotlightCard } from '@/components/ui';

interface MenuItem {
  id: string;
  name: string;
  tag?: string;
  price: number;
  prep_time_mins?: number;
  category_id?: string;
  is_available: boolean;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
}

const TAG_VARIANT: Record<string, 'bestseller' | 'studentFav' | 'fastGrab' | 'spicy' | 'custom'> = {
  'Bestseller': 'bestseller',
  'Student Fav': 'studentFav',
  'Fast Grab': 'fastGrab',
  'Spicy': 'spicy',
};

export default function MenuPage() {
  const { items: cartItems, addItem, removeItem, updateQuantity, totalAmount, totalCount } = useCart();
  const { getEffectiveAvailability, getStockQuantity } = useInventory();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const res = await fetch('/api/menu');
        const json = await res.json();
        if (json.success && json.data) {
          setCategories(json.data.categories || []);
          setMenuItems(json.data.items || []);
        }
      } catch (err) {
        console.error('Failed to load live menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  // Auto-clamp cart quantities if stock decreases below what is currently in cart
  useEffect(() => {
    for (const item of cartItems) {
      const stock = getStockQuantity(item.id);
      if (stock !== null && stock !== undefined && item.quantity > stock) {
        updateQuantity(item.id, stock, stock);
      }
    }
  }, [cartItems, getStockQuantity, updateQuantity]);

  const getCategoryName = (catId?: string) => {
    if (!catId) return '';
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : '';
  };

  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) => {
        const itemCatName = getCategoryName(item.category_id);
        const matchesCategory =
          selectedCategory === 'All' || itemCatName === selectedCategory || item.category_id === selectedCategory;
        const matchesSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.tag && item.tag.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menuItems, selectedCategory, search, categories]
  );

  const getCartQuantity = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-[#F5F5F7] pb-36 relative overflow-hidden">
      {/* Background Aurora Mesh */}
      <div className="aurora-mesh">
        <div
          className="aurora-blob w-[36rem] h-[36rem] bg-[#FF6B2C] -top-24 -right-20"
          style={{ animationDuration: '18s' }}
        />
        <div
          className="aurora-blob w-[38rem] h-[38rem] bg-[#00D4AA] top-1/2 -left-32"
          style={{ animationDuration: '24s', animationDelay: '-6s' }}
        />
      </div>

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-6 relative z-10">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2.5rem] glass-card-heavy p-6 md:p-10 mb-8 shadow-2xl border border-white/10"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 text-[#FFB347] text-xs font-black uppercase tracking-wider mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4AA]" />
              </span>
              Cafe @7 Official Menu • 44 Verified Pure Veg Dishes
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              What's Cooking{' '}
              <span className="bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-[#00D4AA] bg-clip-text text-transparent">
                Today?
              </span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-medium">
              100% Pure Vegetarian campus cuisine. Pre-order before the break bell rings and pick up hot at Cafe @7.
            </p>
          </div>
        </motion.div>

        {/* Search + Category Pills */}
        <div className="mb-8 space-y-5">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search 44+ dishes (e.g. Dosa, Vada Pav, Sandwich)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#12121A] border border-white/10 rounded-2xl pl-11 pr-11 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] focus:ring-2 focus:ring-[#FF6B2C]/20 transition-all shadow-inner"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 transition cursor-pointer"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('All')}
              className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black shadow-lg shadow-[#FF6B2C]/25'
                  : 'bg-[#12121A] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5'
              }`}
            >
              🍽 All Items
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black shadow-lg shadow-[#FF6B2C]/25'
                    : 'bg-[#12121A] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span>{cat.icon || '🍽'}</span>
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Grid with Spotlight Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <DishCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 glass-card rounded-[2.5rem] border-dashed border-white/15"
          >
            <Search className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No dishes found</h3>
            <p className="text-sm text-zinc-400 mb-6">Try searching for something else or reset your active filters.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-6 py-3 rounded-2xl bg-[#FF6B2C]/20 border border-[#FF6B2C]/30 text-[#FFB347] font-bold cursor-pointer hover:bg-[#FF6B2C]/30 transition"
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredItems.map((dish) => {
                const qty = getCartQuantity(dish.id);
                const isAvailable = getEffectiveAvailability(dish);
                const stockQty = getStockQuantity(dish.id);
                const isMaxStockReached = stockQty !== null && stockQty !== undefined && qty >= stockQty;
                const tagVariant = dish.tag ? TAG_VARIANT[dish.tag] || 'custom' : null;

                return (
                  <SpotlightCard
                    key={dish.id}
                    spotlightColor="rgba(255, 107, 44, 0.22)"
                    className={`p-6 flex flex-col justify-between group relative ${
                      !isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''
                    }`}
                  >
                    <InventoryBadge item={dish} size="sm" position="top-right" />
                    {!isAvailable && (
                      <div className="absolute inset-0 z-20 bg-black/60 rounded-[2rem] flex items-center justify-center backdrop-blur-[2px]">
                        <span className="px-4 py-2 rounded-2xl bg-red-950 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                          <Info size={14} /> Sold Out
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="veg" />
                          {tagVariant && <Badge variant={tagVariant}>{dish.tag}</Badge>}
                        </div>
                        {dish.prep_time_mins && (
                          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                            ⏱ {dish.prep_time_mins}m
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-black text-white group-hover:text-[#FFB347] transition-colors leading-tight mb-1">
                        {dish.name}
                      </h3>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {getCategoryName(dish.category_id)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Price</span>
                        <div className="text-xl font-black text-white">₹{Number(dish.price).toFixed(0)}</div>
                      </div>

                      {qty === 0 ? (
                        <motion.button
                          whileHover={isAvailable && (stockQty === null || stockQty === undefined || stockQty > 0) ? { scale: 1.06 } : {}}
                          whileTap={isAvailable && (stockQty === null || stockQty === undefined || stockQty > 0) ? { scale: 0.94 } : {}}
                          disabled={!isAvailable || (stockQty !== null && stockQty !== undefined && stockQty <= 0)}
                          onClick={() =>
                            addItem({
                              id: dish.id,
                              name: dish.name,
                              price: Number(dish.price),
                              tag: dish.tag,
                              category: getCategoryName(dish.category_id),
                              maxStock: stockQty,
                            })
                          }
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black font-black text-xs shadow-lg shadow-[#FF6B2C]/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span>Add</span>
                          <span className="text-base font-black">+</span>
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-2xl p-1 shadow-inner">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(dish.id)}
                            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black text-sm flex items-center justify-center transition cursor-pointer"
                          >
                            −
                          </motion.button>
                          <span className="w-8 text-center font-black text-base text-[#FFB347]">{qty}</span>
                          <motion.button
                            whileTap={!isMaxStockReached ? { scale: 0.9 } : {}}
                            disabled={isMaxStockReached}
                            onClick={() =>
                              !isMaxStockReached &&
                              addItem({
                                id: dish.id,
                                name: dish.name,
                                price: Number(dish.price),
                                tag: dish.tag,
                                category: getCategoryName(dish.category_id),
                                maxStock: stockQty,
                              })
                            }
                            className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center transition ${
                              isMaxStockReached
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-40 shadow-none'
                                : 'bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-md shadow-[#FF6B2C]/30 cursor-pointer'
                            }`}
                            title={isMaxStockReached ? `Maximum stock of ${stockQty} reached` : 'Add one more'}
                          >
                            +
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </SpotlightCard>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Floating Cart Tray */}
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-4 right-4 max-w-3xl mx-auto z-40"
          >
            <div className="glass-card-heavy rounded-[2.5rem] p-4 md:p-5 shadow-2xl shadow-black/90 flex items-center justify-between gap-4 border-2 border-[#FF6B2C]/40 relative overflow-hidden">
              <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#FF6B2C]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] text-black flex items-center justify-center shadow-lg shadow-[#FF6B2C]/30">
                  <ShoppingCart size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    {totalCount} {totalCount === 1 ? 'Item' : 'Items'} in tray
                  </div>
                  <div className="text-2xl font-black text-white">₹{totalAmount.toFixed(0)}</div>
                </div>
              </div>

              <Link href="/checkout" className="relative z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 md:px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B2C] via-[#FF8A3D] to-[#FFB347] text-black font-black text-sm md:text-base shadow-2xl shadow-[#FF6B2C]/40 flex items-center gap-2 cursor-pointer"
                >
                  <span>Checkout</span>
                  <span className="text-xl">→</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
