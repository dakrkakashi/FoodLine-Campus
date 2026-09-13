"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function AnimatedGradientText({
  children,
  className,
  speed = 4,
  style,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <div
      style={
        {
          "--bg-size": "300%",
          animationDuration: `${speed}s`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-none dark:bg-black/20",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#FF6B2C]/50 via-[#FFB347]/50 to-[#00D4AA]/50 p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
        )}
      />
      <span className="inline animate-gradient bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-[#00D4AA] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent font-semibold">
        {children}
      </span>
    </div>
  );
}
