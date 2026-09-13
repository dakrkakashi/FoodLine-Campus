"use client";

import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

interface LineShadowTextProps extends React.HTMLAttributes<HTMLElement> {
  shadowColor?: string;
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
}

export function LineShadowText({
  children,
  shadowColor = "#FF6B2C",
  as: Component = "span",
  className,
  style,
  ...props
}: LineShadowTextProps) {
  return (
    <Component
      style={
        {
          "--shadow-color": shadowColor,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "relative inline-block font-extrabold tracking-tight transition-all",
        "[text-shadow:1px_1px_0_var(--shadow-color),2px_2px_0_var(--shadow-color),3px_3px_0_var(--shadow-color),4px_4px_0_var(--shadow-color),5px_5px_0_var(--shadow-color)]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
