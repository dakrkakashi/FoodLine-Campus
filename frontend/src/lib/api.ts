import { MenuItem, PickupSlot, Order, ApiResponse } from './types';
import localMenu from '../data/menu.json';
import localCampus from '../data/campus.json';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchMenu(category?: string): Promise<{ categories: string[]; items: MenuItem[] }> {
  try {
    const url = category && category !== 'All' 
      ? `${API_BASE}/menu?category=${encodeURIComponent(category)}`
      : `${API_BASE}/menu`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const json: ApiResponse<{ categories: string[]; items: MenuItem[] }> = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (e) {
    console.warn('Backend API unreachable, using local menu data fallback.');
  }

  // Fallback
  const categories = [
    'All',
    'Quick Bites',
    'Chaat Corner',
    'South Indian',
    'North Indian',
    'Sandwiches',
    'Momos & Burgers',
    'Fries & Pasta',
    'Garlic Bread & Pizza',
    'Maggi & Chinese',
    'Beverages',
    'Desserts'
  ];

  let items = localMenu as MenuItem[];
  if (category && category !== 'All') {
    items = items.filter((i) => (i.category || '').toLowerCase() === category.toLowerCase());
  }

  return { categories, items };
}

export async function fetchSlots(): Promise<PickupSlot[]> {
  try {
    const res = await fetch(`${API_BASE}/slots`, { cache: 'no-store' });
    if (res.ok) {
      const json: ApiResponse<PickupSlot[]> = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (e) {
    console.warn('Backend API unreachable, using local slot data fallback.');
  }

  // Fallback
  const slots: PickupSlot[] = [];
  for (const b of (localCampus.breaks || [])) {
    for (const s of (b.slots || [])) {
      const label = (s as any).label || (s as any).time || b.label;
      const startTime = (s as any).startTime || ((s as any).time ? (s as any).time.split('–')[0]?.trim() : '11:50 AM');
      const endTime = (s as any).endTime || ((s as any).time ? (s as any).time.split('–')[1]?.trim() : '12:10 PM');
      const maxCapacity = (s as any).maxCapacity || (s as any).capacity || 60;
      const available = (s as any).available !== undefined ? (s as any).available : (s as any).availableSlots || 30;
      const currentBooked = (s as any).currentBooked !== undefined ? (s as any).currentBooked : Math.max(0, maxCapacity - available);

      slots.push({
        id: s.id,
        label,
        startTime,
        endTime,
        maxCapacity,
        currentBooked,
        availableSlots: Math.max(0, maxCapacity - currentBooked),
        isFull: currentBooked >= maxCapacity
      });
    }
  }
  return slots;
}

export async function createOrder(payload: {
  slotId: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  studentPhone?: string;
  notes?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || 'Failed to create order');
  }
  const json = await res.json();
  return json.data;
}

export async function verifyUtr(orderToken: string, utrNumber: string, amount: number): Promise<any> {
  const res = await fetch(`${API_BASE}/payments/verify-utr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderToken, utrNumber, amount })
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || 'UTR verification failed');
  }
  const json = await res.json();
  return json.data;
}

/**
 * 📦 Dual Inventory API Helpers
 */
export async function fetchInventoryStatus(): Promise<any[]> {
  try {
    const res = await fetch('/api/admin/inventory/status', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (e) {
    console.warn('Failed to fetch inventory status from API:', e);
  }
  return [];
}

export async function postMorningPrep(payload: { date: string; dailyFreshItemIds: string[] }): Promise<{ success: boolean; data?: any }> {
  try {
    const res = await fetch('/api/admin/inventory/morning-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      return { success: true, data: json.data };
    }
  } catch (e) {
    console.error('Failed to submit morning prep:', e);
  }
  return { success: false };
}

export async function patchPersistentStock(
  update: { itemId: string; stockQuantity: number } | { itemId: string; stockQuantity: number }[]
): Promise<{ success: boolean; data?: any }> {
  try {
    const res = await fetch('/api/admin/inventory/persistent', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (res.ok) {
      const json = await res.json();
      return { success: true, data: json.data };
    }
  } catch (e) {
    console.error('Failed to patch persistent stock:', e);
  }
  return { success: false };
}
