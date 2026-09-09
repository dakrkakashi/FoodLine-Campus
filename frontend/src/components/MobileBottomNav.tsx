'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Home,
  UtensilsCrossed,
  Store,
  Receipt,
  ShoppingCart,
  User,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/lib/auth/useAuth';
import { useSoundFX } from '@/hooks/useSoundFX';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { user } = useAuth();
  const { playTab } = useSoundFX();

  // Never render bottom navigation in KDS, TV Display, or on Desktop
  if (
    pathname?.startsWith('/kds') ||
    pathname?.startsWith('/display') ||
    pathname?.startsWith('/admin')
  ) {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Menu',
      href: '/menu',
      icon: UtensilsCrossed,
      isActive: pathname === '/menu',
    },
    {
      label: 'Canteens',
      href: '/canteens',
      icon: Store,
      isActive: pathname === '/canteens',
    },
    ...(user
      ? [
          {
            label: 'Orders',
            href: '/orders',
            icon: Receipt,
            isActive: pathname === '/orders' || pathname.startsWith('/order/'),
          },
          {
            label: 'Tray',
            href: '/checkout',
            icon: ShoppingCart,
            badge: totalCount > 0 ? totalCount : undefined,
            isActive: pathname === '/checkout',
          },
        ]
      : [
          {
            label: 'Profile',
            href: '/login',
            icon: User,
            isActive: pathname === '/login',
          },
        ]),
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-glass-heavy,#0e0e14)]/95 backdrop-blur-2xl border-t border-[var(--border-glass)] shadow-[0_-8px_32px_rgba(0,0,0,0.5)] print:hidden select-none"
      style={{
        paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-1.5 pb-0.5 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => playTab()}
              className="relative flex flex-col items-center justify-center py-1 px-3 min-w-[58px] rounded-2xl transition-all cursor-pointer group active:scale-90"
            >
              {/* Active Background Glow Pill */}
              {active && (
                <motion.div
                  layoutId="activeBottomTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-accent-orange/15 rounded-2xl -z-10 border border-accent-orange/30"
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 2}
                  className={`transition-colors duration-200 ${
                    active
                      ? 'text-accent-orange drop-shadow-[0_0_8px_rgba(255,107,44,0.5)]'
                      : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  }`}
                />

                {/* Optional Counter Badge (Cart Tray) */}
                {item.badge !== undefined && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-accent-orange text-black font-black text-[9px] flex items-center justify-center leading-none shadow-md shadow-accent-orange/40"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>

              {/* Tab Label */}
              <span
                className={`text-[10px] tracking-tight mt-1 transition-all ${
                  active
                    ? 'font-black text-accent-amber scale-105'
                    : 'font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
