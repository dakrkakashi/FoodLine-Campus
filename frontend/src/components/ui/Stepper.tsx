'use client';

import React from 'react';
import { clsx } from 'clsx';

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={clsx('flex items-center w-full', className)}>
      {steps.map((label, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        const isLast = i === steps.length - 1;

        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5 min-w-0 flex-shrink-0">
              <div
                className={clsx(
                  'w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500',
                  isCompleted && 'bg-[#00D4AA] border-[#00D4AA] text-black scale-100',
                  isActive && 'bg-[#FF6B2C] border-[#FF6B2C] text-white scale-110 shadow-lg shadow-[#FF6B2C]/40 animate-pulse',
                  !isCompleted && !isActive && 'bg-[#16161E] border-zinc-700 text-zinc-500'
                )}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={clsx(
                  'text-[10px] font-bold text-center max-w-[72px] leading-tight',
                  isActive ? 'text-[#FF6B2C]' : isCompleted ? 'text-[#00D4AA]' : 'text-zinc-500'
                )}
              >
                {label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-[2px] mx-1 mt-[-18px] rounded-full overflow-hidden bg-zinc-800">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-700',
                    isCompleted ? 'bg-[#00D4AA]' : 'bg-zinc-700'
                  )}
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
