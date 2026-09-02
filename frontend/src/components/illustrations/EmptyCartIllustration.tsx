'use client';

import React from 'react';

interface EmptyCartIllustrationProps {
  className?: string;
  size?: number;
}

export function EmptyCartIllustration({ className = '', size = 200 }: EmptyCartIllustrationProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dynamic Ambient Underglow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[var(--accent-orange,#FF6B2C)]/25 via-[var(--accent-amber,#FFB347)]/15 to-transparent blur-2xl animate-pulse" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <linearGradient id="bentoGradient" x1="20" y1="60" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A2A38" />
            <stop offset="100%" stopColor="#15151F" />
          </linearGradient>

          <linearGradient id="lidGradient" x1="30" y1="40" x2="170" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B2C" />
            <stop offset="100%" stopColor="#FFB347" />
          </linearGradient>

          <linearGradient id="accentGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#00E5BC" />
          </linearGradient>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow Oval Base */}
        <ellipse cx="100" cy="172" rx="65" ry="10" fill="black" opacity="0.4" />

        {/* Floating Bento Box Body */}
        <g className="animate-[float_4s_ease-in-out_infinite]">
          {/* Main Box Outer Rim */}
          <rect
            x="36"
            y="80"
            width="128"
            height="82"
            rx="18"
            fill="url(#bentoGradient)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2.5"
          />

          {/* Inner Compartment Divider Line */}
          <line
            x1="100"
            y1="82"
            x2="100"
            y2="160"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Left Compartment: Empty Bento Plate with Sparkle */}
          <rect x="44" y="88" width="50" height="66" rx="12" fill="#12121A" />
          <circle cx="69" cy="121" r="16" fill="rgba(255, 107, 44, 0.08)" stroke="rgba(255, 107, 44, 0.25)" strokeWidth="1.5" />
          {/* Sleepy Cute Bento Face */}
          <circle cx="63" cy="118" r="2" fill="#FFB347" />
          <circle cx="75" cy="118" r="2" fill="#FFB347" />
          <path d="M66 125 Q69 128 72 125" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Right Compartment: Golden Empty Rice Bowl Silhouette */}
          <rect x="106" y="88" width="50" height="66" rx="12" fill="#12121A" />
          <circle cx="131" cy="121" r="16" fill="rgba(0, 212, 170, 0.08)" stroke="rgba(0, 212, 170, 0.25)" strokeWidth="1.5" />
          {/* Little Star Sparkle in right compartment */}
          <path
            d="M131 113 L133 119 L139 121 L133 123 L131 129 L129 123 L123 121 L129 119 Z"
            fill="url(#accentGlow)"
            filter="url(#glowFilter)"
            className="animate-pulse"
          />

          {/* Open Bento Lid tilted playfully */}
          <g transform="rotate(-14 100 65)">
            <rect
              x="38"
              y="48"
              width="124"
              height="26"
              rx="10"
              fill="url(#lidGradient)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
              filter="url(#glowFilter)"
            />
            <rect x="52" y="55" width="30" height="4" rx="2" fill="white" opacity="0.4" />
            <circle cx="146" cy="61" r="4" fill="white" opacity="0.8" />
          </g>

          {/* Steaming Floating Vapor Wisps */}
          <path
            d="M80 62 Q75 50 82 40 Q88 30 84 20"
            stroke="url(#lidGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
            className="animate-pulse"
          />
          <path
            d="M102 58 Q96 46 103 36 Q110 26 105 16"
            stroke="url(#accentGlow)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
            className="animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
          <path
            d="M124 64 Q120 54 126 44 Q132 34 128 24"
            stroke="url(#lidGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
            className="animate-pulse"
            style={{ animationDelay: '0.8s' }}
          />

          {/* Chopsticks resting on top */}
          <line
            x1="28"
            y1="72"
            x2="168"
            y2="54"
            stroke="#E2E8F0"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="78"
            x2="172"
            y2="60"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
