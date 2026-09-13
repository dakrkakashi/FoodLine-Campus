"use client";

import React, { ElementType } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "slideUp"
  | "scaleUp"
  | "popIn";

type ByType = "text" | "word" | "character" | "line";

interface TextAnimateProps {
  children?: string;
  text?: string;
  className?: string;
  animation?: AnimationType;
  by?: ByType;
  delay?: number;
  duration?: number;
  as?: ElementType;
  startOnView?: boolean;
  once?: boolean;
}

const animationVariants: Record<AnimationType, { container: Variants; item: Variants }> = {
  fadeIn: {
    container: {
      hidden: { opacity: 0 },
      show: (delay = 0) => ({
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: delay },
      }),
    },
    item: {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.4 } },
    },
  },
  blurIn: {
    container: {
      hidden: { opacity: 0 },
      show: (delay = 0) => ({
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: delay },
      }),
    },
    item: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.45 } },
    },
  },
  blurInUp: {
    container: {
      hidden: { opacity: 0 },
      show: (delay = 0) => ({
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: delay },
      }),
    },
    item: {
      hidden: { opacity: 0, filter: "blur(8px)", y: 16 },
      show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.45 } },
    },
  },
  slideUp: {
    container: {
      hidden: { opacity: 0 },
      show: (delay = 0) => ({
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: delay },
      }),
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    },
  },
  scaleUp: {
    container: {
      hidden: { opacity: 0 },
      show: (delay = 0) => ({
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: delay },
      }),
    },
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
    },
  },
  popIn: {
    container: {
      hidden: { opacity: 0 },
      show: (delay = 0) => ({
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: delay },
      }),
    },
    item: {
      hidden: { opacity: 0, scale: 0.5, y: -10 },
      show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      },
    },
  },
};

export function TextAnimate({
  children,
  text,
  className,
  animation = "fadeIn",
  by = "word",
  delay = 0,
  duration,
  as: Component = "p",
  startOnView = true,
  once = true,
}: TextAnimateProps) {
  const content = text || children || "";
  const selected = animationVariants[animation] || animationVariants.fadeIn;

  let segments: string[] = [];
  if (by === "character") {
    segments = Array.from(content);
  } else if (by === "word") {
    segments = content.split(" ");
  } else if (by === "line") {
    segments = content.split("\n");
  } else {
    segments = [content];
  }

  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      variants={selected.container}
      initial="hidden"
      whileInView={startOnView ? "show" : undefined}
      animate={!startOnView ? "show" : undefined}
      viewport={{ once }}
      custom={delay}
      className={cn("inline-block", className)}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={index}
          variants={selected.item}
          transition={duration ? { duration } : undefined}
          className="inline-block"
        >
          {segment}
          {by === "word" && index < segments.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </MotionComponent>
  );
}
