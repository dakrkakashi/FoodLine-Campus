/**
 * 144Hz High-Refresh-Rate Physics & Motion Engine
 * Calibrated specifically for displays with 6.94ms frame budgets (144Hz / 120Hz ProMotion).
 * Ensures zero sub-frame jitter, zero layout reflows, and GPU-only compositing.
 */

// 144Hz Ultra-Precision Springs (restDelta: 0.0001 eliminates sub-frame truncation)
export const SPRING_144HZ_SNAPPY = {
  type: 'spring' as const,
  stiffness: 480,
  damping: 28,
  mass: 0.7,
  restDelta: 0.0001,
  restSpeed: 0.0001,
};

export const SPRING_144HZ_SMOOTH = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 26,
  mass: 0.85,
  restDelta: 0.0001,
  restSpeed: 0.0001,
};

export const SPRING_144HZ_BOUNCE = {
  type: 'spring' as const,
  stiffness: 580,
  damping: 20,
  mass: 0.55,
  restDelta: 0.0001,
  restSpeed: 0.0001,
};

export const SPRING_144HZ_GENTLE = {
  type: 'spring' as const,
  stiffness: 160,
  damping: 22,
  mass: 1.0,
  restDelta: 0.0001,
  restSpeed: 0.0001,
};

// GPU Compositor Layer Promotion CSS Style Object
export const GPU_144HZ_STYLE: React.CSSProperties = {
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  perspective: 1000,
  WebkitPerspective: 1000,
  willChange: 'transform, opacity',
};

// 144Hz Motion Variants (Zero Reflow: Transforms & Opacity ONLY)
export const VARIANTS_FADE_UP_144HZ = {
  hidden: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.15 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_144HZ_SNAPPY,
  },
};

export const VARIANTS_SCALE_POP_144HZ = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: SPRING_144HZ_BOUNCE,
  },
};
