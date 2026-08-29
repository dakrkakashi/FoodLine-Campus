"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const ssr_1 = require("@supabase/ssr");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const createClient = () => (0, ssr_1.createBrowserClient)(supabaseUrl, supabaseKey);
exports.createClient = createClient;
