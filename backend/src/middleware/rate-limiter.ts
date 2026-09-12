import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  statusCode?: number;
  keyGenerator?: (req: Request) => string;
}

const MAX_STORE_CAPACITY = 5000;

/**
 * In-memory sliding window rate limiter.
 * Zero external dependencies (Reuse Ladder: stdlib + native platform).
 * Hardened with bounded memory store to prevent heap exhaustion attacks.
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests. Please try again later.',
    statusCode = 429,
    keyGenerator = (req: Request) => {
      // Extract client IP, prioritizing x-forwarded-for if behind reverse proxy
      const forwarded = req.headers['x-forwarded-for'];
      if (typeof forwarded === 'string') {
        const firstIp = forwarded.split(',')[0].trim().replace(/[^a-zA-Z0-9.:_-]/g, '').slice(0, 45);
        if (firstIp) return firstIp;
      }
      const rawIp = req.ip || req.socket.remoteAddress || 'unknown';
      return rawIp.replace(/[^a-zA-Z0-9.:_-]/g, '').slice(0, 45);
    },
  } = options;

  const store = new Map<string, RateLimitRecord>();

  // Cleanup expired entries every 2 minutes to prevent unbounded memory growth
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, Math.min(windowMs, 2 * 60 * 1000));

  // Allow Node to exit cleanly without unref hang
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = keyGenerator(req);
    let record = store.get(key);

    if (!record) {
      // Memory exhaustion defense: Evict oldest entry if max capacity reached
      if (store.size >= MAX_STORE_CAPACITY) {
        const oldestKey = store.keys().next().value;
        if (oldestKey) {
          store.delete(oldestKey);
        }
      }

      record = { timestamps: [] };
      store.set(key, record);
    }

    // Filter out timestamps outside the sliding window
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    const currentRequests = record.timestamps.length;
    const remaining = Math.max(0, maxRequests - currentRequests);
    const resetTimeSeconds = record.timestamps.length > 0
      ? Math.ceil((record.timestamps[0] + windowMs - now) / 1000)
      : Math.ceil(windowMs / 1000);

    // Standard HTTP RateLimit headers (RFC 6585 & IETF draft)
    res.setHeader('RateLimit-Limit', maxRequests.toString());
    res.setHeader('RateLimit-Remaining', Math.max(0, remaining - 1).toString());
    res.setHeader('RateLimit-Reset', resetTimeSeconds.toString());

    if (currentRequests >= maxRequests) {
      res.setHeader('Retry-After', resetTimeSeconds.toString());
      res.status(statusCode).json({
        success: false,
        error: 'Too Many Requests',
        message: `${message} Retry in ${resetTimeSeconds}s.`,
        meta: {
          limit: maxRequests,
          windowSeconds: Math.round(windowMs / 1000),
          retryAfterSeconds: resetTimeSeconds,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    // Record this valid request
    record.timestamps.push(now);
    next();
  };
}

/**
 * Preconfigured specialized rate limiters
 */

// 1. General API Rate Limiter: 120 requests per minute per IP
export const generalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 120,
  message: 'API rate limit exceeded. Please slow down your requests.',
});

// 2. Login & Auth Rate Limiter: Max 5 attempts per 15 minutes
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Exactly 5 attempts
  message: 'Too many authentication attempts. Account access temporarily locked for 15 minutes to prevent brute-force attacks.',
});

// 3. OTP Verification Rate Limiter: Max 5 attempts per 15 minutes
export const otpRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many OTP verification attempts. Please wait 15 minutes before retrying.',
});

// 4. Order Placement Rate Limiter: Max 20 orders per 5 minutes per IP
export const orderPlacementLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20,
  message: 'Order submission rate limit exceeded. Please wait a few moments before placing another order.',
});

// 5. Password Reset Rate Limiter: Max 3 attempts per 15 minutes per IP
export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3,
  message: 'Too many password reset requests. For security reasons, please wait 15 minutes before requesting again.',
});

// 6. UTR Payment Verification Limiter: Max 10 attempts per 5 minutes per IP
export const utrRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 10,
  message: 'Too many payment reference submissions. Please wait 5 minutes before retrying.',
});

// 7. Student PRN Resolution Limiter: Max 30 requests per minute per IP
export const studentResolveLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  message: 'Too many student lookup attempts. Rate limit exceeded.',
});

// 8. Order Token Lookup Limiter: Max 60 lookups per minute per IP
export const orderLookupLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
  message: 'Order status check frequency limit reached. Please slow down.',
});

// 9. Notification Preview Limiter: Max 15 requests per minute per IP
export const notificationPreviewLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 15,
  message: 'Notification preview rate limit exceeded.',
});
