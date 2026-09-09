import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window store for Next.js App Router routes
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 2 minutes
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 15 * 60 * 1000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 2 * 60 * 1000);
  if (timer.unref) timer.unref();
}

/**
 * Enforces rate limiting on Next.js App Router API handlers.
 * @param request NextRequest
 * @param options { maxRequests: number, windowMs: number, routeName: string }
 * @returns NextResponse with 429 if limit exceeded, or null if allowed.
 */
export function checkRateLimit(
  request: NextRequest,
  options: {
    maxRequests?: number;
    windowMs?: number;
    routeName?: string;
  } = {}
): NextResponse | null {
  const {
    maxRequests = 5, // Default 5 attempts for login routes
    windowMs = 15 * 60 * 1000, // Default 15 minutes window
    routeName = 'auth',
  } = options;

  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  const key = `${routeName}:${ip}`;

  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter timestamps within sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: 'Too Many Requests',
        message: `Too many attempts. Rate limit exceeded (max ${maxRequests} attempts per ${Math.round(
          windowMs / 60000
        )} mins). Please retry in ${retryAfterSeconds}s.`,
        meta: {
          retryAfterSeconds,
          limit: maxRequests,
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfterSeconds.toString(),
          'RateLimit-Limit': maxRequests.toString(),
          'RateLimit-Remaining': '0',
          'RateLimit-Reset': retryAfterSeconds.toString(),
        },
      }
    );
  }

  // Record timestamp
  record.timestamps.push(now);
  return null;
}
