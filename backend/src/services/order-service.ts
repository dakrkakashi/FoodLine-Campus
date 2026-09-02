import { randomUUID } from 'crypto';
import { Order, OrderStatus, CartItem, PickupSlot } from '../lib/types.js';
import { SlotThrottlerService } from './slot-throttler.js';
import { UtrVerifierService } from './utr-verifier.js';
import { sseBroadcaster } from './sse-broadcaster.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { SheetsDbService } from './sheets-db.service.js';
import { NotificationService } from './notification-service.js';

// In-memory active orders store
const ordersStore: Map<string, Order> = new Map();
// Pruned order tokens cache for 24h retention compliance
const prunedOrderTokens: Set<string> = new Set();

export interface CreateOrderInput {
  slotId?: string;
  items: Array<{
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
    item?: any;
  }>;
  studentPhone?: string;
  studentName?: string;
  studentPrn?: string;
  notes?: string;
  userId?: string;
  cafeteriaId?: string;
  idempotencyKey?: string;
}

export class OrderService {
  /**
   * Helper to generate 4-digit token e.g. FL-1793
   */
  public static generateOrderToken(): string {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `FL-${randNum}`;
  }

  /**
   * Helper to generate 4-digit pickup OTP e.g. 6065
   */
  public static generatePickupOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Create a new order with atomic slot reservation
   */
  public static async createOrder(input: CreateOrderInput): Promise<Order> {
    const { slotId, items, studentPhone, studentName, studentPrn, notes, userId, cafeteriaId } = input;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Order must contain at least 1 item');
    }

    const orderId = randomUUID();
    const orderToken = OrderService.generateOrderToken();
    const pickupOtp = OrderService.generatePickupOtp();

    // 1. Reserve slot capacity
    let reservedSlot: PickupSlot;
    if (slotId) {
      if (!SlotThrottlerService.canReserve(slotId, 1)) {
        throw new Error('Selected break slot has reached maximum capacity (60 orders limit).');
      }
      reservedSlot = await SlotThrottlerService.reserveSlot(slotId, 1, orderId);
    } else {
      const defaultSlots = await SlotThrottlerService.getAllSlots();
      reservedSlot = defaultSlots[0] || {
        id: 'slot-default',
        label: 'Lunch Break (11:50 AM - 12:10 PM)',
        startTime: '11:50 AM',
        endTime: '12:10 PM',
        maxCapacity: 60,
        currentBooked: 1,
        availableSlots: 59,
        isFull: false,
      };
    }

    // 2. Financials calculation (88% merchant payout, 12% platform fee, ₹0 student fee)
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
    const formattedItems: CartItem[] = items.map((i: any) => ({
      item: i.item || {
        id: i.id || `dish_${Math.random()}`,
        name: i.name || 'Campus Dish',
        price: i.price || 0,
        isVeg: true,
        prepTime: 5,
        tag: '',
        category: 'Quick Bites',
      },
      quantity: i.quantity || 1,
    }));

    const newOrder: Order = {
      id: orderId,
      orderToken,
      pickupOtp,
      userId,
      cafeteriaId,
      studentPhone,
      studentName,
      studentPrn,
      items: formattedItems,
      slot: reservedSlot,
      totalAmount,
      status: 'PENDING_PAYMENT',
      notes,
      counterId: 'COUNTER_1',
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
      updatedAt: now,
    };

    // Store in memory
    ordersStore.set(orderToken, newOrder);

    // Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data: dbOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            id: orderId,
            order_token: orderToken,
            user_id: userId || null,
            cafeteria_id:
              cafeteriaId && cafeteriaId !== 'b2222222-2222-2222-2222-222222222222' && cafeteriaId.length === 36
                ? cafeteriaId
                : '754bd902-cafb-40a6-9cdd-96bc8760ad7f',
            slot_id:
              slotId && slotId !== 'd1111111-1111-1111-1111-111111111111' && slotId.length === 36
                ? slotId
                : '20e848cf-9d4e-490d-b01f-59cad15bb766',
            total_amount: totalAmount,
            status: 'PENDING_PAYMENT',
            pickup_otp: pickupOtp,
            notes: notes || null,
          })
          .select()
          .single();

        if (!orderError && dbOrder) {
          newOrder.id = dbOrder.id;
        } else if (orderError) {
          console.warn('Supabase order insert error:', orderError.message, orderError.details);
        }

        if (!orderError && dbOrder) {
          // Insert order items
          const orderItemsToInsert = formattedItems.map((fi) => ({
            order_id: dbOrder.id,
            menu_item_id: fi.item.id && fi.item.id.length === 36 ? fi.item.id : null,
            item_name: fi.item.name,
            quantity: fi.quantity,
            unit_price: fi.item.price,
            subtotal: fi.item.price * fi.quantity,
          }));

          await supabase.from('order_items').insert(orderItemsToInsert);
        }
      } catch (err) {
        console.warn('Supabase order creation fallback:', err);
      }
    }

    // 3. Persist directly to Google Sheets Orders Tab (No Google Form)
    if (SheetsDbService.isConfigured()) {
      const itemsSummary = formattedItems
        .map((fi) => `${fi.quantity}x ${fi.item.name} (₹${fi.item.price})`)
        .join(', ');

      SheetsDbService.appendOrder({
        orderId: orderToken,
        timestamp: now,
        prn: studentPrn || 'WALK_IN',
        name: studentName || 'Campus Student',
        items: itemsSummary,
        quantity: formattedItems.reduce((acc, curr) => acc + curr.quantity, 0),
        totalAmount,
        status: 'PENDING_PAYMENT',
      }).catch((err) => {
        console.warn('Google Sheets Orders append warning:', err);
      });
    }

    return newOrder;
  }

  /**
   * Fetch order by token
   */
  public static async getOrderByToken(token: string): Promise<Order | undefined> {
    if (prunedOrderTokens.has(token)) {
      return undefined;
    }

    const memoryOrder = ordersStore.get(token);
    if (memoryOrder) return memoryOrder;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*), pickup_slots(*)')
          .eq('order_token', token)
          .single();

        if (!error && data) {
          const isCompleted = data.status === 'COLLECTED' || data.status === 'CANCELLED';
          const updatedAtMs = new Date(data.updated_at || data.created_at).getTime();
          if (isCompleted && Date.now() - updatedAtMs > 24 * 60 * 60 * 1000) {
            prunedOrderTokens.add(token);
            return undefined;
          }
          const fetchedOrder: Order = {
            id: data.id,
            orderToken: data.order_token,
            pickupOtp: data.pickup_otp,
            userId: data.user_id,
            cafeteriaId: data.cafeteria_id,
            studentPhone: undefined,
            studentName: undefined,
            studentPrn: undefined,
            items: (data.order_items || []).map((oi: any) => ({
              item: {
                id: oi.menu_item_id || oi.id,
                name: oi.item_name,
                price: Number(oi.unit_price),
                category: 'Quick Bites',
                prepTime: 5,
                tag: '',
                isVeg: true,
              },
              quantity: oi.quantity,
            })),
            slot: data.pickup_slots
              ? {
                  id: data.pickup_slots.id,
                  label: data.pickup_slots.label,
                  startTime: data.pickup_slots.start_time,
                  endTime: data.pickup_slots.end_time,
                  maxCapacity: data.pickup_slots.max_capacity,
                  currentBooked: data.pickup_slots.current_booked,
                  availableSlots: data.pickup_slots.max_capacity - data.pickup_slots.current_booked,
                  isFull: data.pickup_slots.current_booked >= data.pickup_slots.max_capacity,
                }
              : {
                  id: 'slot-1',
                  label: 'Lunch Break (11:50 AM - 12:10 PM)',
                  startTime: '11:50 AM',
                  endTime: '12:10 PM',
                  maxCapacity: 60,
                  currentBooked: 1,
                  availableSlots: 59,
                  isFull: false,
                },
            totalAmount: Number(data.total_amount),
            status: data.status as OrderStatus,
            notes: data.notes,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
          ordersStore.set(token, fetchedOrder);
          return fetchedOrder;
        }
      } catch (err) {
        console.warn(`Supabase getOrderByToken error for ${token}:`, err);
      }
    }

    return undefined;
  }

  /**
   * Fetch all active orders
   */
  public static getAllOrders(): Order[] {
    return Array.from(ordersStore.values());
  }

  /**
   * Verify and confirm UTR payment
   */
  public static async confirmUtrPayment(
    orderToken: string,
    utrNumber: string,
    amount?: number
  ): Promise<{ order: Order; message: string }> {
    const order = await OrderService.getOrderByToken(orderToken);
    if (!order) {
      throw new Error(`Order ${orderToken} not found`);
    }

    const verification = await UtrVerifierService.recordPayment(
      order.id,
      utrNumber,
      amount || order.totalAmount,
      'UTR_MANUAL'
    );

    if (!verification.valid) {
      throw new Error(verification.message);
    }

    // Update order status
    order.utrNumber = verification.utrNumber;
    order.status = 'CONFIRMED';
    order.updatedAt = new Date().toISOString();
    ordersStore.set(orderToken, order);

    // Update database
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'CONFIRMED', updated_at: order.updatedAt })
          .eq('order_token', orderToken);
      } catch (err) {
        console.warn('Supabase confirm order update failed:', err);
      }
    }

    // Record verified payment to Google Sheets Payments tab
    if (SheetsDbService.isConfigured()) {
      SheetsDbService.recordPayment({
        timestamp: order.updatedAt,
        name: order.studentName || 'Campus Student',
        prn: order.studentPrn || 'PRN',
        utr: verification.utrNumber || utrNumber,
        orderId: orderToken,
        amount: amount || order.totalAmount,
        verificationStatus: 'VERIFIED',
      }).catch((err) => {
        console.warn('Google Sheets payment record warning:', err);
      });
    }

    // Notify SSE streams
    sseBroadcaster.notifyOrderUpdate(order, 'ORDER_UPDATE');

    return { order, message: verification.message };
  }

  /**
   * Transition order status (KDS)
   */
  public static async transitionStatus(
    idOrToken: string,
    newStatus: OrderStatus
  ): Promise<Order> {
    let targetOrder: Order | undefined;
    for (const order of ordersStore.values()) {
      if (order.id === idOrToken || order.orderToken === idOrToken) {
        targetOrder = order;
        break;
      }
    }

    if (!targetOrder) {
      targetOrder = await OrderService.getOrderByToken(idOrToken);
    }

    if (!targetOrder) {
      throw new Error(`Order ${idOrToken} not found`);
    }

    targetOrder.status = newStatus;
    targetOrder.updatedAt = new Date().toISOString();
    ordersStore.set(targetOrder.orderToken, targetOrder);

    // Update database
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: targetOrder.updatedAt })
          .or(`id.eq.${idOrToken},order_token.eq.${idOrToken}`);
      } catch (err) {
        console.warn('Supabase status transition update failed:', err);
      }
    }

    // Broadcast real-time change to student
    sseBroadcaster.notifyOrderUpdate(targetOrder, 'ORDER_UPDATE');

    // Trigger push notification, webhook, and sound alert if transitioning to READY
    if (newStatus === 'READY') {
      NotificationService.dispatchOrderReadyAlert(targetOrder).catch((err) => {
        console.warn(`[OrderService] Ready alert dispatch error:`, err);
      });
    }

    return targetOrder;
  }

  /**
   * Verify pickup OTP and complete order handover (Counter Staff)
   */
  public static async verifyPickupOtp(
    orderToken: string,
    pickupOtp: string
  ): Promise<{ order: Order; message: string }> {
    const order = await OrderService.getOrderByToken(orderToken);
    if (!order) {
      throw new Error(`Order ${orderToken} not found`);
    }

    if (order.status === 'COLLECTED') {
      throw new Error(`Order ${orderToken} has already been collected`);
    }

    if (order.pickupOtp !== pickupOtp.trim()) {
      throw new Error('Invalid 4-digit pickup OTP. Handover denied.');
    }

    // Mark collected
    order.status = 'COLLECTED';
    order.updatedAt = new Date().toISOString();
    ordersStore.set(orderToken, order);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'COLLECTED', updated_at: order.updatedAt })
          .eq('order_token', orderToken);
      } catch (err) {
        console.warn('Supabase verifyPickupOtp update failed:', err);
      }
    }

    // Broadcast SSE update
    sseBroadcaster.notifyOrderUpdate(order, 'ORDER_UPDATE');

    return {
      order,
      message: `Pickup verified! Order ${orderToken} successfully handed over.`,
    };
  }

  /**
   * Automated Data Retention & Audit Cleanup
   * Prunes completed (COLLECTED) and CANCELLED orders older than maxAgeHours (default 24h).
   * Upholds DPDP data minimization principles and maintains sub-20ms memory/database latency.
   */
  public static async cleanupOldOrders(maxAgeHours: number = 24): Promise<{
    cleanedCount: number;
    remainingOrders: number;
    cutoffTime: string;
    cleanedOrderTokens: string[];
  }> {
    const cutoffTimestamp = Date.now() - maxAgeHours * 60 * 60 * 1000;
    const cutoffTime = new Date(cutoffTimestamp).toISOString();
    const cleanedOrderTokens: string[] = [];

    // 1. Scan memory store
    for (const [token, order] of ordersStore.entries()) {
      const isCompleted = order.status === 'COLLECTED' || order.status === 'CANCELLED';
      const orderUpdatedAtMs = new Date(order.updatedAt || order.createdAt).getTime();

      if (isCompleted && orderUpdatedAtMs <= cutoffTimestamp) {
        ordersStore.delete(token);
        prunedOrderTokens.add(token);
        cleanedOrderTokens.push(token);
      }
    }

    // 2. Cascade purge from Supabase database if configured
    if (isSupabaseConfigured && cleanedOrderTokens.length > 0) {
      try {
        const { data: dbOrders } = await supabase
          .from('orders')
          .select('id')
          .in('order_token', cleanedOrderTokens);

        if (dbOrders && dbOrders.length > 0) {
          const dbOrderIds = dbOrders.map((o) => o.id);
          await supabase.from('order_items').delete().in('order_id', dbOrderIds);
          await supabase.from('payments').delete().in('order_id', dbOrderIds);
        }

        await supabase
          .from('orders')
          .delete()
          .in('order_token', cleanedOrderTokens);
      } catch (err) {
        console.warn('Supabase retention cleanup error:', err);
      }
    } else if (isSupabaseConfigured) {
      // Also check if any older records exist directly in Supabase
      try {
        const { data: expiredDbOrders } = await supabase
          .from('orders')
          .select('id, order_token')
          .in('status', ['COLLECTED', 'CANCELLED'])
          .lte('updated_at', cutoffTime);

        if (expiredDbOrders && expiredDbOrders.length > 0) {
          const expiredIds = expiredDbOrders.map((o) => o.id);
          await supabase.from('order_items').delete().in('order_id', expiredIds);
          await supabase.from('payments').delete().in('order_id', expiredIds);
          await supabase.from('orders').delete().in('id', expiredIds);
          for (const o of expiredDbOrders) {
            if (!cleanedOrderTokens.includes(o.order_token)) {
              cleanedOrderTokens.push(o.order_token);
              ordersStore.delete(o.order_token);
            }
          }
        }
      } catch (err) {
        console.warn('Supabase retention DB scan error:', err);
      }
    }

    return {
      cleanedCount: cleanedOrderTokens.length,
      remainingOrders: ordersStore.size,
      cutoffTime,
      cleanedOrderTokens,
    };
  }
}

