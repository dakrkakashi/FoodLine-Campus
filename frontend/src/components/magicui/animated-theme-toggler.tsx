"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export interface AnimatedThemeTogglerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedThemeToggler({
  className,
  size = "md",
  onClick,
  ...props
}: AnimatedThemeTogglerProps) {
  const [mounted, setMounted] = useState(false);
  const themeContext = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && themeContext?.mode ? themeContext.mode === "dark" : true;

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (themeContext?.toggleMode) {
      themeContext.toggleMode();
    }
    onClick?.(e);
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  }[size];

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 22,
  }[size];

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={handleToggle}
      aria-label="Toggle dark/light theme"
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/5 p-2 text-stone-300 transition-colors hover:border-accent-orange/40 hover:bg-black/10 hover:text-white dark:bg-white/5 dark:text-stone-200",
        sizeClasses,
        className,
      )}
      {...props}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : 90,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute flex items-center justify-center text-amber-400"
      >
        <Moon size={iconSizes} />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          scale: !isDark ? 1 : 0,
          rotate: !isDark ? 0 : -90,
          opacity: !isDark ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute flex items-center justify-center text-accent-orange"
      >
        <Sun size={iconSizes} />
      </motion.div>
    </button>
  );
}
