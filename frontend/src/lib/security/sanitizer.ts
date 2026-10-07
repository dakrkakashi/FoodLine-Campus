/**
 * 🛡️ FoodLine Campus — Client-Side Input Sanitizer & XSS Shield
 *
 * Implements context-aware sanitization, tag stripping, character encoding,
 * and allowlist validation pursuant to OWASP ASVS and DPDP guidelines.
 */

export interface SanitizeOptions {
  /** Maximum allowable string length (default: 500) */
  maxLength?: number;
  /** Allow newlines and line breaks (default: false) */
  allowNewlines?: boolean;
  /** Strip all HTML tags completely (default: true) */
  stripHtml?: boolean;
  /** Encode dangerous characters to HTML entities (default: true) */
  encodeEntities?: boolean;
}

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

// Regex patterns for dangerous vectors
const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript|file):/i;
const HTML_TAG_REGEX = /<[^>]*>?/gm;
const SCRIPT_INJECTION_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const STYLE_INJECTION_REGEX = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
const EVENT_HANDLER_REGEX = /\bon\w+\s*=/gi;
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g;

/**
 * Encodes special characters to HTML entities to prevent DOM XSS injection.
 */
export function encodeHtmlEntities(str: string): string {
  return str.replace(/[&<>"'`=\/]/g, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Universal text sanitizer for general user input fields.
 */
export function sanitizeText(input: unknown, options: SanitizeOptions = {}): string {
  if (input === null || input === undefined) return '';
  let str = String(input);

  const {
    maxLength = 500,
    allowNewlines = false,
    stripHtml = true,
    encodeEntities = true,
  } = options;

  // 1. Strip dangerous null bytes and hidden control characters
  str = str.replace(CONTROL_CHARS_REGEX, '');

  // 2. Remove script and style tags completely
  str = str.replace(SCRIPT_INJECTION_REGEX, '');
  str = str.replace(STYLE_INJECTION_REGEX, '');
  str = str.replace(EVENT_HANDLER_REGEX, '');

  // 3. Strip HTML tags if enabled
  if (stripHtml) {
    str = str.replace(HTML_TAG_REGEX, '');
  }

  // 4. Handle newlines
  if (!allowNewlines) {
    str = str.replace(/[\r\n]+/g, ' ');
  }

  // 5. Trim extraneous whitespace
  str = str.trim();

  // 6. Enforce maximum length
  if (maxLength > 0 && str.length > maxLength) {
    str = str.slice(0, maxLength).trim();
  }

  // 7. Contextual entity encoding if requested
  if (encodeEntities) {
    str = encodeHtmlEntities(str);
  }

  return str;
}

/**
 * Specialized sanitizer for Chef Cooking Instructions / Dietary Notes.
 * Preserves standard punctuation (commas, periods, exclamation, hyphens),
 * but strictly blocks HTML, scripts, styles, and injection characters.
 */
export function sanitizeCookingNotes(notes: unknown, maxLength = 180): string {
  if (!notes || typeof notes !== 'string') return '';

  // Clean dangerous control codes, scripts, and styles
  let cleaned = notes
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(SCRIPT_INJECTION_REGEX, '')
    .replace(STYLE_INJECTION_REGEX, '')
    .replace(HTML_TAG_REGEX, '')
    .replace(/[\r\n]+/g, ' ')
    .trim();

  // Allow only safe human dietary characters: letters, numbers, spaces, standard culinary punctuation
  // E.g. "Less spicy, extra green chutney! No onion/garlic."
  cleaned = cleaned.replace(/[^\w\s.,!?:;/&'()\-+]/gi, '');

  // Truncate to maximum characters
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength).trim();
  }

  return cleaned;
}

/**
 * Specialized sanitizer for Menu & Campus Search Queries.
 * Prevents ReDoS regex denial of service, wildcard injection, and script triggers.
 */
export function sanitizeSearchQuery(query: unknown, maxLength = 60): string {
  if (!query || typeof query !== 'string') return '';

  // Strip control chars, html, styles, and regex metacharacters that cause client search crashes
  let cleaned = query
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(SCRIPT_INJECTION_REGEX, '')
    .replace(STYLE_INJECTION_REGEX, '')
    .replace(HTML_TAG_REGEX, '')
    .replace(/[\r\n]+/g, ' ')
    .trim();

  // Allow alphanumeric, spaces, and simple hyphens
  cleaned = cleaned.replace(/[^\w\s\-@.]/gi, '');

  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength).trim();
  }

  return cleaned;
}

/**
 * Validates and sanitizes a Student PRN (Permanent Registration Number).
 * Enforces alphanumeric format between 3 and 25 characters.
 */
export function sanitizePRN(prn: unknown): { isValid: boolean; sanitized: string } {
  if (!prn || typeof prn !== 'string') {
    return { isValid: false, sanitized: '' };
  }

  // Remove whitespace and convert to uppercase
  const sanitized = prn.replace(/[\s\-_.]/g, '').toUpperCase().trim();

  // Typical Sanjivani PRN: 4-digit (0110), 10-digit, or 12-digit (2023SUCS0777)
  const isValid = /^[A-Z0-9]{3,25}$/.test(sanitized);

  return { isValid, sanitized };
}

/**
 * Validates and sanitizes a 12-digit Indian Bank UPI UTR Number.
 * Strictly checks that exactly 12 numeric digits are present.
 */
export function sanitizeUTR(utr: unknown): { isValid: boolean; sanitized: string } {
  if (!utr || typeof utr !== 'string') {
    return { isValid: false, sanitized: '' };
  }

  // Extract only digits
  const sanitized = utr.replace(/\D/g, '').trim();
  const isValid = /^\d{12}$/.test(sanitized);

  return { isValid, sanitized };
}

/**
 * Validates and sanitizes a 10-digit Indian Mobile Phone Number.
 * Strips +91 or leading 0, ensuring format starts with 6, 7, 8, or 9.
 */
export function sanitizePhoneNumber(phone: unknown): { isValid: boolean; sanitized: string } {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, sanitized: '' };
  }

  // Strip country code (+91) and non-numeric chars
  let sanitized = phone.replace(/\D/g, '');
  if (sanitized.length === 12 && sanitized.startsWith('91')) {
    sanitized = sanitized.slice(2);
  } else if (sanitized.length === 11 && sanitized.startsWith('0')) {
    sanitized = sanitized.slice(1);
  }

  const isValid = /^[6-9]\d{9}$/.test(sanitized);

  return { isValid, sanitized };
}

/**
 * Validates whether a URL or link href is safe to navigate to.
 * Blocks javascript:, data:, and external unlisted domains.
 */
export function isSafeLink(url: unknown): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Block dangerous protocol sinks
  if (DANGEROUS_PROTOCOLS.test(trimmed)) {
    return false;
  }

  // Allow relative internal links
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  // Allow safe campus tel: or mailto: links
  if (trimmed.startsWith('tel:') || trimmed.startsWith('mailto:')) {
    return true;
  }

  return false;
}

