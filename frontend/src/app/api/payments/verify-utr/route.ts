import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { appendPaymentRecord } from '@/lib/google-sheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderToken, utrNumber, amount } = body;

    if (!orderToken || !utrNumber) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Both orderToken and 12-digit utrNumber are required.'
          }
        },
        { status: 400 }
      );
    }

    const cleanUtr = utrNumber.toString().trim();
    if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_UTR_FORMAT',
            message: 'UTR must be exactly 12 numeric digits.'
          }
        },
        { status: 422 }
      );
    }

    // 1. Fetch Order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('order_token', orderToken)
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: `Order ${orderToken} not found.`
          }
        },
        { status: 404 }
      );
    }

    // 2. Check if UTR is already used (prevent replay attack)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('utr_number', cleanUtr)
      .maybeSingle();

    if (existingPayment && existingPayment.order_id !== order.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_UTR',
            message: 'This UTR has already been submitted for another order.'
          }
        },
        { status: 409 }
      );
    }

    // 3. Record Payment
    const { error: payErr } = await supabase.from('payments').upsert(
      {
        order_id: order.id,
        utr_number: cleanUtr,
        amount: amount || order.total_amount,
        status: 'PENDING_VERIFICATION',
        verified_at: new Date().toISOString()
      },
      { onConflict: 'utr_number' }
    );

    if (payErr) throw payErr;

    // 4. Update Order Status to CONFIRMED
    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update({
        status: 'CONFIRMED',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // 5. Synchronize to Google Sheet tab 'FoodLine — Payment & UTR Form'
    const studentName = order.notes?.match(/Name:\s*([^•\]]+)/)?.[1]?.trim() || 'Campus Student';
    const studentPrn = order.notes?.match(/PRN:\s*([^•\]]+)/)?.[1]?.trim() || 'CAMPUS_STUDENT';
    appendPaymentRecord({
      fullName: studentName,
      prn: studentPrn,
      utr: cleanUtr,
      orderToken: order.order_token,
      amount: amount || order.total_amount,
    }).catch((e) => console.warn('[GoogleSheets] verify-utr payment append warning:', e));

    return NextResponse.json({
      success: true,
      data: {
        orderToken: updatedOrder.order_token,
        status: updatedOrder.status,
        utrNumber: cleanUtr,
        pickupOtp: updatedOrder.pickup_otp,
        message: 'Payment UTR submitted successfully. Order is now CONFIRMED.'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PAYMENT_VERIFY_ERROR',
          message: error.message || 'Failed to verify payment UTR'
        }
      },
      { status: 500 }
    );
  }
}
