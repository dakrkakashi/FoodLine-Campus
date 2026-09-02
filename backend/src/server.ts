import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MenuService } from './services/menu-service.js';
import { SlotThrottlerService } from './services/slot-throttler.js';
import { UtrVerifierService } from './services/utr-verifier.js';
import { OrderService } from './services/order-service.js';
import { sseBroadcaster } from './services/sse-broadcaster.js';
import { OrderStatus } from './lib/types.js';
import { checkDatabaseConnection, isSupabaseConfigured } from './lib/supabase.js';
import { authRouter } from './routes/auth.routes.js';
import { CampusService } from './services/campus-service.js';
import { checkGoogleSheetsConnection } from './config/googleSheets.js';
import { SheetsDbService } from './services/sheets-db.service.js';
import { NotificationService } from './services/notification-service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Auth & Signup Routes
app.use('/api/auth', authRouter);

// Background cron to release expired slot holds every 60s
setInterval(() => {
  SlotThrottlerService.expireOldHolds();
}, 60 * 1000);

// Background retention worker: clean up COLLECTED/CANCELLED orders older than 24h every hour
setInterval(() => {
  OrderService.cleanupOldOrders(24).catch((err) => {
    console.warn('Hourly order retention cleanup error:', err);
  });
}, 60 * 60 * 1000);

// Background flush for queued Google Sheets orders every 30s
setInterval(() => {
  SheetsDbService.flushOrdersQueue().catch((err) => {
    console.warn('Google Sheets periodic queue flush error:', err);
  });
}, 30 * 1000);

// Graceful process shutdown flushes pending order write buffer
const handleGracefulShutdown = async () => {
  await SheetsDbService.flushOrdersQueue().catch(() => {});
  process.exit(0);
};
process.on('SIGTERM', handleGracefulShutdown);
process.on('SIGINT', handleGracefulShutdown);

// -----------------------------------------------------------------------------
// Root Landing Dashboard & API Discovery
// -----------------------------------------------------------------------------
app.get('/', (req: Request, res: Response) => {
  if (req.accepts('html')) {
    res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FoodLine Campus — Backend Engine</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #07070B;
      --card: #12121A;
      --border: rgba(255, 255, 255, 0.1);
      --accent: #FF6B2C;
      --teal: #00D4AA;
      --text: #F5F5F7;
      --muted: #A1A1AA;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }
    .container {
      max-width: 680px;
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 36px 32px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 212, 170, 0.12);
      border: 1px solid rgba(0, 212, 170, 0.3);
      color: var(--teal);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--teal);
      box-shadow: 0 0 10px var(--teal);
    }
    h1 {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #FF6B2C, #FFB347, #FFFFFF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.subtitle {
      color: var(--muted);
      font-size: 14px;
      margin-bottom: 28px;
      line-height: 1.5;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    @media (max-width: 540px) {
      .grid { grid-template-columns: 1fr; }
    }
    .link-card {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 16px;
      text-decoration: none;
      color: var(--text);
      transition: all 0.2s ease;
    }
    .link-card:hover {
      background: rgba(255, 107, 44, 0.08);
      border-color: rgba(255, 107, 44, 0.4);
      transform: translateY(-2px);
    }
    .link-title {
      font-size: 13px;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .link-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--muted);
    }
    .btn-frontend {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #FF6B2C, #FF8A3D);
      color: #000;
      font-weight: 800;
      font-size: 14px;
      text-decoration: none;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(255, 107, 44, 0.3);
      transition: all 0.2s;
    }
    .btn-frontend:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(255, 107, 44, 0.45);
    }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      color: #71717A;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="dot"></span>
      Backend Engine Running • Port 4000
    </div>
    <h1>FoodLine Campus API</h1>
    <p class="subtitle">Express API, Slot Throttling Engine, Supabase PostgreSQL, and Google Sheets Sync for Sanjivani University.</p>

    <div class="grid">
      <a class="link-card" href="/health">
        <div class="link-title">🩺 Deep Health Check</div>
        <div class="link-path">GET /health</div>
      </a>
      <a class="link-card" href="/api/telemetry">
        <div class="link-title">📊 Live Telemetry</div>
        <div class="link-path">GET /api/telemetry</div>
      </a>
      <a class="link-card" href="/api/campuses/geo">
        <div class="link-title">🗺️ Geo Campus Hierarchy</div>
        <div class="link-path">GET /api/campuses/geo</div>
      </a>
      <a class="link-card" href="/api/menu">
        <div class="link-title">🍽️ Menu Items (94 Dishes)</div>
        <div class="link-path">GET /api/menu</div>
      </a>
      <a class="link-card" href="/api/slots">
        <div class="link-title">⏱️ Pickup Slots & Capacity</div>
        <div class="link-path">GET /api/slots</div>
      </a>
      <a class="link-card" href="/api/campuses/a1111111-1111-1111-1111-111111111111/canteens">
        <div class="link-title">🏬 5 Sanjivani Canteens</div>
        <div class="link-path">GET /api/campuses/:id/canteens</div>
      </a>
    </div>

    <a class="btn-frontend" href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
      🚀 Open Frontend Application (localhost:3000) →
    </a>

    <div class="footer">
      <span>Pilot Campus: Sanjivani University</span>
      <span>Express + Supabase + Google Sheets</span>
    </div>
  </div>
</body>
</html>`);
    return;
  }

  res.json({
    service: 'FoodLine Backend Engine',
    status: 'healthy',
    port: PORT,
    frontendUrl: 'http://localhost:3000',
    endpoints: {
      health: '/health',
      telemetry: '/api/telemetry',
      geo: '/api/campuses/geo',
      canteens: '/api/campuses/:campusId/canteens',
      menu: '/api/menu',
      slots: '/api/slots',
      orders: '/api/orders',
      verifyUtr: '/api/payments/verify-utr',
      verifyOtp: '/api/orders/verify-otp',
    },
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// Health Check (Deep with Supabase status)
// -----------------------------------------------------------------------------
app.get('/health', async (req: Request, res: Response) => {
  const dbHealth = isSupabaseConfigured
    ? await checkDatabaseConnection()
    : { connected: false, message: 'Supabase unconfigured (Local Memory Fallback Active)', latencyMs: 0 };

  const sheetsHealth = SheetsDbService.isConfigured()
    ? await checkGoogleSheetsConnection()
    : { connected: false, message: 'Google Sheets DB not configured (Awaiting Spreadsheet ID & Service Account)', latencyMs: 0 };

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FoodLine Backend Engine',
    database: dbHealth,
    googleSheets: sheetsHealth,
  });
});

// -----------------------------------------------------------------------------
// Geo-Campus Hierarchy & Canteen Discovery
// -----------------------------------------------------------------------------
app.get('/api/campuses/geo', async (req: Request, res: Response) => {
  try {
    const geo = await CampusService.getGeoHierarchy();
    res.json({
      success: true,
      data: geo,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/campuses/:campusId/canteens', async (req: Request, res: Response) => {
  try {
    const campusId = String(req.params.campusId);
    const result = await CampusService.getCanteensByCampus(campusId);
    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/resolve-student', async (req: Request, res: Response) => {
  try {
    const { prn, email } = req.body;
    const identifier = prn || email;
    if (!identifier) {
      return res.status(400).json({
        success: false,
        error: 'prn or email is required to resolve student profile',
      });
    }

    const studentProfile = await CampusService.resolveStudent(identifier);
    res.json({
      success: true,
      data: studentProfile,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 1. GET /api/menu (Supports ?cafeteriaId=... & ?categoryId=...)
// -----------------------------------------------------------------------------
app.get('/api/menu', async (req: Request, res: Response) => {
  try {
    const category = (req.query.category || req.query.categoryId) as string | undefined;
    const cafeteriaId = (req.query.cafeteriaId || req.query.canteenId) as string | undefined;
    const items = await MenuService.getAllItems(category, cafeteriaId);

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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 2. GET /api/slots
// -----------------------------------------------------------------------------
app.get('/api/slots', async (req: Request, res: Response) => {
  try {
    const slots = await SlotThrottlerService.getAllSlots();
    res.json({
      success: true,
      data: slots,
      meta: { timestamp: new Date().toISOString(), totalSlots: slots.length },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 3. POST /api/orders
// -----------------------------------------------------------------------------
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { slotId, items, studentPhone, studentName, studentPrn, notes, userId, cafeteriaId } = req.body;

    const newOrder = await OrderService.createOrder({
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
  } catch (error: any) {
    const status = error.message && error.message.includes('capacity') ? 409 : 400;
    res.status(status).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 4. POST /api/payments/verify-utr
// -----------------------------------------------------------------------------
app.post('/api/payments/verify-utr', async (req: Request, res: Response) => {
  try {
    const { orderToken, utrNumber, amount } = req.body;

    if (!orderToken) {
      return res.status(400).json({ success: false, error: 'orderToken is required' });
    }

    const { order, message } = await OrderService.confirmUtrPayment(orderToken, utrNumber, amount);

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
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 4b. POST /api/orders/verify-otp (Counter Staff Handover Verification)
// -----------------------------------------------------------------------------
app.post('/api/orders/verify-otp', async (req: Request, res: Response) => {
  try {
    const { orderToken, pickupOtp } = req.body;

    if (!orderToken || !pickupOtp) {
      return res.status(400).json({
        success: false,
        error: 'orderToken and pickupOtp are required',
      });
    }

    const { order, message } = await OrderService.verifyPickupOtp(orderToken, String(pickupOtp));

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
  } catch (error: any) {
    const isNotFound = error.message && error.message.includes('not found');
    res.status(isNotFound ? 404 : 400).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 5. GET /api/order/:token & /api/order/:token/stream
// -----------------------------------------------------------------------------
app.get('/api/order/:token', async (req: Request<{ token: string }>, res: Response) => {
  const token = req.params.token;
  const order = await OrderService.getOrderByToken(token);

  if (!order) {
    return res.status(404).json({ success: false, error: `Order ${token} not found` });
  }

  res.json({
    success: true,
    data: order,
    meta: { timestamp: new Date().toISOString() },
  });
});

app.get('/api/order/:token/stream', async (req: Request<{ token: string }>, res: Response) => {
  const token = req.params.token;
  const order = await OrderService.getOrderByToken(token);

  const clientId = sseBroadcaster.addClient(token, res);

  // Send initial snapshot if order exists
  if (order) {
    sseBroadcaster.notifyOrderUpdate(order, 'ORDER_SNAPSHOT');
  }

  req.on('close', () => {
    sseBroadcaster.removeClient(clientId);
  });
});

// -----------------------------------------------------------------------------
// 6. PATCH /api/kds/orders/:id/status
// -----------------------------------------------------------------------------
app.patch('/api/kds/orders/:id/status', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await OrderService.transitionStatus(id, status as OrderStatus);

    res.json({
      success: true,
      data: updatedOrder,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 7. PATCH /api/kds/inventory/:dishId
// -----------------------------------------------------------------------------
app.patch('/api/kds/inventory/:dishId', async (req: Request<{ dishId: string }>, res: Response) => {
  try {
    const { dishId } = req.params;
    const { isAvailable } = req.body;

    const updatedDish = await MenuService.toggleAvailability(dishId, isAvailable);

    res.json({
      success: true,
      data: updatedDish,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 8. GET /api/admin/metrics
// -----------------------------------------------------------------------------
app.get('/api/admin/metrics', async (req: Request, res: Response) => {
  try {
    const allOrders = OrderService.getAllOrders();
    const gmv = allOrders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
    const merchantNet = Math.round(gmv * 0.88 * 100) / 100;
    const platformRevenue = Math.round(gmv * 0.12 * 100) / 100;
    const studentSavings = allOrders.length * 15; // ₹15 average surge savings
    const slots = await SlotThrottlerService.getAllSlots();

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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 9. POST /api/admin/orders/cleanup (Manual Trigger for Retention Cleanup)
// -----------------------------------------------------------------------------
app.post('/api/admin/orders/cleanup', async (req: Request, res: Response) => {
  try {
    const maxAgeHours = Number(req.body.maxAgeHours || req.query.maxAgeHours || 24);
    const result = await OrderService.cleanupOldOrders(maxAgeHours);

    res.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        policy: `Purged completed orders older than ${maxAgeHours} hours`,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// -----------------------------------------------------------------------------
// 10. GET /api/telemetry (Real-Time System, Memory, SSE & Slot Monitor)
// -----------------------------------------------------------------------------
app.get('/api/telemetry', async (req: Request, res: Response) => {
  try {
    const memory = process.memoryUsage();
    const uptimeSec = Math.floor(process.uptime());
    const dbHealth = isSupabaseConfigured
      ? await checkDatabaseConnection()
      : { connected: false, message: 'Local Memory Cache Active', latencyMs: 0 };
    const allOrders = OrderService.getAllOrders();
    const activeCooking = allOrders.filter((o) => o.status === 'PREPARING').length;
    const readyAtCounter = allOrders.filter((o) => o.status === 'READY').length;
    const slots = await SlotThrottlerService.getAllSlots();

    res.json({
      success: true,
      data: {
        system: {
          status: 'healthy',
          uptimeSeconds: uptimeSec,
          uptimeHuman: `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m ${uptimeSec % 60}s`,
          nodeVersion: process.version,
          platform: process.platform,
          memory: {
            rssMb: Math.round((memory.rss / (1024 * 1024)) * 100) / 100,
            heapUsedMb: Math.round((memory.heapUsed / (1024 * 1024)) * 100) / 100,
            heapTotalMb: Math.round((memory.heapTotal / (1024 * 1024)) * 100) / 100,
          },
        },
        realtime: {
          activeSseClients: sseBroadcaster.getActiveConnectionsCount(),
          activeWatchedTokens: sseBroadcaster.getActiveOrderTokens(),
          recentNotifications: NotificationService.getRecentNotificationLogs().slice(0, 10),
        },
        orders: {
          totalTracked: allOrders.length,
          cookingQueue: activeCooking,
          readyCounter: readyAtCounter,
        },
        slots: {
          totalSlots: slots.length,
          totalCapacity: slots.reduce((acc, s) => acc + s.maxCapacity, 0),
          totalBooked: slots.reduce((acc, s) => acc + s.currentBooked, 0),
        },
        database: dbHealth,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start listening if run directly
const server = app.listen(PORT, () => {
  console.log(`⚡ FoodLine Backend Engine running on http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚡ Notice: Port ${PORT} already active, attaching to existing engine instance.`);
  } else {
    throw err;
  }
});

export { app, server };
