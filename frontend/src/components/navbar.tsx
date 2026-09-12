'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  UtensilsCrossed,
  ChefHat,
  BarChart3,
  ShoppingCart,
  Sparkles,
  Tv,
  Receipt,
  Bug,
  Store,
  Building2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  MoreHorizontal,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme, THEMES, ThemeName } from '@/context/ThemeContext';
import { useCampus } from '@/context/CampusContext';
import { useSoundFX } from '@/hooks/useSoundFX';
import { Logo } from '@/components/ui/Logo';
import { UserAvatar } from '@/components/auth/UserAvatar';
import { usePermissions } from '@/lib/auth/usePermissions';
import { useAuth } from '@/lib/auth/useAuth';

export function Navbar() {
  const { totalCount } = useCart();
  const { theme, setTheme, mode, toggleMode, config } = useTheme();
  const { selectedCampus } = useCampus();
  const { muted, toggleMute, playClick, playTab } = useSoundFX();
  const { isStaffOrAbove, isManagerOrAbove } = usePermissions();
  const { user } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full max-w-[100vw] overflow-x-clip px-3 sm:px-6 pb-2 pt-safe transition-all duration-300 print:hidden ${
        scrolled
          ? 'bg-[var(--bg-glass-heavy)] backdrop-blur-2xl border-b border-[var(--border-glass)] shadow-md'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-0">
        {/* Brand Group */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            onClick={playClick}
            className="flex items-center gap-2 group cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-orange rounded-xl focus-visible:outline-hidden shrink-0"
            aria-label="FoodLine Campus Home"
          >
            <Logo size={34} />
            <span className="font-black text-lg sm:text-xl tracking-tight bg-linear-to-r from-accent-orange via-accent-amber to-accent-teal bg-clip-text text-transparent whitespace-nowrap">
              FoodLine
            </span>
          </Link>

          {user && selectedCampus && (
            <Link
              href="/select-campus"
              onClick={playClick}
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-glass)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer min-h-[32px] max-w-[130px] focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
              title="Change Campus"
              aria-label={`Current Campus: ${selectedCampus.name}. Click to change campus.`}
            >
              <Building2 size={13} className="text-accent-orange shrink-0" />
              <span className="truncate">{selectedCampus.name}</span>
            </Link>
          )}
        </div>

        {/* Desktop primary nav — properly spaced and never overlapping */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1 shrink-0" aria-label="Main Navigation">
            <NavLink href="/menu" onClick={playTab}>
              <UtensilsCrossed size={16} />
              <span>Menu</span>
            </NavLink>
            <NavLink href="/canteens" onClick={playTab}>
              <Store size={16} />
              <span>Canteens</span>
            </NavLink>
            <NavLink href="/orders" onClick={playTab}>
              <Receipt size={16} />
              <span>My Orders</span>
            </NavLink>
            <NavLink href="/faq" onClick={playTab}>
              <HelpCircle size={16} />
              <span>FAQ</span>
            </NavLink>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDesktopMoreOpen((v) => !v);
                  setThemeDropdownOpen(false);
                  playClick();
                }}
                className="text-xs font-black text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 lg:px-3 py-2 min-h-[40px] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
                aria-expanded={desktopMoreOpen}
                aria-label="More navigation"
              >
                <MoreHorizontal size={16} />
                <span>More</span>
              </button>

              <AnimatePresence>
                {desktopMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] shadow-2xl p-2 z-50 backdrop-blur-2xl"
                  >
                    <DesktopMoreLink href="/select-campus" onClick={() => { playTab(); setDesktopMoreOpen(false); }}>
                      <Building2 size={15} /> Change Campus
                    </DesktopMoreLink>
                    <DesktopMoreLink href="/faq" onClick={() => { playTab(); setDesktopMoreOpen(false); }}>
                      <HelpCircle size={15} /> Campus Help & FAQ
                    </DesktopMoreLink>
                    <DesktopMoreLink href="/display" onClick={() => { playTab(); setDesktopMoreOpen(false); }}>
                      <Tv size={15} /> TV Display
                    </DesktopMoreLink>
                    {isStaffOrAbove && (
                      <DesktopMoreLink href="/kds" onClick={() => { playTab(); setDesktopMoreOpen(false); }}>
                        <ChefHat size={15} /> Kitchen KDS
                      </DesktopMoreLink>
                    )}
                    {isManagerOrAbove && (
                      <>
                        <DesktopMoreLink href="/admin" onClick={() => { playTab(); setDesktopMoreOpen(false); }}>
                          <BarChart3 size={15} /> Manager & Admin
                        </DesktopMoreLink>
                        <DesktopMoreLink href="/debug" onClick={() => { playTab(); setDesktopMoreOpen(false); }}>
                          <Bug size={15} /> Debug Suite
                        </DesktopMoreLink>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-1.5 shrink-0" aria-label="Main Navigation">
            <NavLink href="/canteens" onClick={playTab}>
              <Store size={16} />
              <span>Canteens</span>
            </NavLink>
            <NavLink href="/faq" onClick={playTab}>
              <HelpCircle size={16} />
              <span>FAQ</span>
            </NavLink>
            <NavLink href="/login" onClick={playTab} className="bg-accent-orange/10 text-accent-amber hover:bg-accent-orange/20 border border-accent-orange/30">
              <GraduationCap size={16} />
              <span>Student Sign In</span>
            </NavLink>
          </nav>
        )}

        {/* Desktop utilities */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleMute}
            title={muted ? 'Unmute Web Audio FX' : 'Mute Sound FX'}
            aria-label={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 min-w-[38px] min-h-[38px] rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden shrink-0"
          >
            {muted ? <VolumeX size={15} className="text-zinc-400" /> : <Volume2 size={15} className="text-accent-teal" />}
          </button>

          <button
            onClick={() => {
              toggleMode();
              playClick();
            }}
            title={mode === 'light' ? 'Switch to Night Mode (Dark)' : 'Switch to Day Mode (Light)'}
            aria-label={mode === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            className="p-2 min-w-[38px] min-h-[38px] rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden shrink-0"
          >
            {mode === 'light' ? (
              <Sun size={15} className="text-amber-500" />
            ) : (
              <Moon size={15} className="text-indigo-400" />
            )}
          </button>

          <div className="relative shrink-0">
            <button
              onClick={() => {
                setThemeDropdownOpen(!themeDropdownOpen);
                setDesktopMoreOpen(false);
                playClick();
              }}
              className="p-2 min-w-[38px] min-h-[38px] rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center justify-center cursor-pointer text-xs font-bold focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden shrink-0"
              title="Change Campus Theme"
              aria-label="Change Campus Theme Palette"
            >
              <span aria-hidden="true">{config.emoji || '🍊'}</span>
            </button>

            <AnimatePresence>
              {themeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] shadow-2xl p-2 z-50 backdrop-blur-2xl"
                >
                  <div className="text-[10px] font-black uppercase text-[var(--text-muted)] px-3 py-1.5 tracking-wider border-b border-[var(--border-glass)] mb-1">
                    Campus Theme
                  </div>
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id as ThemeName);
                        setThemeDropdownOpen(false);
                        playClick();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                        theme === t.id
                          ? 'bg-accent-orange text-black font-black'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true">{t.emoji}</span>
                        <span>{t.name}</span>
                      </span>
                      {theme === t.id && <Sparkles size={12} className="text-black" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="ml-1 shrink-0">
            <UserAvatar />
          </div>

          {user && (
            <Link
              href="/cart"
              onClick={playClick}
              className="ml-1 flex items-center gap-2 px-3 py-2 min-h-[38px] rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-xs shadow-lg shadow-accent-orange/25 hover:shadow-accent-orange/40 transition active:scale-95 cursor-pointer shrink-0 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
              aria-label={`View Tray with ${totalCount} items`}
            >
              <ShoppingCart size={15} strokeWidth={2.5} />
              <span>Tray</span>
              {totalCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-black text-white text-[10px] font-black">
                  {totalCount}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Mobile top bar: brand only + compact avatar (Tray/More live in bottom nav) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  onClick,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-xs font-black text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 lg:px-3 py-2 min-h-[40px] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden ${className}`}
    >
      {children}
    </Link>
  );
}

function DesktopMoreLink({
  href,
  children,
  onClick,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition ${className}`}
    >
      {children}
    </Link>
  );
}
