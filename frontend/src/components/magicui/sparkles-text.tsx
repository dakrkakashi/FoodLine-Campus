"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface SparklesTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
  className?: string;
}

const SparkleIcon = ({ color }: { color: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pointer-events-none absolute select-none"
  >
    <path
      d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
      fill={color}
    />
  </svg>
);

export function SparklesText({
  text,
  sparklesCount = 10,
  colors = {
    first: "#FF6B2C",
    second: "#FFB347",
  },
  className,
  ...props
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkle = (): Sparkle => ({
      id: Math.random().toString(),
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: Math.random() > 0.5 ? colors.first : colors.second,
      delay: Math.random() * 2,
      scale: Math.random() * 0.7 + 0.5,
      lifespan: Math.random() * 1.5 + 1.2,
    });

    setSparkles(Array.from({ length: sparklesCount }, generateSparkle));

    const interval = setInterval(() => {
      setSparkles((current) =>
        current.map((sparkle) =>
          Math.random() > 0.6 ? generateSparkle() : sparkle,
        ),
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [sparklesCount, colors.first, colors.second]);

  return (
    <div
      className={cn("relative inline-block font-extrabold tracking-tight", className)}
      {...props}
    >
      <span className="relative z-10">{text}</span>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="pointer-events-none absolute z-20"
          style={{ left: sparkle.x, top: sparkle.y }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0, sparkle.scale, 0],
            rotate: [0, 90, 180],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.lifespan,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          <SparkleIcon color={sparkle.color} />
        </motion.span>
      ))}
    </div>
  );
}
