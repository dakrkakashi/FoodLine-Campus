'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  ShoppingCart,
  Info,
  Sparkles,
  Flame,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Store,
  MapPin,
  LayoutGrid,
  List,
} from 'lucide-react';
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
import { CampusCombosBar } from '@/components/menu/CampusCombosBar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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


export default function MenuPage() {
  useKeyboardShortcuts();
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
  const [gridMode, setGridMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foodline_menu_grid_mode') as 'grid' | 'list' | null;
      if (saved === 'grid' || saved === 'list') {
        setGridMode(saved);
      }
    }
  }, []);

  const handleGridModeChange = (mode: 'grid' | 'list') => {
    setGridMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('foodline_menu_grid_mode', mode);
    }
  };

  // Category horizontal scroll state & ref
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartPos, setScrollStartPos] = useState(0);

  const checkCategoryScroll = useCallback(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    checkCategoryScroll();

    el.addEventListener('scroll', checkCategoryScroll, { passive: true });
    window.addEventListener('resize', checkCategoryScroll);

    const timer = setTimeout(checkCategoryScroll, 120);

    return () => {
      el.removeEventListener('scroll', checkCategoryScroll);
      window.removeEventListener('resize', checkCategoryScroll);
      clearTimeout(timer);
    };
  }, [checkCategoryScroll, categories, menuItems]);

  const scrollCategories = (direction: 'left' | 'right') => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const scrollAmount = 260;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Mouse drag-to-scroll support for desktop trackpads & mice
  const handleCategoryMouseDown = (e: React.MouseEvent) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollStartPos(el.scrollLeft);
  };

  const handleCategoryMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = categoryScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollStartPos - walk;
  };

  const handleCategoryMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touchpad horizontal wheel passthrough
  const handleCategoryWheel = (e: React.WheelEvent) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaX) > 0) {
      // Natural horizontal swipe
      return;
    }
    if (e.shiftKey || Math.abs(e.deltaY) > 0) {
      // Convert vertical roll into horizontal scroll if hovering over track
      el.scrollLeft += e.deltaY;
    }
  };

  // Smoothly center selected category button inside track
  const handleCategorySelect = (categoryName: string, event?: React.MouseEvent) => {
    setSelectedCategory(categoryName);
    if (event?.currentTarget) {
      (event.currentTarget as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCartQuantity = useCallback((id: string) => {
    return cartItems.find((i) => i.id === id)?.quantity || 0;
  }, [cartItems]);

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      try {
        const canteenParam = selectedCanteen?.id ? `?canteenId=${selectedCanteen.id}` : '';
        const res = await fetch(`/api/menu${canteenParam}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.items) && data.items.length > 0) {
            setMenuItems(data.items);
            if (Array.isArray(data.categories) && data.categories.length > 0) {
              setCategories(data.categories);
            } else {
              const uniqueCats = Array.from(
                new Set(data.items.map((i: MenuItem) => i.category || 'Specialty'))
              );
              setCategories(
                uniqueCats.map((name, idx) => ({
                  id: String(idx + 1),
                  name: name as string,
                  icon: '🍽️',
                }))
              );
            }
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend menu unavailable, loading campus backup catalog:', err);
      }

      // Campus resilient fallback menu
      const fallbackCategories: Category[] = [
        { id: '1', name: 'Snacks & Quick Bites', icon: '🥟' },
        { id: '2', name: 'South Indian Specials', icon: '🥞' },
        { id: '3', name: 'Student Meals & Thalis', icon: '🍛' },
        { id: '4', name: 'Beverages & Chai', icon: '☕' },
        { id: '5', name: 'Sandwiches & Rolls', icon: '🥪' },
      ];

      const fallbackItems: MenuItem[] = [
        { id: 'f1', name: 'Samosa Pav (2 pcs)', category_id: '1', category: 'Snacks & Quick Bites', price: 40, prep_time_mins: 2, tag: 'Bestseller', is_available: true },
        { id: 'f2', name: 'Vada Pav Single', category_id: '1', category: 'Snacks & Quick Bites', price: 20, prep_time_mins: 2, tag: 'Fast Grab', is_available: true },
        { id: 'f3', name: 'Masala Dosa with Sambhar & Chutney', category_id: '2', category: 'South Indian Specials', price: 60, prep_time_mins: 5, tag: 'Bestseller', is_available: true },
        { id: 'f4', name: 'Idli Sambhar (2 pcs)', category_id: '2', category: 'South Indian Specials', price: 40, prep_time_mins: 3, tag: 'Student Fav', is_available: true },
        { id: 'f5', name: 'Medu Vada Sambhar (2 pcs)', category_id: '2', category: 'South Indian Specials', price: 45, prep_time_mins: 3, tag: 'Fast Grab', is_available: true },
        { id: 'f6', name: 'Mini Student Veg Thali', category_id: '3', category: 'Student Meals & Thalis', price: 80, prep_time_mins: 6, tag: 'Bestseller', is_available: true },
        { id: 'f7', name: 'Deluxe Rajma Chawal Bowl', category_id: '3', category: 'Student Meals & Thalis', price: 70, prep_time_mins: 4, tag: 'Student Fav', is_available: true },
        { id: 'f8', name: 'Special Cutting Chai', category_id: '4', category: 'Beverages & Chai', price: 15, prep_time_mins: 2, tag: 'Bestseller', is_available: true },
        { id: 'f9', name: 'Cold Coffee Frappe', category_id: '4', category: 'Beverages & Chai', price: 45, prep_time_mins: 3, tag: 'Student Fav', is_available: true },
        { id: 'f10', name: 'Grilled Cheese Sandwich', category_id: '5', category: 'Sandwiches & Rolls', price: 50, prep_time_mins: 5, tag: 'Fast Grab', is_available: true },
        { id: 'f11', name: 'Veg Schezwan Franky Roll', category_id: '5', category: 'Sandwiches & Rolls', price: 55, prep_time_mins: 5, tag: 'Spicy', is_available: true },
        { id: 'f12', name: 'Chole Bhature (2 pcs)', category_id: '3', category: 'Student Meals & Thalis', price: 75, prep_time_mins: 6, tag: 'Student Fav', is_available: true },
      ];

      setCategories(fallbackCategories);
      setMenuItems(fallbackItems);
      setLoading(false);
    }

    loadMenu();
  }, [selectedCanteen?.id]);

  const getCategoryName = useCallback(
    (categoryId?: string, directCategory?: string) => {
      if (directCategory) return directCategory;
      if (!categoryId) return '';
      const cat = categories.find((c) => c.id === categoryId);
      return cat ? cat.name : '';
    },
    [categories]
  );

  const isCategoryMatch = useCallback(
    (dish: MenuItem, catName: string) => {
      if (catName === 'All') return true;
      const cName = getCategoryName(dish.category_id, dish.category);
      if (cName.toLowerCase() === catName.toLowerCase()) return true;

      const normCat = catName.toLowerCase();
      const normDish = dish.name.toLowerCase();

      if (normCat.includes('snack') && (normDish.includes('samosa') || normDish.includes('vada') || normDish.includes('bhaji') || normDish.includes('poha') || normDish.includes('kachori') || normDish.includes('upma') || normDish.includes('cutlet'))) return true;
      if (normCat.includes('south') && (normDish.includes('dosa') || normDish.includes('idli') || normDish.includes('vada') || normDish.includes('uttapam'))) return true;
      if (normCat.includes('meal') && (normDish.includes('thali') || normDish.includes('chawal') || normDish.includes('rice') || normDish.includes('roti') || normDish.includes('paneer') || normDish.includes('bhature'))) return true;
      if (normCat.includes('beverage') && (normDish.includes('chai') || normDish.includes('tea') || normDish.includes('coffee') || normDish.includes('lassi') || normDish.includes('juice') || normDish.includes('shake') || normDish.includes('buttermilk'))) return true;
      if (normCat.includes('sand') && (normDish.includes('sandwich') || normDish.includes('toast') || normDish.includes('roll') || normDish.includes('franky') || normDish.includes('burger') || normDish.includes('wrap'))) return true;
      if (normCat.includes('chaat') && (normDish.includes('chaat') || normDish.includes('bhel') || normDish.includes('sev') || normDish.includes('puri') || normDish.includes('dahi'))) return true;
      if (normCat.includes('magg') && (normDish.includes('maggi') || normDish.includes('noodle'))) return true;
      if (normCat.includes('sweet') && (normDish.includes('gulab') || normDish.includes('halwa') || normDish.includes('pastry') || normDish.includes('ice cream') || normDish.includes('sweet'))) return true;

      return false;
    },
    [getCategoryName]
  );

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = isCategoryMatch(item, selectedCategory);
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.tag && item.tag.toLowerCase().includes(search.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [menuItems, selectedCategory, search, isCategoryMatch]);

  return (
    <PageTransition className="min-h-screen pb-36 text-(--text-primary) font-sans selection:bg-accent-orange/20 selection:text-accent-orange relative overflow-x-hidden">
      {/* Background Interactive Food Floating Orbs */}
      <FoodParticles />

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Banner with Active Canteen Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] p-6 md:p-10 mb-8 border border-(--border-glass) bg-linear-to-br from-accent-orange/15 via-accent-amber/5 to-transparent backdrop-blur-xl shadow-lg"
        >
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-accent-orange text-black font-black text-[10px] tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-accent-orange/25">
                <Flame size={12} />
                Live Campus Kitchen
              </span>

              <Link href="/canteens">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 hover:bg-accent-orange/20 border border-(--border-glass) hover:border-accent-orange/40 text-[11px] font-bold text-(--text-secondary) hover:text-(--text-primary) transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                  title="Switch to another canteen"
                >
                  <Store size={13} className="text-accent-amber" />
                  <span>Switch Canteen ({availableCanteens.length} Active)</span>
                  <ChevronRight size={13} className="text-accent-orange" />
                </motion.button>
              </Link>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-(--text-primary) tracking-tight mb-3">
              What&apos;s Cooking{' '}
              <span className="bg-linear-to-r from-accent-orange via-accent-amber to-accent-teal bg-clip-text text-transparent">
                Today?
              </span>
            </h1>
            <p className="text-xs md:text-sm text-(--text-secondary) leading-relaxed font-medium">
              100% Pure Vegetarian campus cuisine at <strong className="text-(--text-primary) font-black">{selectedCanteen.name}</strong> ({selectedCanteen.location}). Pre-order before the break bell rings and pick up hot!
            </p>
          </div>

          {/* Dynamic Illustrated Express Wok Accent */}
          <div className="hidden md:flex absolute right-6 bottom-3 pointer-events-none z-10">
            <ChefExpressIllustration size={160} />
          </div>
        </motion.div>

        {/* Sanjivani Campus Value Combos */}
        <CampusCombosBar />

        {/* Search + Grid View Mode Selector + Category Pills */}
        <div className="mb-8 space-y-5">
          {/* Search Bar + Grid View Mode Selector */}
          <div className="flex items-center justify-between gap-2.5 sm:gap-4 max-w-full">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
              <input
                type="text"
                id="menu-search-input"
                placeholder="Search 44+ dishes (Press '/' to focus)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-(--bg-card) border border-(--border-glass) rounded-2xl pl-11 pr-11 py-3 sm:py-3.5 text-xs sm:text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all shadow-inner"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Grid Selection Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-(--bg-card) border border-(--border-glass) shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => handleGridModeChange('grid')}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black ${
                  gridMode === 'grid'
                    ? 'bg-accent-orange text-black shadow-md shadow-accent-orange/25'
                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                }`}
                title="Compact Grid View (2-Columns on Mobile)"
                aria-label="Switch to compact grid view"
              >
                <LayoutGrid size={16} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => handleGridModeChange('list')}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black ${
                  gridMode === 'list'
                    ? 'bg-accent-orange text-black shadow-md shadow-accent-orange/25'
                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                }`}
                title="Single-Column List View"
                aria-label="Switch to single-column list view"
              >
                <List size={16} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills Container with Complete Scroll Option Suite */}
          <div className="relative group/category-scroll -mx-1 px-1">
            {/* Left Chevron Scroll Button */}
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => scrollCategories('left')}
                  aria-label="Scroll categories left"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-(--bg-glass-heavy) border border-(--border-glass) backdrop-blur-md shadow-xl text-(--text-primary) hover:text-accent-orange hover:border-accent-orange/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Left Gradient Edge Fade */}
            <div
              className={`absolute left-0 top-0 bottom-3 w-10 bg-linear-to-r from-(--bg-canvas) to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Right Gradient Edge Fade */}
            <div
              className={`absolute right-0 top-0 bottom-3 w-12 bg-linear-to-l from-(--bg-canvas) to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Right Chevron Scroll Button */}
            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => scrollCategories('right')}
                  aria-label="Scroll categories right"
                  className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-(--bg-glass-heavy) border border-(--border-glass) backdrop-blur-md shadow-xl text-(--text-primary) hover:text-accent-orange hover:border-accent-orange/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Scrollable Category Track */}
            <div
              ref={categoryScrollRef}
              onWheel={handleCategoryWheel}
              onMouseDown={handleCategoryMouseDown}
              onMouseMove={handleCategoryMouseMove}
              onMouseUp={handleCategoryMouseUpOrLeave}
              onMouseLeave={handleCategoryMouseUpOrLeave}
              className={`flex gap-2 overflow-x-auto pb-3 category-scrollbar snap-x cursor-grab active:cursor-grabbing select-none ${
                isDragging ? 'scroll-auto' : 'scroll-smooth'
              }`}
            >
              <Magnetic strength={0.15}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleCategorySelect('All', e)}
                  className={`snap-start shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCategory === 'All'
                      ? 'bg-linear-to-r from-accent-orange to-accent-amber text-black shadow-lg shadow-accent-orange/25'
                      : 'bg-(--bg-card) border border-(--border-glass) text-(--text-secondary) hover:text-(--text-primary) hover:border-accent-orange/40'
                  }`}
                >
                  <span>🍽️</span>
                  <span>All Items</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      selectedCategory === 'All' ? 'bg-black/20 text-black' : 'bg-black/5 dark:bg-white/10 text-(--text-secondary)'
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
                      onClick={(e) => handleCategorySelect(cat.name, e)}
                      className={`snap-start shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
                        selectedCategory === cat.name
                          ? 'bg-linear-to-r from-accent-orange to-accent-amber text-black shadow-lg shadow-accent-orange/25'
                          : 'bg-(--bg-card) border border-(--border-glass) text-(--text-secondary) hover:text-(--text-primary) hover:border-accent-orange/40'
                      }`}
                    >
                      <span>{cat.icon || '🍽️'}</span>
                      <span>{cat.name}</span>
                      {count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            selectedCategory === cat.name ? 'bg-black/20 text-black' : 'bg-black/5 dark:bg-white/10 text-(--text-secondary)'
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
        </div>

        {/* Menu Grid with Spotlight Cards */}
        {loading ? (
          <div className={gridMode === 'grid' ? "grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"}>
            {[...Array(6)].map((_, i) => (
              <DishCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-4 glass-card rounded-[2.5rem] border-dashed border-(--border-glass)"
          >
            <EmptyMenuIllustration size={160} className="mx-auto mb-2" />
            <h3 className="text-xl font-bold text-(--text-primary) mb-2">No dishes found</h3>
            <p className="text-sm text-(--text-secondary) mb-6 max-w-sm mx-auto">Try searching for something else or reset your active filters.</p>
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
          <div className={gridMode === 'grid' ? "grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"}>
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
                    className={`h-full flex flex-col justify-between group relative border border-(--border-glass) hover:border-accent-orange/50 hover:shadow-[0_0_24px_var(--accent-orange-glow)] transition-all duration-200 bg-(--bg-card) backdrop-blur-md shadow-sm dark:shadow-none ${
                      gridMode === 'grid' ? 'p-3.5 sm:p-6 rounded-2xl sm:rounded-4xl' : 'p-5 sm:p-6 rounded-3xl sm:rounded-4xl'
                    } ${
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
                      <div className="absolute inset-0 z-20 bg-black/40 dark:bg-black/60 rounded-2xl sm:rounded-4xl flex items-center justify-center backdrop-blur-[2px]">
                        <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-red-500/20 dark:bg-red-950 border border-red-500/40 text-red-600 dark:text-red-400 text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                          <Info size={13} /> Sold Out
                        </span>
                      </div>
                    )}

                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant="veg" />
                            {tagVariant && <Badge variant={tagVariant}>{dish.tag}</Badge>}
                          </div>
                          <div className="flex items-center gap-1">
                            {dish.prep_time_mins && (
                              <span className="text-[10px] sm:text-[11px] font-bold text-(--text-secondary) flex items-center gap-0.5 sm:gap-1 bg-black/5 dark:bg-white/5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                                ⏱️ {dish.prep_time_mins}m
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
                              className="text-[9px] sm:text-[10px] font-bold text-accent-amber bg-accent-orange/10 hover:bg-accent-orange/25 border border-accent-orange/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-0.5 sm:gap-1 shrink-0"
                              title="Inspect dish in 3D"
                            >
                              <span>3D</span>
                              <Sparkles size={10} className="text-accent-amber" />
                            </button>
                          </div>
                        </div>

                        <h3 className={`font-black text-(--text-primary) group-hover:text-accent-amber transition-colors leading-snug mb-1 line-clamp-2 ${
                          gridMode === 'grid' ? 'text-xs sm:text-lg' : 'text-sm sm:text-lg'
                        }`}>
                          {dish.name}
                        </h3>
                        <span className="text-[9px] sm:text-[10px] font-black text-(--text-muted) uppercase tracking-wider line-clamp-1">
                          {getCategoryName(dish.category_id, dish.category) || dish.tag || 'Fresh Made'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4 sm:mt-6 pt-2.5 sm:pt-4 border-t border-(--border-glass)">
                        <div>
                          <span className="text-[9px] sm:text-[10px] text-(--text-muted) uppercase tracking-wider font-bold">Price</span>
                          <div className={`font-black text-(--text-primary) ${gridMode === 'grid' ? 'text-base sm:text-xl' : 'text-lg sm:text-xl'}`}>
                            ₹{Number(dish.price).toFixed(0)}
                          </div>
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
                            className={`rounded-xl sm:rounded-2xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black shadow-lg shadow-accent-orange/20 cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                              gridMode === 'grid' ? 'px-2.5 sm:px-5 py-1.5 sm:py-2.5 text-[11px] sm:text-xs' : 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs'
                            }`}
                          >
                            <span>Add</span>
                            <span className="text-sm sm:text-base font-black">+</span>
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-1 sm:gap-1.5 bg-black/5 dark:bg-black/40 border border-(--border-glass) rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-inner">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(dish.id)}
                              className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-(--text-primary) font-black text-xs sm:text-sm flex items-center justify-center transition cursor-pointer"
                            >
                              −
                            </motion.button>
                            <span className="w-5 sm:w-8 text-center font-black text-xs sm:text-base text-accent-amber">{qty}</span>
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
                              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm flex items-center justify-center transition ${
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

      {/* Spring-Physics Floating Bottom Cart Pill — Elevated above bottom navigation bar */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {totalCount > 0 && (
            <motion.div
              initial={{ y: 90, scale: 0.88, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 90, scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="fixed bottom-[94px] sm:bottom-8 inset-x-0 z-45 px-4 flex justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
            >
              <div className="pointer-events-auto w-full max-w-lg rounded-full glass-card-heavy backdrop-blur-2xl bg-(--bg-card)/95 border-2 border-accent-orange/60 shadow-[0_16px_50px_rgba(0,0,0,0.15),0_0_35px_var(--accent-orange-glow)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_35px_var(--accent-orange-glow)] p-2 sm:p-2.5 flex items-center justify-between gap-3 relative overflow-hidden">
                {/* Ambient radial glows */}
                <div className="absolute -left-10 -top-10 w-28 h-28 bg-accent-orange/25 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-accent-teal/20 rounded-full blur-xl pointer-events-none" />

                {/* Left Info: Animated Cart Icon with Pop Badge + Total */}
                <Link href="/cart" className="flex items-center gap-3 pl-2 sm:pl-3 relative z-10 group hover:opacity-90 transition-opacity" aria-label="Review food tray in detail">
                  <div className="relative">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-linear-to-tr from-accent-orange to-accent-amber text-white flex items-center justify-center shadow-lg shadow-accent-orange/35">
                      <ShoppingCart size={20} strokeWidth={2.5} />
                    </div>
                    {/* Bouncy live count badge with AnimatedCounter */}
                    <motion.span
                      key={totalCount}
                      initial={{ scale: 0.5, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 550, damping: 14 }}
                      className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent-teal text-black text-[10px] font-black flex items-center justify-center shadow-md border-2 border-(--bg-card)"
                    >
                      <AnimatedCounter value={totalCount} />
                    </motion.span>
                  </div>

                  <div className="leading-tight">
                    <div className="text-[10px] sm:text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider flex items-center gap-1.5">
                      <span>Tray Subtotal</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-teal inline-block animate-pulse" />
                    </div>
                    <div className="text-lg sm:text-xl font-black text-(--text-primary) font-mono flex items-baseline gap-1">
                      <AnimatedCounter value={totalAmount} prefix="₹" />
                      <span className="text-[10px] font-sans font-medium text-(--text-secondary)">
                        ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Right CTA Button with Magnetic Pull */}
                <Link href="/checkout" className="relative z-10 shrink-0">
                  <Magnetic strength={0.25}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-accent-orange/35 hover:shadow-accent-orange/50 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Checkout</span>
                      <ArrowRight size={16} strokeWidth={2.5} />
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
      {inspectingDish && (
        <DishInspectModal item={inspectingDish} onClose={() => setInspectingDish(null)} />
      )}
    </PageTransition>
  );
}
