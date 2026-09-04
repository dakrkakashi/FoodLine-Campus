'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

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
  | 'galaxy'
  | 'gold'
  | 'custom';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  emoji: string;
  tagline: string;
  primary: string;
  secondary: string;
  accent: string;
  bgCanvasDark: string;
  bgCardDark: string;
  bgCanvasLight: string;
  bgCardLight: string;
  bgCanvas: string;
  bgCard: string;
}

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

export const DEFAULT_CUSTOM_COLORS: CustomColors = {
  primary: '#D4AF37', // Imperial Gold
  secondary: '#F59E0B', // Amber
  accent: '#10B981', // Emerald
};

export const THEMES: Record<Exclude<ThemeName, 'custom'>, ThemeConfig> = {
  sunset: {
    id: 'sunset',
    name: 'Sanjivani Sunset',
    emoji: '🍊',
    tagline: 'Signature Tangerine & Amber Glow',
    primary: '#FF6B2C',
    secondary: '#FFB347',
    accent: '#00D4AA',
    bgCanvasDark: '#07070B',
    bgCardDark: '#12121A',
    bgCanvasLight: '#FFF9F5',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#050814',
    bgCardDark: '#0D1224',
    bgCanvasLight: '#F5F3FF',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#05100B',
    bgCardDark: '#0C1C15',
    bgCanvasLight: '#F0FDF4',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#0D0B0A',
    bgCardDark: '#1A1412',
    bgCanvasLight: '#FFFBEB',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#030712',
    bgCardDark: '#0B1226',
    bgCanvasLight: '#F0F7FF',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#060C06',
    bgCardDark: '#0E170E',
    bgCanvasLight: '#F7FEE7',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#0C0408',
    bgCardDark: '#1C0B14',
    bgCanvasLight: '#FFF1F2',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#060713',
    bgCardDark: '#111329',
    bgCanvasLight: '#EEF2FF',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#000000',
    bgCardDark: '#0A0A10',
    bgCanvasLight: '#F8FAFC',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#090417',
    bgCardDark: '#15092E',
    bgCanvasLight: '#FDF2F8',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#0C0A09',
    bgCardDark: '#1C1614',
    bgCanvasLight: '#FAF5EF',
    bgCardLight: '#FFFFFF',
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
    bgCanvasDark: '#04040C',
    bgCardDark: '#0E0C22',
    bgCanvasLight: '#FAF5FF',
    bgCardLight: '#FFFFFF',
    bgCanvas: '#04040C',
    bgCard: '#0E0C22',
  },
  gold: {
    id: 'gold',
    name: 'Royal Ivory & Gold',
    emoji: '👑',
    tagline: 'Luxury Pearl White, Warm Ivory & Imperial Gold',
    primary: '#D4AF37',
    secondary: '#F3C66F',
    accent: '#E5A93C',
    bgCanvasDark: '#0C0B08',
    bgCardDark: '#17150E',
    bgCanvasLight: '#FAF9F5',
    bgCardLight: '#FFFFFF',
    bgCanvas: '#FAF9F5',
    bgCard: '#FFFFFF',
  },
};

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
  applyCustomPalette: (colors: CustomColors) => void;
  config: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'sunset',
  setTheme: () => {},
  mode: 'dark',
  setMode: () => {},
  toggleMode: () => {},
  customColors: DEFAULT_CUSTOM_COLORS,
  setCustomColors: () => {},
  applyCustomPalette: () => {},
  config: THEMES.sunset,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('sunset');
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [customColors, setCustomColorsState] = useState<CustomColors>(DEFAULT_CUSTOM_COLORS);

  // Helper to build active config
  const getThemeConfig = (tKey: ThemeName, activeMode: ThemeMode, custom: CustomColors): ThemeConfig => {
    const isLight = activeMode === 'light';
    if (tKey === 'custom') {
      return {
        id: 'custom',
        name: 'Custom Palette',
        emoji: '🎨',
        tagline: 'Your Personalized Campus Color Palette',
        primary: custom.primary,
        secondary: custom.secondary,
        accent: custom.accent,
        bgCanvasDark: '#0A0A0F',
        bgCardDark: '#14141E',
        bgCanvasLight: '#FAF9F5',
        bgCardLight: '#FFFFFF',
        bgCanvas: isLight ? '#FAF9F5' : '#0A0A0F',
        bgCard: isLight ? '#FFFFFF' : '#14141E',
      };
    }

    const base = THEMES[tKey] || THEMES.sunset;
    return {
      ...base,
      bgCanvas: isLight ? base.bgCanvasLight : base.bgCanvasDark,
      bgCard: isLight ? base.bgCardLight : base.bgCardDark,
    };
  };

  useEffect(() => {
    const savedTheme = (localStorage.getItem('foodline-theme') as ThemeName) || 'sunset';
    const savedMode = (localStorage.getItem('foodline-mode') as ThemeMode) || 'dark';
    const savedCustom = localStorage.getItem('foodline-custom-colors');
    let parsedCustom = DEFAULT_CUSTOM_COLORS;
    if (savedCustom) {
      try {
        parsedCustom = JSON.parse(savedCustom);
      } catch {
        parsedCustom = DEFAULT_CUSTOM_COLORS;
      }
    }

    const activeTheme = (THEMES[savedTheme as keyof typeof THEMES] || savedTheme === 'custom') ? savedTheme : 'sunset';
    const activeMode = savedMode === 'light' ? 'light' : 'dark';

    setThemeState(activeTheme);
    setModeState(activeMode);
    setCustomColorsState(parsedCustom);

    applyThemeToCSS(activeTheme, activeMode, parsedCustom);
  }, []);

  const applyThemeToCSS = (themeKey: ThemeName, activeMode: ThemeMode, custom: CustomColors) => {
    const t = getThemeConfig(themeKey, activeMode, custom);
    const isLight = activeMode === 'light';
    const root = document.documentElement;

    // Set accent colors
    root.style.setProperty('--accent-orange', t.primary);
    root.style.setProperty('--accent-amber', t.secondary);
    root.style.setProperty('--accent-teal', t.accent);
    root.style.setProperty('--color-accent-orange', t.primary);
    root.style.setProperty('--color-accent-amber', t.secondary);
    root.style.setProperty('--color-accent-teal', t.accent);

    // Canvas and Card backgrounds
    root.style.setProperty('--bg-canvas', t.bgCanvas);
    root.style.setProperty('--bg-card', t.bgCard);
    root.style.setProperty('--color-bg-canvas', t.bgCanvas);
    root.style.setProperty('--color-bg-card', t.bgCard);

    // Glow accents
    root.style.setProperty('--accent-orange-glow', `${t.primary}${isLight ? '33' : '66'}`);
    root.style.setProperty('--accent-amber-glow', `${t.secondary}${isLight ? '28' : '55'}`);
    root.style.setProperty('--accent-teal-glow', `${t.accent}${isLight ? '33' : '66'}`);

    // Mode-dependent typography and surfaces
    if (isLight) {
      root.style.setProperty('--text-primary', '#09090B');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-muted', '#64748B');
      root.style.setProperty('--bg-glass', 'rgba(255, 255, 255, 0.92)');
      root.style.setProperty('--bg-glass-heavy', 'rgba(255, 255, 255, 0.98)');
      root.style.setProperty('--border-glass', 'rgba(0, 0, 0, 0.09)');
      root.style.setProperty('--border-glass-hover', 'rgba(0, 0, 0, 0.18)');
      root.style.setProperty('--border-glass-active', `${t.primary}90`);
    } else {
      root.style.setProperty('--text-primary', '#F5F5F7');
      root.style.setProperty('--text-secondary', '#A1A1AA');
      root.style.setProperty('--text-muted', '#71717A');
      root.style.setProperty('--bg-glass', 'rgba(18, 18, 26, 0.72)');
      root.style.setProperty('--bg-glass-heavy', 'rgba(12, 12, 18, 0.88)');
      root.style.setProperty('--border-glass', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--border-glass-hover', 'rgba(255, 255, 255, 0.22)');
      root.style.setProperty('--border-glass-active', `${t.primary}80`);
    }

    // HTML attributes & classes for responsive CSS scoping
    root.setAttribute('data-theme', themeKey);
    root.setAttribute('data-mode', activeMode);
    root.classList.toggle('light', isLight);
    root.classList.toggle('dark', !isLight);

    if (document.body) {
      document.body.style.backgroundColor = t.bgCanvas;
      document.body.style.color = isLight ? '#09090B' : '#F5F5F7';
    }
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('foodline-theme', newTheme);
    applyThemeToCSS(newTheme, mode, customColors);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('foodline-mode', newMode);
    applyThemeToCSS(theme, newMode, customColors);
  };

  const toggleMode = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
  };

  const setCustomColors = (colors: CustomColors) => {
    setCustomColorsState(colors);
    localStorage.setItem('foodline-custom-colors', JSON.stringify(colors));
    if (theme === 'custom') {
      applyThemeToCSS('custom', mode, colors);
    }
  };

  const applyCustomPalette = (colors: CustomColors) => {
    setCustomColorsState(colors);
    setThemeState('custom');
    localStorage.setItem('foodline-custom-colors', JSON.stringify(colors));
    localStorage.setItem('foodline-theme', 'custom');
    applyThemeToCSS('custom', mode, colors);
  };

  const activeConfig = getThemeConfig(theme, mode, customColors);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        mode,
        setMode,
        toggleMode,
        customColors,
        setCustomColors,
        applyCustomPalette,
        config: activeConfig,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
