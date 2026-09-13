"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface KineticTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
  className?: string;
}

function KineticLetter({ letter }: { letter: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 400, damping: 25 });
  const springY = useSpring(y, { stiffness: 400, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    if (dist < 80) {
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const force = (80 - dist) * 0.4;
      x.set(-Math.cos(angle) * force);
      y.set(-Math.sin(angle) * force);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block cursor-default select-none font-bold"
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}

export function KineticText({ children, className, ...props }: KineticTextProps) {
  const letters = Array.from(children);

  return (
    <div className={cn("inline-flex flex-wrap items-center", className)} {...props}>
      {letters.map((char, index) => (
        <KineticLetter key={index} letter={char} />
      ))}
    </div>
  );
}
