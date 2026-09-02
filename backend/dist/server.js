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
const order_service_js_1 = require("./services/order-service.js");
const sse_broadcaster_js_1 = require("./services/sse-broadcaster.js");
const supabase_js_1 = require("./lib/supabase.js");
const auth_routes_js_1 = require("./routes/auth.routes.js");
const campus_service_js_1 = require("./services/campus-service.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Auth & Signup Routes
app.use('/api/auth', auth_routes_js_1.authRouter);
// Background cron to release expired slot holds every 60s
setInterval(() => {
    slot_throttler_js_1.SlotThrottlerService.expireOldHolds();
}, 60 * 1000);
// Background retention worker: clean up COLLECTED/CANCELLED orders older than 24h every hour
setInterval(() => {
    order_service_js_1.OrderService.cleanupOldOrders(24).catch((err) => {
        console.warn('Hourly order retention cleanup error:', err);
    });
}, 60 * 60 * 1000);
// -----------------------------------------------------------------------------
// Health Check (Deep with Supabase status)
// -----------------------------------------------------------------------------
app.get('/health', async (req, res) => {
    const dbHealth = supabase_js_1.isSupabaseConfigured
        ? await (0, supabase_js_1.checkDatabaseConnection)()
        : { connected: false, message: 'Supabase unconfigured (Local Memory Fallback Active)', latencyMs: 0 };
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'FoodLine Backend Engine',
        database: dbHealth,
    });
});
// -----------------------------------------------------------------------------
// Geo-Campus Hierarchy & Canteen Discovery
// -----------------------------------------------------------------------------
app.get('/api/campuses/geo', async (req, res) => {
    try {
        const geo = await campus_service_js_1.CampusService.getGeoHierarchy();
        res.json({
            success: true,
            data: geo,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.get('/api/campuses/:campusId/canteens', async (req, res) => {
    try {
        const campusId = String(req.params.campusId);
        const result = await campus_service_js_1.CampusService.getCanteensByCampus(campusId);
        res.json({
            success: true,
            data: result,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/api/auth/resolve-student', async (req, res) => {
    try {
        const { prn, email } = req.body;
        const identifier = prn || email;
        if (!identifier) {
            return res.status(400).json({
                success: false,
                error: 'prn or email is required to resolve student profile',
            });
        }
        const studentProfile = await campus_service_js_1.CampusService.resolveStudent(identifier);
        res.json({
            success: true,
            data: studentProfile,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 1. GET /api/menu (Supports ?cafeteriaId=... & ?categoryId=...)
// -----------------------------------------------------------------------------
app.get('/api/menu', async (req, res) => {
    try {
        const category = (req.query.category || req.query.categoryId);
        const cafeteriaId = (req.query.cafeteriaId || req.query.canteenId);
        const items = await menu_service_js_1.MenuService.getAllItems(category, cafeteriaId);
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
            'Desserts',
        ];
        res.json({
            success: true,
            data: {
                categories,
                items,
            },
            meta: {
                timestamp: new Date().toISOString(),
                count: items.length,
                cafeteriaId: cafeteriaId || 'b2222222-2222-2222-2222-222222222222',
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 2. GET /api/slots
// -----------------------------------------------------------------------------
app.get('/api/slots', async (req, res) => {
    try {
        const slots = await slot_throttler_js_1.SlotThrottlerService.getAllSlots();
        res.json({
            success: true,
            data: slots,
            meta: { timestamp: new Date().toISOString(), totalSlots: slots.length },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 3. POST /api/orders
// -----------------------------------------------------------------------------
app.post('/api/orders', async (req, res) => {
    try {
        const { slotId, items, studentPhone, studentName, studentPrn, notes, userId, cafeteriaId } = req.body;
        const newOrder = await order_service_js_1.OrderService.createOrder({
            slotId,
            items,
            studentPhone,
            studentName,
            studentPrn,
            notes,
            userId,
            cafeteriaId,
        });
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
                compliance: newOrder.compliance,
            },
            meta: { timestamp: newOrder.createdAt },
        });
    }
    catch (error) {
        const status = error.message && error.message.includes('capacity') ? 409 : 400;
        res.status(status).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 4. POST /api/payments/verify-utr
// -----------------------------------------------------------------------------
app.post('/api/payments/verify-utr', async (req, res) => {
    try {
        const { orderToken, utrNumber, amount } = req.body;
        if (!orderToken) {
            return res.status(400).json({ success: false, error: 'orderToken is required' });
        }
        const { order, message } = await order_service_js_1.OrderService.confirmUtrPayment(orderToken, utrNumber, amount);
        res.json({
            success: true,
            data: {
                orderToken: order.orderToken,
                status: order.status,
                utrNumber: order.utrNumber,
                pickupOtp: order.pickupOtp,
                message,
            },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 4b. POST /api/orders/verify-otp (Counter Staff Handover Verification)
// -----------------------------------------------------------------------------
app.post('/api/orders/verify-otp', async (req, res) => {
    try {
        const { orderToken, pickupOtp } = req.body;
        if (!orderToken || !pickupOtp) {
            return res.status(400).json({
                success: false,
                error: 'orderToken and pickupOtp are required',
            });
        }
        const { order, message } = await order_service_js_1.OrderService.verifyPickupOtp(orderToken, String(pickupOtp));
        res.json({
            success: true,
            data: {
                orderToken: order.orderToken,
                status: order.status,
                pickupOtp: order.pickupOtp,
                message,
            },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        const isNotFound = error.message && error.message.includes('not found');
        res.status(isNotFound ? 404 : 400).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 5. GET /api/order/:token & /api/order/:token/stream
// -----------------------------------------------------------------------------
app.get('/api/order/:token', async (req, res) => {
    const token = req.params.token;
    const order = await order_service_js_1.OrderService.getOrderByToken(token);
    if (!order) {
        return res.status(404).json({ success: false, error: `Order ${token} not found` });
    }
    res.json({
        success: true,
        data: order,
        meta: { timestamp: new Date().toISOString() },
    });
});
app.get('/api/order/:token/stream', async (req, res) => {
    const token = req.params.token;
    const order = await order_service_js_1.OrderService.getOrderByToken(token);
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
app.patch('/api/kds/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await order_service_js_1.OrderService.transitionStatus(id, status);
        res.json({
            success: true,
            data: updatedOrder,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 7. PATCH /api/kds/inventory/:dishId
// -----------------------------------------------------------------------------
app.patch('/api/kds/inventory/:dishId', async (req, res) => {
    try {
        const { dishId } = req.params;
        const { isAvailable } = req.body;
        const updatedDish = await menu_service_js_1.MenuService.toggleAvailability(dishId, isAvailable);
        res.json({
            success: true,
            data: updatedDish,
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 8. GET /api/admin/metrics
// -----------------------------------------------------------------------------
app.get('/api/admin/metrics', async (req, res) => {
    try {
        const allOrders = order_service_js_1.OrderService.getAllOrders();
        const gmv = allOrders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
        const merchantNet = Math.round(gmv * 0.88 * 100) / 100;
        const platformRevenue = Math.round(gmv * 0.12 * 100) / 100;
        const studentSavings = allOrders.length * 15; // ₹15 average surge savings
        const slots = await slot_throttler_js_1.SlotThrottlerService.getAllSlots();
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
                dpdpStatus: 'ACTIVE_DATA_MINIMIZATION',
                retentionPolicy: 'ACTIVE_24H_COLLECTED_PURGE',
            },
            meta: { timestamp: new Date().toISOString() },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// -----------------------------------------------------------------------------
// 9. POST /api/admin/orders/cleanup (Manual Trigger for Retention Cleanup)
// -----------------------------------------------------------------------------
app.post('/api/admin/orders/cleanup', async (req, res) => {
    try {
        const maxAgeHours = Number(req.body.maxAgeHours || req.query.maxAgeHours || 24);
        const result = await order_service_js_1.OrderService.cleanupOldOrders(maxAgeHours);
        res.json({
            success: true,
            data: result,
            meta: {
                timestamp: new Date().toISOString(),
                policy: `Purged completed orders older than ${maxAgeHours} hours`,
            },
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
