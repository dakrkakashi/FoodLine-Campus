'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { InventoryProvider } from '@/context/InventoryContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <InventoryProvider>{children}</InventoryProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
