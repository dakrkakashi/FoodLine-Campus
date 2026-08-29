'use client';

import { useState, useEffect } from 'react';

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

  const playSynth = (frequency = 440, type: OscillatorType = 'sine', duration = 0.1, gainVal = 0.1) => {
    if (muted || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
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

  return {
    muted,
    toggleMute,
    playClick,
    playPop,
    playSuccess,
    playTab,
  };
}
