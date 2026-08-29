"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotThrottlerService = void 0;
const campus_json_1 = __importDefault(require("../data/campus.json"));
// In-memory slot state synchronized with 60-cap limit
const slotState = new Map();
// Initialize from campus json
for (const breakWindow of campus_json_1.default.breaks) {
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
class SlotThrottlerService {
    static getAllSlots() {
        return Array.from(slotState.values());
    }
    static getSlotById(slotId) {
        return slotState.get(slotId);
    }
    static canReserve(slotId, quantity = 1) {
        const slot = slotState.get(slotId);
        if (!slot)
            return false;
        return slot.currentBooked + quantity <= slot.maxCapacity;
    }
    static reserveSlot(slotId, quantity = 1) {
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
    static releaseSlot(slotId, quantity = 1) {
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
exports.SlotThrottlerService = SlotThrottlerService;
