import { describe, it, expect } from 'vitest';
import { getSupabaseRuntimeConfig } from '../src/config/runtime.js';

describe('runtime config', () => {
  it('should not invent a Supabase service key when credentials are missing', () => {
    const cfg = getSupabaseRuntimeConfig({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NODE_ENV: 'development',
    });

    expect(cfg.url).toBe('https://example.supabase.co');
    expect(cfg.isConfigured).toBe(false);
    expect(cfg.serviceRoleKey).toBeUndefined();
    expect(cfg.reason).toMatch(/missing/i);
  });

  it('should not invent a default Supabase URL when runtime config is absent', () => {
    const cfg = getSupabaseRuntimeConfig({
      NODE_ENV: 'development',
    });

    expect(cfg.url).toBeUndefined();
    expect(cfg.isConfigured).toBe(false);
    expect(cfg.reason).toMatch(/missing|placeholder/i);
  });

  it('should accept explicit credentials without forcing fallback values', () => {
    const cfg = getSupabaseRuntimeConfig({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-secret',
      NODE_ENV: 'production',
    });

    expect(cfg.isConfigured).toBe(true);
    expect(cfg.serviceRoleKey).toBe('service-role-secret');
  });
});
