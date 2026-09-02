'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, X, Check, Sparkles, Sliders, Moon, Sun } from 'lucide-react';
import { useTheme, THEMES, ThemeName } from '@/context/ThemeContext';
import { useSoundFX } from '@/hooks/useSoundFX';
import { SpotlightCard, fireConfettiSuccess } from '@/components/ui';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCustomizerModal({ isOpen, onClose }: ThemeCustomizerModalProps) {
  const { theme: activeTheme, setTheme, config } = useTheme();
  const { playClick, playPop } = useSoundFX();

  const handleSelectTheme = (tId: ThemeName) => {
    setTheme(tId);
    playPop();
    if (tId !== activeTheme) {
      fireConfettiSuccess();
    }
  };

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
            className="relative z-10 w-full max-w-2xl bg-[#0F0F17]/95 border border-white/15 rounded-[2.5rem] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] flex items-center justify-center text-black shadow-lg shadow-[#FF6B2C]/20">
                  <Palette size={24} strokeWidth={2.4} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>Campus Color Themes</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[#FFB347] font-bold">
                      8 Presets
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium">
                    Personalize your FoodLine visual experience. Instant real-time theme glow.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { playClick(); onClose(); }}
                className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* 8-Theme Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {(Object.keys(THEMES) as ThemeName[]).map((tKey) => {
                const t = THEMES[tKey];
                const isSelected = activeTheme === tKey;

                return (
                  <motion.div
                    key={tKey}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectTheme(tKey)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FF6B2C] bg-white/[0.07] shadow-[0_0_30px_rgba(255,107,44,0.25)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Top Row: Emoji, Name, Active Check */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{t.emoji}</span>
                          <div>
                            <span className="text-sm font-black text-white block leading-tight">
                              {t.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium block">
                              {t.tagline}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-[#00D4AA] text-black flex items-center justify-center flex-shrink-0 shadow-md">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Color Swatches */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: t.primary }}
                          title={`Primary: ${t.primary}`}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: t.secondary }}
                          title={`Secondary: ${t.secondary}`}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: t.accent }}
                          title={`Accent: ${t.accent}`}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: t.bgCanvas }}
                          title={`Canvas: ${t.bgCanvas}`}
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

            {/* Live Preview Demo Strip */}
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <Sparkles size={14} className="text-[#FFB347]" />
                <span>Live Active Theme: <strong className="text-white">{config.name}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { playClick(); onClose(); }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-[#FF6B2C]/25"
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
