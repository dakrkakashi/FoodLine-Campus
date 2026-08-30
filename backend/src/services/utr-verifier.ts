import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export interface UTRVerificationResult {
  valid: boolean;
  message: string;
  utrNumber?: string;
}

// In-memory replay cache to protect against duplicate UTR submission
const usedUtrStore = new Set<string>();

export class UtrVerifierService {
  /**
   * Validates Indian Bank UPI 12-digit UTR Reference Number
   * Pattern: Exactly 12 numeric digits
   */
  public static verifyUtr(utrInput: string, orderToken?: string): UTRVerificationResult {
    if (!utrInput) {
      return { valid: false, message: 'UTR Reference number is required' };
    }

    const cleanedUtr = utrInput.trim().replace(/[\s-]/g, '');

    // Validate 12 numeric digits
    if (!/^\d{12}$/.test(cleanedUtr)) {
      return {
        valid: false,
        message: 'Invalid UTR format. Bank UTR must be exactly 12 numeric digits (e.g. 928374615243).',
      };
    }

    // Check for replay attacks / duplicate usage
    if (usedUtrStore.has(cleanedUtr)) {
      return {
        valid: false,
        message: 'This UTR has already been submitted for another order. Replay detected.',
      };
    }

    // Mark as verified in memory
    usedUtrStore.add(cleanedUtr);

    return {
      valid: true,
      utrNumber: cleanedUtr,
      message: 'UTR payment reference verified successfully.',
    };
  }

  public static isUtrUsed(utr: string): boolean {
    const cleaned = utr.trim().replace(/[\s-]/g, '');
    return usedUtrStore.has(cleaned);
  }

  /**
   * Database-backed UTR submission and payment record creation
   */
  public static async recordPayment(
    orderId: string,
    utrNumber: string,
    amount: number,
    method: 'UTR_MANUAL' | 'SOUNDBOX_WEBHOOK' | 'CASHIER_SCAN' = 'UTR_MANUAL'
  ): Promise<UTRVerificationResult> {
    const verification = UtrVerifierService.verifyUtr(utrNumber);
    if (!verification.valid) {
      return verification;
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('payments').insert({
          order_id: orderId,
          utr_number: verification.utrNumber,
          amount,
          status: 'VERIFIED',
          verification_method: method,
          verified_at: new Date().toISOString(),
        });

        if (error) {
          if (error.code === '23505') {
            return {
              valid: false,
              message: 'This UTR has already been submitted for another order today. Duplicate rejected.',
            };
          }
          console.warn('Supabase payment insert warning:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase payment exception:', err);
      }
    }

    return verification;
  }
}

