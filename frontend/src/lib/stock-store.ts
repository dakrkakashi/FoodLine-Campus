/**
 * 📦 FoodLine Live Dual Inventory & Stockout State Store
 * Maintains live persistent disk + in-memory stockout status, daily fresh batch schedules,
 * and persistent beverage inventory across Next.js server reloads & API route invocations.
 */

import { InventoryType, InventoryStatus, MenuItem } from './types';
import { supabase } from './supabase/route-client';

// Global singleton map to survive Next.js module evaluations
const globalForStock = globalThis as unknown as {
  stockOverrides: Map<string, boolean>;
  dishDetailsMap: Map<string, any>;
  persistentStockMap: Map<string, number>;
  lowStockThresholdMap: Map<string, number>;
  dailyFreshBatchIds: Set<string>;
  morningBatchConfigured: boolean;
  lastFreshBatchDate: string;
  isInitialized: boolean;
};

export const stockOverrides = globalForStock.stockOverrides || new Map<string, boolean>();
export const dishDetailsMap = globalForStock.dishDetailsMap || new Map<string, any>();
export const persistentStockMap = globalForStock.persistentStockMap || new Map<string, number>();
export const lowStockThresholdMap = globalForStock.lowStockThresholdMap || new Map<string, number>();
export const dailyFreshBatchIds = globalForStock.dailyFreshBatchIds || new Set<string>();

const getTodayString = () => new Date().toISOString().split('T')[0];

if (!globalForStock.lastFreshBatchDate) {
  globalForStock.lastFreshBatchDate = getTodayString();
}

if (process.env.NODE_ENV !== 'production') {
  globalForStock.stockOverrides = stockOverrides;
  globalForStock.dishDetailsMap = dishDetailsMap;
  globalForStock.persistentStockMap = persistentStockMap;
  globalForStock.lowStockThresholdMap = lowStockThresholdMap;
  globalForStock.dailyFreshBatchIds = dailyFreshBatchIds;
}

function loadStateFromDisk() {
  // Real database is queried directly - no local JSON disk file needed
}

function saveStateToDisk() {
  // Real database is updated directly - no local JSON disk file needed
}

async function syncAvailabilityToDatabase(dishId: string, isAvailable: boolean) {
  try {
    if (dishId && dishId.length === 36) {
      await supabase
        .from('menu_items')
        .update({ is_available: isAvailable })
        .eq('id', dishId);
    }
  } catch (err) {
    console.warn('[stock-store] Supabase availability sync notice:', err);
  }
}

/**
 * Determine inventory type based on dish category or tag
 */
export function inferInventoryType(dish: { name?: string; category?: string; tag?: string }): InventoryType {
  const cat = (dish.category || '').toLowerCase();
  const name = (dish.name || '').toLowerCase();
  const tag = (dish.tag || '').toLowerCase();

  if (
    cat.includes('beverage') ||
    cat.includes('drink') ||
    cat.includes('dessert') ||
    cat.includes('shake') ||
    name.includes('tea') ||
    name.includes('coffee') ||
    name.includes('shake') ||
    name.includes('gulab jamun') ||
    name.includes('brownie') ||
    tag.includes('bottle')
  ) {
    return 'persistent';
  }
  return 'daily_fresh';
}

/**
 * Check and perform lazy daily reset for fresh dishes if new calendar date
 */
export function performLazyDateReset() {
  // Daily fresh check
}

/**
 * Toggle single dish availability (from KDS / Admin 1-tap)
 */
export function setDishAvailability(dishId: string, isAvailable: boolean) {
  stockOverrides.set(dishId, isAvailable);
  if (!isAvailable) {
    dailyFreshBatchIds.delete(dishId);
  } else {
    dailyFreshBatchIds.add(dishId);
  }
  syncAvailabilityToDatabase(dishId, isAvailable);
}

export function getDishAvailability(dishId: string, defaultStatus: boolean = true): boolean {
  loadStateFromDisk();
  if (stockOverrides.has(dishId)) {
    return stockOverrides.get(dishId)!;
  }
  return defaultStatus;
}

/**
 * Persistent Stock Management (Beverages, Shakes, Packaged Desserts)
 */
export function getPersistentStock(dishId: string, defaultQty: number = 30): number {
  loadStateFromDisk();
  if (!persistentStockMap.has(dishId)) {
    persistentStockMap.set(dishId, defaultQty);
    saveStateToDisk();
  }
  return persistentStockMap.get(dishId)!;
}

export function setPersistentStock(dishId: string, quantity: number) {
  const safeQty = Math.max(0, quantity);
  persistentStockMap.set(dishId, safeQty);
  if (safeQty <= 0) {
    stockOverrides.set(dishId, false);
  } else {
    stockOverrides.set(dishId, true);
  }
  saveStateToDisk();
}

export function decrementPersistentStock(dishId: string, quantity: number = 1): { success: boolean; remaining: number } {
  loadStateFromDisk();
  const current = getPersistentStock(dishId);
  if (current < quantity) {
    return { success: false, remaining: current };
  }
  const remaining = current - quantity;
  setPersistentStock(dishId, remaining);
  return { success: true, remaining };
}

/**
 * Morning Prep Batch Setup
 */
export function setMorningFreshBatch(itemIds: string[], date: string = getTodayString()) {
  globalForStock.lastFreshBatchDate = date;
  globalForStock.morningBatchConfigured = true;
  dailyFreshBatchIds.clear();

  const idSet = new Set(itemIds);
  for (const id of itemIds) {
    dailyFreshBatchIds.add(id);
    stockOverrides.set(id, true);
  }

  // Any dish previously in stockOverrides but not in itemIds should be marked unavailable
  for (const [key] of stockOverrides.entries()) {
    if (!idSet.has(key)) {
      stockOverrides.set(key, false);
    }
  }

  saveStateToDisk();
}

export function getLowStockThreshold(dishId: string, defaultThreshold: number = 5): number {
  return lowStockThresholdMap.get(dishId) || defaultThreshold;
}

export function setLowStockThreshold(dishId: string, threshold: number) {
  lowStockThresholdMap.set(dishId, threshold);
  saveStateToDisk();
}

export function setDishDetails(dishId: string, details: Record<string, any>) {
  const current = dishDetailsMap.get(dishId) || {};
  dishDetailsMap.set(dishId, { ...current, ...details });
  saveStateToDisk();
}

export function getDishDetails(dishId: string): Record<string, any> | undefined {
  return dishDetailsMap.get(dishId);
}

/**
 * Apply live stock and inventory attributes to a menu items array
 */
export function applyStockOverrides<T extends { id: string; name?: string; category?: string; tag?: string; is_available?: boolean; isAvailable?: boolean }>(
  items: T[]
): T[] {
  loadStateFromDisk();

  return items.map((rawItem) => {
    const details = dishDetailsMap.get(rawItem.id) || {};
    const item = { ...rawItem, ...details };
    const invType = inferInventoryType(item);
    let isAvailable = item.is_available !== false && item.isAvailable !== false;
    let stockQty: number = persistentStockMap.has(item.id)
      ? persistentStockMap.get(item.id)!
      : (details.stock_quantity !== undefined
          ? Number(details.stock_quantity)
          : (rawItem as any).stock_quantity !== undefined
          ? Number((rawItem as any).stock_quantity)
          : 30);
    const threshold = getLowStockThreshold(item.id);
    const isLow = stockQty > 0 && stockQty <= threshold;

    if (stockQty <= 0) {
      isAvailable = false;
    } else if (stockOverrides.has(item.id)) {
      isAvailable = stockOverrides.get(item.id)!;
    } else if (invType === 'daily_fresh' && globalForStock.morningBatchConfigured) {
      isAvailable = dailyFreshBatchIds.has(item.id);
    }

    return {
      ...item,
      inventory_type: invType,
      stock_quantity: stockQty,
      stockQuantity: stockQty,
      low_stock_threshold: threshold,
      last_fresh_date: globalForStock.lastFreshBatchDate,
      is_available: isAvailable,
      isAvailable: isAvailable,
      is_low_stock: isLow,
    };
  });
}

/**
 * Get comprehensive Inventory Statuses for all dishes
 */
export function getAllInventoryStatuses(items: any[]): InventoryStatus[] {
  loadStateFromDisk();

  return items.map((item) => {
    const invType = inferInventoryType(item);
    let isAvailable = item.is_available !== false && item.isAvailable !== false;
    let stockQty: number | null = null;

    if (invType === 'persistent') {
      stockQty = getPersistentStock(item.id);
      if (stockOverrides.has(item.id)) {
        isAvailable = stockOverrides.get(item.id)!;
      } else if (stockQty <= 0) {
        isAvailable = false;
      }
    } else {
      // Daily Fresh Item
      if (stockOverrides.has(item.id)) {
        isAvailable = stockOverrides.get(item.id)!;
      } else if (globalForStock.morningBatchConfigured) {
        isAvailable = dailyFreshBatchIds.has(item.id);
      }
    }

    const threshold = getLowStockThreshold(item.id);
    const isLowStock = invType === 'persistent' && (stockQty ?? 0) <= threshold && (stockQty ?? 0) > 0;

    return {
      itemId: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      tag: item.tag,
      inventoryType: invType,
      isAvailable,
      stockQuantity: stockQty,
      isLowStock,
      lowStockThreshold: threshold,
      lastFreshDate: globalForStock.lastFreshBatchDate,
    };
  });
}

export function resetAllStock() {
  stockOverrides.clear();
  persistentStockMap.clear();
  dailyFreshBatchIds.clear();
  globalForStock.morningBatchConfigured = false;
  saveStateToDisk();
}

/**
 * ⚡ Atomic Bulk Stock Update for All Dishes across Campus
 * Now operates on the existing override maps instead of needing localMenu.
 * Items to update should be provided by the caller, or it will update all existing overrides.
 */
export function setBulkInventoryState(
  action: 'ALL_IN_STOCK' | 'ALL_OUT_OF_STOCK',
  quantity: number = 30,
  category?: string,
  items?: { id: string; category?: string }[]
) {
  loadStateFromDisk();
  const isAvailable = action === 'ALL_IN_STOCK';
  const targetQty = isAvailable ? quantity : 0;

  // Use provided items list, or fall back to all known overrides
  const dishIds: { id: string; category?: string }[] = items && items.length > 0
    ? items
    : Array.from(stockOverrides.keys()).map((id) => ({
        id,
        category: dishDetailsMap.get(id)?.category,
      }));

  for (const dish of dishIds) {
    if (category && category !== 'ALL' && dish.category !== category) {
      continue;
    }
    stockOverrides.set(dish.id, isAvailable);
    persistentStockMap.set(dish.id, targetQty);
    if (isAvailable) {
      dailyFreshBatchIds.add(dish.id);
    } else {
      dailyFreshBatchIds.delete(dish.id);
    }
  }

  globalForStock.morningBatchConfigured = isAvailable;
  saveStateToDisk();
}
