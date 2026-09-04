import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { parseTimeToMinutes, getCampusTimeIST } from '@/lib/campus-time';

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

    const campusTime = getCampusTimeIST();
    const currentCampusMinutes = campusTime.totalMinutes;
    const campusTimeIST = campusTime.displayTime12h;

    const formattedSlots = (slotsRes.data || []).map(slot => {
      const booked = Math.max(slot.current_booked || 0, slotCountMap[slot.id] || 0);
      const startMinutes = parseTimeToMinutes(slot.start_time);
      const endMinutes = parseTimeToMinutes(slot.end_time);
      const isPast = currentCampusMinutes >= startMinutes;
      const isFull = booked >= slot.max_capacity;
      const isClosed = isPast || isFull;

      return {
        id: slot.id,
        label: slot.label,
        startTime: slot.start_time,
        endTime: slot.end_time,
        maxCapacity: slot.max_capacity,
        currentBooked: booked,
        availableSlots: Math.max(0, slot.max_capacity - booked),
        isFull,
        isPast,
        isClosed,
        status: isPast ? 'CLOSED_TIME_PASSED' : isFull ? 'FULL' : 'OPEN',
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedSlots,
      meta: {
        campusTimeIST,
        currentCampusMinutes,
        allTodaySlotsPassed: formattedSlots.every(s => s.isPast),
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

