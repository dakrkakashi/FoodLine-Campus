import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Multi-path dotenv resolution (supports root, backend, and frontend env files)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'frontend/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ylweomuodekukjjpjrgx.supabase.co';
const rawKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(rawKey && rawKey.length > 10);

// Crash-proof client initialization with fallback dummy token
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy_fallback';
export const supabase: SupabaseClient = createClient(supabaseUrl, isSupabaseConfigured ? rawKey : fallbackKey, {
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

