'use client';

import React, { useMemo } from 'react';
import { Zap, ShieldCheck, Smartphone, Flame, HeartHandshake } from 'lucide-react';

function DisplayTickerComponent() {
  const tickerItems = useMemo(
    () => [
      {
        icon: <Zap size={15} className="text-[#FF6B2C]" />,
        text: 'AVERAGE EXPRESS GRAB SPEED: 26 SECONDS',
      },
      {
        icon: <ShieldCheck size={15} className="text-emerald-400" />,
        text: '100% PURE VEG FSSAI CERTIFIED KITCHEN',
      },
      {
        icon: <Smartphone size={15} className="text-[#00D4AA]" />,
        text: 'ORDER AHEAD FROM CLASS FOR 11:50 BREAK',
      },
      {
        icon: <Flame size={15} className="text-amber-400" />,
        text: 'MORNING FRESH BATCH PREPARED DAILY AT CAFE @7',
      },
      {
        icon: <HeartHandshake size={15} className="text-purple-400" />,
        text: 'DIRECT UPI SETTLEMENT • ZERO FOOD COMMISSION',
      },
    ],
    []
  );

  const loopItems = useMemo(() => [...tickerItems, ...tickerItems], [tickerItems]);

  return (
    <div className="w-full bg-black/80 border-t border-white/10 py-3 overflow-hidden select-none relative z-20 backdrop-blur-md">
      <div className="marquee-track flex items-center gap-12">
        {/* Render twice for seamless infinite loop */}
        {loopItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs md:text-sm font-black text-zinc-300 tracking-wider whitespace-nowrap">
            {item.icon}
            <span>{item.text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20 ml-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const DisplayTicker = React.memo(DisplayTickerComponent);
