export type RuntimeEnv = Record<string, string | undefined>;

export type SupabaseRuntimeConfig = {
  url?: string;
  serviceRoleKey?: string;
  anonKey?: string;
  isConfigured: boolean;
  reason: string;
};

export function isLikelyPlaceholder(value?: string): boolean {
  if (!value) return true;
  const normalized = value.trim();
  if (normalized.length < 8) return true;
  return /^(dummy|example|placeholder|changeme|test|sample|your_|replace_me|todo)/i.test(normalized);
}

export function getSupabaseFrontendRuntimeConfig(
  env: RuntimeEnv = process.env,
): SupabaseRuntimeConfig {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && !isLikelyPlaceholder(url) && anonKey && !isLikelyPlaceholder(anonKey)) {
    return {
      url,
      anonKey,
      isConfigured: true,
      reason: 'Supabase frontend credentials are configured.',
    };
  }

  return {
    url,
    anonKey,
    isConfigured: false,
    reason: 'Supabase frontend credentials are missing or placeholder. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the runtime environment.',
  };
}

export function getSupabaseAdminRuntimeConfig(
  env: RuntimeEnv = process.env,
): SupabaseRuntimeConfig {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && !isLikelyPlaceholder(url) && serviceRoleKey && !isLikelyPlaceholder(serviceRoleKey)) {
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
    reason: 'Supabase admin credentials are missing or placeholder. Set SUPABASE_SERVICE_ROLE_KEY, or a valid NEXT_PUBLIC_SUPABASE_URL with an approved anon key.',
  };
}
