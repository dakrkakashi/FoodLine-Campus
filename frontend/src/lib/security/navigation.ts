/**
 * 🧭 FoodLine Campus — Navigation Security & Open Redirect Prevention
 *
 * Guarantees that client-side redirects derived from user-supplied query parameters
 * (e.g., `?returnUrl=...` or `?redirect=...`) never navigate to external phishing origins.
 */

/**
 * Checks if a target URL path is a safe internal relative route.
 */
export function isSafeInternalRedirect(url: unknown): boolean {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim();

  // Must begin with a single slash '/'
  if (!trimmed.startsWith('/')) {
    return false;
  }

  // Prevent protocol-relative URL bypass (e.g. "//evil.com")
  if (trimmed.startsWith('//')) {
    return false;
  }

  // Prevent backslash evasion (e.g. "/\evil.com")
  if (trimmed.startsWith('/\\')) {
    return false;
  }

  // Block control characters and dangerous protocol schemes
  if (/[\u0000-\u001F]/.test(trimmed) || /^\/(?:javascript|data|vbscript):/i.test(trimmed)) {
    return false;
  }

  return true;
}

/**
 * Resolves a safe redirect URL, falling back to a safe default route if invalid.
 */
export function getSafeRedirectUrl(targetUrl: unknown, fallbackRoute = '/'): string {
  if (isSafeInternalRedirect(targetUrl)) {
    return (targetUrl as string).trim();
  }
  return fallbackRoute;
}

