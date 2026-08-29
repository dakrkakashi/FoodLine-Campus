"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSession = void 0;
const ssr_1 = require("@supabase/ssr");
const server_1 = require("next/server");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const updateSession = async (request) => {
    let supabaseResponse = server_1.NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
    const supabase = (0, ssr_1.createServerClient)(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                supabaseResponse = server_1.NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
            },
        },
    });
    // Refresh auth session
    await supabase.auth.getUser();
    return supabaseResponse;
};
exports.updateSession = updateSession;
