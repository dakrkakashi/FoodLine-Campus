"use client";

import React from "react";
import { cn } from "@/lib/utils";

type TColorProp = string | string[];

interface ShineBorderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

/**
 * @name ShineBorder
 * @description An animated background border effect with continuous shining gradient.
 */
export function ShineBorder({
  borderRadius = 16,
  borderWidth = 1.5,
  duration = 8,
  color = ["#FF6B2C", "#FFB347", "#00D4AA"],
  className,
  children,
  style,
  ...props
}: ShineBorderProps) {
  const colorList = Array.isArray(color) ? color.join(",") : `${color},transparent,${color}`;

  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "relative isolate min-h-[60px] w-full rounded-[var(--border-radius)] bg-stone-900/50 p-3 text-stone-100 dark:bg-stone-950/60",
        className,
      )}
      {...props}
    >
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": `${borderRadius}px`,
            "--duration": `${duration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-radial-gradient": `radial-gradient(transparent,transparent, ${colorList},transparent,transparent)`,
          } as React.CSSProperties
        }
        className={cn(
          "pointer-events-none before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[var(--border-radius)] before:p-[var(--border-width)] before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-gradient-flow",
        )}
      />
      {children}
    </div>
  );
}
