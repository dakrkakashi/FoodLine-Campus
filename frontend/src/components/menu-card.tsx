'use client';

import React from 'react';
import { MenuItem } from '../lib/types';
import { formatINR } from '../lib/utils';
import { VegIcon, ClockIcon } from './icons';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import { InventoryBadge } from './ui/InventoryBadge';
import { useSoundFX } from '../hooks/useSoundFX';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, removeItem } = useCart();
  const { getEffectiveAvailability, isLowStock, getStockQuantity } = useInventory();
  const { playPop, playClick } = useSoundFX();

  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isAvailable = getEffectiveAvailability(item);
  const lowStock = isLowStock(item);
  const stockQty = getStockQuantity(item.id);
  const isMaxStockReached = stockQty !== null && stockQty !== undefined && quantity >= stockQty;

  const tagColor =
    item.tag === 'Bestseller'
      ? 'border-accent-amber/40 text-accent-amber bg-accent-amber/10'
      : item.tag === 'Student Fav'
      ? 'border-accent-teal/40 text-accent-teal bg-accent-teal/10'
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
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
            <VegIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-500 dark:text-emerald-400">
              Pure Veg
            </span>
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

      {/* Footer Price & Add Button */}
      <div className="flex items-center justify-between pt-3 border-t border-(--border-glass) mt-auto">
        <div>
          <span className="text-[10px] text-(--text-muted) uppercase font-bold tracking-wider block">
            Price
          </span>
          <span className="font-black text-lg text-(--text-primary) tracking-tight font-mono">
            {formatINR(item.price)}
          </span>
        </div>

        {!isAvailable || (stockQty !== null && stockQty !== undefined && stockQty <= 0) ? (
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 select-none">
            Sold Out
          </span>
        ) : quantity === 0 ? (
          <button
            type="button"
            onClick={() => {
              playPop();
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                category: item.category,
                tag: item.tag,
                maxStock: stockQty,
              });
            }}
            aria-label={`Add ${item.name} to tray for ${formatINR(item.price)}`}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber hover:brightness-110 text-black font-black text-xs shadow-lg shadow-accent-orange/25 transition active:scale-95 cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
          >
            <span>+ Add</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-accent-orange/40 rounded-2xl p-1 shadow-md shadow-accent-orange/10">
            <button
              type="button"
              onClick={() => {
                playClick();
                removeItem(item.id);
              }}
              aria-label={`Decrease quantity for ${item.name}`}
              className="w-9 h-9 min-w-[36px] rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-(--text-primary) font-black text-sm flex items-center justify-center transition active:scale-90 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
            >
              −
            </button>
            <span
              className="text-xs font-black font-mono text-accent-teal min-w-5 text-center"
              aria-label={`Quantity: ${quantity}`}
            >
              {quantity}
            </span>
            <button
              type="button"
              disabled={isMaxStockReached}
              onClick={() => {
                if (!isMaxStockReached) {
                  playPop();
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    tag: item.tag,
                    maxStock: stockQty,
                  });
                }
              }}
              aria-label={`Increase quantity for ${item.name}`}
              className={`w-9 h-9 min-w-[36px] rounded-xl font-black text-sm flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden ${
                isMaxStockReached
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
                  : 'bg-accent-orange hover:brightness-110 text-black active:scale-90 cursor-pointer shadow-sm'
              }`}
              title={isMaxStockReached ? `Maximum stock of ${stockQty} reached` : 'Add one more'}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
