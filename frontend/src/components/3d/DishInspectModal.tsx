'use client';

import React from 'react';
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
          className="relative w-full max-w-xl bg-[#12121A] border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(255,107,44,0.18)] z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#FF6B2C]/20 text-[#FF6B2C]">
                <Sparkles size={16} />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
                Interactive 3D Dish View
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* 3D WebGL Canvas Viewport */}
          <div className="relative w-full h-[280px] sm:h-[320px] bg-gradient-to-b from-[#181824]/60 to-[#0F0F17]">
            <Food3DViewer modelType={modelType} className="w-full h-full" autoRotate={true} />
            <div className="absolute top-3 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-zinc-400">
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                      {item.category}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white">{item.name}</h2>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-zinc-500 font-bold uppercase">Price</div>
                <div className="text-2xl font-black text-[#00D4AA]">₹{item.price}</div>
              </div>
            </div>

            {/* Fresh Preparation Signals */}
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
                <Clock size={15} className="text-[#FFB347]" />
                <span>
                  Prep time: <strong>~{item.prep_time_mins || 5} mins</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
                <CheckCircle2 size={15} className="text-[#00D4AA]" />
                <span>Express Campus Pickup</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-zinc-400">
                {quantity > 0 ? (
                  <span>
                    In Cart:{' '}
                    <strong className="text-white">
                      {quantity} (₹{quantity * item.price})
                    </strong>
                  </span>
                ) : (
                  <span>Instant slot reservation</span>
                )}
              </div>

              {quantity === 0 ? (
                <button
                  disabled={!isAvailable || (stockQty !== null && stockQty !== undefined && stockQty <= 0)}
                  onClick={() =>
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      tag: item.tag,
                      category: item.category,
                      maxStock: stockQty,
                    })
                  }
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black font-black text-sm shadow-lg shadow-[#FF6B2C]/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Order Tray</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-2xl p-1.5">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-sm flex items-center justify-center transition cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-black text-base text-[#FFB347]">{quantity}</span>
                  <button
                    disabled={isMaxStockReached}
                    onClick={() =>
                      !isMaxStockReached &&
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        tag: item.tag,
                        category: item.category,
                        maxStock: stockQty,
                      })
                    }
                    className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center transition ${
                      isMaxStockReached
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
                        : 'bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90 cursor-pointer'
                    }`}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
