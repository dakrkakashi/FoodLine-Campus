'use client';

import confetti from 'canvas-confetti';

export function fireConfettiSuccess() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-blast cannon
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#FF6B2C', '#FFB347', '#00D4AA'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#8B5CF6', '#3B82F6', '#FF6B2C'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#00D4AA', '#FFB347', '#FFFFFF'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#FF6B2C', '#00D4AA', '#8B5CF6'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#FFB347', '#00D4AA', '#FF6B2C'],
  });
}

export function fireFireworks() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FF6B2C', '#00D4AA', '#FFB347'] });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#8B5CF6', '#00D4AA', '#FF6B2C'] });
  }, 250);
}
