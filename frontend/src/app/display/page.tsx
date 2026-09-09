'use client';

import React, { useState, useEffect } from 'react';
import {
  DisplayHeader,
  PreparingColumn,
  ReadyColumn,
  DisplayTicker,
  AudioSettingsDrawer,
} from '@/components/display';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { useWakeLock } from '@/hooks/useWakeLock';
import { getSoundSettings, saveSoundSettings } from '@/lib/voice-announcer';
import { SoundSettings } from '@/lib/types';

export default function CounterDisplayPage() {
  const { preparingOrders, readyOrders, isConnected, demoMode, setDemoMode } =
    useRealtimeOrders();
  const { isLocked: isWakeLocked } = useWakeLock();

  const [soundSettings, setSoundSettings] = useState<SoundSettings>(getSoundSettings());
  const [isAudioDrawerOpen, setIsAudioDrawerOpen] = useState(false);

  useEffect(() => {
    setSoundSettings(getSoundSettings());
  }, []);

  const handleUpdateSoundSettings = (newSettings: SoundSettings) => {
    setSoundSettings(newSettings);
    saveSoundSettings(newSettings);
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-between bg-[#07070B] overflow-hidden relative">
      {/* Dynamic Background Aurora Glows */}
      <div className="absolute top-1/4 left-1/5 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-[650px] h-[650px] bg-[#00D4AA]/8 rounded-full blur-[160px] pointer-events-none" />

      {/* Top TV Header Bar */}
      <DisplayHeader
        soundSettings={soundSettings}
        onOpenSoundSettings={() => setIsAudioDrawerOpen(true)}
        isWakeLocked={isWakeLocked}
        isConnected={isConnected}
        demoMode={demoMode}
      />

      {/* Main Split-Screen Stage */}
      <main className="flex-1 px-6 py-4 flex flex-col lg:flex-row items-stretch gap-6 overflow-hidden relative z-10 min-h-0">
        {/* Left Column (45% Width): Now Preparing */}
        <div className="w-full lg:w-[45%] flex flex-col min-h-0">
          <PreparingColumn orders={preparingOrders} />
        </div>

        {/* Right Column (55% Width): Ready for Pickup */}
        <div className="w-full lg:w-[55%] flex flex-col min-h-0">
          <ReadyColumn orders={readyOrders} />
        </div>
      </main>

      {/* Bottom Marquee Live Ticker */}
      <DisplayTicker />

      {/* Slide-over Audio & Demo Settings Drawer */}
      <AudioSettingsDrawer
        isOpen={isAudioDrawerOpen}
        onClose={() => setIsAudioDrawerOpen(false)}
        settings={soundSettings}
        onUpdateSettings={handleUpdateSoundSettings}
        demoMode={demoMode}
        onToggleDemoMode={setDemoMode}
      />
    </div>
  );
}
