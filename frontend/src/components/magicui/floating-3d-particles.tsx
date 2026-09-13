"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Particle3D {
  id: number;
  size: number;
  x: number;
  y: number;
  z: number;
  color: string;
  duration: number;
  delay: number;
}

interface Floating3DParticlesProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  className?: string;
}

const COLORS = [
  "rgba(255, 107, 44, 0.4)", // FoodLine Orange
  "rgba(255, 179, 71, 0.35)", // Amber
  "rgba(0, 212, 170, 0.3)", // Teal
  "rgba(139, 92, 246, 0.25)", // Purple
];

export function Floating3DParticles({
  count = 16,
  className,
  ...props
}: Floating3DParticlesProps) {
  const [particles, setParticles] = React.useState<Particle3D[]>([]);

  React.useEffect(() => {
    const items: Particle3D[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 60) + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 40 - 20,
      color: COLORS[i % COLORS.length],
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 4,
    }));
    setParticles(items);
  }, [count]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden [perspective:1000px]",
        className,
      )}
      {...props}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle at 30% 30%, ${p.color}, transparent 70%)`,
            filter: `blur(${Math.max(2, p.size / 6)}px)`,
          }}
          className="absolute rounded-full"
          animate={{
            y: ["0%", "-30%", "0%"],
            x: ["0%", "20%", "0%"],
            scale: [1, 1.15, 1],
            rotateZ: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
