'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  X,
  Play,
  Languages,
  Sliders,
  Sparkles,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { SoundSettings } from '@/lib/types';
import { playTestChime } from '@/lib/voice-announcer';

interface AudioSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SoundSettings;
  onUpdateSettings: (newSettings: SoundSettings) => void;
  demoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
}

export function AudioSettingsDrawer({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  demoMode,
  onToggleDemoMode,
}: AudioSettingsDrawerProps) {
  const [isPlayingTest, setIsPlayingTest] = React.useState(false);

  const handleTestChime = async () => {
    setIsPlayingTest(true);
    try {
      await playTestChime(settings);
    } finally {
      setIsPlayingTest(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#0D0D14] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00D4AA]/15 border border-[#00D4AA]/30 flex items-center justify-center text-[#00D4AA]">
                    <Sliders size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-['Outfit',sans-serif]">
                      SoundBox & Display Controls
                    </h3>
                    <span className="text-xs text-zinc-400">Audio chime & TV configuration</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Master Sound Switch */}
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.enabled ? (
                      <Volume2 size={22} className="text-[#00D4AA]" />
                    ) : (
                      <VolumeX size={22} className="text-zinc-500" />
                    )}
                    <div>
                      <div className="font-extrabold text-sm text-white">Voice Calling SoundBox</div>
                      <span className="text-xs text-zinc-400">
                        {settings.enabled ? 'Enabled (Airport chime + speech)' : 'Muted'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateSettings({ ...settings, enabled: !settings.enabled })}
                    className={`w-14 h-8 rounded-full transition-all relative p-1 cursor-pointer ${
                      settings.enabled ? 'bg-[#00D4AA]' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-all transform ${
                        settings.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                    <span>Sound Volume</span>
                    <span className="font-mono text-[#00D4AA]">
                      {Math.round(settings.volume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.volume}
                    disabled={!settings.enabled}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, volume: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[#00D4AA] h-2 bg-black/50 rounded-lg cursor-pointer disabled:opacity-30"
                  />
                </div>

                {/* Language / Accent Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Languages size={14} />
                    <span>Voice Language & Accent</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'en-IN', label: 'English', sub: '(Indian)' },
                      { id: 'hi-IN', label: 'हिंदी', sub: '(Hindi)' },
                      { id: 'mr-IN', label: 'मराठी', sub: '(Marathi)' },
                    ].map((lang) => {
                      const isSelected = settings.lang === lang.id;
                      return (
                        <button
                          key={lang.id}
                          onClick={() =>
                            onUpdateSettings({ ...settings, lang: lang.id as any })
                          }
                          className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#00D4AA]/20 border-[#00D4AA] text-white'
                              : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/20'
                          }`}
                        >
                          <div className="font-black text-xs">{lang.label}</div>
                          <span className="text-[10px] text-zinc-400 block">{lang.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Test Voice Chime Button */}
                <button
                  onClick={handleTestChime}
                  disabled={isPlayingTest}
                  className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play size={14} />
                  <span>{isPlayingTest ? 'Playing Chime...' : 'Test Announcement Chime'}</span>
                </button>

                {/* Demo Rush Mode Switch */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-purple-400" />
                      <span className="text-xs font-extrabold text-white">
                        Demo Lunch Rush Simulation
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleDemoMode(!demoMode)}
                      className={`w-12 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${
                        demoMode ? 'bg-purple-600' : 'bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-all transform ${
                          demoMode ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Simulates active student break traffic by spawning test tokens every 18 seconds for presentation and display testing.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-[11px] text-zinc-500 font-mono">
                FoodLine Audio Engine • v1.0.0 (Web Audio & Speech API)
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
