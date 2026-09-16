export type RuntimeEnv = Record<string, string | undefined>;

export type SupabaseRuntimeConfig = {
  url?: string;
  serviceRoleKey?: string;
  anonKey?: string;
  isConfigured: boolean;
  reason: string;
};

export function getSupabaseRuntimeConfig(env: RuntimeEnv = process.env): SupabaseRuntimeConfig {
  const rawUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const url = rawUrl && !/^(dummy|example|placeholder|changeme|test|sample)/i.test(rawUrl.trim()) ? rawUrl : undefined;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isLikelyPlaceholder = (value?: string) => {
    if (!value) return true;
    const normalized = value.trim();
    if (normalized.length < 8) return true;
    return /^(dummy|example|placeholder|changeme|test|sample)/i.test(normalized);
  };

  if (serviceRoleKey && !isLikelyPlaceholder(serviceRoleKey)) {
    return {
      url,
      serviceRoleKey,
      anonKey,
      isConfigured: true,
      reason: 'Supabase service credentials are configured.',
    };
  }

  if (anonKey && !isLikelyPlaceholder(anonKey)) {
    return {
      url,
      serviceRoleKey,
      anonKey,
      isConfigured: true,
      reason: 'Supabase anonymous credentials are configured.',
    };
  }

  if (rawUrl && !url) {
    return {
      url: undefined,
      serviceRoleKey,
      anonKey,
      isConfigured: false,
      reason: 'Supabase URL is placeholder or invalid. Set a real NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in the runtime environment.',
    };
  }

  return {
    url,
    serviceRoleKey,
    anonKey,
    isConfigured: false,
    reason: 'Supabase credentials missing or placeholder: set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the runtime environment.',
  };
}
