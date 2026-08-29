import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slotId, items, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ORDER_ITEMS',
            message: 'Order must contain at least one item.'
          }
        },
        { status: 400 }
      );
    }

    // 1. Validate slot capacity if slotId provided
    if (slotId) {
      const { data: slot, error: slotErr } = await supabase
        .from('pickup_slots')
        .select('*')
        .eq('id', slotId)
        .single();

      if (slotErr || !slot) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'SLOT_NOT_FOUND',
              message: 'Selected pickup slot was not found.'
            }
          },
          { status: 404 }
        );
      }

      if (slot.current_booked >= slot.max_capacity) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'SLOT_CAPACITY_EXCEEDED',
              message: `Slot "${slot.label}" is fully booked (60/60). Please select another slot.`
            }
          },
          { status: 409 }
        );
      }
    }

    // 2. Fetch Cafeteria
    const { data: cafe } = await supabase.from('cafeterias').select('id').limit(1).single();
    const cafeteriaId = cafe?.id || null;

    // 3. Calculate total & validate/decrement stock
    const randomTokenNum = Math.floor(1000 + Math.random() * 9000);
    const orderToken = `FL-${randomTokenNum}`;
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    let subtotal = 0;
    const orderItemsToInsert: any[] = [];

    for (const item of items) {
      const unitPrice = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);
      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      // Decrement persistent stock if applicable
      if (item.id) {
        const { inferInventoryType, decrementPersistentStock } = await import('@/lib/stock-store');
        const invType = inferInventoryType(item);
        if (invType === 'persistent') {
          const decResult = decrementPersistentStock(item.id, quantity);
          if (!decResult.success) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: 'ITEM_OUT_OF_STOCK',
                  message: `"${item.name}" is out of stock (only ${decResult.remaining} left). Please adjust tray.`,
                },
              },
              { status: 400 }
            );
          }
        }
      }

      orderItemsToInsert.push({
        menu_item_id: item.id || null,
        item_name: item.name,
        quantity,
        unit_price: unitPrice,
        subtotal: itemSubtotal,
      });
    }

    const platformConvenienceFee = Number((subtotal * 0.035).toFixed(2));
    const totalAmount = Number((subtotal + platformConvenienceFee).toFixed(2));

    const paymentMethod = body.paymentMethod === 'COD' ? 'COD' : 'UPI';
    const cleanUtr = body.utrNumber ? body.utrNumber.toString().trim() : null;
    const isUpiWithValidUtr = paymentMethod === 'UPI' && cleanUtr && cleanUtr.length === 12;

    const initialStatus = (paymentMethod === 'COD' || isUpiWithValidUtr) ? 'CONFIRMED' : 'PENDING_PAYMENT';
    const orderNotes = paymentMethod === 'COD'
      ? (notes ? `${notes} | [💵 COD: Collect ₹${totalAmount} at Counter]` : `[💵 COD: Collect ₹${totalAmount} at Counter]`)
      : (notes || null);

    // 4. Create Order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_token: orderToken,
        cafeteria_id: cafeteriaId,
        slot_id: slotId || null,
        total_amount: totalAmount,
        status: initialStatus,
        pickup_otp: pickupOtp,
        notes: orderNotes
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // Record Payment if UPI with UTR
    if (isUpiWithValidUtr && order) {
      try {
        await supabase.from('payments').upsert({
          order_id: order.id,
          utr_number: cleanUtr,
          amount: totalAmount,
          status: 'PENDING_VERIFICATION',
          verified_at: new Date().toISOString()
        }, { onConflict: 'utr_number' });
      } catch (e) {
        console.warn('Payment record upsert warning:', e);
      }
    }

    // Increment slot booked counter for confirmed orders
    if (slotId && (paymentMethod === 'COD' || isUpiWithValidUtr)) {
      try {
        const { data: currentSlot } = await supabase.from('pickup_slots').select('current_booked').eq('id', slotId).single();
        if (currentSlot) {
          await supabase.from('pickup_slots').update({ current_booked: (currentSlot.current_booked || 0) + 1 }).eq('id', slotId);
        }
      } catch (e) {}
    }

    // 5. Insert Order Items
    const itemsPayload = orderItemsToInsert.map(i => ({ ...i, order_id: order.id }));
    const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
    if (itemsErr) throw itemsErr;

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderToken: order.order_token,
        totalAmount: order.total_amount,
        pickupOtp: order.pickup_otp,
        status: order.status,
        paymentMethod,
        createdAt: order.created_at
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ORDER_CREATION_ERROR',
          message: error.message || 'Failed to create order'
        }
      },
      { status: 500 }
    );
  }
}
