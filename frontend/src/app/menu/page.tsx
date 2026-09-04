'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ShoppingCart, Info, Sparkles, Flame, ArrowRight, ChevronRight, Store, MapPin } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { useCampus } from '@/context/CampusContext';
import { DishCardSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { InventoryBadge } from '@/components/ui/InventoryBadge';
import { PageTransition, SpotlightCard, SteamEffect, AnimatedCounter, FoodParticles, Magnetic } from '@/components/ui';
import { DishInspectModal, DishInspectItem } from '@/components/3d/DishInspectModal';
import { ChefExpressIllustration, EmptyMenuIllustration } from '@/components/illustrations';

interface MenuItem {
  id: string;
  name: string;
  tag?: string;
  price: number;
  prep_time_mins?: number;
  category_id?: string;
  category?: string;
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


const CANTEEN_SPECIFIC_DISHES: Record<string, MenuItem[]> = {
  'south-corner': [
    { id: 'sc-1', name: 'Ghee Roast Masala Dosa', price: 65, tag: 'Bestseller', prep_time_mins: 4, is_available: true },
    { id: 'sc-2', name: 'Mysore Butter Masala Dosa', price: 70, tag: 'Student Fav', prep_time_mins: 5, is_available: true },
    { id: 'sc-3', name: 'Rava Onion Crispy Dosa', price: 60, tag: 'Fast Grab', prep_time_mins: 4, is_available: true },
    { id: 'sc-4', name: 'Steamed Idli Sambar (2 Pcs)', price: 35, tag: 'Fast Grab', prep_time_mins: 2, is_available: true },
    { id: 'sc-5', name: 'Crispy Medu Vada (2 Pcs)', price: 40, tag: 'Bestseller', prep_time_mins: 3, is_available: true },
    { id: 'sc-6', name: 'Authentic Filter Kaapi', price: 25, tag: 'Student Fav', prep_time_mins: 2, is_available: true },
  ],
  'nescafe-kiosk': [
    { id: 'nk-1', name: 'Classic Chilled Iced Frappe', price: 55, tag: 'Bestseller', prep_time_mins: 2, is_available: true },
    { id: 'nk-2', name: 'Hot Hazelnut Cappuccino', price: 45, tag: 'Student Fav', prep_time_mins: 2, is_available: true },
    { id: 'nk-3', name: 'Double Masala Cheese Maggi', price: 50, tag: 'Bestseller', prep_time_mins: 4, is_available: true },
    { id: 'nk-4', name: 'Peri Peri Spicy Maggi', price: 45, tag: 'Spicy', prep_time_mins: 3, is_available: true },
    { id: 'nk-5', name: 'Fudge Walnut Brownie', price: 40, tag: 'Student Fav', prep_time_mins: 1, is_available: true },
    { id: 'nk-6', name: 'Crispy Veg Potato Puff', price: 25, tag: 'Fast Grab', prep_time_mins: 1, is_available: true },
  ],
  'mba-cafeteria': [
    { id: 'mba-1', name: 'Paneer Tikka Panini Grill', price: 85, tag: 'Bestseller', prep_time_mins: 6, is_available: true },
    { id: 'mba-2', name: 'Triple Layer Cheese Club Sandwich', price: 80, tag: 'Student Fav', prep_time_mins: 5, is_available: true },
    { id: 'mba-3', name: 'Spicy Corn & Jalapeño Sub', price: 75, tag: 'Fast Grab', prep_time_mins: 5, is_available: true },
    { id: 'mba-4', name: 'Loaded Cheesy Peri Peri Fries', price: 90, tag: 'Bestseller', prep_time_mins: 4, is_available: true },
    { id: 'mba-5', name: 'Mint Virgin Mojito', price: 50, tag: 'Student Fav', prep_time_mins: 2, is_available: true },
  ],
  'hostel-mess': [
    { id: 'hm-1', name: 'Deluxe Student Lunch Thali', price: 70, tag: 'Bestseller', prep_time_mins: 1, is_available: true },
    { id: 'hm-2', name: 'Regular Dal Tadka & Jeera Rice Thali', price: 50, tag: 'Fast Grab', prep_time_mins: 1, is_available: true },
    { id: 'hm-3', name: 'Hot Maharashtrian Kanda Poha', price: 25, tag: 'Student Fav', prep_time_mins: 1, is_available: true },
    { id: 'hm-4', name: 'Upma with Coconut Chutney', price: 25, tag: 'Fast Grab', prep_time_mins: 1, is_available: true },
  ],
};

export default function MenuPage() {
  const { items: cartItems, addItem, removeItem, updateQuantity, totalAmount, totalCount } = useCart();
  const { getEffectiveAvailability, getStockQuantity } = useInventory();
  const { selectedCampus, selectedCanteen, availableCanteens } = useCampus();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [inspectingDish, setInspectingDish] = useState<DishInspectItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedCategory('All');
    async function loadMenu() {
      try {
        setLoading(true);
        if (selectedCanteen.slug !== 'cafe7' && CANTEEN_SPECIFIC_DISHES[selectedCanteen.slug]) {
          // Display authentic dishes for selected canteen
          setCategories([
            { id: 'cat-all', name: 'All', icon: '🍽' },
            { id: 'cat-special', name: 'Specialty Menu', icon: '✨' },
          ]);
          setMenuItems(
            CANTEEN_SPECIFIC_DISHES[selectedCanteen.slug].map((dish) => ({
              ...dish,
              category: 'Specialty Menu',
              category_id: 'cat-special',
            }))
          );
          return;
        }

        const res = await fetch(`/api/menu?cafeteriaId=${selectedCanteen.id}`);
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
  }, [selectedCanteen.id, selectedCanteen.slug]);

  // Auto-clamp cart quantities if stock decreases below what is currently in cart
  useEffect(() => {
    for (const item of cartItems) {
      const stock = getStockQuantity(item.id);
      if (stock !== null && stock !== undefined && item.quantity > stock) {
        updateQuantity(item.id, stock, stock);
      }
    }
  }, [cartItems, getStockQuantity, updateQuantity]);

  const getCategoryName = useCallback(
    (catId?: string, rawCat?: string) => {
      if (catId) {
        const cat = categories.find((c) => c.id === catId);
        if (cat) return cat.name;
      }
      if (rawCat) {
        const cat = categories.find(
          (c) => c.name.toLowerCase() === rawCat.toLowerCase() || c.id === rawCat
        );
        if (cat) return cat.name;

        const norm = rawCat.toLowerCase();
        if (norm.includes('quick') || norm.includes('chaat')) return 'Quick Bites & Chaat';
        if (norm.includes('south') || norm.includes('north') || norm.includes('indian')) return 'South & North Indian';
        if (norm.includes('sandwich') || norm.includes('roll')) return 'Loaded Sandwiches';
        if (norm.includes('momo') || norm.includes('burger')) return 'Momos & Burgers';
        if (norm.includes('frie') || norm.includes('pasta')) return 'Fries & Pastas';
        if (norm.includes('garlic') || norm.includes('bread') || norm.includes('pizza')) return 'Garlic Bread & Pizzas';
        if (norm.includes('maggi') || norm.includes('chinese') || norm.includes('rice') || norm.includes('noodle')) return 'Maggi, Chinese & Rice';
        if (norm.includes('beverage') || norm.includes('dessert') || norm.includes('shake') || norm.includes('coffee') || norm.includes('tea')) return 'Beverages & Desserts';

        return rawCat;
      }
      return '';
    },
    [categories]
  );

  const isCategoryMatch = useCallback(
    (item: MenuItem, selectedCat: string): boolean => {
      if (!selectedCat || selectedCat === 'All') return true;

      // 1. Direct ID match
      if (item.category_id === selectedCat) return true;

      // 2. Direct name match
      if (item.category && item.category.toLowerCase() === selectedCat.toLowerCase()) return true;

      // 3. Category lookup in categories array
      const matchedCat = categories.find(
        (c) => c.name.toLowerCase() === selectedCat.toLowerCase() || c.id === selectedCat
      );
      if (matchedCat) {
        if (item.category_id && item.category_id === matchedCat.id) return true;
        if (item.category && item.category.toLowerCase() === matchedCat.name.toLowerCase()) return true;
      }

      // 4. Resolved Category Name Match
      const resolvedName = getCategoryName(item.category_id, item.category);
      if (resolvedName && resolvedName.toLowerCase() === selectedCat.toLowerCase()) return true;

      // 5. Semantic / Group Matching
      const selNorm = selectedCat.toLowerCase();
      const itemCat = (item.category || '').toLowerCase();
      const itemTag = (item.tag || '').toLowerCase();
      const itemName = (item.name || '').toLowerCase();

      if (selNorm.includes('quick') || selNorm.includes('chaat')) {
        return (
          itemCat.includes('quick') ||
          itemCat.includes('chaat') ||
          itemTag.includes('chaat') ||
          itemTag.includes('grab')
        );
      }
      if (selNorm.includes('south') || selNorm.includes('north') || selNorm.includes('indian')) {
        return (
          itemCat.includes('south') ||
          itemCat.includes('north') ||
          itemCat.includes('indian') ||
          itemTag.includes('south') ||
          itemTag.includes('north') ||
          itemName.includes('dosa') ||
          itemName.includes('idli') ||
          itemName.includes('uttapa') ||
          itemName.includes('bhature')
        );
      }
      if (selNorm.includes('sandwich')) {
        return itemCat.includes('sandwich') || itemCat.includes('roll') || itemName.includes('sandwich');
      }
      if (selNorm.includes('momo') || selNorm.includes('burger')) {
        return (
          itemCat.includes('momo') ||
          itemCat.includes('burger') ||
          itemName.includes('burger') ||
          itemName.includes('momo')
        );
      }
      if (selNorm.includes('frie') || selNorm.includes('pasta')) {
        return (
          itemCat.includes('frie') ||
          itemCat.includes('pasta') ||
          itemName.includes('fries') ||
          itemName.includes('pasta')
        );
      }
      if (selNorm.includes('bread') || selNorm.includes('pizza')) {
        return (
          itemCat.includes('bread') ||
          itemCat.includes('pizza') ||
          itemName.includes('pizza') ||
          itemName.includes('bread') ||
          itemName.includes('toast')
        );
      }
      if (selNorm.includes('maggi') || selNorm.includes('chinese') || selNorm.includes('rice')) {
        return (
          itemCat.includes('maggi') ||
          itemCat.includes('chinese') ||
          itemCat.includes('rice') ||
          itemName.includes('maggi') ||
          itemName.includes('noodle') ||
          itemName.includes('fried rice') ||
          itemName.includes('manchurian')
        );
      }
      if (selNorm.includes('beverage') || selNorm.includes('dessert')) {
        return (
          itemCat.includes('beverage') ||
          itemCat.includes('dessert') ||
          itemCat.includes('shake') ||
          itemTag.includes('drink') ||
          itemName.includes('coffee') ||
          itemName.includes('tea') ||
          itemName.includes('shake') ||
          itemName.includes('juice') ||
          itemName.includes('frappe') ||
          itemName.includes('kaapi') ||
          itemName.includes('mojito')
        );
      }
      if (selNorm.includes('special')) {
        return true;
      }

      return false;
    },
    [categories, getCategoryName]
  );

  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) => {
        const matchesCategory = isCategoryMatch(item, selectedCategory);
        const matchesSearch =
          !search.trim() ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.tag && item.tag.toLowerCase().includes(search.toLowerCase())) ||
          (item.category && item.category.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesSearch;
      }),
    [menuItems, selectedCategory, search, isCategoryMatch]
  );

  const getCartQuantity = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <PageTransition className="min-h-screen bg-[var(--bg-canvas)] text-[#F5F5F7] pb-36 relative overflow-hidden transition-colors duration-500">
      {/* Background Aurora Mesh */}
      <div className="aurora-mesh">
        <div
          className="aurora-blob w-[36rem] h-[36rem] bg-accent-orange -top-24 -right-20"
          style={{ animationDuration: '18s' }}
        />
        <div
          className="aurora-blob w-[38rem] h-[38rem] bg-accent-teal top-1/2 -left-32"
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
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-orange/15 border border-accent-orange/30 text-accent-amber text-xs font-black uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal" />
                </span>
                {selectedCanteen.name} • {selectedCampus.name}
              </div>

              {/* Fast Canteen Switcher Button */}
              <Link href="/canteens">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
                >
                  <Store size={13} className="text-accent-amber" />
                  <span>Switch Canteen ({availableCanteens.length} Active)</span>
                  <ChevronRight size={13} className="text-accent-orange" />
                </motion.button>
              </Link>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              What&apos;s Cooking{' '}
              <span className="bg-linear-to-r from-accent-orange via-accent-amber to-accent-teal bg-clip-text text-transparent">
                Today?
              </span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-medium">
              100% Pure Vegetarian campus cuisine at <strong className="text-white">{selectedCanteen.name}</strong> ({selectedCanteen.location}). Pre-order before the break bell rings and pick up hot!
            </p>
          </div>

          {/* Dynamic Illustrated Express Wok Accent */}
          <div className="hidden md:flex absolute right-6 bottom-3 pointer-events-none z-10">
            <ChefExpressIllustration size={160} />
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
              className="w-full bg-[var(--bg-card)] border border-white/10 rounded-2xl pl-11 pr-11 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all shadow-inner"
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
            <Magnetic strength={0.15}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory('All')}
                className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === 'All'
                    ? 'bg-linear-to-r from-accent-orange to-accent-amber text-black shadow-lg shadow-accent-orange/25'
                    : 'bg-[var(--bg-card)] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span>🍽</span>
                <span>All Items</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedCategory === 'All' ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {menuItems.length}
                </span>
              </motion.button>
            </Magnetic>
            {categories.map((cat) => {
              const count = menuItems.filter((item) => isCategoryMatch(item, cat.name)).length;
              return (
                <Magnetic key={cat.id} strength={0.15}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'bg-linear-to-r from-accent-orange to-accent-amber text-black shadow-lg shadow-accent-orange/25'
                        : 'bg-[var(--bg-card)] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <span>{cat.icon || '🍽'}</span>
                    <span>{cat.name}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          selectedCategory === cat.name ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </motion.button>
                </Magnetic>
              );
            })}
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
            className="text-center py-16 px-4 glass-card rounded-[2.5rem] border-dashed border-white/15"
          >
            <EmptyMenuIllustration size={160} className="mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">No dishes found</h3>
            <p className="text-sm text-zinc-400 mb-6 max-w-sm mx-auto">Try searching for something else or reset your active filters.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-6 py-3 rounded-2xl bg-accent-orange/20 border border-accent-orange/30 text-accent-amber font-bold cursor-pointer hover:bg-accent-orange/30 transition"
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((dish) => {
              const qty = getCartQuantity(dish.id);
              const isAvailable = getEffectiveAvailability(dish);
              const stockQty = getStockQuantity(dish.id);
              const isMaxStockReached = stockQty !== null && stockQty !== undefined && qty >= stockQty;
              const tagVariant = dish.tag ? TAG_VARIANT[dish.tag] || 'custom' : null;

              return (
                <div
                  key={dish.id}
                  className={`h-full transition-transform duration-200 ${isAvailable ? 'hover:-translate-y-1' : ''}`}
                >
                  <SpotlightCard
                    spotlightColor="var(--accent-orange-glow, rgba(255, 107, 44, 0.18))"
                    className={`h-full p-6 flex flex-col justify-between group relative rounded-[2rem] border border-white/10 hover:border-accent-orange/50 hover:shadow-[0_0_24px_var(--accent-orange-glow)] transition-all duration-200 bg-[#16161E]/85 backdrop-blur-md ${
                      !isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''
                    }`}
                  >
                    <InventoryBadge item={dish} size="sm" position="top-right" />
                    {/* Zero-Lag Culinary Steam Effect (shows on hover) */}
                    {isAvailable && (dish.prep_time_mins || dish.name.toLowerCase().includes('dosa') || dish.name.toLowerCase().includes('chai') || dish.name.toLowerCase().includes('maggi') || dish.name.toLowerCase().includes('thali') || dish.name.toLowerCase().includes('pav')) && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <SteamEffect count={2} />
                      </div>
                    )}
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
                          <div className="flex items-center gap-1.5">
                            {dish.prep_time_mins && (
                              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                ⏱ {dish.prep_time_mins}m
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectingDish({
                                  id: dish.id,
                                  name: dish.name,
                                  tag: dish.tag,
                                  price: Number(dish.price),
                                  prep_time_mins: dish.prep_time_mins,
                                  category: getCategoryName(dish.category_id, dish.category),
                                  is_available: isAvailable,
                                });
                              }}
                              className="text-[10px] font-bold text-accent-amber bg-accent-orange/10 hover:bg-accent-orange/25 border border-accent-orange/30 px-2 py-1 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                              title="Inspect dish in 3D"
                            >
                              <span>3D</span>
                              <Sparkles size={11} className="text-accent-amber" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg font-black text-white group-hover:text-accent-amber transition-colors leading-tight mb-1">
                          {dish.name}
                        </h3>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          {getCategoryName(dish.category_id, dish.category) || dish.tag || 'Fresh Made'}
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
                                category: getCategoryName(dish.category_id, dish.category),
                                maxStock: stockQty,
                              })
                            }
                            className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-xs shadow-lg shadow-accent-orange/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
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
                            <span className="w-8 text-center font-black text-base text-accent-amber">{qty}</span>
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
                                  : 'bg-accent-orange hover:brightness-110 text-black shadow-md shadow-accent-orange/30 cursor-pointer'
                              }`}
                              title={isMaxStockReached ? `Maximum stock of ${stockQty} reached` : 'Add one more'}
                            >
                              +
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </SpotlightCard>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Spring-Physics Floating / Freeze Bottom Cart Pill (Portaled directly to body to bypass any transform or overflow restrictions) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {totalCount > 0 && (
            <motion.div
              initial={{ y: 90, scale: 0.88, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 90, scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="fixed bottom-6 sm:bottom-8 inset-x-0 z-[999] px-4 flex justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
            >
              <div className="pointer-events-auto w-full max-w-lg rounded-full glass-card-heavy backdrop-blur-2xl bg-[#16161E]/95 border-2 border-accent-orange/60 shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_35px_var(--accent-orange-glow)] p-2 sm:p-2.5 flex items-center justify-between gap-3 relative overflow-hidden">
                {/* Ambient radial glows */}
                <div className="absolute -left-10 -top-10 w-28 h-28 bg-accent-orange/25 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-accent-teal/20 rounded-full blur-xl pointer-events-none" />

                {/* Left Info: Animated Cart Icon with Pop Badge + Total */}
                <div className="flex items-center gap-3 pl-2 sm:pl-3 relative z-10">
                  <div className="relative">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-linear-to-tr from-accent-orange to-accent-amber text-black flex items-center justify-center shadow-lg shadow-accent-orange/35">
                      <ShoppingCart size={20} strokeWidth={2.5} />
                    </div>
                    {/* Bouncy live count badge with AnimatedCounter */}
                    <motion.span
                      key={totalCount}
                      initial={{ scale: 0.5, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 550, damping: 14 }}
                      className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-accent-teal text-black text-[10px] font-black flex items-center justify-center shadow-md border-2 border-[#16161E]"
                    >
                      <AnimatedCounter value={totalCount} />
                    </motion.span>
                  </div>

                  <div className="leading-tight">
                    <div className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Tray Subtotal</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-teal inline-block animate-pulse" />
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white font-mono flex items-baseline gap-1">
                      <AnimatedCounter value={totalAmount} prefix="₹" />
                      <span className="text-[10px] font-sans font-medium text-zinc-400">
                        ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right CTA Button with Magnetic Pull */}
                <Link href="/checkout" className="relative z-10 flex-shrink-0">
                  <Magnetic strength={0.25}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.94 }}
                      className="px-5 sm:px-7 py-3 rounded-full bg-linear-to-r from-accent-orange via-accent-amber to-accent-amber text-black font-black text-xs sm:text-sm shadow-xl shadow-accent-orange/35 flex items-center gap-2 cursor-pointer border border-white/20 uppercase tracking-wider"
                    >
                      <span>Select Slot</span>
                      <ArrowRight size={16} strokeWidth={3} className="text-black" />
                    </motion.button>
                  </Magnetic>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Interactive 3D Dish Inspection Modal */}
      <DishInspectModal item={inspectingDish} onClose={() => setInspectingDish(null)} />
    </PageTransition>
  );
}
