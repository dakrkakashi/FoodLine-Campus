'use client';

import { useState, useEffect, useRef } from 'react';

export interface FramePacerMetrics {
  fps: number;
  refreshRate: number;
  frameTimeMs: number;
  is144Hz: boolean;
  isHighRefresh: boolean;
}

export function use144HzFramePacer() {
  const [metrics, setMetrics] = useState<FramePacerMetrics>({
    fps: 144,
    refreshRate: 144,
    frameTimeMs: 6.94,
    is144Hz: true,
    isHighRefresh: true,
  });

  const rafRef = useRef<number | null>(null);
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frameCount = 0;
    let startTime = performance.now();
    lastTimeRef.current = startTime;

    const measureFrame = (currentTime: number) => {
      const delta = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (delta > 0 && delta < 100) {
        frameTimesRef.current.push(delta);
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }
      }

      frameCount++;

      // Every 30 frames, update calculated refresh rate and metrics
      if (frameCount >= 30) {
        const elapsed = currentTime - startTime;
        const calculatedFps = Math.round((frameCount / elapsed) * 1000);

        // Classify refresh rate target (e.g. ~144Hz, ~120Hz, ~90Hz, ~60Hz)
        let estimatedHz = 144;
        if (calculatedFps > 135) estimatedHz = 144;
        else if (calculatedFps > 110) estimatedHz = 120;
        else if (calculatedFps > 80) estimatedHz = 90;
        else estimatedHz = 60;

        const avgDelta = frameTimesRef.current.length > 0
          ? frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
          : 6.94;

        // Apply hardware acceleration profile to root html tag
        document.documentElement.setAttribute('data-hz', estimatedHz.toString());
        document.documentElement.setAttribute('data-frame-budget', `${avgDelta.toFixed(2)}ms`);

        setMetrics({
          fps: Math.min(144, calculatedFps),
          refreshRate: estimatedHz,
          frameTimeMs: Number(avgDelta.toFixed(2)),
          is144Hz: calculatedFps >= 135,
          isHighRefresh: calculatedFps >= 90,
        });

        frameCount = 0;
        startTime = currentTime;
      }

      rafRef.current = requestAnimationFrame(measureFrame);
    };

    rafRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return metrics;
}
