'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName = 'sunset' | 'cyber' | 'emerald' | 'solar';

interface ThemeConfig {
  id: ThemeName;
  name: string;
  emoji: string;
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
    primary: '#8B5CF6',
    secondary: '#00E5FF',
    accent: '#FF2E93',
    bgCanvas: '#050814',
    bgCard: '#0D1224',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    emoji: '🍵',
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
    primary: '#F59E0B',
    secondary: '#EF4444',
    accent: '#8B5CF6',
    bgCanvas: '#0D0B0A',
    bgCard: '#1A1412',
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
    const root = document.documentElement;
    root.style.setProperty('--accent-orange', t.primary);
    root.style.setProperty('--accent-amber', t.secondary);
    root.style.setProperty('--accent-teal', t.accent);
    root.style.setProperty('--bg-canvas', t.bgCanvas);
    root.style.setProperty('--bg-card', t.bgCard);
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
