"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "#FF6B2C",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const memoizedColor = useMemo(() => {
    const toRGBA = (colorStr: string) => {
      if (typeof window === "undefined") {
        return `rgba(255, 107, 44,`;
      }
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "rgba(255, 107, 44,";
      ctx.fillStyle = colorStr;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      return `rgba(${r}, ${g}, ${b},`;
    };
    return toRGBA(color);
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, widthVal: number, heightVal: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = widthVal * dpr;
      canvas.height = heightVal * dpr;
      canvas.style.width = `${widthVal}px`;
      canvas.style.height = `${heightVal}px`;
      const cols = Math.floor(widthVal / (squareSize + gridGap));
      const rows = Math.floor(heightVal / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: { cols: number; rows: number; squares: Float32Array; dpr: number };

    const updateGrid = () => {
      const w = width || container.clientWidth;
      const h = height || container.clientHeight;
      gridParams = setupCanvas(canvas, w, h);
    };

    updateGrid();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!gridParams) return;
      // throttle redraw to ~24fps for subtle flickering
      if (time - lastTime > 40) {
        lastTime = time;
        const { cols, rows, squares, dpr } = gridParams;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const idx = i * rows + j;
            if (Math.random() < flickerChance) {
              squares[idx] = Math.random() * maxOpacity;
            }
            ctx.fillStyle = `${memoizedColor} ${squares[idx]})`;
            ctx.fillRect(
              (i * (squareSize + gridGap)) * dpr,
              (j * (squareSize + gridGap)) * dpr,
              squareSize * dpr,
              squareSize * dpr,
            );
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(() => {
      updateGrid();
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [setupCanvas, memoizedColor, squareSize, gridGap, flickerChance, maxOpacity, width, height]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 size-full overflow-hidden", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
