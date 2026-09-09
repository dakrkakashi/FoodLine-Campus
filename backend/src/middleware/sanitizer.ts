import { Request, Response, NextFunction } from 'express';

/**
 * Strips script tags, HTML event handlers, and dangerous injection characters.
 */
export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script>...</script>
    .replace(/<[^>]*>/g, '') // Strip remaining HTML tags
    .replace(/javascript\s*:/gi, '') // Strip javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Strip inline JS handlers (onload=, onerror=, etc.)
    .trim();
}

/**
 * Deep recursive sanitization of objects and arrays.
 * Protects against Prototype Pollution attacks.
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
      // Prototype pollution defense
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
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
      if (!item.id || typeof item.id !== 'string') {
        return { valid: false, error: 'Each order item must contain a valid dish ID' };
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
