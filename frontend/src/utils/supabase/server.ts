import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseFrontendRuntimeConfig } from "@/lib/supabase/runtime";

const runtime = getSupabaseFrontendRuntimeConfig(process.env);

if (!runtime.isConfigured || !runtime.url || !runtime.anonKey) {
  throw new Error(`[utils/supabase/server] ${runtime.reason}`);
}

const supabaseUrl = runtime.url;
const supabaseKey = runtime.anonKey;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
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
            // The setAll method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
};
