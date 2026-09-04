'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, X, Check, Sparkles, Sliders, Moon, Sun, Wand2, RefreshCw } from 'lucide-react';
import { useTheme, THEMES, ThemeName, CustomColors } from '@/context/ThemeContext';
import { useSoundFX } from '@/hooks/useSoundFX';
import { fireConfettiSuccess } from '@/components/ui';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_CUSTOM_PALETTES = [
  { name: 'Royal Gold', primary: '#D4AF37', secondary: '#F3C66F', accent: '#E5A93C' },
  { name: 'Sakura Blossom', primary: '#F43F5E', secondary: '#FDA4AF', accent: '#FB7185' },
  { name: 'Electric Cyan', primary: '#06B6D4', secondary: '#67E8F9', accent: '#3B82F6' },
  { name: 'Emerald Jade', primary: '#10B981', secondary: '#6EE7B7', accent: '#059669' },
  { name: 'Hyper Violet', primary: '#8B5CF6', secondary: '#C4B5FD', accent: '#EC4899' },
  { name: 'Sunset Tangerine', primary: '#FF6B2C', secondary: '#FDBA74', accent: '#F59E0B' },
];

export function ThemeCustomizerModal({ isOpen, onClose }: ThemeCustomizerModalProps) {
  const { theme: activeTheme, setTheme, mode, toggleMode, setMode, customColors, setCustomColors, applyCustomPalette, config } = useTheme();
  const { playClick, playPop } = useSoundFX();

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [localCustom, setLocalCustom] = useState<CustomColors>(customColors);

  React.useEffect(() => {
    if (isOpen) {
      setLocalCustom(customColors);
    }
  }, [isOpen, customColors]);

  const handleSelectTheme = (tId: ThemeName) => {
    setTheme(tId);
    playPop();
    if (tId !== activeTheme) {
      fireConfettiSuccess();
    }
  };

  const handleApplyCustom = () => {
    applyCustomPalette(localCustom);
    playPop();
    fireConfettiSuccess();
  };

  const isLight = mode === 'light';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className={`relative z-10 w-full max-w-2xl border rounded-[2.5rem] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto backdrop-blur-2xl transition-colors duration-300 ${
              isLight
                ? 'bg-white/95 border-black/10 text-zinc-900 shadow-xl'
                : 'bg-[#0F0F17]/95 border-white/15 text-white shadow-2xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-accent-orange to-accent-amber flex items-center justify-center text-black shadow-lg shadow-accent-orange/20">
                  <Palette size={24} strokeWidth={2.4} />
                </div>
                <div>
                  <h2 className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    <span>Campus Theme Studio</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent-orange/15 text-accent-orange font-bold border border-accent-orange/30">
                      {Object.keys(THEMES).length} Presets + Custom
                    </span>
                  </h2>
                  <p className={`text-xs font-medium ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Personalize your FoodLine visual experience. Instant real-time UI styling.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { playClick(); onClose(); }}
                className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition cursor-pointer ${
                  isLight
                    ? 'bg-black/5 hover:bg-black/10 border-black/10 text-zinc-600 hover:text-black'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400 hover:text-white'
                }`}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Controls Bar: Day/Night Mode Switch & Presets/Custom Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-5 p-3 rounded-2xl bg-black/5 dark:bg-white/[0.04] border border-black/5 dark:border-white/10">
              {/* Day / Night Segmented Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 w-full sm:w-auto justify-center">
                <button
                  onClick={() => {
                    if (mode !== 'light') {
                      playClick();
                      setMode('light');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    mode === 'light'
                      ? 'bg-white text-zinc-900 shadow-md font-black'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Sun size={14} className="text-amber-500" />
                  <span>Day Mode</span>
                </button>

                <button
                  onClick={() => {
                    if (mode !== 'dark') {
                      playClick();
                      setMode('dark');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    mode === 'dark'
                      ? 'bg-zinc-800 text-white shadow-md font-black border border-white/10'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                  }`}
                >
                  <Moon size={14} className="text-indigo-400" />
                  <span>Night Mode</span>
                </button>
              </div>

              {/* Presets vs Custom Studio Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 w-full sm:w-auto justify-center">
                <button
                  onClick={() => {
                    setActiveTab('presets');
                    playClick();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'presets'
                      ? 'bg-accent-orange text-black font-black shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Theme Presets</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('custom');
                    playClick();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'custom'
                      ? 'bg-accent-orange text-black font-black shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Sliders size={13} />
                  <span>Custom Color Studio</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Presets Grid */}
            {activeTab === 'presets' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
                {(Object.keys(THEMES) as Array<Exclude<ThemeName, 'custom'>>).map((tKey) => {
                  const t = THEMES[tKey];
                  const isSelected = activeTheme === tKey;
                  const canvasColor = isLight ? t.bgCanvasLight : t.bgCanvasDark;

                  return (
                    <motion.div
                      key={tKey}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTheme(tKey)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-accent-orange bg-accent-orange/10 shadow-[0_0_24px_var(--accent-orange-glow)]'
                          : isLight
                          ? 'border-black/10 bg-black/[0.02] hover:border-black/20 hover:bg-black/[0.04]'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'
                      }`}
                    >
                      {/* Top Row: Emoji, Name, Active Check */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{t.emoji}</span>
                            <div>
                              <span className={`text-sm font-black block leading-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                                {t.name}
                              </span>
                              <span className={`text-[10px] font-medium block ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                {t.tagline}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <span className="w-6 h-6 rounded-full bg-accent-teal text-black flex items-center justify-center flex-shrink-0 shadow-md">
                              <Check size={14} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row: Color Swatches */}
                      <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20 shadow-sm"
                            style={{ backgroundColor: t.primary }}
                            title={`Primary: ${t.primary}`}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20 shadow-sm"
                            style={{ backgroundColor: t.secondary }}
                            title={`Secondary: ${t.secondary}`}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20 shadow-sm"
                            style={{ backgroundColor: t.accent }}
                            title={`Accent: ${t.accent}`}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/20 shadow-sm"
                            style={{ backgroundColor: canvasColor }}
                            title={`Canvas: ${canvasColor}`}
                          />
                        </div>

                        <span
                          className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: `${t.primary}50`,
                            color: t.primary,
                            backgroundColor: `${t.primary}15`,
                          }}
                        >
                          {isSelected ? 'Active' : 'Apply'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Custom Color Studio */}
            {activeTab === 'custom' && (
              <div className="space-y-5 my-4">
                {/* Intro banner */}
                <div className="p-4 rounded-2xl bg-linear-to-r from-accent-orange/10 via-accent-amber/10 to-transparent border border-accent-orange/20 flex items-center gap-3">
                  <Wand2 className="text-accent-orange shrink-0" size={22} />
                  <div className="text-xs">
                    <p className={`font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Design Your Own FoodLine Color Scheme
                    </p>
                    <p className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>
                      Customize primary, secondary, and accent colors. Changes apply across all buttons, badges, and glows.
                    </p>
                  </div>
                </div>

                {/* Preset Palettes */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold block ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    1-Tap Color Inspiration Presets:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_CUSTOM_PALETTES.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setLocalCustom({ primary: p.primary, secondary: p.secondary, accent: p.accent });
                          playClick();
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          isLight
                            ? 'bg-black/5 hover:bg-black/10 border-black/10 text-zinc-800'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.secondary }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Individual Color Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Primary Color */}
                  <div className={`p-4 rounded-2xl border ${isLight ? 'bg-black/[0.02] border-black/10' : 'bg-black/40 border-white/10'}`}>
                    <label className={`text-xs font-bold block mb-2 ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                      Primary Accent
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={localCustom.primary}
                        onChange={(e) => setLocalCustom({ ...localCustom, primary: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                      />
                      <div>
                        <span className="font-mono text-xs font-bold uppercase">{localCustom.primary}</span>
                        <span className="block text-[10px] text-zinc-400">Buttons & Highlights</span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className={`p-4 rounded-2xl border ${isLight ? 'bg-black/[0.02] border-black/10' : 'bg-black/40 border-white/10'}`}>
                    <label className={`text-xs font-bold block mb-2 ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                      Secondary Gradient
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={localCustom.secondary}
                        onChange={(e) => setLocalCustom({ ...localCustom, secondary: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                      />
                      <div>
                        <span className="font-mono text-xs font-bold uppercase">{localCustom.secondary}</span>
                        <span className="block text-[10px] text-zinc-400">Gradient Tails & Badges</span>
                      </div>
                    </div>
                  </div>

                  {/* Accent Highlight */}
                  <div className={`p-4 rounded-2xl border ${isLight ? 'bg-black/[0.02] border-black/10' : 'bg-black/40 border-white/10'}`}>
                    <label className={`text-xs font-bold block mb-2 ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                      Status & Highlights
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={localCustom.accent}
                        onChange={(e) => setLocalCustom({ ...localCustom, accent: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                      />
                      <div>
                        <span className="font-mono text-xs font-bold uppercase">{localCustom.accent}</span>
                        <span className="block text-[10px] text-zinc-400">Cart & Indicators</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className={`p-5 rounded-2xl border ${isLight ? 'bg-white border-black/10 shadow-sm' : 'bg-[#12121A] border-white/10'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-3 text-zinc-400">
                    Live UI Preview with Your Custom Palette:
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="px-4 py-2 rounded-xl text-black font-black text-xs uppercase tracking-wider shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${localCustom.primary}, ${localCustom.secondary})`,
                        boxShadow: `0 4px 14px ${localCustom.primary}40`,
                      }}
                    >
                      Express Order Tray
                    </button>

                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold border"
                      style={{
                        borderColor: `${localCustom.accent}60`,
                        color: localCustom.accent,
                        backgroundColor: `${localCustom.accent}15`,
                      }}
                    >
                      30-Sec Counter Pickup
                    </span>

                    <span
                      className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg"
                      style={{
                        color: localCustom.primary,
                        backgroundColor: `${localCustom.primary}15`,
                      }}
                    >
                      OTP: 6065
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setLocalCustom(customColors);
                      playClick();
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isLight ? 'border-black/10 hover:bg-black/5' : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <RefreshCw size={14} />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={handleApplyCustom}
                    className="px-6 py-2.5 rounded-xl text-black text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg transition flex items-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${localCustom.primary}, ${localCustom.secondary})`,
                      boxShadow: `0 4px 20px ${localCustom.primary}50`,
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                    <span>Apply Custom Palette</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Preview Demo Strip */}
            <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 ${
              isLight ? 'bg-black/[0.03] border-black/10' : 'bg-black/40 border-white/10'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                <Sparkles size={14} className="text-accent-amber" />
                <span className={isLight ? 'text-zinc-700' : 'text-zinc-300'}>
                  Active Theme: <strong className={isLight ? 'text-black font-black' : 'text-white font-black'}>{config.name}</strong> ({mode === 'light' ? '☀️ Day' : '🌙 Night'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { playClick(); onClose(); }}
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-black text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-accent-orange/25"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
