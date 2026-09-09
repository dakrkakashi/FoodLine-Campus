'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  tag?: string;
  maxStock?: number | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: { id: string; name: string; price: number; category?: string; tag?: string; maxStock?: number | null }) => void;
  removeItem: (id: string) => void;
  deleteItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, maxStock?: number | null) => void;
  clearCart: () => void;
  totalAmount: number;
  totalCount: number;
  selectedSlot: { id: string; label: string } | null;
  setSelectedSlot: (slot: { id: string; label: string } | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; label: string } | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('foodline_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedSlot = localStorage.getItem('foodline_slot');
      if (savedSlot) {
        setSelectedSlot(JSON.parse(savedSlot));
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foodline_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (selectedSlot) {
        localStorage.setItem('foodline_slot', JSON.stringify(selectedSlot));
      } else {
        localStorage.removeItem('foodline_slot');
      }
    } catch (e) {
      console.error('Error saving slot to storage', e);
    }
  }, [selectedSlot]);

  const addItem = (item: { id: string; name: string; price: number; category?: string; tag?: string; maxStock?: number | null }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const effectiveMax = item.maxStock !== undefined ? item.maxStock : existing?.maxStock;

      if (effectiveMax !== undefined && effectiveMax !== null && effectiveMax <= 0) {
        return prev;
      }

      if (existing) {
        if (effectiveMax !== undefined && effectiveMax !== null && existing.quantity >= effectiveMax) {
          return prev;
        }
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, maxStock: effectiveMax } : i
        );
      }
      return [...prev, { ...item, quantity: 1, maxStock: effectiveMax }];
    });
  };

  const updateQuantity = (id: string, quantity: number, maxStock?: number | null) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) => {
        if (i.id === id) {
          const effectiveMax = maxStock !== undefined ? maxStock : i.maxStock;
          const safeQty = effectiveMax !== undefined && effectiveMax !== null ? Math.min(quantity, effectiveMax) : quantity;
          return { ...i, quantity: safeQty, maxStock: effectiveMax };
        }
        return i;
      });
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setSelectedSlot(null);
    try {
      localStorage.removeItem('foodline_cart');
      localStorage.removeItem('foodline_slot');
    } catch (e) {}
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        deleteItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
        selectedSlot,
        setSelectedSlot,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
