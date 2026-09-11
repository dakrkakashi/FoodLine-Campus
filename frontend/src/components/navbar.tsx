'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  UtensilsCrossed,
  ChefHat,
  BarChart3,
  LogIn,
  ShoppingCart,
  Palette,
  Volume2,
  VolumeX,
  Menu as MenuIcon,
  X,
  Sparkles,
  Tv,
  Receipt,
  Bug,
  Store,
  Building2,
  User,
  Sun,
  Moon,
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
  const { selectedCampus, selectedCanteen } = useCampus();
  const { muted, toggleMute, playClick, playTab } = useSoundFX();
  const { isStaffOrAbove, isManagerOrAbove } = usePermissions();
  const { user } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 px-4 pb-3 pt-safe transition-all duration-300 print:hidden relative ${
          scrolled
            ? 'bg-[var(--bg-glass-heavy)] backdrop-blur-2xl border-b border-[var(--border-glass)] shadow-md'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              onClick={playClick}
              className="flex items-center gap-2.5 group cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-orange rounded-xl focus-visible:outline-hidden"
              aria-label="FoodLine Campus Home"
            >
              <Logo size={38} />
              <span className="font-black text-xl tracking-tight bg-linear-to-r from-accent-orange via-accent-amber to-accent-teal bg-clip-text text-transparent">
                FoodLine
              </span>
            </Link>
            
            {/* Campus Pill - Only show after student is logged in */}
            {user && selectedCampus && (
              <Link
                href="/select-campus"
                onClick={playClick}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-glass)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer min-h-[36px] focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
                title="Change Campus"
                aria-label={`Current Campus: ${selectedCampus.name}. Click to change campus.`}
              >
                <Building2 size={13} className="text-accent-orange" />
                <span className="max-w-[130px] truncate">{selectedCampus.name}</span>
              </Link>
            )}

            {/* Canteen Pill - Only show after student is logged in */}
            {user && selectedCanteen && (
              <Link
                href="/canteens"
                onClick={playClick}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-orange/10 hover:bg-accent-orange/15 border border-accent-orange/20 text-xs font-bold text-accent-amber hover:text-[var(--text-primary)] transition cursor-pointer min-h-[36px] focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
                title="Change Canteen"
                aria-label={`Current Canteen: ${selectedCanteen.name}. Click to change canteen.`}
              >
                <Store size={13} className="text-accent-orange" />
                <span className="max-w-[120px] truncate">{selectedCanteen.name}</span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation - Only visible after student logs in */}
          {user && (
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
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

              {isStaffOrAbove && (
                <>
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <NavLink href="/display" onClick={playTab}>
                    <Tv size={16} />
                    <span>TV Display</span>
                  </NavLink>
                  {isStaffOrAbove && (
                    <NavLink href="/kds" onClick={playTab}>
                      <ChefHat size={16} />
                      <span>Kitchen</span>
                    </NavLink>
                  )}
                  {isManagerOrAbove && (
                    <>
                      <NavLink href="/admin" onClick={playTab}>
                        <BarChart3 size={16} />
                        <span>Manager & Admin</span>
                      </NavLink>
                      <NavLink href="/debug" onClick={playTab}>
                        <Bug size={16} />
                        <span>Debug</span>
                      </NavLink>
                    </>
                  )}
                </>
              )}
            </nav>
          )}

          {/* Right Action Utilities — DESKTOP ONLY (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Sound FX Toggle Button */}
            <button
              onClick={toggleMute}
              title={muted ? 'Unmute Web Audio FX' : 'Mute Sound FX'}
              aria-label={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
            >
              {muted ? <VolumeX size={16} className="text-zinc-400" /> : <Volume2 size={16} className="text-accent-teal" />}
            </button>

            {/* Day / Night Mode Toggle */}
            <button
              onClick={() => {
                toggleMode();
                playClick();
              }}
              title={mode === 'light' ? 'Switch to Night Mode (Dark)' : 'Switch to Day Mode (Light)'}
              aria-label={mode === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
            >
              {mode === 'light' ? (
                <Sun size={16} className="text-amber-500" />
              ) : (
                <Moon size={16} className="text-indigo-400" />
              )}
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen);
                  playClick();
                }}
                className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center justify-center cursor-pointer text-xs font-bold focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
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
                            ? 'bg-accent-orange text-black'
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

            {/* User Profile / Auth Avatar */}
            <div className="ml-2">
              <UserAvatar />
            </div>

            {/* Cart Tray Pill */}
            {user && (
              <Link
                href="/cart"
                onClick={playClick}
                className="ml-2 flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-xs shadow-lg shadow-accent-orange/25 hover:shadow-accent-orange/40 transition active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
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

          {/* Mobile Right Controls — MOBILE ONLY */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Day/Night quick toggle on mobile */}
            <button
              onClick={() => {
                toggleMode();
                playClick();
              }}
              aria-label={mode === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] text-[var(--text-secondary)] active:scale-90 transition flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
            >
              {mode === 'light' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-400" />}
            </button>

            {/* Cart Tray on mobile — compact pill */}
            {user && (
              <Link
                href="/cart"
                onClick={playClick}
                aria-label={`View Tray with ${totalCount} items`}
                className="relative flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-xs shadow-md shadow-accent-orange/30 active:scale-95 transition focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
              >
                <ShoppingCart size={15} strokeWidth={2.5} />
                <span className="hidden min-[360px]:inline">Tray</span>
                {totalCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-black text-white text-[10px] font-black leading-none">
                    {totalCount}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger Menu */}
            <button
              onClick={() => {
                setMobileOpen(!mobileOpen);
                playClick();
              }}
              aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileOpen}
              className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-90 transition flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
            >
              {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute inset-x-0 top-full z-40 bg-[var(--bg-card)]/98 backdrop-blur-2xl border-b border-[var(--border-glass)] text-[var(--text-primary)] shadow-2xl shadow-black/20 dark:shadow-black/80 overflow-hidden"
          >
            <nav className="flex flex-col py-4 px-4 gap-1.5" aria-label="Mobile Drawer Navigation">
              {user ? (
                <>
                  <MobileNavLink href="/canteens" onClick={() => { playTab(); setMobileOpen(false); }}>
                    <Store size={16} />
                    <span>Campus Canteens</span>
                  </MobileNavLink>
                  <MobileNavLink href="/select-campus" onClick={() => { playTab(); setMobileOpen(false); }}>
                    <Building2 size={16} />
                    <span>Change Campus</span>
                  </MobileNavLink>
                  <MobileNavLink href="/menu" onClick={() => { playTab(); setMobileOpen(false); }}>
                    <UtensilsCrossed size={16} />
                    <span>Browse Menu</span>
                  </MobileNavLink>
                  <MobileNavLink href="/cart" onClick={() => { playTab(); setMobileOpen(false); }}>
                    <ShoppingCart size={16} />
                    <span>Review Tray ({totalCount})</span>
                  </MobileNavLink>
                  <MobileNavLink href="/orders" onClick={() => { playTab(); setMobileOpen(false); }}>
                    <Receipt size={16} />
                    <span>My Orders</span>
                  </MobileNavLink>
                  <MobileNavLink href="/profile" onClick={() => { playTab(); setMobileOpen(false); }}>
                    <User size={16} />
                    <span>My Account & Profile</span>
                  </MobileNavLink>
                  <MobileNavLink href="/display" onClick={() => { playTab(); setMobileOpen(false); }}>
                    <Tv size={16} />
                    <span>Counter TV Display</span>
                  </MobileNavLink>
                  {isStaffOrAbove && (
                    <MobileNavLink href="/kds" onClick={() => { playTab(); setMobileOpen(false); }}>
                      <ChefHat size={16} />
                      <span>Kitchen KDS</span>
                    </MobileNavLink>
                  )}
                  {isManagerOrAbove && (
                    <>
                      <MobileNavLink href="/admin" onClick={() => { playTab(); setMobileOpen(false); }}>
                        <BarChart3 size={16} />
                        <span>Manager & Admin</span>
                      </MobileNavLink>
                      <MobileNavLink href="/debug" onClick={() => { playTab(); setMobileOpen(false); }}>
                        <Bug size={16} />
                        <span>Debug & Error Suite</span>
                      </MobileNavLink>
                    </>
                  )}
                </>
              ) : (
                <MobileNavLink href="/login" onClick={() => { playTab(); setMobileOpen(false); }}>
                  <GraduationCap size={16} className="text-accent-orange" />
                  <span>Student PRN Login</span>
                </MobileNavLink>
              )}

              <div className="pt-3 border-t border-[var(--border-glass)] flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-[var(--text-secondary)]">Mode:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      toggleMute();
                    }}
                    aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
                    className="px-3 py-2 min-h-[44px] rounded-xl border border-[var(--border-glass)] bg-black/5 dark:bg-white/5 flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] cursor-pointer"
                    title={muted ? 'Unmute Sounds' : 'Mute Sounds'}
                  >
                    {muted ? <VolumeX size={14} className="text-zinc-400" /> : <Volume2 size={14} className="text-accent-teal" />}
                    <span>{muted ? 'Muted' : 'Sound'}</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleMode();
                      playClick();
                    }}
                    aria-label={mode === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
                    className="px-3 py-2 min-h-[44px] rounded-xl border border-[var(--border-glass)] bg-black/5 dark:bg-white/5 flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] cursor-pointer"
                  >
                    {mode === 'light' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-400" />}
                    <span>{mode === 'light' ? 'Day ☀️' : 'Night 🌙'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-[var(--text-secondary)]">Campus Theme:</span>
                <div className="flex gap-1.5 flex-wrap max-w-[200px] justify-end">
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id as ThemeName);
                        playClick();
                      }}
                      title={t.name}
                      aria-label={`Select theme ${t.name}`}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition flex items-center justify-center cursor-pointer border border-[var(--border-glass)] ${
                        theme === t.id ? 'bg-accent-orange text-black shadow-md font-black' : 'bg-black/5 dark:bg-white/5 text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/15'
                      }`}
                    >
                      <span aria-hidden="true">{t.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-xs font-black text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3.5 py-2.5 min-h-[44px] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm font-black text-[var(--text-primary)] px-4 py-3 min-h-[48px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
    >
      {children}
    </Link>
  );
}
