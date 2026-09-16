import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { getSupabaseRuntimeConfig } from '../config/runtime.js';

// Multi-path dotenv resolution (supports root, backend, and frontend env files)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'frontend/.env.local') });

const runtimeConfig = getSupabaseRuntimeConfig(process.env);
const supabaseUrl = runtimeConfig.url || 'https://invalid.invalid';
const rawKey = runtimeConfig.serviceRoleKey || runtimeConfig.anonKey || 'not-configured';

export const isSupabaseConfigured = runtimeConfig.isConfigured;

export const supabase: SupabaseClient = createClient(supabaseUrl, rawKey, {
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

  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: runtimeConfig.reason,
      latencyMs: Date.now() - start,
    };
  }

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

