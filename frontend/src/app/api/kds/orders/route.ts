import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items (*), pickup_slots (*)')
      .in('status', ['CONFIRMED', 'PREPARING', 'READY', 'COLLECTED'])
      .order('created_at', { ascending: false })
      .limit(60);

    if (error) {
      console.error('[KDS API] Error fetching orders:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err: any) {
    console.error('[KDS API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
