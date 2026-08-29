'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Radio,
  Clock,
  Sparkles,
  WifiOff,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { formatDigitalClock, getActiveCampusBreakStatus } from '@/lib/display-utils';
import { SoundSettings } from '@/lib/types';

interface DisplayHeaderProps {
  soundSettings: SoundSettings;
  onOpenSoundSettings: () => void;
  isWakeLocked: boolean;
  isConnected: boolean;
  demoMode: boolean;
}

export function DisplayHeader({
  soundSettings,
  onOpenSoundSettings,
  isWakeLocked,
  isConnected,
  demoMode,
}: DisplayHeaderProps) {
  const [clock, setClock] = useState(formatDigitalClock(new Date()));
  const [breakStatus, setBreakStatus] = useState(getActiveCampusBreakStatus(new Date()));
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setClock(formatDigitalClock(now));
      setBreakStatus(getActiveCampusBreakStatus(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="px-6 py-4 border-b border-white/10 bg-black/60 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4 select-none relative z-30">
      {/* Brand & Campus Node */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-[#FF6B2C]/30 flex-shrink-0">
          FL
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight text-white font-['Outfit',sans-serif]">
              FOODLINE <span className="text-[#FF6B2C]">CAFE @7</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/30 text-[#00D4AA] text-[10px] font-black uppercase tracking-wider">
              Live Counter TV
            </span>
            {demoMode && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-wider animate-pulse">
                Demo Rush
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mt-0.5">
            <span>Sanjivani University Campus Pilot</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={12} /> 100% Pure Veg
            </span>
          </span>
        </div>
      </div>

      {/* Center: Break Slot Countdown */}
      <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-2xl shadow-inner">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Flame size={18} />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
            {breakStatus.label}
          </span>
          <span className="text-base font-black text-amber-400 font-mono tracking-tight">
            {breakStatus.countdown} {breakStatus.isActive ? 'remaining' : ''}
          </span>
        </div>
      </div>

      {/* Right: Live Digital Clock & Control Actions */}
      <div className="flex items-center gap-4">
        {/* Connection Status Pill */}
        {!isConnected && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-pulse shadow-lg">
            <WifiOff size={14} />
            <span>Reconnecting...</span>
          </div>
        )}

        {/* Digital Clock */}
        <div className="bg-black/60 border border-white/10 px-4 py-2 rounded-2xl text-right">
          <span className="text-xs text-zinc-400 font-medium block leading-none mb-0.5">
            {clock.dateString}
          </span>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-black font-mono text-[#00D4AA] tracking-tight">
              {clock.timeString}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {clock.ampm}
            </span>
          </div>
        </div>

        {/* Audio SoundBox Settings Button */}
        <button
          onClick={onOpenSoundSettings}
          title="SoundBox Audio Settings"
          className={`p-3 rounded-2xl border transition flex items-center justify-center cursor-pointer ${
            soundSettings.enabled
              ? 'bg-[#00D4AA]/15 border-[#00D4AA]/40 text-[#00D4AA] hover:bg-[#00D4AA]/25'
              : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white'
          }`}
        >
          {soundSettings.enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Fullscreen TV Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen TV Mode"
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer flex items-center justify-center"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>
    </header>
  );
}
