"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function GET() {
    try {
        const { data: slots, error } = await supabase
            .from('pickup_slots')
            .select('*')
            .eq('is_active', true)
            .order('start_time', { ascending: true });
        if (error)
            throw error;
        const formattedSlots = (slots || []).map(slot => ({
            id: slot.id,
            label: slot.label,
            startTime: slot.start_time,
            endTime: slot.end_time,
            maxCapacity: slot.max_capacity,
            currentBooked: slot.current_booked,
            availableSlots: Math.max(0, slot.max_capacity - slot.current_booked),
            isFull: slot.current_booked >= slot.max_capacity
        }));
        return server_1.NextResponse.json({
            success: true,
            data: formattedSlots,
            meta: {
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        return server_1.NextResponse.json({
            success: false,
            error: {
                code: 'SLOTS_FETCH_ERROR',
                message: error.message || 'Failed to fetch pickup slots'
            }
        }, { status: 500 });
    }
}
