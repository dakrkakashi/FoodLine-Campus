import { PickupSlot } from '../lib/types.js';
import campusData from '../data/campus.json';

// In-memory slot state synchronized with 60-cap limit
const slotState: Map<string, PickupSlot> = new Map();

// Initialize from campus json
for (const breakWindow of campusData.breaks) {
  for (const slot of breakWindow.slots) {
    slotState.set(slot.id, {
      id: slot.id,
      label: slot.label,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCapacity: slot.maxCapacity,
      currentBooked: slot.currentBooked,
      availableSlots: Math.max(0, slot.maxCapacity - slot.currentBooked),
      isFull: slot.currentBooked >= slot.maxCapacity
    });
  }
}

export class SlotThrottlerService {
  public static getAllSlots(): PickupSlot[] {
    return Array.from(slotState.values());
  }

  public static getSlotById(slotId: string): PickupSlot | undefined {
    return slotState.get(slotId);
  }

  public static canReserve(slotId: string, quantity: number = 1): boolean {
    const slot = slotState.get(slotId);
    if (!slot) return false;
    return slot.currentBooked + quantity <= slot.maxCapacity;
  }

  public static reserveSlot(slotId: string, quantity: number = 1): PickupSlot {
    const slot = slotState.get(slotId);
    if (!slot) {
      throw new Error(`Slot with id ${slotId} not found`);
    }

    if (slot.currentBooked + quantity > slot.maxCapacity) {
      throw new Error(`Slot is full. Capacity reached: ${slot.currentBooked}/${slot.maxCapacity}`);
    }

    slot.currentBooked += quantity;
    slot.availableSlots = Math.max(0, slot.maxCapacity - slot.currentBooked);
    slot.isFull = slot.currentBooked >= slot.maxCapacity;

    slotState.set(slotId, slot);
    return slot;
  }

  public static releaseSlot(slotId: string, quantity: number = 1): PickupSlot {
    const slot = slotState.get(slotId);
    if (!slot) {
      throw new Error(`Slot with id ${slotId} not found`);
    }

    slot.currentBooked = Math.max(0, slot.currentBooked - quantity);
    slot.availableSlots = Math.max(0, slot.maxCapacity - slot.currentBooked);
    slot.isFull = slot.currentBooked >= slot.maxCapacity;

    slotState.set(slotId, slot);
    return slot;
  }
}
