'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { InventoryStatus, MenuItem } from '@/lib/types';
import { fetchInventoryStatus } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';

interface InventoryContextType {
  statusMap: Map<string, InventoryStatus>;
  isLoading: boolean;
  getStatus: (itemId: string) => InventoryStatus | null;
  getEffectiveAvailability: (item: { id: string; is_available?: boolean; isAvailable?: boolean }) => boolean;
  isLowStock: (item: { id: string }) => boolean;
  getStockQuantity: (itemId: string) => number | null;
  refresh: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [statusMap, setStatusMap] = useState<Map<string, InventoryStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const statuses = await fetchInventoryStatus();
      if (Array.isArray(statuses) && statuses.length > 0) {
        setStatusMap((prev) => {
          // Avoid triggering re-renders across the app if data is unchanged
          if (prev.size === statuses.length) {
            let hasChanged = false;
            for (const s of statuses) {
              const existing = prev.get(s.itemId);
              if (!existing || existing.isAvailable !== s.isAvailable || existing.stockQuantity !== s.stockQuantity) {
                hasChanged = true;
                break;
              }
            }
            if (!hasChanged) return prev;
          }
          return new Map(statuses.map((s) => [s.itemId, s]));
        });
      }
    } catch (e) {
      console.warn('Inventory refresh warning:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    // 30s backup polling interval (Supabase realtime postgres_changes handles live updates)
    const interval = setInterval(() => {
      refresh();
    }, 30000);

    const onFocus = () => {
      refresh();
    };
    window.addEventListener('focus', onFocus);

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('menu-inventory-live')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'menu_items' },
          (payload) => {
            if (payload.new && (payload.new as any).id) {
              const updated = payload.new as any;
              setStatusMap((prev) => {
                const next = new Map(prev);
                const existing = next.get(updated.id);
                if (existing) {
                  next.set(updated.id, {
                    ...existing,
                    isAvailable: updated.is_available !== false,
                    stockQuantity: updated.stock_quantity ?? existing.stockQuantity,
                    isLowStock:
                      updated.stock_quantity !== null &&
                      updated.stock_quantity !== undefined &&
                      updated.stock_quantity <= (updated.low_stock_threshold || 5) &&
                      updated.stock_quantity > 0,
                  });
                }
                return next;
              });
            }
          }
        )
        .subscribe();

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', onFocus);
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime inventory channel subscription error:', e);
      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', onFocus);
      };
    }
  }, [refresh]);

  const getStatus = (itemId: string): InventoryStatus | null => {
    return statusMap.get(itemId) || null;
  };

  const getEffectiveAvailability = (item: { id: string; is_available?: boolean; isAvailable?: boolean }): boolean => {
    const status = getStatus(item.id);
    if (status) {
      return status.isAvailable;
    }
    return item.is_available !== false && item.isAvailable !== false;
  };

  const isLowStock = (item: { id: string }): boolean => {
    const status = getStatus(item.id);
    if (!status || status.inventoryType !== 'persistent') return false;
    return status.isLowStock;
  };

  const getStockQuantity = (itemId: string): number | null => {
    const status = getStatus(itemId);
    return status?.stockQuantity ?? null;
  };

  return (
    <InventoryContext.Provider
      value={{
        statusMap,
        isLoading,
        getStatus,
        getEffectiveAvailability,
        isLowStock,
        getStockQuantity,
        refresh,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return ctx;
}
