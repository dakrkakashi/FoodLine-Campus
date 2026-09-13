"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface MeteorsProps {
  number?: number;
  className?: string;
  color?: string;
}

export const Meteors = ({ number = 20, className, color }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: -5,
      left: Math.floor(Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200)) + "px",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style}
          className={cn(
            "pointer-events-none absolute size-0.5 rotate-[215deg] animate-meteor rounded-full bg-accent-orange/80 shadow-[0_0_0_1px_#FF6B2C40]",
            className,
          )}
        >
          {/* Meteor Tail */}
          <div
            style={color ? { background: `linear-gradient(to right, ${color}, transparent)` } : undefined}
            className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-accent-orange/60 via-accent-amber/40 to-transparent"
          />
        </span>
      ))}
    </>
  );
};
