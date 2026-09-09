import { describe, it, expect, beforeEach } from 'vitest';
import { SlotThrottlerService } from '../src/services/slot-throttler.js';

describe('SlotThrottlerService — Concurrency & 60-Order Slot Throttling', () => {
  const testSlotId = 'test-slot-' + Math.random().toString(36).substring(2, 8);

  it('should allow reservation when capacity is within limit', () => {
    const canReserve = SlotThrottlerService.canReserve(testSlotId, 1);
    expect(canReserve).toBe(true);
  });

  it('should reserve slot atomically and decrement available slots', async () => {
    const reserved = await SlotThrottlerService.reserveSlot(testSlotId, 5, 'order-101');
    expect(reserved.currentBooked).toBe(5);
    expect(reserved.availableSlots).toBe(55);
    expect(reserved.isFull).toBe(false);
  });

  it('should enforce the strict 60-order max capacity limit', async () => {
    // Current is 5. Adding 55 brings to exactly 60
    const fullSlot = await SlotThrottlerService.reserveSlot(testSlotId, 55, 'order-102');
    expect(fullSlot.currentBooked).toBe(60);
    expect(fullSlot.availableSlots).toBe(0);
    expect(fullSlot.isFull).toBe(true);

    // Any further reservation MUST throw capacity reached error
    await expect(SlotThrottlerService.reserveSlot(testSlotId, 1, 'order-overflow')).rejects.toThrow(
      /maximum capacity/i
    );
  });

  it('should correctly release slot capacity upon hold expiration or cancellation', async () => {
    const released = await SlotThrottlerService.releaseSlot(testSlotId, 10);
    expect(released?.currentBooked).toBe(50);
    expect(released?.availableSlots).toBe(10);
    expect(released?.isFull).toBe(false);
  });

  it('should handle zero or negative edge-case releases safely', async () => {
    const released = await SlotThrottlerService.releaseSlot(testSlotId, 100);
    expect(released?.currentBooked).toBe(0);
    expect(released?.availableSlots).toBe(60);
  });
});
