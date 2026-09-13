"use client";

import React, { useEffect, useRef } from "react";

export interface CoolModeProps {
  children: React.ReactElement<any>;
  options?: {
    particle?: string;
    particleCount?: number;
    speedHorz?: number;
    speedUp?: number;
  };
}

const DEFAULT_EMOJIS = ["🍕", "☕", "🍔", "🥪", "🥟", "🥤", "🌮", "🥗"];

export function CoolMode({ children, options }: CoolModeProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      const count = options?.particleCount || 18;

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("span");
        particle.innerText =
          options?.particle ||
          DEFAULT_EMOJIS[Math.floor(Math.random() * DEFAULT_EMOJIS.length)];
        particle.style.position = "fixed";
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "99999";
        particle.style.fontSize = `${Math.random() * 14 + 16}px`;
        particle.style.userSelect = "none";
        particle.style.transform = `translate(-50%, -50%)`;
        particle.style.transition = `transform 0.85s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.85s ease-out`;

        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 120 + 40;
        const targetX = Math.cos(angle) * dist;
        const targetY = Math.sin(angle) * dist - 40; // upward bias

        requestAnimationFrame(() => {
          particle.style.transform = `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(${Math.random() * 0.5 + 0.8}) rotate(${Math.random() * 360}deg)`;
          particle.style.opacity = "0";
        });

        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 900);
      }
    };

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [options]);

  return React.cloneElement(children, {
    ref,
  });
}
