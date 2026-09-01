import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderToken, pickupOtp } = body;

    if (!orderToken || !pickupOtp) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both orderToken and 4-digit pickupOtp are required.',
        },
        { status: 400 }
      );
    }

    const cleanOtp = pickupOtp.toString().trim();

    // 1. Fetch Order from Supabase
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('order_token', orderToken)
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        {
          success: false,
          error: `Order ${orderToken} not found.`,
        },
        { status: 404 }
      );
    }

    // 2. Validate OTP
    if (order.status === 'COLLECTED') {
      return NextResponse.json(
        {
          success: false,
          error: `Order ${orderToken} has already been collected.`,
        },
        { status: 400 }
      );
    }

    if (order.pickup_otp !== cleanOtp) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid 4-digit pickup OTP. Handover denied.',
        },
        { status: 400 }
      );
    }

    // 3. Update status to COLLECTED
    const now = new Date().toISOString();
    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update({
        status: 'COLLECTED',
        updated_at: now,
      })
      .eq('id', order.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return NextResponse.json({
      success: true,
      data: {
        orderToken: updatedOrder.order_token,
        status: updatedOrder.status,
        pickupOtp: updatedOrder.pickup_otp,
        message: `Pickup verified! Order ${orderToken} successfully handed over.`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify pickup OTP',
      },
      { status: 500 }
    );
  }
}
