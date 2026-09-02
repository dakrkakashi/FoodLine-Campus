/**
 * ⚡ FoodLine Backend Engine — Full API Verification & Health Audit
 */

import { server } from '../src/server.js';

const BASE_URL = 'http://localhost:4000';

async function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runApiAudit() {
  console.log('\n' + '━'.repeat(65));
  console.log('  🔍 FOODLINE BACKEND ENGINE — COMPREHENSIVE ENDPOINT AUDIT');
  console.log('━'.repeat(65) + '\n');

  let passed = 0;
  let failed = 0;

  async function check(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // Wait 500ms for server to bind
  await wait(500);

  // 1. Health Check
  await check('GET /health (System status & DB connectivity)', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error(`Unexpected status: ${data.status}`);
  });

  // 2. Telemetry Endpoint
  await check('GET /api/telemetry (Memory, Uptime, SSE & Slots)', async () => {
    const res = await fetch(`${BASE_URL}/api/telemetry`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.system.memory.heapUsedMb) throw new Error('Invalid telemetry payload');
  });

  // 3. Geo Hierarchy
  await check('GET /api/campuses/geo (4-tier hierarchy)', async () => {
    const res = await fetch(`${BASE_URL}/api/campuses/geo`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.states || data.data.states.length === 0) throw new Error('Missing states');
  });

  // 4. Canteens List
  await check('GET /api/campuses/:id/canteens (5 canteens directory)', async () => {
    const campusId = 'a1111111-1111-1111-1111-111111111111';
    const res = await fetch(`${BASE_URL}/api/campuses/${campusId}/canteens`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.canteens.length !== 5) {
      throw new Error(`Expected 5 canteens, found ${data.data.canteens?.length}`);
    }
  });

  // 5. Menu Filter by Canteen (South Corner)
  await check('GET /api/menu?cafeteriaId=south-corner (Filtered dishes)', async () => {
    const res = await fetch(`${BASE_URL}/api/menu?cafeteriaId=b3333333-3333-3333-3333-333333333333`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.items.length === 0) throw new Error('No items returned for South Corner');
  });

  // 6. Pickup Slots
  let slotId = '';
  await check('GET /api/slots (Break capacity meter)', async () => {
    const res = await fetch(`${BASE_URL}/api/slots`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.length === 0) throw new Error('No slots available');
    slotId = data.data[0].id;
  });

  // 7. Student PRN Auto-Resolution
  await check('POST /api/auth/resolve-student (PRN Heuristic / DB)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/resolve-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prn: '2023SUCS0142' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.campus.slug !== 'sanjivani') throw new Error('Failed to resolve campus');
  });

  // 7b. Auth Login (PRN / Email + Password / Resolver with JWT)
  await check('POST /api/auth/login (JWT Session Authentication)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPrn: '2023SUCS0142',
        password: 'TestPassword123',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.token) throw new Error('No JWT token returned');
  });

  // 8. Order Creation & Slot Throttling
  let orderToken = '';
  let orderId = '';
  await check('POST /api/orders (Order creation & slot hold)', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotId,
        items: [{ id: 'm1', name: 'Dabeli', price: 20, quantity: 2 }],
        notes: 'Integration Test Order',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.orderToken) throw new Error('No orderToken generated');
    orderToken = data.data.orderToken;
    orderId = data.data.orderId;
  });

  // 9. Payment UTR Verification
  await check('POST /api/payments/verify-utr (12-digit UTR validation)', async () => {
    const testUtr = '9' + Math.floor(10000000000 + Math.random() * 90000000000).toString();
    const res = await fetch(`${BASE_URL}/api/payments/verify-utr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderToken,
        utrNumber: testUtr,
        amount: 40,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.status !== 'CONFIRMED') throw new Error('Order not confirmed');
  });

  // 10. KDS Status Transition (PREPARING -> READY)
  await check('PATCH /api/kds/orders/:id/status (Kitchen status transition)', async () => {
    const res1 = await fetch(`${BASE_URL}/api/kds/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PREPARING' }),
    });
    if (!res1.ok) throw new Error(`PREPARING failed HTTP ${res1.status}`);

    const res2 = await fetch(`${BASE_URL}/api/kds/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'READY' }),
    });
    if (!res2.ok) throw new Error(`READY failed HTTP ${res2.status}`);
    const data2 = await res2.json();
    if (!data2.success || data2.data.status !== 'READY') throw new Error('Status transition failed');
  });

  console.log('\n' + '━'.repeat(65));
  console.log(`  📊 AUDIT RESULT: ${passed} Passed | ${failed} Failed`);
  console.log('━'.repeat(65) + '\n');

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runApiAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  server.close();
  process.exit(1);
});
