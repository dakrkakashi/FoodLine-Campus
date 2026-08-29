"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;
        const validStatuses = ['PENDING_PAYMENT', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED'];
        if (!status || !validStatuses.includes(status)) {
            return server_1.NextResponse.json({
                success: false,
                error: {
                    code: 'INVALID_STATUS',
                    message: `Status must be one of: ${validStatuses.join(', ')}`
                }
            }, { status: 400 });
        }
        const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update({
            status,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return server_1.NextResponse.json({
            success: true,
            data: updatedOrder
        });
    }
    catch (error) {
        return server_1.NextResponse.json({
            success: false,
            error: {
                code: 'KDS_UPDATE_ERROR',
                message: error.message || 'Failed to update order status'
            }
        }, { status: 500 });
    }
}
