"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtrVerifierService = void 0;
// In-memory replay cache to protect against duplicate UTR submission
const usedUtrStore = new Set();
class UtrVerifierService {
    /**
     * Validates Indian Bank UPI 12-digit UTR Reference Number
     * Pattern: Exactly 12 numeric digits
     */
    static verifyUtr(utrInput, orderToken) {
        if (!utrInput) {
            return { valid: false, message: 'UTR Reference number is required' };
        }
        const cleanedUtr = utrInput.trim().replace(/[\s-]/g, '');
        // Validate 12 numeric digits
        if (!/^\d{12}$/.test(cleanedUtr)) {
            return {
                valid: false,
                message: 'Invalid UTR format. Bank UTR must be exactly 12 numeric digits (e.g. 928374615243).'
            };
        }
        // Check for replay attacks / duplicate usage
        if (usedUtrStore.has(cleanedUtr)) {
            return {
                valid: false,
                message: 'This UTR has already been submitted for another order. Replay detected.'
            };
        }
        // Mark as verified & stored
        usedUtrStore.add(cleanedUtr);
        return {
            valid: true,
            utrNumber: cleanedUtr,
            message: 'UTR payment reference verified successfully.'
        };
    }
    static isUtrUsed(utr) {
        const cleaned = utr.trim().replace(/[\s-]/g, '');
        return usedUtrStore.has(cleaned);
    }
}
exports.UtrVerifierService = UtrVerifierService;
