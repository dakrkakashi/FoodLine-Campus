/**
 * 🔒 FoodLine Campus — DPDP Compliance & Privacy Masking Utilities
 *
 * Enforces DPDP Act 2023 data minimization standards on client-facing UI,
 * physical receipts, and browser telemetry logs.
 */

/**
 * Masks a 10-digit phone number, displaying only the last 4 digits.
 * E.g. "9960091371" -> "+91 ******1371"
 */
export function maskPhoneNumber(phone: unknown): string {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');

  if (digits.length < 4) return '******';

  const last4 = digits.slice(-4);
  return `+91 ******${last4}`;
}

/**
 * Masks a Student PRN for display in public kiosks or shared screens.
 * E.g. "2023SUCS0777" -> "2023****0777" or "0110" -> "0***"
 */
export function maskPRN(prn: unknown): string {
  if (!prn || typeof prn !== 'string') return '';
  const trimmed = prn.trim();

  if (trimmed.length <= 4) {
    return `${trimmed[0]}***`;
  }

  const prefix = trimmed.slice(0, 4);
  const suffix = trimmed.slice(-4);
  return `${prefix}****${suffix}`;
}

/**
 * Masks an email address for privacy.
 * E.g. "shivam.nirmal@sanjivani.edu.in" -> "s***l@sanjivani.edu.in"
 */
export function maskEmail(email: unknown): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '';

  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `*@${domain}`;
  }

  const firstChar = username[0];
  const lastChar = username[username.length - 1];
  return `${firstChar}***${lastChar}@${domain}`;
}

/**
 * Masks a 12-digit UPI Bank UTR number.
 * E.g. "928374615243" -> "9283****5243"
 */
export function maskUTR(utr: unknown): string {
  if (!utr || typeof utr !== 'string') return '';
  const cleaned = utr.trim();

  if (cleaned.length < 8) return '****';

  const prefix = cleaned.slice(0, 4);
  const suffix = cleaned.slice(-4);
  return `${prefix}****${suffix}`;
}

/**
 * Safe client logger that automatically strips or masks PII before printing.
 * In production mode, console statements are completely suppressed.
 */
export function safeClientLog(message: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'production') return;

  if (!data) {
    console.log(`[FoodLine Security] ${message}`);
    return;
  }

  // Create sanitized copy of data
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
      sanitized[key] = maskPhoneNumber(String(value));
    } else if (lowerKey.includes('prn')) {
      sanitized[key] = maskPRN(String(value));
    } else if (lowerKey.includes('email')) {
      sanitized[key] = maskEmail(String(value));
    } else if (lowerKey.includes('utr')) {
      sanitized[key] = maskUTR(String(value));
    } else if (lowerKey.includes('password') || lowerKey.includes('token') || lowerKey.includes('secret')) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }

  console.log(`[FoodLine Security] ${message}`, sanitized);
}

