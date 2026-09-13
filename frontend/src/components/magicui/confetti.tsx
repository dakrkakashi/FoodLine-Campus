"use client";

import React, { createContext, forwardRef, useCallback, useContext, useImperativeHandle, useRef } from "react";
import canvasConfetti from "canvas-confetti";
import type { CreateTypes, GlobalOptions, Options } from "canvas-confetti";
import { Button } from "@/components/ui/Button";

type ConfettiContextType = {
  fire: (options?: Options) => void;
};

const ConfettiContext = createContext<ConfettiContextType>({
  fire: () => {},
});

export interface ConfettiRef {
  fire: (options?: Options) => void;
}

interface ConfettiProps extends React.ComponentPropsWithoutRef<"canvas"> {
  options?: Options;
  globalOptions?: GlobalOptions;
  manualstart?: boolean;
  children?: React.ReactNode;
}

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>(
  ({ options, globalOptions = { resize: true, useWorker: true }, manualstart = false, children, className, ...props }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const instanceRef = useRef<CreateTypes | null>(null);

    const fire = useCallback(
      (opts: Options = {}) => {
        if (!instanceRef.current && canvasRef.current) {
          instanceRef.current = canvasConfetti.create(canvasRef.current, {
            ...globalOptions,
            resize: true,
          });
        }
        const mergedOpts: Options = {
          colors: ["#FF6B2C", "#FFB347", "#00D4AA", "#8B5CF6", "#FFFFFF"],
          ...options,
          ...opts,
        };
        instanceRef.current?.(mergedOpts);
      },
      [globalOptions, options],
    );

    useImperativeHandle(ref, () => ({ fire }), [fire]);

    React.useEffect(() => {
      if (!manualstart) {
        fire();
      }
    }, [manualstart, fire]);

    return (
      <ConfettiContext.Provider value={{ fire }}>
        <canvas
          ref={canvasRef}
          className={className || "pointer-events-none absolute inset-0 z-50 size-full"}
          {...props}
        />
        {children}
      </ConfettiContext.Provider>
    );
  },
);

Confetti.displayName = "Confetti";

interface ConfettiButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  options?: Options;
}

export const ConfettiButton = ({
  options,
  children,
  onClick,
  ...props
}: ConfettiButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    canvasConfetti({
      origin: { x, y },
      colors: ["#FF6B2C", "#FFB347", "#00D4AA", "#8B5CF6"],
      particleCount: 60,
      spread: 70,
      ...options,
    });

    onClick?.(event);
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};
