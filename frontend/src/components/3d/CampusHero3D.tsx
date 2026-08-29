'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Food3DViewer } from './Food3DViewer';
import { Sparkles, ArrowRight, Flame, ShieldCheck } from 'lucide-react';

const MODELS = [
  { id: 'burger' as const, name: 'Cafe @7 Double Cheese Burger', price: '₹90', prep: '4 mins', tag: 'Chef Special' },
  { id: 'coffee' as const, name: 'Signature Hot Cappuccino', price: '₹40', prep: '2 mins', tag: 'Fast Grab' },
  { id: 'dosa' as const, name: 'Special Butter Masala Dosa', price: '₹50', prep: '5 mins', tag: 'Student Fav' },
];

export function CampusHero3D() {
  const [activeModel, setActiveModel] = useState<'burger' | 'coffee' | 'dosa'>('burger');
  const currentDish = MODELS.find((m) => m.id === activeModel)!;

  return (
    <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#16161E]/90 to-[#0A0A0F]/95 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FF6B2C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#00D4AA]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Interactive Selector Tabs */}
      <div className="flex items-center justify-between gap-2 mb-4 relative z-10 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModel(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeModel === m.id
                  ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{m.id === 'burger' ? '🍔' : m.id === 'coffee' ? '☕' : '🥞'}</span>
              <span className="capitalize">{m.id}</span>
            </button>
          ))}
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-black flex items-center gap-1">
          <Sparkles size={11} />
          <span>Realtime WebGL 3D</span>
        </span>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative z-10 my-2">
        <Food3DViewer modelType={activeModel} className="w-full h-[280px]" />
      </div>

      {/* Bottom Dish Information & Order CTA */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#FF6B2C] uppercase tracking-wider">
              {currentDish.tag}
            </span>
            <span className="text-[10px] text-zinc-500">• Prep in {currentDish.prep}</span>
          </div>
          <h4 className="text-base font-black text-white mt-0.5">{currentDish.name}</h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <div className="text-lg font-black text-[#00D4AA]">{currentDish.price}</div>
          </div>

          <Link
            href="/menu"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] hover:from-[#FF6B2C]/90 hover:to-[#FFB347]/90 text-black font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#FF6B2C]/20 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span>Order</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
