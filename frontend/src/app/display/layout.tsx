'use client';

import React, { useState, useEffect } from 'react';
import { useWakeLock } from '@/hooks/useWakeLock';
import { getAudioContext } from '@/lib/voice-announcer';
import { Volume2 } from 'lucide-react';

export default function DisplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLocked } = useWakeLock();
  const [audioNeedsUnlock, setAudioNeedsUnlock] = useState(false);

  useEffect(() => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      setAudioNeedsUnlock(true);
    }

    const unlockHandler = async () => {
      const audio = getAudioContext();
      if (audio && audio.state === 'suspended') {
        try {
          await audio.resume();
        } catch (e) {
          console.warn('Audio resume error:', e);
        }
      }
      setAudioNeedsUnlock(false);
    };

    window.addEventListener('click', unlockHandler, { once: true });
    window.addEventListener('touchstart', unlockHandler, { once: true });

    return () => {
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
    };
  }, []);

  return (
    <div className="min-h-screen w-screen bg-[#07070B] text-[#F5F5F7] overflow-hidden flex flex-col font-sans relative select-none">
      {/* Audio Unlock Notification Toast */}
      {audioNeedsUnlock && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/50 text-[#00D4AA] text-xs font-black uppercase tracking-wider backdrop-blur-xl shadow-2xl flex items-center gap-2 animate-bounce cursor-pointer">
          <Volume2 size={16} />
          <span>Tap anywhere to enable SoundBox Voice Calling</span>
        </div>
      )}

      {children}
    </div>
  );
}
