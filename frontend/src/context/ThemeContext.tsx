'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName =
  | 'sunset'
  | 'cyber'
  | 'emerald'
  | 'solar'
  | 'midnight'
  | 'matcha'
  | 'crimson'
  | 'aurora'
  | 'obsidian'
  | 'synthwave'
  | 'chai'
  | 'galaxy';

interface ThemeConfig {
  id: ThemeName;
  name: string;
  emoji: string;
  tagline: string;
  primary: string;
  secondary: string;
  accent: string;
  bgCanvas: string;
  bgCard: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  sunset: {
    id: 'sunset',
    name: 'Sanjivani Sunset',
    emoji: '🍊',
    tagline: 'Signature Tangerine & Amber Glow',
    primary: '#FF6B2C',
    secondary: '#FFB347',
    accent: '#00D4AA',
    bgCanvas: '#07070B',
    bgCard: '#12121A',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk Neon',
    emoji: '🌌',
    tagline: 'Violet Pulse & Cyber Cyan',
    primary: '#8B5CF6',
    secondary: '#00E5FF',
    accent: '#FF2E93',
    bgCanvas: '#050814',
    bgCard: '#0D1224',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    emoji: '🍃',
    tagline: 'Refreshing Mint & Jade Green',
    primary: '#00D4AA',
    secondary: '#10B981',
    accent: '#FFB347',
    bgCanvas: '#05100B',
    bgCard: '#0C1C15',
  },
  solar: {
    id: 'solar',
    name: 'Solar Flare',
    emoji: '⚡',
    tagline: 'Molten Gold & Crimson Blaze',
    primary: '#F59E0B',
    secondary: '#EF4444',
    accent: '#8B5CF6',
    bgCanvas: '#0D0B0A',
    bgCard: '#1A1412',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Sapphire',
    emoji: '💎',
    tagline: 'Cobalt Deep Blue & Sky Ice',
    primary: '#3B82F6',
    secondary: '#38BDF8',
    accent: '#A855F7',
    bgCanvas: '#030712',
    bgCard: '#0B1226',
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Breeze',
    emoji: '🍵',
    tagline: 'Zen Lime & Golden Pistachio',
    primary: '#84CC16',
    secondary: '#EAB308',
    accent: '#10B981',
    bgCanvas: '#060C06',
    bgCard: '#0E170E',
  },
  crimson: {
    id: 'crimson',
    name: 'Tokyo Neon Crimson',
    emoji: '⛩️',
    tagline: 'Hot Sakura Pink & Tokyo Red',
    primary: '#F43F5E',
    secondary: '#FF1744',
    accent: '#FB923C',
    bgCanvas: '#0C0408',
    bgCard: '#1C0B14',
  },
  aurora: {
    id: 'aurora',
    name: 'Cosmic Borealis',
    emoji: '🌠',
    tagline: 'Hyper Indigo & Bio Teal Aura',
    primary: '#6366F1',
    secondary: '#14F195',
    accent: '#E879F9',
    bgCanvas: '#060713',
    bgCard: '#111329',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Velvet',
    emoji: '🔮',
    tagline: 'Pure OLED Pitch & Electric Violet',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#06B6D4',
    bgCanvas: '#000000',
    bgCard: '#0A0A10',
  },
  synthwave: {
    id: 'synthwave',
    name: '80s Synthwave',
    emoji: '🕹️',
    tagline: 'Laser Magenta & Neon Grid Gold',
    primary: '#FF007F',
    secondary: '#00F0FF',
    accent: '#FFE600',
    bgCanvas: '#090417',
    bgCard: '#15092E',
  },
  chai: {
    id: 'chai',
    name: 'Campus Masala Chai',
    emoji: '☕',
    tagline: 'Warm Spiced Cinnamon & Mint Leaf',
    primary: '#D97706',
    secondary: '#F59E0B',
    accent: '#10B981',
    bgCanvas: '#0C0A09',
    bgCard: '#1C1614',
  },
  galaxy: {
    id: 'galaxy',
    name: 'Starlight Nebula',
    emoji: '🪐',
    tagline: 'Deep Cosmic Purple & Astral Cyan',
    primary: '#7C3AED',
    secondary: '#EC4899',
    accent: '#38BDF8',
    bgCanvas: '#04040C',
    bgCard: '#0E0C22',
  },
};

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'sunset',
  setTheme: () => {},
  config: THEMES.sunset,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('sunset');

  useEffect(() => {
    const saved = localStorage.getItem('foodline-theme') as ThemeName;
    if (saved && THEMES[saved]) {
      setThemeState(saved);
      applyThemeToCSS(saved);
    }
  }, []);

  const applyThemeToCSS = (themeKey: ThemeName) => {
    const t = THEMES[themeKey];
    if (!t) return;
    const root = document.documentElement;
    root.style.setProperty('--accent-orange', t.primary);
    root.style.setProperty('--accent-amber', t.secondary);
    root.style.setProperty('--accent-teal', t.accent);
    root.style.setProperty('--accent-orange-glow', `${t.primary}66`);
    root.style.setProperty('--accent-amber-glow', `${t.secondary}55`);
    root.style.setProperty('--accent-teal-glow', `${t.accent}66`);
    root.style.setProperty('--bg-canvas', t.bgCanvas);
    root.style.setProperty('--bg-card', t.bgCard);
    root.style.setProperty('--border-glass-active', `${t.primary}80`);
    root.setAttribute('data-theme', themeKey);
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('foodline-theme', newTheme);
    applyThemeToCSS(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
