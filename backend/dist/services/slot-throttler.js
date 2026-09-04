"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotThrottlerService = void 0;
const campus_json_1 = __importDefault(require("../data/campus.json"));
const supabase_js_1 = require("../lib/supabase.js");
// In-memory slot state synchronized with 60-cap limit
const slotState = new Map();
const slotHolds = new Map();
function parseTimeToMinutes(timeStr) {
    if (!timeStr)
        return 0;
    const str = timeStr.trim().toUpperCase();
    const isPM = str.includes('PM');
    const isAM = str.includes('AM');
    const cleaned = str.replace(/[AP]M/, '').trim();
    const parts = cleaned.split(':');
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    if (isPM && hours < 12)
        hours += 12;
    else if (isAM && hours === 12)
        hours = 0;
    return hours * 60 + minutes;
}
function getCampusCurrentMinutes() {
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
for (const breakWindow of campus_json_1.default.breaks) {
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
class SlotThrottlerService {
    /**
     * Get all pickup slots with live capacity counts and auto-time closure
     */
    static async getAllSlots() {
        const currentCampusMinutes = getCampusCurrentMinutes();
        if (supabase_js_1.isSupabaseConfigured) {
            try {
                const { data, error } = await supabase_js_1.supabase
                    .from('pickup_slots')
                    .select('*')
                    .eq('is_active', true)
                    .order('start_time', { ascending: true });
                if (!error && data && data.length > 0) {
                    return data.map((d) => {
                        const startMinutes = parseTimeToMinutes(d.start_time);
                        const isPast = currentCampusMinutes >= startMinutes;
                        const isFull = (d.current_booked || 0) >= (d.max_capacity || 60);
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
                            status: isPast ? 'CLOSED_TIME_PASSED' : isFull ? 'FULL' : 'OPEN',
                            cafeteriaId: d.cafeteria_id,
                            facultyReserved: d.faculty_reserved || 5,
                        };
                    });
                }
            }
            catch (err) {
                console.warn('Supabase slots fetch fallback to local cache:', err);
            }
        }
        return Array.from(slotState.values()).map((slot) => {
            const startMinutes = parseTimeToMinutes(slot.startTime);
            const isPast = currentCampusMinutes >= startMinutes;
            const isFull = (slot.currentBooked || 0) >= (slot.maxCapacity || 60);
            return {
                ...slot,
                isPast,
                isClosed: isPast || isFull,
                status: isPast ? 'CLOSED_TIME_PASSED' : isFull ? 'FULL' : 'OPEN',
            };
        });
    }
    /**
     * Get slot by ID
     */
    static async getSlotById(slotId) {
        const slots = await SlotThrottlerService.getAllSlots();
        return slots.find((s) => s.id === slotId) || slotState.get(slotId);
    }
    /**
     * Check capacity before booking
     */
    static canReserve(slotId, quantity = 1) {
        const slot = slotState.get(slotId);
        if (!slot)
            return true; // allow if dynamic UUID
        return slot.currentBooked + quantity <= slot.maxCapacity;
    }
    /**
     * Atomically reserve slot capacity and record 10-minute hold
     */
    static async reserveSlot(slotId, quantity = 1, orderId) {
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
            const hold = {
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
            if (supabase_js_1.isSupabaseConfigured) {
                supabase_js_1.supabase
                    .from('pickup_slots')
                    .update({ current_booked: slot.currentBooked })
                    .eq('id', slotId)
                    .then(() => { });
            }
        }
        return slot;
    }
    /**
     * Release reserved slot capacity
     */
    static async releaseSlot(slotId, quantity = 1, orderId) {
        const slot = slotState.get(slotId);
        if (slot) {
            slot.currentBooked = Math.max(0, slot.currentBooked - quantity);
            slot.availableSlots = Math.max(0, slot.maxCapacity - slot.currentBooked);
            slot.isFull = slot.currentBooked >= slot.maxCapacity;
            slotState.set(slotId, slot);
            if (supabase_js_1.isSupabaseConfigured) {
                supabase_js_1.supabase
                    .from('pickup_slots')
                    .update({ current_booked: slot.currentBooked })
                    .eq('id', slotId)
                    .then(() => { });
            }
        }
        if (orderId && slotHolds.has(orderId)) {
            const hold = slotHolds.get(orderId);
            hold.isReleased = true;
            slotHolds.set(orderId, hold);
        }
        return slot;
    }
    /**
     * Periodic garbage collector to release expired holds
     */
    static expireOldHolds() {
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
exports.SlotThrottlerService = SlotThrottlerService;
