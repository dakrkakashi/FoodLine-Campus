'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Activity, Cpu, Sparkles, X } from 'lucide-react';
import { use144HzFramePacer } from '@/hooks/use144HzFramePacer';

interface HighRefreshRateBadgeProps {
  className?: string;
}

export function HighRefreshRateBadge({ className = '' }: HighRefreshRateBadgeProps) {
  const { fps, refreshRate, frameTimeMs, is144Hz } = use144HzFramePacer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className={`fixed bottom-20 sm:bottom-4 left-3 sm:left-4 z-40 select-none ${className}`}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            onClick={() => setIsExpanded(true)}
            title="Click to view 144Hz GPU & Frame Pacing Telemetry"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#191614]/90 hover:bg-[#24201D] border border-white/10 hover:border-[#00D4AA]/40 backdrop-blur-xl shadow-lg cursor-pointer transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4AA]" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-black font-mono tracking-tight text-[#FAF9F6]">
              {fps > 0 ? fps : 144} FPS
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#00D4AA] uppercase tracking-wider">
              {refreshRate}Hz
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            className="w-60 sm:w-64 rounded-2xl bg-[#191614]/95 border border-[#00D4AA]/30 p-3.5 backdrop-blur-2xl shadow-2xl text-[#FAF9F6]"
          >
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-black">
                <Zap className="w-3.5 h-3.5 text-[#00D4AA]" />
                <span>144Hz GPU Engine</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-xs text-[#8E8EA0] hover:text-[#FAF9F6] p-1 rounded-md cursor-pointer"
                  aria-label="Collapse"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] font-medium">
              <div className="flex items-center justify-between">
                <span className="text-[#8E8EA0]">Render Speed</span>
                <span className="font-mono font-bold text-[#00D4AA]">{fps} FPS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E8EA0]">Display Target</span>
                <span className="font-mono font-bold text-[#FAF9F6]">{refreshRate}Hz Ultra-Smooth</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E8EA0]">Frame Budget</span>
                <span className="font-mono font-bold text-[#FFB347]">{frameTimeMs}ms (vs 16.6ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E8EA0]">Compositing</span>
                <span className="text-[10px] font-bold text-[#00C261] uppercase tracking-wider">GPU Direct-Pass</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/10 text-[9.5px] text-[#8E8EA0] flex items-center justify-between">
              <span>High Refresh Native</span>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="text-[#FF6B2C] hover:underline font-bold cursor-pointer"
              >
                Hide HUD
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
