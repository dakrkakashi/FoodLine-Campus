import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { verifyJwt } from '../lib/jwt.js';

export interface AuthenticatedUser {
  id?: string;
  role: 'student' | 'kitchen' | 'canteen_manager' | 'admin';
  email?: string;
  prn?: string;
  isStaffPasskey?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Constant-time string comparison to prevent timing side-channel attacks.
 */
function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');

  if (bufA.length !== bufB.length) {
    // Perform dummy timing-safe comparison with bufA to equalize execution timing
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Middleware to require authentication and optional role authorization.
 * Accepts either:
 *  1. Bearer JWT via Authorization header ('Authorization: Bearer <token>')
 *  2. Direct staff/kds passkey via 'x-staff-passkey' or 'x-admin-passkey' header
 */
export function requireAuth(allowedRoles?: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const rawStaffPasskey = (req.headers['x-staff-passkey'] || req.headers['x-admin-passkey']) as string | undefined;
    const targetPasskey = process.env.STAFF_AUTH_PASSKEY || 'FoodLineCafe@7';

    // 1. Staff Passkey authentication for physical KDS hardware tablets / onsite staff
    if (rawStaffPasskey) {
      const isMatch = timingSafeCompare(rawStaffPasskey.trim(), targetPasskey);
      if (isMatch) {
        req.user = {
          role: 'kitchen',
          isStaffPasskey: true,
        };

        // Check if role is allowed (if role restrictions are passed)
        if (allowedRoles && allowedRoles.length > 0) {
          const hasRole = allowedRoles.includes('kitchen') || allowedRoles.includes('canteen_manager') || allowedRoles.includes('admin');
          if (!hasRole) {
            res.status(403).json({
              success: false,
              error: 'Forbidden: Staff passkey is not authorized for this operation',
            });
            return;
          }
        }

        return next();
      } else {
        res.status(401).json({
          success: false,
          error: 'Unauthorized: Invalid staff passkey',
        });
        return;
      }
    }

    // 2. Bearer JWT token verification
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication token or staff passkey required',
      });
      return;
    }

    const token = authHeader.substring(7).trim();
    const verification = verifyJwt<AuthenticatedUser>(token);

    if (!verification.valid || !verification.payload) {
      res.status(401).json({
        success: false,
        error: `Unauthorized: ${verification.error || 'Invalid session token'}`,
      });
      return;
    }

    const user = verification.payload;

    // 3. Role-based access control check
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAllowedRole = allowedRoles.includes(user.role);
      if (!hasAllowedRole) {
        res.status(403).json({
          success: false,
          error: `Forbidden: User role '${user.role}' is not authorized to access this resource`,
        });
        return;
      }
    }

    req.user = user;
    next();
  };
}
