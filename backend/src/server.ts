import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MenuService } from './services/menu-service.js';
import { SlotThrottlerService } from './services/slot-throttler.js';
import { UtrVerifierService } from './services/utr-verifier.js';
import { sseBroadcaster } from './services/sse-broadcaster.js';
import { Order, OrderStatus } from './lib/types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory active orders store
const ordersStore: Map<string, Order> = new Map();

// Helper to generate 4-digit token e.g. FL-1793 & 4-digit pickup OTP e.g. 6065
function generateOrderToken(): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `FL-${randNum}`;
}

function generatePickupOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// -----------------------------------------------------------------------------
// Health Check
// -----------------------------------------------------------------------------
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FoodLine Backend Engine'
  });
});

// -----------------------------------------------------------------------------
// 1. GET /api/menu
// -----------------------------------------------------------------------------
app.get('/api/menu', (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const items = MenuService.getAllItems(category);
    
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 2. GET /api/slots
// -----------------------------------------------------------------------------
app.get('/api/slots', (req: Request, res: Response) => {
  try {
    const slots = SlotThrottlerService.getAllSlots();
    res.json({
      success: true,
      data: slots,
      meta: { timestamp: new Date().toISOString(), totalSlots: slots.length }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 3. POST /api/orders
// -----------------------------------------------------------------------------
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { slotId, items, studentPhone, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least 1 item' });
    }

    // Reserve slot capacity
    let reservedSlot;
    if (slotId) {
      if (!SlotThrottlerService.canReserve(slotId, 1)) {
        return res.status(409).json({
          success: false,
          error: 'Selected break slot has reached maximum capacity (60 orders limit).'
        });
      }
      reservedSlot = SlotThrottlerService.reserveSlot(slotId, 1);
    } else {
      const defaultSlots = SlotThrottlerService.getAllSlots();
      reservedSlot = defaultSlots[0];
    }

    const orderToken = generateOrderToken();
    const pickupOtp = generatePickupOtp();
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (item.price || item.item?.price || 0) * (item.quantity || 1),
      0
    );

    const itemTotal = totalAmount;
    const studentPlatformFee = 0; // ₹0
    const paymentGatewayMdr = 0;   // 0%
    const totalAmountPaid = itemTotal;
    const merchantPayoutAmount = Math.round(itemTotal * 0.88 * 100) / 100;
    const platformShareAmount = Math.round(itemTotal * 0.12 * 100) / 100;

    const now = new Date().toISOString();
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderToken,
      pickupOtp,
      studentPhone,
      studentName: req.body.studentName,
      studentPrn: req.body.studentPrn,
      items: items.map((i: any) => ({
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 4. POST /api/payments/verify-utr
// -----------------------------------------------------------------------------
app.post('/api/payments/verify-utr', (req: Request, res: Response) => {
  try {
    const { orderToken, utrNumber, amount } = req.body;

    if (!orderToken) {
      return res.status(400).json({ success: false, error: 'orderToken is required' });
    }

    const order = ordersStore.get(orderToken);
    if (!order) {
      return res.status(404).json({ success: false, error: `Order ${orderToken} not found` });
    }

    const verification = UtrVerifierService.verifyUtr(utrNumber, orderToken);
    if (!verification.valid) {
      return res.status(400).json({ success: false, error: verification.message });
    }

    // Update order status
    order.utrNumber = verification.utrNumber;
    order.status = 'CONFIRMED';
    order.updatedAt = new Date().toISOString();
    ordersStore.set(orderToken, order);

    // Notify SSE streams
    sseBroadcaster.notifyOrderUpdate(order, 'ORDER_UPDATE');

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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 5. GET /api/order/:token & /api/order/:token/stream
// -----------------------------------------------------------------------------
app.get('/api/order/:token', (req: Request<{ token: string }>, res: Response) => {
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

app.get('/api/order/:token/stream', (req: Request<{ token: string }>, res: Response) => {
  const token = req.params.token;
  const order = ordersStore.get(token);

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
app.patch('/api/kds/orders/:id/status', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let targetOrder: Order | undefined;
    for (const order of ordersStore.values()) {
      if (order.id === id || order.orderToken === id) {
        targetOrder = order;
        break;
      }
    }

    if (!targetOrder) {
      return res.status(404).json({ success: false, error: `Order ${id} not found` });
    }

    targetOrder.status = status as OrderStatus;
    targetOrder.updatedAt = new Date().toISOString();
    ordersStore.set(targetOrder.orderToken, targetOrder);

    // Broadcast real-time change to student
    sseBroadcaster.notifyOrderUpdate(targetOrder, 'ORDER_UPDATE');

    res.json({
      success: true,
      data: targetOrder,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 7. PATCH /api/kds/inventory/:dishId
// -----------------------------------------------------------------------------
app.patch('/api/kds/inventory/:dishId', (req: Request<{ dishId: string }>, res: Response) => {
  try {
    const { dishId } = req.params;
    const { isAvailable } = req.body;

    const updatedDish = MenuService.toggleAvailability(dishId, isAvailable);

    res.json({
      success: true,
      data: updatedDish,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -----------------------------------------------------------------------------
// 8. GET /api/admin/metrics
// -----------------------------------------------------------------------------
app.get('/api/admin/metrics', (req: Request, res: Response) => {
  try {
    const allOrders = Array.from(ordersStore.values());
    const gmv = allOrders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
    const merchantNet = Math.round(gmv * 0.88 * 100) / 100;
    const platformRevenue = Math.round(gmv * 0.12 * 100) / 100;
    const studentSavings = allOrders.length * 15; // ₹15 average surge fee savings vs commercial aggregators
    const slots = SlotThrottlerService.getAllSlots();

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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`⚡ FoodLine Backend Engine running on http://localhost:${PORT}`);
});
