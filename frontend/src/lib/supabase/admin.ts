import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminRuntimeConfig } from './runtime';

/**
 * Server-only Supabase client with service_role.
 * Bypasses RLS — never import this into client components.
 */
export function createAdminClient(): SupabaseClient | null {
  const runtimeConfig = getSupabaseAdminRuntimeConfig(process.env);

  if (!runtimeConfig.isConfigured || !runtimeConfig.url || !runtimeConfig.serviceRoleKey) {
    console.error(`[supabase/admin] ${runtimeConfig.reason}`);
    return null;
  }

  return createClient(runtimeConfig.url, runtimeConfig.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
