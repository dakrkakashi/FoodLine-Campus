'use client';

import { useState, useCallback } from 'react';
import {
  sanitizeText,
  sanitizeCookingNotes,
  sanitizePRN,
  sanitizeUTR,
  sanitizePhoneNumber,
} from './sanitizer';

export type InputFieldType = 'text' | 'notes' | 'prn' | 'utr' | 'phone';

export interface FieldValidationRule {
  required?: boolean;
  type?: InputFieldType;
  maxLength?: number;
  customValidator?: (value: string) => string | null;
}

/**
 * useSecureForm: Reusable React hook for forms requiring real-time sanitization,
 * XSS defense, and allowlist validation.
 */
export function useSecureForm<T extends Record<string, string>>(
  initialValues: T,
  rules: Partial<Record<keyof T, FieldValidationRule>> = {}
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (name: keyof T, rawValue: string): string | null => {
      const rule = rules[name];
      if (!rule) return null;

      if (rule.required && !rawValue.trim()) {
        return 'This field is required';
      }

      if (rule.type === 'prn' && rawValue.trim()) {
        const { isValid } = sanitizePRN(rawValue);
        if (!isValid) return 'Invalid student PRN (3-25 alphanumeric chars)';
      }

      if (rule.type === 'utr' && rawValue.trim()) {
        const { isValid } = sanitizeUTR(rawValue);
        if (!isValid) return 'Bank UTR must be exactly 12 numeric digits';
      }

      if (rule.type === 'phone' && rawValue.trim()) {
        const { isValid } = sanitizePhoneNumber(rawValue);
        if (!isValid) return 'Please enter a valid 10-digit mobile number';
      }

      if (rule.customValidator) {
        return rule.customValidator(rawValue);
      }

      return null;
    },
    [rules]
  );

  const setFieldValue = useCallback(
    (name: keyof T, rawValue: string) => {
      const rule = rules[name];
      let sanitizedValue = rawValue;

      if (rule?.type === 'notes') {
        sanitizedValue = sanitizeCookingNotes(rawValue, rule.maxLength || 180);
      } else if (rule?.type === 'prn') {
        sanitizedValue = rawValue.replace(/[\s\-_.]/g, '').toUpperCase();
      } else if (rule?.type === 'utr') {
        sanitizedValue = rawValue.replace(/\D/g, '').slice(0, 12);
      } else if (rule?.type === 'phone') {
        sanitizedValue = rawValue.replace(/\D/g, '').slice(0, 10);
      } else {
        sanitizedValue = sanitizeText(rawValue, {
          maxLength: rule?.maxLength || 500,
          allowNewlines: false,
          stripHtml: true,
          encodeEntities: false,
        });
      }

      setValues((prev) => ({ ...prev, [name]: sanitizedValue }));

      if (touched[name]) {
        const err = validateField(name, sanitizedValue);
        setErrors((prev) => ({ ...prev, [name]: err || undefined }));
      }
    },
    [rules, touched, validateField]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const err = validateField(name, values[name] || '');
      setErrors((prev) => ({ ...prev, [name]: err || undefined }));
    },
    [validateField, values]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const key of Object.keys(rules) as (keyof T)[]) {
      const err = validateField(key, values[key] || '');
      if (err) {
        newErrors[key] = err;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    validateAll,
    reset,
  };
}

