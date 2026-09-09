'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/useAuth';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { InventoryProvider } from '@/context/InventoryContext';
import { CampusProvider } from '@/context/CampusContext';
import { FloatingThemeTrigger } from '@/components/theme/FloatingThemeTrigger';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { GlobalClickEffect } from '@/components/ui/GlobalClickEffect';
import { MeshGradientBackground } from '@/components/ui/MeshGradientBackground';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CampusProvider>
          <CartProvider>
            <InventoryProvider>
              <div className="print:hidden">
                <MeshGradientBackground opacity={0.65} />
                <CustomCursor />
                <GlobalClickEffect />
                <OfflineBanner />
                <FloatingThemeTrigger />
              </div>
              {children}
              <MobileBottomNav />
            </InventoryProvider>
          </CartProvider>
        </CampusProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

