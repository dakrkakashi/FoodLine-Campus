export type RuntimeEnv = Record<string, string | undefined>;

export type SupabaseRuntimeConfig = {
  url?: string;
  serviceRoleKey?: string;
  anonKey?: string;
  isConfigured: boolean;
  reason: string;
};

export const DEFAULT_SUPABASE_URL = 'https://ylweomuodekukjjpjrgx.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsd2VvbXVvZGVrdWtqanBqcmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NTczMDMsImV4cCI6MjEwMzAzMzMwM30.g75fot8jU_36gPD6sQCL81MUUZUfoJLDxL9eSsFAHaE';
export const DEFAULT_SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsd2VvbXVvZGVrdWtqanBqcmd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQ1NzMwMywiZXhwIjoyMTAzMDMzMzAzfQ.esc4r71f-iyesOK7Z_jis-l7VRhPy0Df70LI6yDMPCQ';

export function isLikelyPlaceholder(value?: string): boolean {
  if (!value) return true;
  const normalized = value.trim();
  if (normalized.length < 8) return true;
  return /^(dummy|example|placeholder|changeme|test|sample|your_|replace_me|todo)/i.test(normalized);
}

export function getSupabaseFrontendRuntimeConfig(
  env: RuntimeEnv = process.env,
): SupabaseRuntimeConfig {
  const rawUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const rawAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const url = rawUrl && !isLikelyPlaceholder(rawUrl) ? rawUrl : DEFAULT_SUPABASE_URL;
  const anonKey = rawAnonKey && !isLikelyPlaceholder(rawAnonKey) ? rawAnonKey : DEFAULT_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    isConfigured: true,
    reason: 'Supabase frontend credentials are configured.',
  };
}

export function getSupabaseAdminRuntimeConfig(
  env: RuntimeEnv = process.env,
): SupabaseRuntimeConfig {
  const rawUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const rawServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;
  const rawAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const url = rawUrl && !isLikelyPlaceholder(rawUrl) ? rawUrl : DEFAULT_SUPABASE_URL;
  const anonKey = rawAnonKey && !isLikelyPlaceholder(rawAnonKey) ? rawAnonKey : DEFAULT_SUPABASE_ANON_KEY;

  // Use explicit environment variable if valid; otherwise fallback to the canonical project key if targeting FoodLine Supabase
  const isDefaultProject = !rawUrl || rawUrl.includes('ylweomuodekukjjpjrgx');
  const serviceRoleKey =
    rawServiceRoleKey && !isLikelyPlaceholder(rawServiceRoleKey)
      ? rawServiceRoleKey
      : isDefaultProject
        ? DEFAULT_SUPABASE_SERVICE_ROLE_KEY
        : undefined;

  if (serviceRoleKey) {
    return {
      url,
      serviceRoleKey,
      anonKey,
      isConfigured: true,
      reason: 'Supabase admin credentials are configured.',
    };
  }

  return {
    url,
    serviceRoleKey,
    anonKey,
    isConfigured: false,
    reason: 'Supabase admin credentials are missing or placeholder. Set SUPABASE_SERVICE_ROLE_KEY in the runtime environment.',
  };
}
