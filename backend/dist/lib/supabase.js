"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.isSupabaseConfigured = void 0;
exports.checkDatabaseConnection = checkDatabaseConnection;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ylweomuodekukjjpjrgx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';
exports.isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});
/**
 * Health check to verify live Supabase PostgreSQL connectivity
 */
async function checkDatabaseConnection() {
    const start = Date.now();
    try {
        const { error } = await exports.supabase.from('cafeterias').select('id').limit(1);
        const latencyMs = Date.now() - start;
        if (error) {
            return { connected: false, message: error.message, latencyMs };
        }
        return { connected: true, message: 'Supabase PostgreSQL reachable', latencyMs };
    }
    catch (err) {
        return { connected: false, message: err.message || 'Connection failed', latencyMs: Date.now() - start };
    }
}
