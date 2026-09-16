'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Food3DViewer } from './Food3DViewer';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { Badge } from '@/components/ui/Badge';

export interface DishInspectItem {
  id: string;
  name: string;
  tag?: string;
  price: number;
  prep_time_mins?: number;
  category?: string;
  is_available?: boolean;
}

interface DishInspectModalProps {
  item: DishInspectItem | null;
  onClose: () => void;
}

export function getDishModelType(name: string): 'burger' | 'coffee' | 'dosa' {
  const lower = name.toLowerCase();
  if (
    lower.includes('coffee') ||
    lower.includes('tea') ||
    lower.includes('chai') ||
    lower.includes('frappe') ||
    lower.includes('cappuccino') ||
    lower.includes('mojito') ||
    lower.includes('sips')
  ) {
    return 'coffee';
  }
  if (
    lower.includes('dosa') ||
    lower.includes('roll') ||
    lower.includes('wrap') ||
    lower.includes('puff') ||
    lower.includes('vada') ||
    lower.includes('idli')
  ) {
    return 'dosa';
  }
  return 'burger';
}

export function DishInspectModal({ item, onClose }: DishInspectModalProps) {
  const { items: cartItems, addItem, removeItem } = useCart();
  const { getStockQuantity } = useInventory();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!item) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item]);

  if (!item) return null;

  const modelType = getDishModelType(item.name);
  const cartItem = cartItems.find((i) => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const stockQty = getStockQuantity(item.id);
  const isMaxStockReached = stockQty !== null && stockQty !== undefined && quantity >= stockQty;
  const isAvailable = item.is_available !== false;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Darkened Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-glass)] text-[var(--text-primary)] rounded-3xl overflow-hidden shadow-2xl z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-[var(--border-glass)]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#FF6B2C]/20 text-[#FF6B2C]">
                <Sparkles size={16} />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Interactive 3D Dish View
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* 3D WebGL Canvas Viewport */}
          <div className="relative w-full h-[280px] sm:h-[320px] bg-black/[0.03] dark:bg-gradient-to-b dark:from-[#181824]/60 dark:to-[#0F0F17]">
            <Food3DViewer modelType={modelType} className="w-full h-full" autoRotate={true} />
            <div className="absolute top-3 left-4 px-3 py-1 rounded-full bg-black/40 dark:bg-black/60 backdrop-blur-md border border-[var(--border-glass)] text-[10px] font-bold text-[var(--text-secondary)]">
              Model: {modelType.toUpperCase()}
            </div>
          </div>

          {/* Dish Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge variant="veg" />
                  {item.tag && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFB347]/15 text-[#FFB347] border border-[#FFB347]/30">
                      {item.tag}
                    </span>
                  )}
                  {item.category && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border border-[var(--border-glass)]">
                      {item.category}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-[var(--text-primary)]">{item.name}</h2>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-[var(--text-muted)] font-bold uppercase">Price</div>
                <div className="text-2xl font-black text-[#00D4AA]">₹{item.price}</div>
              </div>
            </div>

            {/* Fresh Preparation Signals */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-primary)] pt-2 border-t border-[var(--border-glass)]">
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-xl p-2.5">
                <Clock size={15} className="text-[#FFB347] font-bold" />
                <span>
                  Prep time: <strong>~{item.prep_time_mins || 5} mins</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] rounded-xl p-2.5">
                <CheckCircle2 size={15} className="text-[#00D4AA]" />
                <span>Express Campus Pickup</span>
              </div>
            </div>

            {/* Allergen & Kitchen Intermediary Disclaimer */}
            <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[11px] text-[var(--text-secondary)] leading-relaxed space-y-0.5">
              <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 text-[11px]">
                <span>Allergen & Quality Notice</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Prepared by campus canteen kitchen staff. May contain gluten, dairy, or nuts. FoodLine serves as an ordering intermediary; food quality & FSSAI hygiene are maintained directly by the licensed canteen.
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-[var(--border-glass)] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Total in Tray</span>
                <span className="text-lg font-black text-[var(--text-primary)]">
                  {quantity > 0 ? `${quantity} added (₹${quantity * item.price})` : 'Not in tray'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {quantity > 0 ? (
                  <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-[var(--border-glass)]">
                    <button
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                          try { navigator.vibrate(30); } catch {}
                        }
                        removeItem(item.id);
                      }}
                      className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-lg font-bold transition active:scale-95 cursor-pointer flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-base min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      disabled={isMaxStockReached}
                      onClick={() => {
                        if (!isMaxStockReached) {
                          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                            try { navigator.vibrate(30); } catch {}
                          }
                          addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            tag: item.tag,
                            category: item.category,
                            maxStock: stockQty,
                          });
                        }
                      }}
                      className="w-9 h-9 rounded-xl bg-[#FF6B2C] text-black hover:bg-[#FF6B2C]/90 font-bold text-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={!isAvailable}
                    onClick={() => {
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        tag: item.tag,
                        category: item.category,
                        maxStock: stockQty,
                      });
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black font-extrabold text-sm shadow-xl shadow-[#FF6B2C]/20 transition active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={16} />
                    <span>{isAvailable ? 'Add to Tray' : 'Sold Out'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
