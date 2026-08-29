"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function POST(request) {
    try {
        const body = await request.json();
        const { slotId, items, notes } = body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return server_1.NextResponse.json({
                success: false,
                error: {
                    code: 'INVALID_ORDER_ITEMS',
                    message: 'Order must contain at least one item.'
                }
            }, { status: 400 });
        }
        // 1. Validate slot capacity if slotId provided
        if (slotId) {
            const { data: slot, error: slotErr } = await supabase
                .from('pickup_slots')
                .select('*')
                .eq('id', slotId)
                .single();
            if (slotErr || !slot) {
                return server_1.NextResponse.json({
                    success: false,
                    error: {
                        code: 'SLOT_NOT_FOUND',
                        message: 'Selected pickup slot was not found.'
                    }
                }, { status: 404 });
            }
            if (slot.current_booked >= slot.max_capacity) {
                return server_1.NextResponse.json({
                    success: false,
                    error: {
                        code: 'SLOT_CAPACITY_EXCEEDED',
                        message: `Slot "${slot.label}" is fully booked (60/60). Please select another slot.`
                    }
                }, { status: 409 });
            }
        }
        // 2. Fetch Cafeteria
        const { data: cafe } = await supabase.from('cafeterias').select('id').limit(1).single();
        const cafeteriaId = cafe?.id || null;
        // 3. Calculate total & generate token (e.g. FL-8492)
        const randomTokenNum = Math.floor(1000 + Math.random() * 9000);
        const orderToken = `FL-${randomTokenNum}`;
        const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
        let totalAmount = 0;
        const orderItemsToInsert = [];
        for (const item of items) {
            const unitPrice = Number(item.price || 0);
            const quantity = Number(item.quantity || 1);
            const subtotal = unitPrice * quantity;
            totalAmount += subtotal;
            orderItemsToInsert.push({
                menu_item_id: item.id || null,
                item_name: item.name,
                quantity,
                unit_price: unitPrice,
                subtotal
            });
        }
        // 4. Create Order
        const { data: order, error: orderErr } = await supabase
            .from('orders')
            .insert({
            order_token: orderToken,
            cafeteria_id: cafeteriaId,
            slot_id: slotId || null,
            total_amount: totalAmount,
            status: 'PENDING_PAYMENT',
            pickup_otp: pickupOtp,
            notes: notes || null
        })
            .select()
            .single();
        if (orderErr)
            throw orderErr;
        // 5. Insert Order Items
        const itemsPayload = orderItemsToInsert.map(i => ({ ...i, order_id: order.id }));
        const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
        if (itemsErr)
            throw itemsErr;
        return server_1.NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                orderToken: order.order_token,
                totalAmount: order.total_amount,
                pickupOtp: order.pickup_otp,
                status: order.status,
                createdAt: order.created_at
            }
        });
    }
    catch (error) {
        return server_1.NextResponse.json({
            success: false,
            error: {
                code: 'ORDER_CREATION_ERROR',
                message: error.message || 'Failed to create order'
            }
        }, { status: 500 });
    }
}
