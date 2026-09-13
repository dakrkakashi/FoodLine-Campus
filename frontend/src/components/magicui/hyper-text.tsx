"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: any;
  className?: string;
  animateOnHover?: boolean;
  characterSet?: string[];
}

const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

export function HyperText({
  text,
  duration = 800,
  framerProps = { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 3 } },
  className,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTERS,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const interations = useRef(0);
  const isFirstRender = useRef(true);

  const triggerAnimation = () => {
    interations.current = 0;
    setTrigger(true);
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!trigger) {
          clearInterval(interval);
          return;
        }
        if (interations.current < text.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === " "
                ? " "
                : i <= interations.current
                  ? text[i]
                  : characterSet[Math.floor(Math.random() * characterSet.length)],
            ),
          );
          interations.current += 0.5;
        } else {
          setDisplayText(text.split(""));
          setTrigger(false);
          clearInterval(interval);
        }
      },
      duration / (text.length * 2),
    );
    return () => clearInterval(interval);
  }, [text, duration, trigger, characterSet]);

  useEffect(() => {
    if (isFirstRender.current) {
      triggerAnimation();
      isFirstRender.current = false;
    }
  }, []);

  return (
    <div
      className={cn("flex scale-100 cursor-default overflow-hidden py-1", className)}
      onMouseEnter={animateOnHover ? triggerAnimation : undefined}
    >
      <AnimatePresence mode="wait">
        {displayText.map((letter, i) => (
          <motion.span
            key={i}
            className={cn("font-mono", letter === " " ? "w-2" : "")}
            {...framerProps}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
