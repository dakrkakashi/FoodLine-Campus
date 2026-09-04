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
  const { theme, setTheme } = useTheme();
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
            ? 'bg-[#07070B]/92 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/40'
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
              <span className="font-black text-xl tracking-tight bg-linear-to-r from-accent-orange via-accent-amber to-white bg-clip-text text-transparent">
                FoodLine
              </span>
            </Link>
            <Link
              href="/canteens"
              title={`Active: ${selectedCanteen.name} (${selectedCampus.name}) — Tap to switch outlet`}
              className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF6B2C]/40 text-[#00D4AA] font-extrabold tracking-wider transition cursor-pointer"
            >
              <span>{selectedCanteen.name}</span>
              <span className="text-[9px] text-[#FFB347]">▾</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink href="/canteens" onClick={playTab}>
              <Store size={16} />
              <span>5 Canteens</span>
            </NavLink>
            {user && (
              <>
                <NavLink href="/menu" onClick={playTab}>
                  <UtensilsCrossed size={16} />
                  <span>Menu</span>
                </NavLink>
                <NavLink href="/orders" onClick={playTab}>
                  <Receipt size={16} />
                  <span>My Orders</span>
                </NavLink>
                <NavLink href="/profile" onClick={playTab}>
                  <User size={16} />
                  <span>Account</span>
                </NavLink>
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

            {/* Sound FX Toggle Button */}
            <button
              onClick={toggleMute}
              title={muted ? 'Unmute Web Audio FX' : 'Mute Sound FX'}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition cursor-pointer ml-1"
            >
              {muted ? <VolumeX size={16} className="text-zinc-500" /> : <Volume2 size={16} className="text-accent-teal" />}
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen);
                  playClick();
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer text-xs font-bold"
                title="Change Campus Theme"
              >
                <span>{THEMES[theme]?.emoji || '🍊'}</span>
              </button>

              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#12121A] border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-2xl"
                  >
                    <div className="text-[10px] font-black uppercase text-zinc-400 px-3 py-1.5 tracking-wider border-b border-white/5 mb-1">
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
                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
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
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-accent-teal" />}
            </button>

            {user && (
              <Link
                href="/checkout"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-orange text-black font-black text-xs"
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
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
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
            className="md:hidden fixed inset-x-0 top-14.5 z-40 bg-[#07070B]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/80 overflow-hidden"
          >
            <nav className="flex flex-col py-4 px-4 gap-1.5">
              <MobileNavLink href="/canteens" onClick={() => { playTab(); setMobileOpen(false); }}>
                <Store size={16} />
                <span>5 Campus Canteens</span>
              </MobileNavLink>
              <MobileNavLink href="/select-campus" onClick={() => { playTab(); setMobileOpen(false); }}>
                <Building2 size={16} />
                <span>Change Campus</span>
              </MobileNavLink>

              {user ? (
                <>
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
                  <LogIn size={16} />
                  <span>Campus Sign In</span>
                </MobileNavLink>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-zinc-400">Campus Theme:</span>
                <div className="flex gap-1.5 flex-wrap max-w-[200px] justify-end">
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id as ThemeName);
                        playClick();
                      }}
                      title={t.name}
                      className={`w-7 h-7 rounded-xl text-xs font-black transition flex items-center justify-center cursor-pointer ${
                        theme === t.id ? 'bg-accent-orange text-black shadow-md' : 'bg-white/5 text-white hover:bg-white/15'
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
      className="text-xs font-black text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition cursor-pointer flex items-center gap-1.5"
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
      className="text-sm font-black text-zinc-200 hover:text-white px-4 py-3 rounded-2xl hover:bg-white/10 transition cursor-pointer flex items-center gap-2.5"
    >
      {children}
    </Link>
  );
}
