"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface DiaTextRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  className?: string;
  boxColor?: string;
  duration?: number;
  delay?: number;
}

export function DiaTextReveal({
  text,
  className,
  boxColor = "#FF6B2C",
  duration = 0.5,
  delay = 0.25,
  ...props
}: DiaTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words = text.split(" ");

  return (
    <div ref={ref} className={cn("relative overflow-hidden inline-block", className)} {...props}>
      <div className="flex flex-wrap gap-x-2">
        {words.map((word, i) => (
          <span key={i} className="relative inline-block overflow-hidden pb-1">
            <motion.span
              initial={{ y: "110%", opacity: 0 }}
              animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
              transition={{
                duration,
                delay: delay + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </div>

      {/* Dynamic cinematic sweep bar */}
      <motion.div
        initial={{ left: "0%", width: "0%" }}
        animate={isInView ? { left: ["0%", "0%", "100%"], width: ["0%", "100%", "0%"] } : {}}
        transition={{
          duration: duration * 1.2,
          delay,
          ease: "easeInOut",
        }}
        style={{ backgroundColor: boxColor }}
        className="pointer-events-none absolute bottom-0 top-0 z-20 h-full rounded-sm"
      />
    </div>
  );
}
