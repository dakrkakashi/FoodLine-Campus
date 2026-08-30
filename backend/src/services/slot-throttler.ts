import { PickupSlot, SlotHoldRecord } from '../lib/types.js';
import campusData from '../data/campus.json';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

// In-memory slot state synchronized with 60-cap limit
const slotState: Map<string, PickupSlot> = new Map();
const slotHolds: Map<string, SlotHoldRecord> = new Map();

// Initialize from campus json
for (const breakWindow of campusData.breaks) {
  for (const slot of breakWindow.slots) {
    slotState.set(slot.id, {
      id: slot.id,
      label: slot.label,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCapacity: slot.maxCapacity || 60,
      currentBooked: slot.currentBooked || 0,
      availableSlots: Math.max(0, (slot.maxCapacity || 60) - (slot.currentBooked || 0)),
      isFull: (slot.currentBooked || 0) >= (slot.maxCapacity || 60),
    });
  }
}

export class SlotThrottlerService {
  /**
   * Get all pickup slots with live capacity counts
   */
  public static async getAllSlots(): Promise<PickupSlot[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pickup_slots')
          .select('*')
          .eq('is_active', true)
          .order('start_time', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            label: d.label,
            startTime: d.start_time,
            endTime: d.end_time,
            maxCapacity: d.max_capacity || 60,
            currentBooked: d.current_booked || 0,
            availableSlots: Math.max(0, (d.max_capacity || 60) - (d.current_booked || 0)),
            isFull: (d.current_booked || 0) >= (d.max_capacity || 60),
            cafeteriaId: d.cafeteria_id,
            facultyReserved: d.faculty_reserved || 5,
          }));
        }
      } catch (err) {
        console.warn('Supabase slots fetch fallback to local cache:', err);
      }
    }

    return Array.from(slotState.values());
  }

  /**
   * Get slot by ID
   */
  public static async getSlotById(slotId: string): Promise<PickupSlot | undefined> {
    const slots = await SlotThrottlerService.getAllSlots();
    return slots.find((s) => s.id === slotId) || slotState.get(slotId);
  }

  /**
   * Check capacity before booking
   */
  public static canReserve(slotId: string, quantity: number = 1): boolean {
    const slot = slotState.get(slotId);
    if (!slot) return true; // allow if dynamic UUID
    return slot.currentBooked + quantity <= slot.maxCapacity;
  }

  /**
   * Atomically reserve slot capacity and record 10-minute hold
   */
  public static async reserveSlot(
    slotId: string,
    quantity: number = 1,
    orderId?: string
  ): Promise<PickupSlot> {
    let slot = slotState.get(slotId);

    // If slot not in initial JSON (e.g. UUID from Supabase), create dynamic slot entry
    if (!slot) {
      slot = {
        id: slotId,
        label: 'Dynamic Lunch Break Slot',
        startTime: '11:50 AM',
        endTime: '12:10 PM',
        maxCapacity: 60,
        currentBooked: 0,
        availableSlots: 60,
        isFull: false,
      };
      slotState.set(slotId, slot);
    }

    if (slot.currentBooked + quantity > slot.maxCapacity) {
      throw new Error(`Slot has reached maximum capacity (${slot.currentBooked}/${slot.maxCapacity} orders).`);
    }

    // Atomic increment
    slot.currentBooked += quantity;
    slot.availableSlots = Math.max(0, slot.maxCapacity - slot.currentBooked);
    slot.isFull = slot.currentBooked >= slot.maxCapacity;
    slotState.set(slotId, slot);

    // Record hold
    if (orderId) {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      const hold: SlotHoldRecord = {
        id: `hold_${Date.now()}`,
        orderId,
        slotId,
        quantity,
        expiresAt,
        isReleased: false,
        createdAt: new Date().toISOString(),
      };
      slotHolds.set(orderId, hold);

      // Async persist to Supabase if configured
      if (isSupabaseConfigured) {
        supabase
          .from('pickup_slots')
          .update({ current_booked: slot.currentBooked })
          .eq('id', slotId)
          .then(() => {});
      }
    }

    return slot;
  }

  /**
   * Release reserved slot capacity
   */
  public static async releaseSlot(slotId: string, quantity: number = 1, orderId?: string): Promise<PickupSlot | undefined> {
    const slot = slotState.get(slotId);
    if (slot) {
      slot.currentBooked = Math.max(0, slot.currentBooked - quantity);
      slot.availableSlots = Math.max(0, slot.maxCapacity - slot.currentBooked);
      slot.isFull = slot.currentBooked >= slot.maxCapacity;
      slotState.set(slotId, slot);

      if (isSupabaseConfigured) {
        supabase
          .from('pickup_slots')
          .update({ current_booked: slot.currentBooked })
          .eq('id', slotId)
          .then(() => {});
      }
    }

    if (orderId && slotHolds.has(orderId)) {
      const hold = slotHolds.get(orderId)!;
      hold.isReleased = true;
      slotHolds.set(orderId, hold);
    }

    return slot;
  }

  /**
   * Periodic garbage collector to release expired holds
   */
  public static expireOldHolds(): void {
    const now = new Date();
    for (const [orderId, hold] of slotHolds.entries()) {
      if (!hold.isReleased && new Date(hold.expiresAt) <= now) {
        SlotThrottlerService.releaseSlot(hold.slotId, hold.quantity, orderId);
        hold.isReleased = true;
        slotHolds.set(orderId, hold);
      }
    }
  }
}

