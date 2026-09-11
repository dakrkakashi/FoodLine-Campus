'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  Home,
  UtensilsCrossed,
  Receipt,
  ShoppingCart,
  MoreHorizontal,
  Store,
  Building2,
  User,
  Tv,
  ChefHat,
  BarChart3,
  Bug,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  GraduationCap,
  X,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/lib/auth/useAuth';
import { useSoundFX } from '@/hooks/useSoundFX';
import { useTheme, THEMES, ThemeName } from '@/context/ThemeContext';
import { usePermissions } from '@/lib/auth/usePermissions';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { user } = useAuth();
  const { playTab, playClick, muted, toggleMute } = useSoundFX();
  const { theme, setTheme, mode, toggleMode, config } = useTheme();
  const { isStaffOrAbove, isManagerOrAbove } = usePermissions();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [moreOpen]);

  if (
    pathname?.startsWith('/kds') ||
    pathname?.startsWith('/display') ||
    pathname?.startsWith('/admin')
  ) {
    return null;
  }

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      id: 'menu',
      label: 'Menu',
      href: '/menu',
      icon: UtensilsCrossed,
      isActive: pathname === '/menu',
    },
    ...(user
      ? [
          {
            id: 'orders',
            label: 'Orders',
            href: '/orders',
            icon: Receipt,
            isActive: pathname === '/orders' || Boolean(pathname?.startsWith('/order/')),
          },
          {
            id: 'tray',
            label: 'Tray',
            href: '/cart',
            icon: ShoppingCart,
            badge: totalCount > 0 ? totalCount : undefined,
            isActive: pathname === '/cart' || pathname === '/checkout',
          },
        ]
      : [
          {
            id: 'login',
            label: 'Login',
            href: '/login',
            icon: GraduationCap,
            isActive: pathname === '/login',
          },
        ]),
  ];

  const closeMore = () => setMoreOpen(false);

  return (
    <>
      <nav
        aria-label="Campus Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 w-full max-w-[100vw] bg-[var(--bg-glass-heavy,#0e0e14)]/95 backdrop-blur-2xl border-t border-[var(--border-glass)] shadow-[0_-8px_32px_rgba(0,0,0,0.35)] print:hidden select-none"
        style={{
          paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))',
          paddingLeft: 'max(0.25rem, env(safe-area-inset-left))',
          paddingRight: 'max(0.25rem, env(safe-area-inset-right))',
        }}
      >
        <div className="flex w-full items-stretch justify-between gap-0.5 px-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => playTab()}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className="relative flex flex-1 min-w-0 flex-col items-center justify-center py-1.5 px-1 min-h-[52px] rounded-2xl transition-all cursor-pointer group active:scale-95 focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
              >
                {active && (
                  <motion.div
                    layoutId="activeBottomTab"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0.5 bg-accent-orange/15 rounded-2xl -z-10 border border-accent-orange/30"
                  />
                )}

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
                  {'badge' in item && item.badge !== undefined && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-accent-orange text-black font-black text-[9px] flex items-center justify-center leading-none shadow-md shadow-accent-orange/40"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>

                <span
                  className={`text-[10px] tracking-tight mt-0.5 max-w-full truncate transition-all ${
                    active
                      ? 'font-black text-accent-amber'
                      : 'font-semibold text-[var(--text-secondary)]'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More — opens bottom sheet */}
          <button
            type="button"
            onClick={() => {
              playClick();
              setMoreOpen(true);
            }}
            aria-label="Open more menu"
            aria-expanded={moreOpen}
            className="relative flex flex-1 min-w-0 flex-col items-center justify-center py-1.5 px-1 min-h-[52px] rounded-2xl transition-all cursor-pointer group active:scale-95 focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
          >
            {moreOpen && (
              <div className="absolute inset-0.5 bg-accent-orange/15 rounded-2xl -z-10 border border-accent-orange/30" />
            )}
            <MoreHorizontal
              size={20}
              strokeWidth={moreOpen ? 2.5 : 2}
              className={moreOpen ? 'text-accent-orange' : 'text-[var(--text-secondary)]'}
            />
            <span
              className={`text-[10px] tracking-tight mt-0.5 font-semibold ${
                moreOpen ? 'font-black text-accent-amber' : 'text-[var(--text-secondary)]'
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More Menu bottom sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close more menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
              onClick={closeMore}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="More menu"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className="md:hidden fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-[var(--bg-card)] border-t border-[var(--border-glass)] shadow-2xl"
              style={{
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
                paddingLeft: 'max(1rem, env(safe-area-inset-left))',
                paddingRight: 'max(1rem, env(safe-area-inset-right))',
              }}
            >
              <div className="sticky top-0 z-10 bg-[var(--bg-card)]/95 backdrop-blur-md pt-3 pb-2">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--text-muted)]/40" />
                <div className="flex items-center justify-between px-1">
                  <div>
                    <p className="text-sm font-black text-[var(--text-primary)]">More</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Campus tools & settings</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeMore}
                    aria-label="Close"
                    className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 px-1 pb-2">
                {user ? (
                  <>
                    <SheetLink href="/canteens" icon={Store} label="Campus Canteens" onClick={() => { playTab(); closeMore(); }} />
                    <SheetLink href="/select-campus" icon={Building2} label="Change Campus" onClick={() => { playTab(); closeMore(); }} />
                    <SheetLink href="/profile" icon={User} label="My Account & Profile" onClick={() => { playTab(); closeMore(); }} />
                    <SheetLink href="/display" icon={Tv} label="Counter TV Display" onClick={() => { playTab(); closeMore(); }} />
                    {isStaffOrAbove && (
                      <SheetLink href="/kds" icon={ChefHat} label="Kitchen KDS" onClick={() => { playTab(); closeMore(); }} />
                    )}
                    {isManagerOrAbove && (
                      <>
                        <SheetLink href="/admin" icon={BarChart3} label="Manager & Admin" onClick={() => { playTab(); closeMore(); }} />
                        <SheetLink href="/debug" icon={Bug} label="Debug & Error Suite" onClick={() => { playTab(); closeMore(); }} />
                      </>
                    )}
                  </>
                ) : (
                  <SheetLink href="/login" icon={GraduationCap} label="Student PRN Login" onClick={() => { playTab(); closeMore(); }} />
                )}

                <div className="mt-2 pt-3 border-t border-[var(--border-glass)] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase text-[var(--text-secondary)]">Quick controls</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="px-3 py-2 min-h-[44px] rounded-xl border border-[var(--border-glass)] bg-black/5 dark:bg-white/5 flex items-center gap-2 text-xs font-bold"
                      >
                        {muted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-accent-teal" />}
                        {muted ? 'Muted' : 'Sound'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toggleMode();
                          playClick();
                        }}
                        className="px-3 py-2 min-h-[44px] rounded-xl border border-[var(--border-glass)] bg-black/5 dark:bg-white/5 flex items-center gap-2 text-xs font-bold"
                      >
                        {mode === 'light' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-400" />}
                        {mode === 'light' ? 'Day' : 'Night'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-black uppercase text-[var(--text-secondary)] pt-2">
                      Theme {config.emoji}
                    </span>
                    <div className="flex gap-1.5 flex-wrap max-w-[220px] justify-end">
                      {Object.values(THEMES).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setTheme(t.id as ThemeName);
                            playClick();
                          }}
                          title={t.name}
                          aria-label={`Select theme ${t.name}`}
                          className={`w-9 h-9 rounded-xl text-xs flex items-center justify-center border border-[var(--border-glass)] ${
                            theme === t.id
                              ? 'bg-accent-orange text-black shadow-md'
                              : 'bg-black/5 dark:bg-white/5'
                          }`}
                        >
                          {theme === t.id ? <Sparkles size={12} /> : <span aria-hidden="true">{t.emoji}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SheetLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm font-black text-[var(--text-primary)] px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );
}
