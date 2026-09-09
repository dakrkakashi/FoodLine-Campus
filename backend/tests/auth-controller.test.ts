import { describe, it, expect } from 'vitest';
import { signJwt, verifyJwt } from '../src/lib/jwt.js';
import { SecurityValidators, sanitizeString, sanitizeDeep } from '../src/middleware/sanitizer.js';

describe('Auth & Security Infrastructure — JWT, Sanitization & PRN Validation', () => {
  describe('JWT Token Issuance & Verification', () => {
    it('should sign and verify valid JWT tokens', () => {
      const payload = {
        userId: 'user-777',
        role: 'student',
        prn: '2023SUCS0142',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      };

      const token = signJwt(payload);
      expect(token).toBeDefined();
      expect(token.split('.')).toHaveLength(3);

      const verification = verifyJwt(token);
      expect(verification.valid).toBe(true);
      expect(verification.payload?.userId).toBe('user-777');
      expect(verification.payload?.role).toBe('student');
    });

    it('should reject tampered or modified tokens', () => {
      const token = signJwt({ prn: '2023SUCS0142' });
      const tampered = token.slice(0, -4) + 'abcd';

      const verification = verifyJwt(tampered);
      expect(verification.valid).toBe(false);
      expect(verification.error).toMatch(/signature/i);
    });

    it('should reject expired tokens', () => {
      const expiredPayload = {
        userId: 'user-expired',
        exp: Math.floor(Date.now() / 1000) - 60, // expired 1 min ago
      };

      const token = signJwt(expiredPayload);
      const verification = verifyJwt(token);
      expect(verification.valid).toBe(false);
      expect(verification.error).toMatch(/expired/i);
    });
  });

  describe('SecurityValidators & Domain Input Guards', () => {
    it('should validate student PRN formatting (5-25 alphanumeric)', () => {
      expect(SecurityValidators.isValidPrn('2023SUCS0142')).toBe(true);
      expect(SecurityValidators.isValidPrn('PRN-9988')).toBe(true);
      expect(SecurityValidators.isValidPrn('123')).toBe(false); // too short
      expect(SecurityValidators.isValidPrn('A'.repeat(30))).toBe(false); // too long
      expect(SecurityValidators.isValidPrn('PRN<script>')).toBe(false); // illegal chars
    });

    it('should validate 4-digit pickup OTP', () => {
      expect(SecurityValidators.isValidOtp('6065')).toBe(true);
      expect(SecurityValidators.isValidOtp('1000')).toBe(true);
      expect(SecurityValidators.isValidOtp('999')).toBe(false);
      expect(SecurityValidators.isValidOtp('12345')).toBe(false);
      expect(SecurityValidators.isValidOtp('abcd')).toBe(false);
    });

    it('should sanitize dangerous XSS injections and event handlers', () => {
      const dirty = '<script>alert("hack")</script>Extra spicy please<img src=x onerror=alert(1)>';
      const clean = sanitizeString(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('onerror=');
      expect(clean).toContain('Extra spicy please');
    });

    it('should protect against prototype pollution keys', () => {
      const payload = {
        studentName: 'Aarav Sharma',
        __proto__: { isAdmin: true },
        nested: {
          note: 'No onions',
          constructor: { prototype: { hacked: true } },
        },
      };

      const cleaned = sanitizeDeep(payload);
      expect(cleaned.studentName).toBe('Aarav Sharma');
      expect(Object.prototype.hasOwnProperty.call(cleaned, '__proto__')).toBe(false);
      expect((cleaned as any).isAdmin).toBeUndefined();
    });
  });
});
