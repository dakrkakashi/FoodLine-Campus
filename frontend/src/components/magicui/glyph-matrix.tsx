"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlyphMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  cols?: number;
  className?: string;
  glowColor?: string;
}

const GLYPHS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\u03C0\u03A9\u03A3\u26A1\u2615\uD83C\uDF55\uD83C\uDF71".split("");

export function GlyphMatrix({
  rows = 12,
  cols = 24,
  className,
  glowColor = "#FF6B2C",
  ...props
}: GlyphMatrixProps) {
  const [matrix, setMatrix] = useState<string[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPos, setHoveredPos] = useState<{ r: number; c: number } | null>(null);

  const initGrid = useCallback(() => {
    const grid: string[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      }
      grid.push(row);
    }
    setMatrix(grid);
  }, [rows, cols]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cellW = rect.width / cols;
    const cellH = rect.height / rows;
    const c = Math.floor((e.clientX - rect.left) / cellW);
    const r = Math.floor((e.clientY - rect.top) / cellH);
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      setHoveredPos({ r, c });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPos(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "pointer-events-auto grid select-none font-mono text-[10px] leading-none opacity-40 transition-opacity hover:opacity-80",
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      {...props}
    >
      {matrix.map((row, r) =>
        row.map((char, c) => {
          const isNear =
            hoveredPos &&
            Math.hypot(hoveredPos.r - r, hoveredPos.c - c) <= 2.2;

          return (
            <span
              key={`${r}-${c}`}
              style={
                isNear
                  ? {
                      color: glowColor,
                      textShadow: `0 0 8px ${glowColor}`,
                      fontWeight: 700,
                    }
                  : undefined
              }
              className="flex items-center justify-center p-1 text-stone-600 transition-colors duration-150 dark:text-stone-500"
            >
              {char}
            </span>
          );
        }),
      )}
    </div>
  );
}
