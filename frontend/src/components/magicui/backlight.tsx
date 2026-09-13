"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BacklightProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  secondaryColor?: string;
  blur?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function Backlight({
  color = "#FF6B2C",
  secondaryColor = "#FFB347",
  blur = 72,
  opacity = 0.35,
  className,
  children,
  ...props
}: BacklightProps) {
  return (
    <div className={cn("relative isolate", className)} {...props}>
      <div
        aria-hidden="true"
        style={{
          filter: `blur(${blur}px)`,
          opacity,
          background: `radial-gradient(ellipse at center, ${color} 0%, ${secondaryColor} 45%, transparent 70%)`,
        }}
        className="pointer-events-none absolute -inset-6 -z-10 rounded-full transition-all duration-700 ease-out"
      />
      {children}
    </div>
  );
}
