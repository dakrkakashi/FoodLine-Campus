import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ylweomuodekukjjpjrgx.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Health check to verify live Supabase PostgreSQL connectivity
 */
export async function checkDatabaseConnection(): Promise<{ connected: boolean; message: string; latencyMs: number }> {
  const start = Date.now();
  try {
    const { error } = await supabase.from('cafeterias').select('id').limit(1);
    const latencyMs = Date.now() - start;
    if (error) {
      return { connected: false, message: error.message, latencyMs };
    }
    return { connected: true, message: 'Supabase PostgreSQL reachable', latencyMs };
  } catch (err: any) {
    return { connected: false, message: err.message || 'Connection failed', latencyMs: Date.now() - start };
  }
}

