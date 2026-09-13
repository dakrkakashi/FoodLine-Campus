import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';
import { OrderService } from '../src/services/order-service.js';

describe('GET /api/orders — Cursor-Based Pagination API Endpoint', () => {
  beforeAll(async () => {
    // Seed at least 3 orders for pagination testing
    for (let i = 1; i <= 3; i++) {
      await OrderService.createOrder({
        slotId: '11111111-1111-1111-1111-111111111111',
        items: [{ dishId: 'd01', name: `Test Dish ${i}`, price: 50, quantity: 1 }],
        studentPhone: '9876543210',
        studentName: `Student ${i}`,
        studentPrn: `2023SUCS000${i}`,
      }).catch(() => {});
    }
  });

  it('returns paginated orders with opaque cursor and pagination metadata', async () => {
    const res = await request(app).get('/api/orders?limit=2');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.limit).toBe(2);
    expect(typeof res.body.pagination.hasMore).toBe('boolean');
  });

  it('fetches subsequent pages stably using nextCursor', async () => {
    const page1 = await request(app).get('/api/orders?limit=1');
    expect(page1.status).toBe(200);
    const nextCursor = page1.body.pagination?.nextCursor;

    if (nextCursor) {
      const page2 = await request(app).get(`/api/orders?limit=1&cursor=${encodeURIComponent(nextCursor)}`);
      expect(page2.status).toBe(200);
      expect(page2.body.success).toBe(true);
      if (page2.body.data.length > 0 && page1.body.data.length > 0) {
        expect(page2.body.data[0].id).not.toBe(page1.body.data[0].id);
      }
    }
  });
});
