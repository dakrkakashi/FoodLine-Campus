'use client';

export interface SavedOrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SavedOrder {
  orderId: string;
  orderToken: string;
  totalAmount: number;
  pickupOtp: string;
  status: string;
  paymentMethod: 'UPI' | 'COD';
  slotLabel?: string;
  slotTime?: string;
  notes?: string;
  studentPrn?: string;
  studentName?: string;
  items: SavedOrderItem[];
  createdAt: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'foodline_user_orders';

export function getLocalOrderHistory(): SavedOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse local order history:', err);
    return [];
  }
}

export function saveOrderToHistory(order: SavedOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalOrderHistory();
    // Check if order already exists in history
    const filtered = existing.filter(o => o.orderToken !== order.orderToken && o.orderId !== order.orderId);
    const updated = [order, ...filtered];
    // Keep max 50 orders in local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (err) {
    console.warn('Failed to save order to history:', err);
  }
}

export function updateOrderStatusInHistory(orderToken: string, status: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalOrderHistory();
    const updated = existing.map(o => o.orderToken === orderToken ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to update order status in history:', err);
  }
}
