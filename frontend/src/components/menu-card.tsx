'use client';

import React from 'react';
import { MenuItem } from '../lib/types';
import { formatINR } from '../lib/utils';
import { VegIcon, ClockIcon } from './icons';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import { InventoryBadge } from './ui/InventoryBadge';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, removeItem } = useCart();
  const { getEffectiveAvailability, isLowStock, getStockQuantity } = useInventory();

  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isAvailable = getEffectiveAvailability(item);
  const lowStock = isLowStock(item);
  const stockQty = getStockQuantity(item.id);
  const isMaxStockReached = stockQty !== null && stockQty !== undefined && quantity >= stockQty;

  return (
    <div
      className={`group relative bg-[#16161E]/80 backdrop-blur-xl border rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg hover:shadow-[#FF6B2C]/5 ${
        !isAvailable ? 'opacity-60 border-red-500/20 bg-red-950/10' : 'border-white/10'
      }`}
    >
      <InventoryBadge item={item} size="sm" position="top-right" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <VegIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">100% Veg</span>
          </div>
          {item.tag && !lowStock && isAvailable && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFB347]/10 text-[#FFB347] border border-[#FFB347]/20">
              {item.tag}
            </span>
          )}
        </div>

        {/* Dish Title */}
        <h3 className="font-bold text-base text-[#F5F5F7] group-hover:text-[#FF6B2C] transition leading-snug mb-1">
          {item.name}
        </h3>

        {/* Prep Time Estimate */}
        <div className="flex items-center gap-1 text-xs text-zinc-400 mb-3">
          <ClockIcon className="w-3.5 h-3.5 text-zinc-400" />
          <span>~{item.prep_time_mins || 5} min prep</span>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
        <span className="font-black text-lg text-white">
          {formatINR(item.price)}
        </span>

        {!isAvailable || (stockQty !== null && stockQty !== undefined && stockQty <= 0) ? (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 select-none">
            Sold Out
          </span>
        ) : quantity === 0 ? (
          <button
            onClick={() =>
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                category: item.category,
                tag: item.tag,
                maxStock: stockQty,
              })
            }
            className="px-3.5 py-1.5 rounded-xl bg-[#FF6B2C]/15 hover:bg-[#FF6B2C] text-[#FF6B2C] hover:text-white font-bold text-xs border border-[#FF6B2C]/30 hover:border-transparent transition active:scale-95 cursor-pointer"
          >
            + Add
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[#1C1C28] border border-white/15 rounded-xl px-2 py-1">
            <button
              onClick={() => removeItem(item.id)}
              className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 text-white font-black text-sm flex items-center justify-center transition active:scale-90"
            >
              -
            </button>
            <span className="text-xs font-black text-[#00D4AA] min-w-4 text-center">
              {quantity}
            </span>
            <button
              disabled={isMaxStockReached}
              onClick={() =>
                !isMaxStockReached &&
                addItem({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  category: item.category,
                  tag: item.tag,
                  maxStock: stockQty,
                })
              }
              className={`w-6 h-6 rounded-lg font-black text-sm flex items-center justify-center transition ${
                isMaxStockReached
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                  : 'bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white active:scale-90 cursor-pointer'
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
