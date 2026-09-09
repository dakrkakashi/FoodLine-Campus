'use client';

import React from 'react';
import { MenuItem } from '@/lib/types';
import { useInventory } from '@/context/InventoryContext';

interface InventoryBadgeProps {
  item: MenuItem | { id: string; name?: string; is_available?: boolean; isAvailable?: boolean };
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'inline';
}

export function InventoryBadge({
  item,
  size = 'md',
  position = 'top-right',
}: InventoryBadgeProps) {
  const { getEffectiveAvailability, isLowStock, getStockQuantity } = useInventory();

  const available = getEffectiveAvailability(item);
  const lowStock = isLowStock(item);
  const stockQty = getStockQuantity(item.id);

  if (available && !lowStock) return null;

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
  }[size];

  const posClasses =
    position === 'inline'
      ? 'relative inline-flex'
      : `absolute ${position === 'top-right' ? 'top-2 right-2' : 'top-2 left-2'} z-10`;

  if (!available) {
    return (
      <span
        className={`${posClasses} ${sizeClasses} rounded-xl bg-red-500/15 dark:bg-red-950/90 border border-red-500/40 text-red-600 dark:text-red-300 font-black uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600 dark:bg-red-500" />
        </span>
        Sold Out Today
      </span>
    );
  }

  if (lowStock && stockQty !== null) {
    return (
      <span
        className={`${posClasses} ${sizeClasses} rounded-xl bg-amber-500/15 dark:bg-amber-950/90 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-black uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-600 dark:bg-amber-400" />
        </span>
        ⚡ Only {stockQty} Left
      </span>
    );
  }

  return null;
}
