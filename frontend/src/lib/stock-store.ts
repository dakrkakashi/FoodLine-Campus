/**
 * 📦 FoodLine Live Dual Inventory & Stockout State Store
 * Maintains live persistent disk + in-memory stockout status, daily fresh batch schedules,
 * and persistent beverage inventory across Next.js server reloads & API route invocations.
 */

import fs from 'fs';
import path from 'path';
import { InventoryType, InventoryStatus, MenuItem } from './types';
import localMenu from '@/data/menu.json';

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

function getStorageFilePath(): string {
  const candidate1 = path.join(process.cwd(), 'frontend', 'src', 'data', 'inventory-state.json');
  const candidate2 = path.join(process.cwd(), 'src', 'data', 'inventory-state.json');
  const candidate3 = path.join(process.cwd(), 'inventory-state.json');
  if (fs.existsSync(path.dirname(candidate1))) return candidate1;
  if (fs.existsSync(path.dirname(candidate2))) return candidate2;
  return candidate3;
}

function loadStateFromDisk() {
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (data) {
        if (data.lastFreshBatchDate) {
          globalForStock.lastFreshBatchDate = data.lastFreshBatchDate;
        }
        if (typeof data.morningBatchConfigured === 'boolean') {
          globalForStock.morningBatchConfigured = data.morningBatchConfigured;
        }
        if (Array.isArray(data.dailyFreshBatchIds)) {
          dailyFreshBatchIds.clear();
          data.dailyFreshBatchIds.forEach((id: string) => dailyFreshBatchIds.add(id));
        }
        if (data.stockOverrides && typeof data.stockOverrides === 'object') {
          stockOverrides.clear();
          Object.entries(data.stockOverrides).forEach(([k, v]) => stockOverrides.set(k, Boolean(v)));
        }
        if (data.dishDetailsMap && typeof data.dishDetailsMap === 'object') {
          dishDetailsMap.clear();
          Object.entries(data.dishDetailsMap).forEach(([k, v]) => dishDetailsMap.set(k, v));
        }
        if (data.persistentStockMap && typeof data.persistentStockMap === 'object') {
          persistentStockMap.clear();
          Object.entries(data.persistentStockMap).forEach(([k, v]) => persistentStockMap.set(k, Number(v)));
        }
        if (data.lowStockThresholdMap && typeof data.lowStockThresholdMap === 'object') {
          lowStockThresholdMap.clear();
          Object.entries(data.lowStockThresholdMap).forEach(([k, v]) => lowStockThresholdMap.set(k, Number(v)));
        }
      }
    }
  } catch (err) {
    console.error('[stock-store] Failed to read inventory-state.json:', err);
  }
}

function saveStateToDisk() {
  try {
    const filePath = getStorageFilePath();
    const payload = {
      lastFreshBatchDate: globalForStock.lastFreshBatchDate || getTodayString(),
      morningBatchConfigured: globalForStock.morningBatchConfigured ?? false,
      dailyFreshBatchIds: Array.from(dailyFreshBatchIds),
      stockOverrides: Object.fromEntries(stockOverrides.entries()),
      dishDetailsMap: Object.fromEntries(dishDetailsMap.entries()),
      persistentStockMap: Object.fromEntries(persistentStockMap.entries()),
      lowStockThresholdMap: Object.fromEntries(lowStockThresholdMap.entries()),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('[stock-store] Failed to write inventory-state.json:', err);
  }
}

// Ensure initial state load
loadStateFromDisk();

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
  loadStateFromDisk();
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
  saveStateToDisk();
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
      if (stockQty <= 0) {
        isAvailable = false;
      } else if (stockOverrides.has(item.id)) {
        isAvailable = stockOverrides.get(item.id)!;
      }
    } else {
      // Daily Fresh Item
      if (globalForStock.morningBatchConfigured) {
        isAvailable = dailyFreshBatchIds.has(item.id);
      } else if (stockOverrides.has(item.id)) {
        isAvailable = stockOverrides.get(item.id)!;
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
 */
export function setBulkInventoryState(
  action: 'ALL_IN_STOCK' | 'ALL_OUT_OF_STOCK',
  quantity: number = 30,
  category?: string
) {
  loadStateFromDisk();
  const isAvailable = action === 'ALL_IN_STOCK';
  const targetQty = isAvailable ? quantity : 0;

  const allDishes = (localMenu as any[]).map((m) => ({ id: m.id, category: m.category }));

  for (const dish of allDishes) {
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
