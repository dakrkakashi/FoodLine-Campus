'use client';

import React from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { InventoryBadge } from '@/components/ui/InventoryBadge';
import { SteamEffect } from '@/components/ui/SteamEffect';
import { Badge } from '@/components/ui/Badge';
import { MorphingStepper } from '@/components/ui/MorphingStepper';
import { Info, Sparkles } from 'lucide-react';

export interface MenuGridItemProps {
  dish: any;
  gridMode: 'grid' | 'list';
  qty: number;
  isAvailable: boolean;
  stockQty: number | null | undefined;
  categoryName: string;
  tagVariant?: React.ComponentProps<typeof Badge>['variant'] | null;
  onInspect: (dish: any, categoryName: string, isAvailable: boolean) => void;
  onAdd: (dish: any, categoryName: string, stockQty: number | null | undefined) => void;
  onRemove: (dishId: string) => void;
}

function MenuGridItemComponent({
  dish,
  gridMode,
  qty,
  isAvailable,
  stockQty,
  categoryName,
  tagVariant,
  onInspect,
  onAdd,
  onRemove,
}: MenuGridItemProps) {
  const isMaxStockReached = stockQty !== null && stockQty !== undefined && qty >= stockQty;
  const isSoldOut = !isAvailable || (stockQty !== null && stockQty !== undefined && stockQty <= 0);

  const shouldShowSteam =
    isAvailable &&
    (dish.prep_time_mins ||
      dish.name.toLowerCase().includes('dosa') ||
      dish.name.toLowerCase().includes('chai') ||
      dish.name.toLowerCase().includes('maggi') ||
      dish.name.toLowerCase().includes('thali') ||
      dish.name.toLowerCase().includes('pav'));

  return (
    <div
      className={`h-full transition-transform duration-200 dish-card-contain ${
        isAvailable ? 'hover:-translate-y-1' : ''
      }`}
    >
      <SpotlightCard
        spotlightColor="var(--accent-orange-glow, rgba(255, 107, 44, 0.18))"
        className={`h-full flex flex-col justify-between group relative border border-(--border-glass) hover:border-accent-orange/50 hover:shadow-[0_0_24px_var(--accent-orange-glow)] transition-all duration-200 bg-(--bg-card) backdrop-blur-md shadow-sm dark:shadow-none ${
          gridMode === 'grid' ? 'p-3.5 sm:p-6 rounded-2xl sm:rounded-4xl' : 'p-5 sm:p-6 rounded-3xl sm:rounded-4xl'
        } ${!isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''}`}
      >
        <InventoryBadge item={dish} size="sm" position="top-right" />

        {/* Zero-Lag Culinary Steam Effect (shows on hover) */}
        {shouldShowSteam && (
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
                  onInspect(dish, categoryName, isAvailable);
                }}
                className="text-[9px] sm:text-[10px] font-bold text-accent-amber bg-accent-orange/10 hover:bg-accent-orange/25 border border-accent-orange/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-0.5 sm:gap-1 shrink-0"
                title="Inspect dish in 3D"
              >
                <span>3D</span>
                <Sparkles size={10} className="text-accent-amber" />
              </button>
            </div>
          </div>

          <h3
            className={`font-black text-(--text-primary) group-hover:text-accent-amber transition-colors leading-snug mb-1 line-clamp-2 ${
              gridMode === 'grid' ? 'text-xs sm:text-lg' : 'text-sm sm:text-lg'
            }`}
          >
            {dish.name}
          </h3>
          <span className="text-[9px] sm:text-[10px] font-black text-(--text-muted) uppercase tracking-wider line-clamp-1">
            {categoryName || dish.tag || 'Fresh Made'}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-6 pt-2.5 sm:pt-4 border-t border-(--border-glass)">
          <div>
            <span className="text-[9px] sm:text-[10px] text-(--text-muted) uppercase tracking-wider font-bold">
              Price
            </span>
            <div
              className={`font-black text-(--text-primary) ${
                gridMode === 'grid' ? 'text-base sm:text-xl' : 'text-lg sm:text-xl'
              }`}
            >
              ₹{Number(dish.price).toFixed(0)}
            </div>
          </div>

          <MorphingStepper
            quantity={qty}
            disabled={isSoldOut}
            isMaxReached={isMaxStockReached}
            itemName={dish.name}
            size={gridMode === 'grid' ? 'sm' : 'md'}
            onAdd={() => onAdd(dish, categoryName, stockQty)}
            onRemove={() => onRemove(dish.id)}
          />
        </div>
      </SpotlightCard>
    </div>
  );
}

export const MenuGridItem = React.memo(MenuGridItemComponent, (prev, next) => {
  return (
    prev.dish.id === next.dish.id &&
    prev.dish.price === next.dish.price &&
    prev.dish.name === next.dish.name &&
    prev.qty === next.qty &&
    prev.isAvailable === next.isAvailable &&
    prev.stockQty === next.stockQty &&
    prev.gridMode === next.gridMode &&
    prev.categoryName === next.categoryName &&
    prev.tagVariant === next.tagVariant
  );
});
