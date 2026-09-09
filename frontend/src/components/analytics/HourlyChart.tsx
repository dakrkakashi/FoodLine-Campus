'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface HourlyDataPoint {
  time: string;
  orders: number;
}

interface HourlyChartProps {
  data: HourlyDataPoint[];
}

export function HourlyChart({ data }: HourlyChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxOrders = Math.max(...data.map((d) => d.orders), 120);
  const chartHeight = 220;
  const chartWidth = 600;

  // Calculate points for the smooth SVG area curve
  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (d.orders / maxOrders) * (chartHeight - 40) - 20;
    return { x, y, ...d };
  });

  // Generate SVG path for line and filled area
  const linePath = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="relative w-full flex-1 min-h-[220px]">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#FF6B2C" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FF6B2C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF6B2C" />
              <stop offset="50%" stopColor="#FFB347" />
              <stop offset="100%" stopColor="#FF6B2C" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - ratio * (chartHeight - 40) - 20;
            return (
              <line
                key={i}
                x1="0"
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Glowing Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Points / Interactive Hover Circles */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 6 : 4}
                fill={hoveredIndex === i ? '#FFFFFF' : '#FF6B2C'}
                stroke="#16161E"
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer"
              />
              {/* Invisible larger hover area */}
              <circle
                cx={p.x}
                cy={p.y}
                r={24}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-10 px-3 py-1.5 rounded-xl bg-[#16161E] border border-white/20 shadow-2xl text-xs font-bold text-white pointer-events-none transform -translate-x-1/2 flex items-center gap-2 backdrop-blur-xl"
            style={{
              left: `${(hoveredIndex / (data.length - 1)) * 90 + 5}%`,
            }}
          >
            <span className="text-zinc-400">{data[hoveredIndex].time}:</span>
            <span className="text-[#FF6B2C] font-black">{data[hoveredIndex].orders} orders</span>
          </div>
        )}
      </div>

      {/* X-Axis Time Labels */}
      <div className="flex justify-between text-[11px] font-bold text-zinc-500 pt-3 border-t border-white/5">
        {data.map((d, i) => (
          <span
            key={i}
            className={`transition-colors ${
              hoveredIndex === i ? 'text-[#FFB347] font-black' : ''
            }`}
          >
            {d.time}
          </span>
        ))}
      </div>
    </div>
  );
}
