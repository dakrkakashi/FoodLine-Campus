import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseFrontendRuntimeConfig } from './runtime';

const fallbackUrl = 'https://ylweomuodekukjjpjrgx.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fallback_key';

export function createClient() {
  const runtimeConfig = getSupabaseFrontendRuntimeConfig(process.env);
  const url = runtimeConfig.url || fallbackUrl;
  const anonKey = runtimeConfig.anonKey || fallbackKey;

  return createBrowserClient(url, anonKey);
}
