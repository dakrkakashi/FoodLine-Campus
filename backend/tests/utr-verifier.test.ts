import { describe, it, expect } from 'vitest';
import { UtrVerifierService } from '../src/services/utr-verifier.js';

describe('UtrVerifierService — 12-Digit Bank UTR Verification & Anti-Replay', () => {
  it('should reject missing or empty UTR input', () => {
    const res = UtrVerifierService.verifyUtr('');
    expect(res.valid).toBe(false);
    expect(res.message).toMatch(/required/i);
  });

  it('should reject malformed UTRs (alphabetic, short, long)', () => {
    // Alphabetic
    expect(UtrVerifierService.verifyUtr('ABCDEFGHIJKL').valid).toBe(false);
    // 11 digits (too short)
    expect(UtrVerifierService.verifyUtr('12345678901').valid).toBe(false);
    // 13 digits (too long)
    expect(UtrVerifierService.verifyUtr('1234567890123').valid).toBe(false);
    // Special characters
    expect(UtrVerifierService.verifyUtr('1234-5678-90!@').valid).toBe(false);
  });

  it('should accept valid 12-digit numeric Indian Bank UTR references', () => {
    const validUtr = '928374' + Math.floor(100000 + Math.random() * 900000).toString();
    const res = UtrVerifierService.verifyUtr(validUtr);
    expect(res.valid).toBe(true);
    expect(res.utrNumber).toBe(validUtr);
    expect(res.requiresCounterCheck).toBe(true);
  });

  it('should prevent replay attacks by rejecting duplicate UTR submission', () => {
    const uniqueUtr = '889977' + Math.floor(100000 + Math.random() * 900000).toString();
    
    // First submission: should succeed
    const firstAttempt = UtrVerifierService.verifyUtr(uniqueUtr);
    expect(firstAttempt.valid).toBe(true);

    // Second submission with exact same UTR: MUST be rejected
    const secondAttempt = UtrVerifierService.verifyUtr(uniqueUtr);
    expect(secondAttempt.valid).toBe(false);
    expect(secondAttempt.message).toMatch(/replay detected/i);
  });

  it('should clean hyphens and whitespace before checking', () => {
    const base = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const formatted = `${base.slice(0, 4)} ${base.slice(4, 8)} ${base.slice(8, 12)}`;
    
    const res = UtrVerifierService.verifyUtr(formatted);
    expect(res.valid).toBe(true);
    expect(res.utrNumber).toBe(base);
  });
});
