'use client';

import React from 'react';
import { PickupSlot } from '../lib/types';

interface SlotPickerProps {
  slots: PickupSlot[];
  selectedSlot: PickupSlot | null;
  onSelectSlot: (slot: PickupSlot) => void;
}

export function SlotPicker({ slots, selectedSlot, onSelectSlot }: SlotPickerProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase font-black tracking-wider text-zinc-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF6B2C]" />
          <span>Select Campus Break Slot (60-Cap Limit)</span>
        </label>
        <span className="text-xs text-[#00D4AA] font-extrabold flex items-center gap-1 bg-[#00D4AA]/10 px-2 py-0.5 rounded-full border border-[#00D4AA]/20">
          <span>⚡</span> 10-Min Express Slots
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const percentage = Math.min(100, Math.round((slot.currentBooked / slot.maxCapacity) * 100));
          const isFull = slot.isFull || slot.availableSlots <= 0;
          const isNearFull = percentage >= 80;

          return (
            <button
              key={slot.id}
              disabled={isFull}
              onClick={() => onSelectSlot(slot)}
              type="button"
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-[#201d2d] to-[#161622] border-[#FF6B2C] shadow-xl shadow-[#FF6B2C]/20 ring-2 ring-[#FF6B2C]/50'
                  : isFull
                  ? 'bg-[#101018]/50 border-white/5 opacity-40 cursor-not-allowed'
                  : 'bg-[#14141E]/80 border-white/10 hover:border-white/25 hover:bg-[#181826]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-white">
                  {slot.label.split('(')[0] || slot.label}
                </span>
                {isSelected ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#FF6B2C] bg-[#FF6B2C]/15 px-2 py-0.5 rounded-full border border-[#FF6B2C]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C] animate-ping" />
                    Selected
                  </span>
                ) : isFull ? (
                  <span className="text-[10px] font-black uppercase text-red-400 bg-red-950/40 px-2 py-0.5 rounded-full border border-red-500/30">
                    Full
                  </span>
                ) : null}
              </div>

              <div className="text-xs text-zinc-400 mb-3 font-medium">
                ⏱️ {slot.startTime} – {slot.endTime}
              </div>

              {/* Capacity Meter */}
              <div className="space-y-1.5 bg-black/30 p-2 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 font-medium">Capacity</span>
                  <span className={`font-mono font-black ${isFull ? 'text-red-400' : isNearFull ? 'text-[#FFB347]' : 'text-[#00D4AA]'}`}>
                    {isFull ? 'CAP REACHED' : `${slot.availableSlots} left (${slot.currentBooked}/${slot.maxCapacity})`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isFull
                        ? 'bg-red-500'
                        : isNearFull
                        ? 'bg-gradient-to-r from-[#FFB347] to-[#FF6B2C]'
                        : 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
