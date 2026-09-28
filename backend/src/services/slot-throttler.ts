import { PickupSlot, SlotHoldRecord } from '../lib/types.js';
import campusData from '../data/campus.json';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

// In-memory slot state synchronized with 60-cap limit
const slotState: Map<string, PickupSlot> = new Map();
const slotHolds: Map<string, SlotHoldRecord> = new Map();

// High-speed short-lived read cache for slots to prevent DB contention during peak bursts
let cachedSlots: PickupSlot[] | null = null;
let cachedSlotsTimestamp: number = 0;
const SLOTS_CACHE_TTL_MS = 3000; // 3-second read-through TTL

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const str = timeStr.trim().toUpperCase();
  const isPM = str.includes('PM');
  const isAM = str.includes('AM');
  const cleaned = str.replace(/[AP]M/, '').trim();
  const parts = cleaned.split(':');
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  if (isPM && hours < 12) hours += 12;
  else if (isAM && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function getCampusCurrentMinutes(): number {
  const now = new Date();
  const istFormatter24 = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = istFormatter24.formatToParts(now);
  const hours = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
  const minutes = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
  return hours * 60 + minutes;
}

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
   * Invalidate cached slots immediately upon reservation or capacity changes
   */
  public static invalidateCache(): void {
    cachedSlots = null;
    cachedSlotsTimestamp = 0;
  }

  /**
   * Get all pickup slots with live capacity counts and auto-time closure
   */
  public static async getAllSlots(): Promise<PickupSlot[]> {
    const currentCampusMinutes = getCampusCurrentMinutes();
    const now = Date.now();

    // Check read-through cache if within TTL
    if (cachedSlots && (now - cachedSlotsTimestamp < SLOTS_CACHE_TTL_MS)) {
      return cachedSlots.map((s) => {
        const startMinutes = parseTimeToMinutes(s.startTime);
        const isPast = currentCampusMinutes >= startMinutes;
        const isFull = (s.currentBooked || 0) >= (s.maxCapacity || 60);
        const status: 'OPEN' | 'FULL' | 'CLOSED_TIME_PASSED' = isPast ? 'CLOSED_TIME_PASSED' : isFull ? 'FULL' : 'OPEN';
        return {
          ...s,
          isPast,
          isClosed: isPast || isFull,
          status,
        };
      });
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pickup_slots')
          .select('*')
          .eq('is_active', true)
          .order('start_time', { ascending: true });

        if (!error && data && data.length > 0) {
          const freshSlots: PickupSlot[] = data.map((d: any) => {
            const startMinutes = parseTimeToMinutes(d.start_time);
            const isPast = currentCampusMinutes >= startMinutes;
            const isFull = (d.current_booked || 0) >= (d.max_capacity || 60);
            const status: 'OPEN' | 'FULL' | 'CLOSED_TIME_PASSED' = isPast ? 'CLOSED_TIME_PASSED' : isFull ? 'FULL' : 'OPEN';
            return {
              id: d.id,
              label: d.label,
              startTime: d.start_time,
              endTime: d.end_time,
              maxCapacity: d.max_capacity || 60,
              currentBooked: d.current_booked || 0,
              availableSlots: Math.max(0, (d.max_capacity || 60) - (d.current_booked || 0)),
              isFull,
              isPast,
              isClosed: isPast || isFull,
              status,
              cafeteriaId: d.cafeteria_id,
              facultyReserved: d.faculty_reserved || 5,
            };
          });

          cachedSlots = freshSlots;
          cachedSlotsTimestamp = now;
          return freshSlots;
        }
      } catch (err) {
        console.warn('Supabase slots fetch fallback to local cache:', err);
      }
    }

    const localSlots: PickupSlot[] = Array.from(slotState.values()).map((slot) => {
      const startMinutes = parseTimeToMinutes(slot.startTime);
      const isPast = currentCampusMinutes >= startMinutes;
      const isFull = (slot.currentBooked || 0) >= (slot.maxCapacity || 60);
      const status: 'OPEN' | 'FULL' | 'CLOSED_TIME_PASSED' = isPast ? 'CLOSED_TIME_PASSED' : isFull ? 'FULL' : 'OPEN';
      return {
        ...slot,
        isPast,
        isClosed: isPast || isFull,
        status,
      };
    });

    cachedSlots = localSlots;
    cachedSlotsTimestamp = now;
    return localSlots;
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

    // Invalidate cached slots immediately
    SlotThrottlerService.invalidateCache();

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

      // Async persist to Supabase only if configured and slotId is a valid UUID
      if (isSupabaseConfigured && isValidUuid(slotId)) {
        supabase
          .from('pickup_slots')
          .update({ current_booked: slot.currentBooked })
          .eq('id', slotId)
          .then(({ error }) => {
            if (error) {
              console.error(`[SlotThrottler] Failed to persist reservation for ${slotId}:`, error.message);
            }
          });
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

      // Invalidate cached slots immediately
      SlotThrottlerService.invalidateCache();

      if (isSupabaseConfigured && isValidUuid(slotId)) {
        supabase
          .from('pickup_slots')
          .update({ current_booked: slot.currentBooked })
          .eq('id', slotId)
          .then(({ error }) => {
            if (error) {
              console.error(`[SlotThrottler] Failed to persist release for ${slotId}:`, error.message);
            }
          });
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
