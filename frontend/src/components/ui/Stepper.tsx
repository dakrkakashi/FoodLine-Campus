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
                  'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500',
                  isCompleted && 'bg-accent-teal border-accent-teal text-black scale-100',
                  isActive && 'bg-accent-orange border-accent-orange text-black scale-110 shadow-lg shadow-accent-orange/40 animate-pulse font-black',
                  !isCompleted && !isActive && 'bg-black/5 dark:bg-white/5 border-black/15 dark:border-white/15 text-[var(--text-muted)]'
                )}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={clsx(
                  'text-[9px] sm:text-[10px] font-extrabold text-center max-w-[64px] sm:max-w-[72px] leading-tight',
                  isActive ? 'text-accent-orange' : isCompleted ? 'text-accent-teal' : 'text-[var(--text-muted)]'
                )}
              >
                {label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-[2px] mx-1 mt-[-18px] rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-700',
                    isCompleted ? 'bg-accent-teal' : 'bg-black/5 dark:bg-white/5'
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
