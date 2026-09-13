"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, children, ...props }, ref) => {
  const content = children || text;

  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border border-white/10 bg-stone-900 p-2 px-6 text-center font-semibold text-white",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full bg-accent-orange transition-all duration-300 group-hover:scale-[100] group-hover:bg-accent-orange" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {content}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{content}</span>
        <ArrowRight size={16} />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
