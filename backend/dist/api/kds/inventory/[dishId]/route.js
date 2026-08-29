"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function PATCH(request, { params }) {
    try {
        const { dishId } = await params;
        const body = await request.json();
        const { isAvailable } = body;
        if (typeof isAvailable !== 'boolean') {
            return server_1.NextResponse.json({
                success: false,
                error: {
                    code: 'INVALID_PAYLOAD',
                    message: 'isAvailable boolean is required.'
                }
            }, { status: 400 });
        }
        const { data: updatedItem, error } = await supabase
            .from('menu_items')
            .update({ is_available: isAvailable })
            .eq('id', dishId)
            .select()
            .single();
        if (error)
            throw error;
        return server_1.NextResponse.json({
            success: true,
            data: updatedItem
        });
    }
    catch (error) {
        return server_1.NextResponse.json({
            success: false,
            error: {
                code: 'INVENTORY_TOGGLE_ERROR',
                message: error.message || 'Failed to toggle inventory status'
            }
        }, { status: 500 });
    }
}
