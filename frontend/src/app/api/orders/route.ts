import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { isSlotPassedForDay } from '@/lib/campus-time';
import { appendPaymentRecord, appendOrderRecord } from '@/lib/google-sheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prn = searchParams.get('prn');
    const token = searchParams.get('token');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let query = supabase
      .from('orders')
      .select('*, order_items (*), pickup_slots (*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (token) {
      query = query.eq('order_token', token);
    } else if (prn) {
      query = query.ilike('notes', `%${prn}%`);
    }

    const { data: orders, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: orders || [],
      meta: { count: orders?.length || 0 }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ORDERS_ERROR',
          message: error.message || 'Failed to fetch order history'
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idempotencyKey = request.headers.get('idempotency-key') || body.idempotencyKey;
    const { slotId, items, notes, studentPrn, studentName, phone } = body;
    const effectivePrn = (studentPrn || body.prn || '').toString().trim();
    const effectiveName = (studentName || body.name || body.fullName || '').toString().trim();

    // Idempotency: If idempotency-key provided, return existing order to avoid duplicate creation
    if (idempotencyKey) {
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('*, order_items (*), pickup_slots (*)')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existingOrder) {
        return NextResponse.json({
          success: true,
          data: {
            orderId: existingOrder.id,
            orderToken: existingOrder.order_token,
            totalAmount: existingOrder.total_amount,
            pickupOtp: existingOrder.pickup_otp,
            status: existingOrder.status,
            slot: existingOrder.pickup_slots,
            idempotentReplay: true,
          },
          meta: { timestamp: existingOrder.created_at }
        }, { status: 200 });
      }
    }

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

    // 1. Validate slot capacity and campus time if slotId provided
    const isSlotUuid = typeof slotId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slotId);
    let resolvedSlotId: string | null = null;
    const isTomorrow = body.isTomorrow === true || body.pickupDate === 'TOMORROW';

    if (slotId && isSlotUuid) {
      const { data: slot, error: slotErr } = await supabase
        .from('pickup_slots')
        .select('*')
        .eq('id', slotId)
        .single();

      if (!slotErr && slot) {
        resolvedSlotId = slot.id;

        // Check if slot has already passed for Today
        if (!isTomorrow && slot.start_time) {
          const isPast = isSlotPassedForDay(slot.start_time, 'TODAY');
          if (isPast) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: 'SLOT_CLOSED_TIME_PASSED',
                  message: `Slot "${slot.label}" is closed because its campus pickup window has already passed. Please choose an upcoming slot or order for Tomorrow.`,
                },
              },
              { status: 400 }
            );
          }
        }

        // Check capacity
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
    }

    // 2. Fetch Cafeteria
    const { data: cafe } = await supabase.from('cafeterias').select('id').limit(1).single();
    const cafeteriaId = cafe?.id || null;

    // 3. Calculate total & validate/decrement stock
    // Generate guaranteed unique token with collision check
    const generateUniqueToken = async (): Promise<string> => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const candidate = `FL-${randNum}`;
        const { data: existing } = await supabase
          .from('orders')
          .select('id')
          .eq('order_token', candidate)
          .limit(1);
        if (!existing || existing.length === 0) {
          return candidate;
        }
      }
      // High-entropy 5-digit fallback if 4-digit space has collision
      return `FL-${Math.floor(10000 + Math.random() * 90000)}`;
    };

    let orderToken = await generateUniqueToken();
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

      const isItemUuid = typeof item.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);

      orderItemsToInsert.push({
        menu_item_id: isItemUuid ? item.id : null,
        item_name: item.name,
        quantity,
        unit_price: unitPrice,
        subtotal: itemSubtotal,
      });
    }

    const platformConvenienceFee = Number((subtotal * 0.035).toFixed(2));
    const totalAmount = Number((subtotal + platformConvenienceFee).toFixed(2));

    if (body.paymentMethod === 'COD') {
      return NextResponse.json(
        { success: false, error: 'Cash on Delivery has been discontinued. Please pay online via DirectPay UPI.' },
        { status: 400 }
      );
    }

    const cleanUtr = body.utrNumber ? body.utrNumber.toString().trim() : null;
    const isUpiWithValidUtr = cleanUtr && cleanUtr.length === 12;
    const initialStatus = isUpiWithValidUtr ? 'CONFIRMED' : 'PENDING_PAYMENT';

    // Format comprehensive student metadata tag in notes
    const studentTags = [
      isTomorrow ? 'Pickup: TOMORROW' : 'Pickup: TODAY',
      effectivePrn ? `PRN: ${effectivePrn}` : '',
      effectiveName ? `Name: ${effectiveName}` : '',
      phone ? `Phone: ${String(phone).trim()}` : '',
    ].filter(Boolean).join(' • ');

    let orderNotes = notes ? notes.trim() : '';
    if (studentTags) {
      orderNotes = orderNotes ? `[${studentTags}] ${orderNotes}` : `[${studentTags}]`;
    }

    // 4. Create Order with automatic collision-retry loop
    let order: any = null;
    let lastOrderErr: any = null;
    const MAX_INSERT_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_INSERT_ATTEMPTS; attempt++) {
      const { data: insertedOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_token: orderToken,
          cafeteria_id: cafeteriaId,
          slot_id: resolvedSlotId,
          total_amount: totalAmount,
          status: initialStatus,
          payment_status: isUpiWithValidUtr ? 'PENDING_MANUAL_REVIEW' : 'PENDING',
          idempotency_key: idempotencyKey || null,
          pickup_otp: pickupOtp,
          notes: orderNotes || null
        })
        .select()
        .single();

      if (!orderErr && insertedOrder) {
        order = insertedOrder;
        break;
      }

      lastOrderErr = orderErr;
      const isUniqueViolation = orderErr?.code === '23505' || orderErr?.message?.includes('duplicate key');
      if (isUniqueViolation && attempt < MAX_INSERT_ATTEMPTS) {
        console.warn(`[OrderCreation] Token collision on ${orderToken}. Generating fresh token (attempt ${attempt + 1}/${MAX_INSERT_ATTEMPTS})...`);
        orderToken = await generateUniqueToken();
        continue;
      }

      break;
    }

    if (!order) {
      console.error('[OrderCreation] Failed to insert order after retries:', lastOrderErr);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ORDER_CREATION_FAILED',
            message: lastOrderErr?.message?.includes('duplicate key')
              ? 'Token collision detected. Please tap Submit again to generate a fresh pickup pass.'
              : (lastOrderErr?.message || 'Failed to reserve your order. Please try again.')
          }
        },
        { status: 500 }
      );
    }

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

      // Synchronize to Google Sheets tab 'FoodLine — Payment & UTR Form'
      appendPaymentRecord({
        fullName: effectiveName || 'Campus Student',
        prn: effectivePrn || 'CAMPUS_STUDENT',
        utr: cleanUtr,
        orderToken: order.order_token,
        amount: totalAmount,
      }).catch((e) => console.warn('[GoogleSheets] Payment sync error:', e));
    }

    // Synchronize to Google Sheets tab 'Orders'
    const itemsSummary = items.map((i: any) => `${i.quantity || 1}x ${i.name} (₹${i.price})`).join(', ');
    const totalQuantity = items.reduce((acc: number, i: any) => acc + Number(i.quantity || 1), 0);
    appendOrderRecord({
      orderToken: order.order_token,
      prn: effectivePrn || 'CAMPUS_STUDENT',
      name: effectiveName || 'Campus Student',
      itemsSummary,
      quantity: totalQuantity,
      totalAmount: order.total_amount,
      status: order.status,
      utr: cleanUtr || '',
    }).catch((e) => console.warn('[GoogleSheets] Order sync error:', e));

    // Increment slot booked counter for confirmed orders
    if (slotId && isUpiWithValidUtr) {
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
        paymentMethod: 'UPI',
        studentPrn,
        studentName,
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

