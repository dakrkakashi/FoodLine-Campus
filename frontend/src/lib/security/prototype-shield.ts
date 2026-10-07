/**
 * 🛡️ FoodLine Campus — Prototype Pollution Guard
 *
 * Prevents prototype pollution attacks by recursively validating and
 * rejecting malicious keys (__proto__, constructor, prototype) during
 * deep object assignment or deserialization.
 */

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Checks if a key is a prototype pollution attack vector.
 */
export function isPollutedKey(key: string): boolean {
  return BLOCKED_KEYS.has(key);
}

/**
 * Safely deep-clones an object while omitting dangerous prototype properties.
 */
export function safeDeepClone<T>(source: T): T {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map((item) => safeDeepClone(item)) as unknown as T;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    if (isPollutedKey(key)) {
      continue;
    }
    result[key] = safeDeepClone(value);
  }

  return result as T;
}

/**
 * Safely parses JSON strings and strips prototype-polluting keys.
 */
export function safeJsonParse<T = unknown>(jsonString: string, fallbackValue: T): T {
  try {
    const parsed = JSON.parse(jsonString, (key, value) => {
      if (isPollutedKey(key)) {
        return undefined;
      }
      return value;
    });
    return parsed as T;
  } catch {
    return fallbackValue;
  }
}

