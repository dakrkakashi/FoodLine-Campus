'use client';

import React from 'react';
import { MenuItem } from '../lib/types';
import { formatINR } from '../lib/utils';
import { VegIcon, NonVegIcon, EggIcon, ClockIcon } from './icons';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import { InventoryBadge } from './ui/InventoryBadge';
import { MorphingStepper } from './ui/MorphingStepper';
import { useToast } from '../context/ToastContext';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, removeItem } = useCart();
  const { getEffectiveAvailability, isLowStock, getStockQuantity } = useInventory();
  const { cart: toastCart } = useToast();

  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isAvailable = getEffectiveAvailability(item);
  const lowStock = isLowStock(item);
  const stockQty = getStockQuantity(item.id);
  const isMaxStockReached = stockQty !== null && stockQty !== undefined && quantity >= stockQty;
  const isSoldOut = !isAvailable || (stockQty !== null && stockQty !== undefined && stockQty <= 0);

  const isEgg = item.name.toLowerCase().includes('egg') || (item.category && item.category.toLowerCase().includes('egg'));
  const isNonVeg = item.category && (item.category.toLowerCase().includes('non-veg') || item.category.toLowerCase().includes('chicken'));

  const tagColor =
    item.tag === 'Bestseller'
      ? 'border-accent-amber/40 text-accent-amber bg-accent-amber/10'
      : item.tag === 'Student Fav'
      ? 'border-[#00D4AA]/40 text-[#00D4AA] bg-[#00D4AA]/10'
      : item.tag === 'Fast Grab'
      ? 'border-accent-purple/40 text-accent-purple bg-accent-purple/10'
      : 'border-(--border-glass) text-(--text-secondary) bg-black/5 dark:bg-white/5';

  return (
    <div
      className={`group relative bg-(--bg-card)/90 backdrop-blur-xl border rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent-orange/15 ${
        !isAvailable
          ? 'opacity-60 border-red-500/20 bg-red-950/10'
          : quantity > 0
          ? 'border-accent-orange/60 shadow-accent-orange/15 ring-2 ring-accent-orange/30'
          : 'border-(--border-glass) hover:border-accent-orange/40'
      }`}
    >
      <InventoryBadge item={item} size="sm" position="top-right" />

      <div>
        {/* Top Dietary & Highlight Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 dark:bg-white/5 border border-white/10">
            {isNonVeg ? (
              <>
                <NonVegIcon className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-black tracking-wider text-[#E11D48]">
                  Non-Veg
                </span>
              </>
            ) : isEgg ? (
              <>
                <EggIcon className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-black tracking-wider text-[#F59E0B]">
                  Contains Egg
                </span>
              </>
            ) : (
              <>
                <VegIcon className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-black tracking-wider text-[#00C261]">
                  Pure Veg
                </span>
              </>
            )}
          </div>

          {item.tag && !lowStock && isAvailable && (
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tagColor}`}
            >
              {item.tag}
            </span>
          )}
        </div>

        {/* Dish Title */}
        <h3 className="font-extrabold text-base text-(--text-primary) group-hover:text-accent-amber transition-colors leading-snug mb-1.5">
          {item.name}
        </h3>

        {/* Prep Time Estimate */}
        <div className="flex items-center gap-1.5 text-xs text-(--text-secondary) mb-3">
          <ClockIcon className="w-3.5 h-3.5 text-accent-amber shrink-0" />
          <span className="font-medium text-[11px]">~{item.prep_time_mins || 5} mins fresh prep</span>
        </div>
      </div>

      {/* Footer Price & Morphing Stepper */}
      <div className="flex items-center justify-between pt-3 border-t border-(--border-glass) mt-auto">
        <div>
          <span className="text-[10px] text-(--text-muted) uppercase font-bold tracking-wider block">
            Price
          </span>
          <span className="font-black text-lg text-(--text-primary) tracking-tight font-mono">
            {formatINR(item.price)}
          </span>
        </div>

        <MorphingStepper
          quantity={quantity}
          disabled={isSoldOut}
          isMaxReached={isMaxStockReached}
          itemName={item.name}
          onAdd={() => {
            toastCart(`Added ${item.name} to Tray!`);
            addItem({
              id: item.id,
              name: item.name,
              price: item.price,
              category: item.category,
              tag: item.tag,
              maxStock: stockQty,
            });
          }}
          onRemove={() => {
            removeItem(item.id);
          }}
        />
      </div>
    </div>
  );
}
