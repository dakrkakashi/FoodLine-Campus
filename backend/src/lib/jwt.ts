import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: JWT_SECRET environment variable is missing in production!');
      process.exit(1);
    }
    return 'foodline-campus-dev-ephemeral-secret-key-2026';
  }
  return secret;
}

const JWT_SECRET = getJwtSecret();

/**
 * In-memory token revocation blacklist (JTI or full token string).
 * Self-cleaning via TTL check to prevent memory leaks.
 */
const revokedTokens = new Map<string, number>();

// Periodic eviction of expired revoked tokens every 5 minutes
const revocationCleanup = setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  for (const [id, exp] of revokedTokens.entries()) {
    if (exp <= now) {
      revokedTokens.delete(id);
    }
  }
}, 5 * 60 * 1000);

if (revocationCleanup.unref) {
  revocationCleanup.unref();
}

/**
 * Revokes a JWT or JTI.
 */
export function revokeJwt(tokenOrJti: string, expiresInSeconds = 86400): void {
  const expiry = Math.floor(Date.now() / 1000) + expiresInSeconds;
  revokedTokens.set(tokenOrJti, expiry);
}

/**
 * Checks if a JWT or JTI is revoked.
 */
export function isJwtRevoked(tokenOrJti: string): boolean {
  const exp = revokedTokens.get(tokenOrJti);
  if (!exp) return false;
  if (exp <= Math.floor(Date.now() / 1000)) {
    revokedTokens.delete(tokenOrJti);
    return false;
  }
  return true;
}

export function signJwt(payload: Record<string, any>): string {
  const now = Math.floor(Date.now() / 1000);
  const securePayload = {
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + 24 * 60 * 60, // Default 24h validity if not overridden
    ...payload,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(securePayload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt<T = any>(token: string): { valid: boolean; payload?: T; error?: string } {
  try {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Token missing or invalid type' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    const [header, body, signature] = parts;

    // 1. Strict Algorithm & Header Verification
    let parsedHeader: any;
    try {
      parsedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
    } catch {
      return { valid: false, error: 'Malformed token header' };
    }

    if (!parsedHeader || parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') {
      return { valid: false, error: 'Invalid algorithm or token type. Only HS256 JWTs are permitted.' };
    }

    // 2. Cryptographic Signature Verification (Timing-Safe)
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    const sigBuf = Buffer.from(signature, 'utf8');
    const expectedBuf = Buffer.from(expectedSignature, 'utf8');

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return { valid: false, error: 'Signature mismatch' };
    }

    // 3. Payload Parsing & Claim Verification
    const payload: any = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));

    // Expiration Check
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' };
    }

    // Not Before Check (if present)
    if (payload.nbf && payload.nbf > Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token not yet valid' };
    }

    // Revocation / Blacklist Check
    if (isJwtRevoked(token) || (payload.jti && isJwtRevoked(payload.jti))) {
      return { valid: false, error: 'Token has been revoked' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Token verification failed' };
  }
}
