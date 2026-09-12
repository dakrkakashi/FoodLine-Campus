import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ylweomuodekukjjpjrgx.supabase.co';
const DEFAULT_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsd2VvbXVvZGVrdWtqanBqcmd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQ1NzMwMywiZXhwIjoyMTAzMDMzMzAzfQ.esc4r71f-iyesOK7Z_jis-l7VRhPy0Df70LI6yDMPCQ';

/**
 * Server-only Supabase client with service_role.
 * Bypasses RLS — never import this into client components.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    DEFAULT_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.error('[supabase/admin] SUPABASE_SERVICE_ROLE_KEY is not set');
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
