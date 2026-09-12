import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [ordersRes, itemsRes, slotsRes] = await Promise.all([
      supabase
        .from('orders')
        .select('*, pickup_slots (*)')
        .neq('status', 'CANCELLED')
        .order('created_at', { ascending: false }),
      supabase
        .from('order_items')
        .select('*'),
      supabase
        .from('pickup_slots')
        .select('*')
        .order('start_time', { ascending: true }),
    ]);

    if (ordersRes.error) {
      console.error('[Admin Orders API] Orders fetch error:', ordersRes.error);
      return NextResponse.json({ success: false, error: ordersRes.error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        orders: ordersRes.data || [],
        orderItems: itemsRes.data || [],
        slots: slotsRes.data || [],
      },
    });
  } catch (err: any) {
    console.error('[Admin Orders API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
