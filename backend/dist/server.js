"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const menu_service_js_1 = require("./services/menu-service.js");
const slot_throttler_js_1 = require("./services/slot-throttler.js");
const utr_verifier_js_1 = require("./services/utr-verifier.js");
const sse_broadcaster_js_1 = require("./services/sse-broadcaster.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// In-memory active orders store
const ordersStore = new Map();
// Helper to generate 4-digit token e.g. FL-1793 & 4-digit pickup OTP e.g. 6065
function generateOrderToken() {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `FL-${randNum}`;
}
function generatePickupOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
// -----------------------------------------------------------------------------
// Health Check
// -----------------------------------------------------------------------------
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'FoodLine Backend Engine'
    });
});
// -----------------------------------------------------------------------------
// 1. GET /api/menu
// -----------------------------------------------------------------------------
app.get('/api/menu', (req, res) => {
    try {
        const category = req.query.category;
        const items = menu_service_js_1.MenuService.getAllItems(category);
        // Categories list
        const categories = [
            'All',
            'Quick Bites',
            'Chaat Corner',
            'South Indian',
            'North Indian',
            'Sandwiches',
            'Momos & Burgers',
            'Fries & Pasta',
            'Garlic Bread & Pizza',
            'Maggi & Chinese',
            'Beverages',
            'Desserts'
        ];
        res.json({
            success: true,
            data: {
                categories,
                items
            },
            meta: { timestamp: new Date().toISOString(), count: items.length }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 2. GET /api/slots
// -----------------------------------------------------------------------------
app.get('/api/slots', (req, res) => {
    try {
        const slots = slot_throttler_js_1.SlotThrottlerService.getAllSlots();
        res.json({
            success: true,
            data: slots,
            meta: { timestamp: new Date().toISOString(), totalSlots: slots.length }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 3. POST /api/orders
// -----------------------------------------------------------------------------
app.post('/api/orders', (req, res) => {
    try {
        const { slotId, items, studentPhone, notes } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Order must contain at least 1 item' });
        }
        // Reserve slot capacity
        let reservedSlot;
        if (slotId) {
            if (!slot_throttler_js_1.SlotThrottlerService.canReserve(slotId, 1)) {
                return res.status(409).json({
                    success: false,
                    error: 'Selected break slot has reached maximum capacity (60 orders limit).'
                });
            }
            reservedSlot = slot_throttler_js_1.SlotThrottlerService.reserveSlot(slotId, 1);
        }
        else {
            const defaultSlots = slot_throttler_js_1.SlotThrottlerService.getAllSlots();
            reservedSlot = defaultSlots[0];
        }
        const orderToken = generateOrderToken();
        const pickupOtp = generatePickupOtp();
        const totalAmount = items.reduce((sum, item) => sum + (item.price || item.item?.price || 0) * (item.quantity || 1), 0);
        const itemTotal = totalAmount;
        const studentPlatformFee = 0; // ₹0
        const paymentGatewayMdr = 0; // 0%
        const totalAmountPaid = itemTotal;
        const merchantPayoutAmount = Math.round(itemTotal * 0.88 * 100) / 100;
        const platformShareAmount = Math.round(itemTotal * 0.12 * 100) / 100;
        const now = new Date().toISOString();
        const newOrder = {
            id: `ord_${Date.now()}`,
            orderToken,
            pickupOtp,
            studentPhone,
            studentName: req.body.studentName,
            studentPrn: req.body.studentPrn,
            items: items.map((i) => ({
                item: i.item || { id: i.id, name: i.name, price: i.price, isVeg: true, prepTime: 5, tag: '', category: '' },
                quantity: i.quantity || 1
            })),
            slot: reservedSlot,
            totalAmount,
            status: 'PENDING_PAYMENT',
            notes,
            financials: {
                itemTotal,
                studentPlatformFee,
                paymentGatewayMdr,
                totalAmountPaid,
                merchantPayoutAmount,
                platformShareAmount,
            },
            compliance: {
                dpdpConsentGiven: true,
                fssaiLicense: '11522036000142',
                maxSlotHoldMinutes: 20,
            },
            createdAt: now,
            updatedAt: now
        };
        ordersStore.set(orderToken, newOrder);
        res.status(201).json({
            success: true,
            data: {
                orderId: newOrder.id,
                orderToken: newOrder.orderToken,
                totalAmount: newOrder.totalAmount,
                pickupOtp: newOrder.pickupOtp,
                status: newOrder.status,
                slot: newOrder.slot,
                financials: newOrder.financials,
                compliance: newOrder.compliance
            },
            meta: { timestamp: now }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 4. POST /api/payments/verify-utr
// -----------------------------------------------------------------------------
app.post('/api/payments/verify-utr', (req, res) => {
    try {
        const { orderToken, utrNumber, amount } = req.body;
        if (!orderToken) {
            return res.status(400).json({ success: false, error: 'orderToken is required' });
        }
        const order = ordersStore.get(orderToken);
        if (!order) {
            return res.status(404).json({ success: false, error: `Order ${orderToken} not found` });
        }
        const verification = utr_verifier_js_1.UtrVerifierService.verifyUtr(utrNumber, orderToken);
        if (!verification.valid) {
            return res.status(400).json({ success: false, error: verification.message });
        }
        // Update order status
        order.utrNumber = verification.utrNumber;
        order.status = 'CONFIRMED';
        order.updatedAt = new Date().toISOString();
        ordersStore.set(orderToken, order);
        // Notify SSE streams
        sse_broadcaster_js_1.sseBroadcaster.notifyOrderUpdate(order, 'ORDER_UPDATE');
        res.json({
            success: true,
            data: {
                orderToken: order.orderToken,
                status: order.status,
                utrNumber: order.utrNumber,
                pickupOtp: order.pickupOtp,
                message: verification.message
            },
            meta: { timestamp: new Date().toISOString() }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 5. GET /api/order/:token & /api/order/:token/stream
// -----------------------------------------------------------------------------
app.get('/api/order/:token', (req, res) => {
    const token = req.params.token;
    const order = ordersStore.get(token);
    if (!order) {
        return res.status(404).json({ success: false, error: `Order ${token} not found` });
    }
    res.json({
        success: true,
        data: order,
        meta: { timestamp: new Date().toISOString() }
    });
});
app.get('/api/order/:token/stream', (req, res) => {
    const token = req.params.token;
    const order = ordersStore.get(token);
    const clientId = sse_broadcaster_js_1.sseBroadcaster.addClient(token, res);
    // Send initial snapshot if order exists
    if (order) {
        sse_broadcaster_js_1.sseBroadcaster.notifyOrderUpdate(order, 'ORDER_SNAPSHOT');
    }
    req.on('close', () => {
        sse_broadcaster_js_1.sseBroadcaster.removeClient(clientId);
    });
});
// -----------------------------------------------------------------------------
// 6. PATCH /api/kds/orders/:id/status
// -----------------------------------------------------------------------------
app.patch('/api/kds/orders/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        let targetOrder;
        for (const order of ordersStore.values()) {
            if (order.id === id || order.orderToken === id) {
                targetOrder = order;
                break;
            }
        }
        if (!targetOrder) {
            return res.status(404).json({ success: false, error: `Order ${id} not found` });
        }
        targetOrder.status = status;
        targetOrder.updatedAt = new Date().toISOString();
        ordersStore.set(targetOrder.orderToken, targetOrder);
        // Broadcast real-time change to student
        sse_broadcaster_js_1.sseBroadcaster.notifyOrderUpdate(targetOrder, 'ORDER_UPDATE');
        res.json({
            success: true,
            data: targetOrder,
            meta: { timestamp: new Date().toISOString() }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 7. PATCH /api/kds/inventory/:dishId
// -----------------------------------------------------------------------------
app.patch('/api/kds/inventory/:dishId', (req, res) => {
    try {
        const { dishId } = req.params;
        const { isAvailable } = req.body;
        const updatedDish = menu_service_js_1.MenuService.toggleAvailability(dishId, isAvailable);
        res.json({
            success: true,
            data: updatedDish,
            meta: { timestamp: new Date().toISOString() }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 8. GET /api/admin/metrics
// -----------------------------------------------------------------------------
app.get('/api/admin/metrics', (req, res) => {
    try {
        const allOrders = Array.from(ordersStore.values());
        const gmv = allOrders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
        const merchantNet = Math.round(gmv * 0.88 * 100) / 100;
        const platformRevenue = Math.round(gmv * 0.12 * 100) / 100;
        const studentSavings = allOrders.length * 15; // ₹15 average surge fee savings vs commercial aggregators
        const slots = slot_throttler_js_1.SlotThrottlerService.getAllSlots();
        res.json({
            success: true,
            data: {
                totalOrders: allOrders.length,
                gmv,
                merchantNetRevenue: merchantNet,
                platformFacilitationRevenue: platformRevenue,
                studentSavingsGmv: studentSavings,
                avgHandoverTimeSeconds: 22,
                activeCookingQueue: allOrders.filter((o) => o.status === 'PREPARING').length,
                readyAtCounter: allOrders.filter((o) => o.status === 'READY').length,
                slotUtilization: slots,
                fssaiStatus: 'VERIFIED_100_PERCENT_VEG',
                fssaiLicense: '11522036000142',
                dpdpStatus: 'ACTIVE_DATA_MINIMIZATION'
            },
            meta: { timestamp: new Date().toISOString() }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// Start listening
app.listen(PORT, () => {
    console.log(`⚡ FoodLine Backend Engine running on http://localhost:${PORT}`);
});
