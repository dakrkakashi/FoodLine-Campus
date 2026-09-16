import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseFrontendRuntimeConfig } from './runtime';

export async function createClient() {
  const runtimeConfig = getSupabaseFrontendRuntimeConfig(process.env);

  if (!runtimeConfig.isConfigured || !runtimeConfig.url || !runtimeConfig.anonKey) {
    throw new Error(`[supabase/server] ${runtimeConfig.reason}`);
  }

  const cookieStore = await cookies();

  return createServerClient(
    runtimeConfig.url,
    runtimeConfig.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
