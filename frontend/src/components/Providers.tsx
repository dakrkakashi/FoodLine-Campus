'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/lib/auth/useAuth';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { InventoryProvider } from '@/context/InventoryContext';
import { CampusProvider } from '@/context/CampusContext';
import { ToastProvider } from '@/context/ToastContext';
import { DeferredMount } from '@/components/DeferredMount';
import { FloatingThemeTrigger } from '@/components/theme/FloatingThemeTrigger';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { MeshGradientBackground } from '@/components/ui/MeshGradientBackground';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner';

// Interaction-triggered decorative globals (custom cursor, click ripples, back-to-top)
// are lazy-loaded as separate chunks after first idle, so they neither block the
// initial shared-bundle parse nor mount listeners before the app is interactive.
const CustomCursorLazy = dynamic(
  () => import('@/components/ui/CustomCursor').then((m) => m.CustomCursor),
  { ssr: false, loading: () => null }
);
const GlobalClickEffectLazy = dynamic(
  () => import('@/components/ui/GlobalClickEffect').then((m) => m.GlobalClickEffect),
  { ssr: false, loading: () => null }
);
const BackToTopLazy = dynamic(
  () => import('@/components/ui/BackToTop').then((m) => m.BackToTop),
  { ssr: false, loading: () => null }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {/* Decorative components isolated outside business providers */}
      <div className="print:hidden">
        <MeshGradientBackground opacity={0.65} />
        <DeferredMount>
          <CustomCursorLazy />
          <GlobalClickEffectLazy />
          <BackToTopLazy />
        </DeferredMount>
        <OfflineBanner />
        <FloatingThemeTrigger />
        <CookieConsentBanner />
      </div>

      <AuthProvider>
        <CampusProvider>
          <CartProvider>
            <InventoryProvider>
              <ToastProvider>
                {children}
                <MobileBottomNav />
              </ToastProvider>
            </InventoryProvider>
          </CartProvider>
        </CampusProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
