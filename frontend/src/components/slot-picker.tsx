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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase font-extrabold tracking-wider text-zinc-400">
          Select Campus Break Slot (60-Cap Limit)
        </label>
        <span className="text-xs text-[#00D4AA] font-semibold">
          ⚡ 10-Min Fast Windows
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const percentage = Math.min(100, Math.round((slot.currentBooked / slot.maxCapacity) * 100));
          const isFull = slot.isFull || slot.availableSlots <= 0;

          return (
            <button
              key={slot.id}
              disabled={isFull}
              onClick={() => onSelectSlot(slot)}
              type="button"
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-[#1C1C28] border-[#FF6B2C] shadow-lg shadow-[#FF6B2C]/10 ring-1 ring-[#FF6B2C]'
                  : isFull
                  ? 'bg-[#111118]/50 border-white/5 opacity-50 cursor-not-allowed'
                  : 'bg-[#16161E]/80 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-white">
                  {slot.label.split('(')[0] || slot.label}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-pulse" />
                )}
              </div>

              <div className="text-xs text-zinc-400 mb-2">
                {slot.startTime} – {slot.endTime}
              </div>

              {/* Capacity Meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Capacity:</span>
                  <span className={`font-mono font-bold ${isFull ? 'text-red-400' : percentage > 80 ? 'text-[#FFB347]' : 'text-[#00D4AA]'}`}>
                    {isFull ? 'SLOT FULL' : `${slot.availableSlots} left (${slot.currentBooked}/${slot.maxCapacity})`}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all rounded-full ${
                      isFull
                        ? 'bg-red-500'
                        : percentage > 80
                        ? 'bg-[#FFB347]'
                        : 'bg-[#00D4AA]'
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
