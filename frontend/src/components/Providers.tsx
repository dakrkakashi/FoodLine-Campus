'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/useAuth';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { InventoryProvider } from '@/context/InventoryContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <InventoryProvider>{children}</InventoryProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
