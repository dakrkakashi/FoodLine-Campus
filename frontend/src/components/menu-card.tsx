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
    item.tag === 'Bestseller' ? 'border-[#FFB347]/30 text-[#FFB347] bg-[#FFB347]/10' :
    item.tag === 'Student Fav' ? 'border-[#00D4AA]/30 text-[#00D4AA] bg-[#00D4AA]/10' :
    item.tag === 'Fast Grab' ? 'border-[#8B5CF6]/30 text-[#8B5CF6] bg-[#8B5CF6]/10' :
    'border-white/10 text-zinc-300 bg-white/5';

  return (
    <div
      className={`group relative bg-gradient-to-b from-[#181824]/90 to-[#101018]/90 backdrop-blur-xl border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF6B2C]/10 ${
        !isAvailable 
          ? 'opacity-60 border-red-500/20 bg-red-950/10' 
          : quantity > 0 
          ? 'border-[#FF6B2C]/50 shadow-[#FF6B2C]/15 ring-1 ring-[#FF6B2C]/30' 
          : 'border-white/10 hover:border-white/25'
      }`}
    >
      <InventoryBadge item={item} size="sm" position="top-right" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/30 border border-emerald-500/20">
            <VegIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400">Pure Veg</span>
          </div>
          {item.tag && !lowStock && isAvailable && (
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagColor}`}>
              {item.tag}
            </span>
          )}
        </div>

        {/* Dish Title */}
        <h3 className="font-extrabold text-base text-[#F5F5F7] group-hover:text-[#FF6B2C] transition-colors leading-snug mb-1.5">
          {item.name}
        </h3>

        {/* Prep Time Estimate */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-3">
          <ClockIcon className="w-3.5 h-3.5 text-[#FFB347]" />
          <span className="font-medium text-[11px]">~{item.prep_time_mins || 5} mins fresh prep</span>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Price</span>
          <span className="font-black text-lg text-white tracking-tight">
            {formatINR(item.price)}
          </span>
        </div>

        {!isAvailable || (stockQty !== null && stockQty !== undefined && stockQty <= 0) ? (
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 select-none">
            Sold Out
          </span>
        ) : quantity === 0 ? (
          <button
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
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FF8A3D] hover:brightness-110 text-black font-black text-xs shadow-lg shadow-[#FF6B2C]/25 transition active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>+ Add</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-[#14141E] border border-[#FF6B2C]/40 rounded-xl p-1 shadow-md shadow-[#FF6B2C]/10">
            <button
              onClick={() => {
                playClick();
                removeItem(item.id);
              }}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black text-sm flex items-center justify-center transition active:scale-90 cursor-pointer"
            >
              -
            </button>
            <span className="text-xs font-black font-mono text-[#00D4AA] min-w-5 text-center">
              {quantity}
            </span>
            <button
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
              className={`w-7 h-7 rounded-lg font-black text-sm flex items-center justify-center transition ${
                isMaxStockReached
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                  : 'bg-[#FF6B2C] hover:bg-[#FF8A3D] text-black active:scale-90 cursor-pointer'
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
