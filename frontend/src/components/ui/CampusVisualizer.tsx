'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Gauge, ChefHat, QrCode, ArrowRight, CheckCircle2, Zap, Info } from 'lucide-react';

const NODES = [
  {
    id: 'lecture',
    label: '1. Classroom Pre-Order',
    sub: '10 Mins Before Bell',
    icon: <Smartphone size={24} className="text-[#FF6B2C]" />,
    color: '#FF6B2C',
    stats: '0% Surcharge UPI',
    desc: 'Students browse 44 Cafe @7 dishes during lectures and lock their order without stepping outside.',
  },
  {
    id: 'throttler',
    label: '2. 60-Cap Slot Engine',
    sub: 'Real-Time Load Balancer',
    icon: <Gauge size={24} className="text-[#FFB347]" />,
    color: '#FFB347',
    stats: '60 Max Orders/Slot',
    desc: 'Prevents kitchen overload by automatically batching orders into 15-minute campus break windows.',
  },
  {
    id: 'kitchen',
    label: '3. Chef KDS Station',
    sub: 'Real-Time Tablet Kanban',
    icon: <ChefHat size={24} className="text-[#00D4AA]" />,
    color: '#00D4AA',
    stats: 'SSE Live Sync',
    desc: 'Kitchen staff view incoming tickets on tablets with 1-tap stockout management and sound alerts.',
  },
  {
    id: 'express',
    label: '4. 30s Express Grab',
    sub: 'Digital QR Flash Pass',
    icon: <QrCode size={24} className="text-[#8B5CF6]" />,
    color: '#8B5CF6',
    stats: 'Under 30s Handover',
    desc: 'Students show their verified QR code at the dedicated pickup counter for immediate hot tray grab.',
  },
];

export function CampusVisualizer() {
  const [activeNode, setActiveNode] = useState(0);

  return (
    <div className="w-full glass-card-heavy rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Energy Lines */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B2C]/20 via-[#00D4AA]/20 to-[#8B5CF6]/20 -translate-y-1/2 pointer-events-none hidden md:block" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 text-[#FFB347] text-xs font-black uppercase tracking-wider mb-2">
            <Zap size={14} /> Interactive Campus Architecture
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            How FoodLine Powers Sanjivani Dining
          </h3>
        </div>
        <div className="text-xs font-bold text-zinc-400 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 w-fit">
          Click any node to inspect data flow ⚡
        </div>
      </div>

      {/* Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 mb-8">
        {NODES.map((node, idx) => {
          const isActive = activeNode === idx;
          return (
            <motion.div
              key={node.id}
              onClick={() => setActiveNode(idx)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                isActive
                  ? 'bg-[#181824] shadow-2xl shadow-black/80'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
              style={{
                borderColor: isActive ? node.color : undefined,
                boxShadow: isActive ? `0 0 25px ${node.color}25` : undefined,
              }}
            >
              {isActive && (
                <span
                  className="absolute -top-2.5 right-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: node.color, color: '#000' }}
                >
                  Inspecting
                </span>
              )}

              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  style={{
                    backgroundColor: `${node.color}15`,
                    border: `1px solid ${node.color}35`,
                  }}
                >
                  {node.icon}
                </div>
                <h4 className="text-sm font-black text-white mb-1">{node.label}</h4>
                <p className="text-[11px] font-bold text-zinc-400">{node.sub}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">{node.stats}</span>
                <span style={{ color: node.color }} className="text-xs font-black">
                  0{idx + 1}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Node Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNode}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="p-6 rounded-3xl bg-black/50 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
              style={{
                backgroundColor: `${NODES[activeNode].color}20`,
                border: `1px solid ${NODES[activeNode].color}40`,
              }}
            >
              {NODES[activeNode].icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-black text-white">{NODES[activeNode].label}</h4>
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${NODES[activeNode].color}20`,
                    color: NODES[activeNode].color,
                  }}
                >
                  Live Architecture Node
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl font-medium">
                {NODES[activeNode].desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveNode((prev) => (prev + 1) % NODES.length)}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs transition cursor-pointer flex items-center gap-2"
            >
              <span>Next Node</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
