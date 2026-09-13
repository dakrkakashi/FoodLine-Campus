"use client";

import React from "react";
import { Wifi, BatteryMedium, Signal } from "lucide-react";
import { cn } from "@/lib/utils";

interface AndroidProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  showStatusBar?: boolean;
  time?: string;
}

export function Android({
  children,
  className,
  width = 320,
  height = 640,
  showStatusBar = true,
  time = "12:00",
  style,
  ...props
}: AndroidProps) {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      className={cn(
        "relative mx-auto flex flex-col overflow-hidden rounded-[36px] border-[6px] border-stone-800 bg-stone-950 shadow-2xl shadow-black/80 ring-1 ring-white/10",
        className,
      )}
      {...props}
    >
      {/* Top Punch Hole Camera & Speaker */}
      <div className="absolute top-2.5 z-40 flex w-full justify-center">
        <div className="size-3.5 rounded-full bg-stone-900 ring-1 ring-stone-700/50 flex items-center justify-center">
          <div className="size-1 rounded-full bg-blue-900/60" />
        </div>
      </div>

      {/* Android Status Bar */}
      {showStatusBar && (
        <div className="relative z-30 flex h-7 w-full items-center justify-between px-5 text-[11px] font-medium text-stone-300">
          <span>{time}</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal size={12} />
            <Wifi size={12} />
            <BatteryMedium size={14} />
          </div>
        </div>
      )}

      {/* Screen Content */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden bg-(--bg-canvas) text-(--text-primary)">
        {children}
      </div>

      {/* Android Gesture Navigation Bar */}
      <div className="relative z-30 flex h-4 w-full items-center justify-center bg-transparent">
        <div className="h-1 w-24 rounded-full bg-stone-500/40" />
      </div>
    </div>
  );
}
