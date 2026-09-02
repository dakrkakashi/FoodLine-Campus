'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/useAuth';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { InventoryProvider } from '@/context/InventoryContext';
import { CampusProvider } from '@/context/CampusContext';
import { FloatingThemeTrigger } from '@/components/theme/FloatingThemeTrigger';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CampusProvider>
          <CartProvider>
            <InventoryProvider>
              {children}
              <FloatingThemeTrigger />
            </InventoryProvider>
          </CartProvider>
        </CampusProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

