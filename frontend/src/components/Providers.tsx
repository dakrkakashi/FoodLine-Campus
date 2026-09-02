'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/useAuth';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { InventoryProvider } from '@/context/InventoryContext';
import { CampusProvider } from '@/context/CampusContext';
import { FloatingThemeTrigger } from '@/components/theme/FloatingThemeTrigger';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CampusProvider>
          <CartProvider>
            <InventoryProvider>
              <OfflineBanner />
              {children}
            </InventoryProvider>
          </CartProvider>
        </CampusProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

