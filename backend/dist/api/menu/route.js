"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const [categoriesRes, menuRes] = await Promise.all([
            supabase.from('categories').select('*').order('display_order', { ascending: true }),
            categoryId
                ? supabase.from('menu_items').select('*').eq('category_id', categoryId).order('name')
                : supabase.from('menu_items').select('*').order('name')
        ]);
        if (categoriesRes.error)
            throw categoriesRes.error;
        if (menuRes.error)
            throw menuRes.error;
        return server_1.NextResponse.json({
            success: true,
            data: {
                categories: categoriesRes.data || [],
                items: menuRes.data || []
            },
            meta: {
                totalItems: menuRes.data?.length || 0,
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        return server_1.NextResponse.json({
            success: false,
            error: {
                code: 'MENU_FETCH_ERROR',
                message: error.message || 'Failed to fetch menu items'
            }
        }, { status: 500 });
    }
}
