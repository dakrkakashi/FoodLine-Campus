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
        className={`sticky top-0 z-50 px-4 py-3 transition-all duration-300 ${
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
              className="flex items-center gap-2.5 group cursor-pointer"
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
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-glass)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
                title="Change Campus"
              >
                <Building2 size={12} className="text-accent-orange" />
                <span className="max-w-[130px] truncate">{selectedCampus.name}</span>
              </Link>
            )}

            {/* Canteen Pill - Only show after student is logged in */}
            {user && selectedCanteen && (
              <Link
                href="/canteens"
                onClick={playClick}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-orange/10 hover:bg-accent-orange/15 border border-accent-orange/20 text-xs font-bold text-accent-amber hover:text-[var(--text-primary)] transition cursor-pointer"
                title="Change Canteen"
              >
                <Store size={12} className="text-accent-orange" />
                <span className="max-w-[120px] truncate">{selectedCanteen.name}</span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation - Only visible after student logs in */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
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

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2">
            {/* Sound FX Toggle Button */}
            <button
              onClick={toggleMute}
              title={muted ? 'Unmute Web Audio FX' : 'Mute Sound FX'}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition cursor-pointer ml-1"
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
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] transition cursor-pointer ml-1"
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
                className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center gap-1.5 cursor-pointer text-xs font-bold"
                title="Change Campus Theme"
              >
                <span>{config.emoji || '🍊'}</span>
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
                          <span>{t.emoji}</span>
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
                href="/checkout"
                onClick={playClick}
                className="ml-2 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-xs shadow-lg shadow-accent-orange/25 hover:shadow-accent-orange/40 transition active:scale-95 cursor-pointer"
              >
                <ShoppingCart size={15} strokeWidth={2.5} />
                <span>Tray</span>
                {totalCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-black text-white text-[10px] font-black">
                    {totalCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-accent-teal" />}
            </button>

            {user && (
              <Link
                href="/checkout"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-orange text-black font-black text-xs shadow-md shadow-accent-orange/30"
              >
                <ShoppingCart size={14} />
                {totalCount > 0 && <span>{totalCount}</span>}
              </Link>
            )}

            <button
              onClick={() => {
                setMobileOpen(!mobileOpen);
                playClick();
              }}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
            className="md:hidden fixed inset-x-0 top-14.5 z-40 bg-[var(--bg-card)]/98 backdrop-blur-2xl border-b border-[var(--border-glass)] text-[var(--text-primary)] shadow-2xl shadow-black/20 dark:shadow-black/80 overflow-hidden"
          >
            <nav className="flex flex-col py-4 px-4 gap-1.5">
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
                <button
                  onClick={() => {
                    toggleMode();
                    playClick();
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-glass)] bg-black/5 dark:bg-white/5 flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] cursor-pointer"
                >
                  {mode === 'light' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-400" />}
                  <span>{mode === 'light' ? 'Day ☀️' : 'Night 🌙'}</span>
                </button>
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
                      className={`w-7 h-7 rounded-xl text-xs font-black transition flex items-center justify-center cursor-pointer border border-[var(--border-glass)] ${
                        theme === t.id ? 'bg-accent-orange text-black shadow-md font-black' : 'bg-black/5 dark:bg-white/5 text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/15'
                      }`}
                    >
                      {t.emoji}
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
      className="text-xs font-black text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer flex items-center gap-1.5"
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
      className="text-sm font-black text-[var(--text-primary)] px-4 py-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer flex items-center gap-2.5"
    >
      {children}
    </Link>
  );
}
