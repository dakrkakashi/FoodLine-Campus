'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { useSoundFX } from '@/hooks/useSoundFX';
import { useAuth } from '@/lib/auth/useAuth';
import { CoolMode } from '@/components/magicui/cool-mode';

export function HowItWorksCTA() {
  const { playClick, playTab } = useSoundFX();
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <CoolMode options={{ particleCount: 20 }}>
        <Link
          href={user ? '/menu' : '/login'}
          onClick={playClick}
          className="w-full sm:w-auto px-8 py-3.5 bg-accent-orange hover:bg-accent-orange/90 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-accent-orange/25 hover:shadow-accent-orange/40 flex items-center justify-center gap-2 active:scale-98"
        >
          <span>{user ? 'Open Cafe @7 Menu' : 'Sign In with PRN'}</span>
          <ArrowRight size={16} />
        </Link>
      </CoolMode>

      <Link
        href="/faq"
        onClick={playTab}
        className="w-full sm:w-auto px-6 py-3.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
      >
        <HelpCircle size={16} />
        <span>Campus FAQ</span>
      </Link>
    </div>
  );
}
