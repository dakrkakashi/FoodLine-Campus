import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const [slotsRes, ordersRes] = await Promise.all([
      supabase
        .from('pickup_slots')
        .select('*')
        .eq('is_active', true)
        .order('start_time', { ascending: true }),
      supabase
        .from('orders')
        .select('slot_id')
        .neq('status', 'CANCELLED')
    ]);

    if (slotsRes.error) throw slotsRes.error;

    const slotCountMap: Record<string, number> = {};
    (ordersRes.data || []).forEach(o => {
      if (o.slot_id) {
        slotCountMap[o.slot_id] = (slotCountMap[o.slot_id] || 0) + 1;
      }
    });

    const formattedSlots = (slotsRes.data || []).map(slot => {
      const booked = Math.max(slot.current_booked || 0, slotCountMap[slot.id] || 0);
      return {
        id: slot.id,
        label: slot.label,
        startTime: slot.start_time,
        endTime: slot.end_time,
        maxCapacity: slot.max_capacity,
        currentBooked: booked,
        availableSlots: Math.max(0, slot.max_capacity - booked),
        isFull: booked >= slot.max_capacity
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedSlots,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SLOTS_FETCH_ERROR',
          message: error.message || 'Failed to fetch pickup slots'
        }
      },
      { status: 500 }
    );
  }
}
