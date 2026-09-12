import { Request, Response, NextFunction } from 'express';

/**
 * Strips script tags, HTML event handlers, dangerous injection characters,
 * null bytes, and malicious URI schemes.
 */
export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return val;
  return val
    .replace(/\0/g, '') // Null byte injection defense
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script>...</script>
    .replace(/<[^>]*>/g, '') // Strip remaining HTML tags
    .replace(/javascript\s*:/gi, '') // Strip javascript: protocol
    .replace(/vbscript\s*:/gi, '') // Strip vbscript: protocol
    .replace(/data\s*:\s*text\/html/gi, '') // Strip data: HTML URIs
    .replace(/on\w+\s*=/gi, '') // Strip inline JS handlers (onload=, onerror=, etc.)
    .trim();
}

/**
 * Deep recursive sanitization of objects and arrays.
 * Protects against Prototype Pollution and NoSQL injection operator keys ($where, $gt, etc.).
 */
export function sanitizeDeep(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeDeep(item));
  }

  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Prototype pollution & NoSQL injection operator defense
      if (
        key === '__proto__' ||
        key === 'constructor' ||
        key === 'prototype' ||
        key.startsWith('$')
      ) {
        continue;
      }
      cleaned[sanitizeString(key)] = sanitizeDeep(value);
    }
    return cleaned;
  }

  return obj;
}

/**
 * Global input sanitization middleware.
 */
export function sanitizeInputsMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeDeep(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeDeep(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeDeep(req.params);
    }
    next();
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: 'Malformed Input',
      message: 'Failed to sanitize request inputs: ' + (err.message || 'Unknown error'),
    });
  }
}

/**
 * Middleware: Reject oversized request payloads.
 * Default max 64KB per request.
 */
export function payloadSizeGuard(maxBytes: number = 64 * 1024) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      res.status(413).json({
        success: false,
        error: 'Payload Too Large',
        message: `Request payload exceeds maximum allowed size of ${Math.round(maxBytes / 1024)}KB.`,
      });
      return;
    }
    next();
  };
}

/**
 * CSRF / Origin Validation Guard for mutating HTTP methods (POST, PUT, PATCH, DELETE).
 * Protects against cross-site request forgery and unauthorized browser-based state mutations.
 */
export function csrfOriginGuard(allowedOrigins: (string | RegExp)[] = []) {
  const defaultAllowed: (string | RegExp)[] = [
    /^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/,
    /^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/,
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.BACKEND_URL || 'http://localhost:4000',
    ...allowedOrigins,
  ];

  return (req: Request, res: Response, next: NextFunction): void => {
    // Only inspect mutating state methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    const origin = req.headers.origin;
    if (!origin) {
      // Direct CLI, server-to-server, or native client requests without Origin header
      return next();
    }

    const isAllowed = defaultAllowed.some((allowed) => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });

    if (!isAllowed) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: Cross-Origin Request Blocked',
        message: 'Origin is not authorized to perform state-changing operations.',
      });
      return;
    }

    next();
  };
}

/**
 * Path Traversal Guard: Blocks directory traversal attempts in path and URL.
 */
export function pathTraversalGuard(req: Request, res: Response, next: NextFunction): void {
  const rawUrl = req.url || '';
  let decodedUrl = '';
  try {
    decodedUrl = decodeURIComponent(rawUrl);
  } catch {
    res.status(400).json({
      success: false,
      error: 'Malformed URL',
      message: 'URL decoding failed.',
    });
    return;
  }

  // Check for directory traversal sequences
  if (
    rawUrl.includes('..') ||
    decodedUrl.includes('..') ||
    rawUrl.includes('\\') ||
    decodedUrl.includes('\\')
  ) {
    res.status(400).json({
      success: false,
      error: 'Path Traversal Detected',
      message: 'Invalid request path: Directory traversal sequences are strictly forbidden.',
    });
    return;
  }

  next();
}

/**
 * Specialized domain sanitizers & validators
 */
export const SecurityValidators = {
  // PRN must be alphanumeric, 5-25 chars
  isValidPrn: (prn: string): boolean => {
    if (!prn || typeof prn !== 'string') return false;
    return /^[A-Za-z0-9\-_]{5,25}$/.test(prn.trim());
  },

  // 12-digit UTR must be exactly 12 numeric digits
  isValidUtr: (utr: string): boolean => {
    if (!utr || typeof utr !== 'string') return false;
    return /^\d{12}$/.test(utr.trim());
  },

  // Pickup OTP must be exactly 4 digits
  isValidOtp: (otp: string): boolean => {
    if (!otp || typeof otp !== 'string') return false;
    return /^\d{4}$/.test(otp.trim());
  },

  // Order token format (e.g. FL-1234 or FL-12345)
  isValidOrderToken: (token: string): boolean => {
    if (!token || typeof token !== 'string') return false;
    return /^FL-\d{4,6}$/.test(token.trim());
  },

  // Indian mobile number validation (10 digits starting with 6-9)
  isValidIndianPhone: (phone: string): boolean => {
    if (!phone || typeof phone !== 'string') return false;
    const cleanPhone = phone.replace(/[\s+-]/g, '').slice(-10);
    return /^[6-9]\d{9}$/.test(cleanPhone);
  },

  // Standard email validation
  isValidEmail: (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  },

  // Order items validation
  validateOrderItems: (items: any[]): { valid: boolean; error?: string } => {
    if (!Array.isArray(items) || items.length === 0) {
      return { valid: false, error: 'Order must contain at least 1 item' };
    }
    if (items.length > 50) {
      return { valid: false, error: 'Maximum 50 items allowed per order' };
    }
    for (const item of items) {
      if (!item || typeof item !== 'object') {
        return { valid: false, error: 'Invalid order item structure' };
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0 || item.quantity > 50 || !Number.isInteger(item.quantity)) {
        return { valid: false, error: 'Item quantity must be an integer between 1 and 50' };
      }
      if (typeof item.price !== 'number' || item.price < 0 || item.price > 10000) {
        return { valid: false, error: 'Item price must be a valid non-negative number' };
      }
    }
    return { valid: true };
  },
};
