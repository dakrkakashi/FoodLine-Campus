import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseFrontendRuntimeConfig } from "@/lib/supabase/runtime";

const runtime = getSupabaseFrontendRuntimeConfig(process.env);
const fallbackUrl = 'https://ylweomuodekukjjpjrgx.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fallback_key';

export const isSupabaseConfigured = runtime.isConfigured;
export const supabaseUrl = runtime.url || fallbackUrl;
export const supabaseKey = runtime.anonKey || fallbackKey;

export function createClient() {
  if (typeof window === 'undefined') {
    return createSupabaseClient(supabaseUrl, supabaseKey);
  }
  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
