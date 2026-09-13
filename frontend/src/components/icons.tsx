import React from 'react';

export function SparklesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

export function ClockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function QrCodeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function ShoppingBagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

/**
 * FSSAI Indian Standard Pure Vegetarian Indicator
 * Green square with centered solid green circle
 */
export function VegIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div
      title="Pure Vegetarian (FSSAI Certified)"
      aria-label="Pure Vegetarian"
      className={`inline-flex items-center justify-center border-[1.5px] border-[#00C261] rounded-xs bg-[#00C261]/10 p-[2px] shrink-0 ${className}`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#00C261]" />
    </div>
  );
}

/**
 * FSSAI Indian Standard Non-Vegetarian Indicator
 * Crimson square with centered solid crimson triangle
 */
export function NonVegIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div
      title="Non-Vegetarian"
      aria-label="Non-Vegetarian"
      className={`inline-flex items-center justify-center border-[1.5px] border-[#E11D48] rounded-xs bg-[#E11D48]/10 p-[2px] shrink-0 ${className}`}
    >
      <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-[#E11D48]" />
    </div>
  );
}

/**
 * Indian Standard Contains Egg Indicator
 * Amber square with centered solid amber oval
 */
export function EggIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div
      title="Contains Egg"
      aria-label="Contains Egg"
      className={`inline-flex items-center justify-center border-[1.5px] border-[#F59E0B] rounded-xs bg-[#F59E0B]/10 p-[2px] shrink-0 ${className}`}
    >
      <div className="w-1.5 h-2 rounded-full bg-[#F59E0B]" />
    </div>
  );
}
