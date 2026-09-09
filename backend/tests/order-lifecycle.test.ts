import { describe, it, expect } from 'vitest';
import { OrderService } from '../src/services/order-service.js';

describe('OrderService — Order Lifecycle, Idempotency & Payment Reconciliation', () => {
  const sampleItems = [
    { name: 'Samosa Pav', price: 25, quantity: 2 },
    { name: 'Special Cutting Chai', price: 15, quantity: 1 },
  ];

  it('should create an order with unique token and 4-digit pickup OTP', async () => {
    const order = await OrderService.createOrder({
      items: sampleItems,
      studentName: 'Priya Sharma',
      studentPrn: '2023SUCS0199',
      studentPhone: '9876543210',
      notes: 'Extra chutney please',
    });

    expect(order.id).toBeDefined();
    expect(order.orderToken).toMatch(/^FL-\d{4,5}$/);
    expect(order.pickupOtp).toMatch(/^\d{4}$/);
    expect(order.totalAmount).toBe(65); // (25*2) + (15*1) = 65
    expect(order.status).toBe('PENDING_PAYMENT');
    expect(order.paymentStatus).toBe('PENDING');
  });

  it('should guarantee idempotency when identical idempotencyKey is supplied', async () => {
    const idempotencyKey = 'idemp-' + Math.random().toString(36).substring(2, 10);

    const order1 = await OrderService.createOrder({
      items: sampleItems,
      studentName: 'Aman Verma',
      studentPrn: '2023SUIT0104',
      idempotencyKey,
    });

    // Replay attempt with same idempotency key
    const order2 = await OrderService.createOrder({
      items: sampleItems,
      studentName: 'Aman Verma',
      studentPrn: '2023SUIT0104',
      idempotencyKey,
    });

    expect(order1.orderToken).toBe(order2.orderToken);
    expect(order1.id).toBe(order2.id);
    expect(order1.pickupOtp).toBe(order2.pickupOtp);
  });

  it('should confirm UTR payment and set paymentStatus to PENDING_MANUAL_REVIEW', async () => {
    const order = await OrderService.createOrder({
      items: [{ name: 'Vada Pav', price: 20, quantity: 1 }],
      studentName: 'Kunal Patil',
    });

    const mockUtr = '9988' + Math.floor(10000000 + Math.random() * 90000000).toString();
    const { order: confirmedOrder, message } = await OrderService.confirmUtrPayment(
      order.orderToken,
      mockUtr,
      20
    );

    expect(confirmedOrder.status).toBe('CONFIRMED');
    expect(confirmedOrder.paymentStatus).toBe('PENDING_MANUAL_REVIEW');
    expect(confirmedOrder.utrNumber).toBe(mockUtr);
    expect(message).toBeDefined();
  });

  it('should allow staff to reconcile payment and mark status VERIFIED', async () => {
    const order = await OrderService.createOrder({
      items: [{ name: 'Misal Pav', price: 50, quantity: 1 }],
      studentName: 'Sneha Shinde',
    });

    const mockUtr = '7766' + Math.floor(10000000 + Math.random() * 90000000).toString();
    await OrderService.confirmUtrPayment(order.orderToken, mockUtr, 50);

    // Staff visual check / reconciliation
    const reconciledOrder = await OrderService.reconcilePayment(order.orderToken, 'Manager Priya');
    expect(reconciledOrder.paymentStatus).toBe('VERIFIED');
  });

  it('should progress through KDS states: PREPARING -> READY -> COLLECTED', async () => {
    const order = await OrderService.createOrder({
      items: [{ name: 'Bun Maska', price: 30, quantity: 1 }],
      studentName: 'Rahul Deshmukh',
    });

    // Step 1: PREPARING
    const prepOrder = await OrderService.transitionStatus(order.id, 'PREPARING');
    expect(prepOrder.status).toBe('PREPARING');

    // Step 2: READY
    const readyOrder = await OrderService.transitionStatus(order.id, 'READY');
    expect(readyOrder.status).toBe('READY');

    // Step 3: COLLECTED via OTP verification
    const { order: collectedOrder } = await OrderService.verifyPickupOtp(
      readyOrder.orderToken,
      readyOrder.pickupOtp
    );
    expect(collectedOrder.status).toBe('COLLECTED');
  });
});
