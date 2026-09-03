'use client';

import { useState, useEffect } from 'react';

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function useSoundFX() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('foodline-muted');
    if (saved !== null) {
      setMuted(saved === 'true');
    }
  }, []);

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem('foodline-muted', String(next));
      return next;
    });
  };

  const unlockAudio = async (): Promise<boolean> => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }
    return ctx?.state === 'running';
  };

  const playSynth = (frequency = 440, type: OscillatorType = 'sine', duration = 0.1, gainVal = 0.1) => {
    if (muted || typeof window === 'undefined') return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context ignore
    }
  };

  const playClick = () => playSynth(600, 'sine', 0.08, 0.08);
  const playPop = () => playSynth(880, 'triangle', 0.12, 0.1);
  const playSuccess = () => {
    playSynth(523.25, 'sine', 0.15, 0.1); // C5
    setTimeout(() => playSynth(659.25, 'sine', 0.15, 0.1), 80); // E5
    setTimeout(() => playSynth(783.99, 'sine', 0.25, 0.12), 160); // G5
    setTimeout(() => playSynth(1046.5, 'sine', 0.35, 0.15), 240); // C6
  };
  const playTab = () => playSynth(400, 'sine', 0.06, 0.05);

  const playKitchenReadyChime = () => {
    if (muted || typeof window === 'undefined') return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Resonant 3-bell counter chime: A5 (880Hz) -> C#6 (1108.7Hz) -> E6 (1318.5Hz)
      const playBell = (freq: number, delay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.22, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      playBell(880.0, 0.0, 0.4);
      playBell(1108.73, 0.12, 0.5);
      playBell(1318.51, 0.24, 0.8);
    } catch (e) {
      // Ignore audio context issues
    }
  };

  return {
    muted,
    toggleMute,
    unlockAudio,
    playClick,
    playPop,
    playSuccess,
    playTab,
    playKitchenReadyChime,
  };
}
