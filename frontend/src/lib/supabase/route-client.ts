import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdminRuntimeConfig, getSupabaseFrontendRuntimeConfig } from './runtime';

const adminRuntime = getSupabaseAdminRuntimeConfig(process.env);
const frontendRuntime = getSupabaseFrontendRuntimeConfig(process.env);

const fallbackUrl = 'https://ylweomuodekukjjpjrgx.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fallback_key';

export const isConfigured = adminRuntime.isConfigured || frontendRuntime.isConfigured;
export const supabaseUrl = adminRuntime.url || frontendRuntime.url || fallbackUrl;

// On the server, preferentially use the service role key to bypass RLS for backend API route operations.
export const supabaseKey =
  adminRuntime.serviceRoleKey ||
  frontendRuntime.anonKey ||
  fallbackKey;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
