/**
 * ⚡ FoodLine Campus — Pilot Concurrency Stress Test & Slot Throttling Simulation
 *
 * Simulates real-world campus break conditions:
 * - 50 concurrent students placing orders in a burst window
 * - Overbooking stress test pushing past the 60-slot hard cap
 * - Hold expiry and 24-hour data retention verification
 */

import { OrderService } from '../src/services/order-service.js';
import { SlotThrottlerService } from '../src/services/slot-throttler.js';

interface LatencyMetric {
  orderToken?: string;
  durationMs: number;
  success: boolean;
  error?: string;
}

async function runPilotStressTest() {
  console.log('\n' + '━'.repeat(70));
  console.log('  🍔 FOODLINE CAMPUS — PILOT CONCURRENCY & THROTTLING BENCHMARK');
  console.log('━'.repeat(70));
  console.log('🎯 Target Venue: Cafe @7 (Sanjivani University)');
  console.log('⚡ Simulation: Burst break-window concurrency (50 students) + 60-cap limit test');
  console.log('━'.repeat(70) + '\n');

  // Test Slot Setup: Isolated Break Slot with 60 Max Capacity
  const testSlotId = `slot-stress-${Date.now()}`;
  const initialSlot = await SlotThrottlerService.reserveSlot(testSlotId, 0); // initial registration
  // Reset slot capacity counters for clean simulation baseline
  initialSlot.currentBooked = 0;
  initialSlot.availableSlots = 60;
  initialSlot.maxCapacity = 60;
  initialSlot.isFull = false;

  console.log(`📋 Initializing Break Window Slot [${testSlotId}]:`);
  console.log(`   Capacity: ${initialSlot.maxCapacity} orders | Booked: ${initialSlot.currentBooked} | Available: ${initialSlot.availableSlots}\n`);

  // =========================================================================
  // PHASE 1: 50 Concurrent Student Order Burst
  // =========================================================================
  console.log('🚀 PHASE 1: Dispatching 50 concurrent student pre-orders (Break Window Burst)...');
  const phase1Count = 50;
  const phase1Metrics: LatencyMetric[] = [];

  const startTimeP1 = Date.now();

  const phase1Promises = Array.from({ length: phase1Count }, async (_, i) => {
    const studentIndex = i + 1;
    const reqStart = Date.now();

    try {
      const order = await OrderService.createOrder({
        slotId: testSlotId,
        studentName: `Student ${studentIndex}`,
        studentPhone: `98765${String(studentIndex).padStart(5, '0')}`,
        studentPrn: `SU2026CS${String(studentIndex).padStart(3, '0')}`,
        items: [
          { id: 'dish-vada-pav', name: 'Vada Pav', price: 20, quantity: 1 },
          { id: 'dish-chai', name: 'Masala Chai', price: 15, quantity: 1 },
        ],
        notes: `Burst test order #${studentIndex}`,
      });

      const durationMs = Date.now() - reqStart;
      phase1Metrics.push({
        orderToken: order.orderToken,
        durationMs,
        success: true,
      });
    } catch (err: any) {
      const durationMs = Date.now() - reqStart;
      phase1Metrics.push({
        durationMs,
        success: false,
        error: err.message,
      });
    }
  });

  await Promise.all(phase1Promises);
  const totalDurationP1 = Date.now() - startTimeP1;

  const p1Success = phase1Metrics.filter((m) => m.success).length;
  const p1Failed = phase1Metrics.filter((m) => !m.success).length;
  const latenciesP1 = phase1Metrics.map((m) => m.durationMs).sort((a, b) => a - b);
  const minLatP1 = latenciesP1[0] ?? 0;
  const maxLatP1 = latenciesP1[latenciesP1.length - 1] ?? 0;
  const avgLatP1 = latenciesP1.reduce((sum, v) => sum + v, 0) / (latenciesP1.length || 1);
  const p95LatP1 = latenciesP1[Math.floor(latenciesP1.length * 0.95)] ?? 0;

  console.log(`   ✅ Completed in: ${totalDurationP1}ms`);
  console.log(`   📊 Success: ${p1Success}/${phase1Count} (100.0%) | Failed: ${p1Failed}`);
  console.log(`   ⏱️  Latency: Min=${minLatP1}ms | Avg=${avgLatP1.toFixed(2)}ms | P95=${p95LatP1}ms | Max=${maxLatP1}ms`);

  const slotAfterP1 = await SlotThrottlerService.getSlotById(testSlotId);
  console.log(`   🛡️  Slot State: Booked=${slotAfterP1?.currentBooked}/60 | Available=${slotAfterP1?.availableSlots} | isFull=${slotAfterP1?.isFull}\n`);

  if (p1Success !== 50 || slotAfterP1?.currentBooked !== 50) {
    throw new Error(`❌ Phase 1 assertion failed! Expected 50 booked, got ${slotAfterP1?.currentBooked}`);
  }

  // =========================================================================
  // PHASE 2: Boundary Overload Stress (15 more orders pushing past 60-cap)
  // =========================================================================
  console.log('⚡ PHASE 2: Overload Boundary Test (15 additional orders pushing total to 65)...');
  console.log('   Expected outcome: Exactly 10 succeed (reaching 60/60 cap) & 5 strictly rejected.\n');

  const phase2Count = 15;
  const phase2Metrics: LatencyMetric[] = [];
  const startTimeP2 = Date.now();

  const phase2Promises = Array.from({ length: phase2Count }, async (_, i) => {
    const studentIndex = 51 + i;
    const reqStart = Date.now();

    try {
      const order = await OrderService.createOrder({
        slotId: testSlotId,
        studentName: `Student ${studentIndex}`,
        studentPhone: `98765${String(studentIndex).padStart(5, '0')}`,
        studentPrn: `SU2026CS${String(studentIndex).padStart(3, '0')}`,
        items: [{ id: 'dish-sandwich', name: 'Veg Grilled Sandwich', price: 60, quantity: 1 }],
      });

      const durationMs = Date.now() - reqStart;
      phase2Metrics.push({
        orderToken: order.orderToken,
        durationMs,
        success: true,
      });
    } catch (err: any) {
      const durationMs = Date.now() - reqStart;
      phase2Metrics.push({
        durationMs,
        success: false,
        error: err.message,
      });
    }
  });

  await Promise.all(phase2Promises);
  const totalDurationP2 = Date.now() - startTimeP2;

  const p2Success = phase2Metrics.filter((m) => m.success).length;
  const p2Throttled = phase2Metrics.filter((m) => !m.success).length;
  const slotAfterP2 = await SlotThrottlerService.getSlotById(testSlotId);

  console.log(`   ✅ Overload burst executed in: ${totalDurationP2}ms`);
  console.log(`   🎯 Orders Accepted: ${p2Success} (Expected: 10)`);
  console.log(`   🛑 Orders Throttled: ${p2Throttled} (Expected: 5)`);
  console.log(`   🔒 Final Slot Bookings: ${slotAfterP2?.currentBooked}/${slotAfterP2?.maxCapacity}`);
  console.log(`   🔴 Slot Full Status: ${slotAfterP2?.isFull ? 'LOCKED (100% Full)' : 'ERROR (Not Locked)'}`);

  if (slotAfterP2?.currentBooked !== 60 || p2Success !== 10 || p2Throttled !== 5) {
    throw new Error(`❌ Boundary overload assertion failed! Capacity exceeded or limit breached.`);
  }

  // =========================================================================
  // PHASE 3: 24h Data Retention & Audit Cleanup Verification
  // =========================================================================
  console.log('\n🧹 PHASE 3: Verifying 24h Order Retention & Automated Log Cleanup...');

  // Inject a mock completed order collected 26 hours ago
  const oldCollectedOrder = await OrderService.createOrder({
    items: [{ id: 'dish-test', name: 'Cold Coffee', price: 40, quantity: 1 }],
    studentName: 'Retention Test Student',
  });
  oldCollectedOrder.status = 'COLLECTED';
  oldCollectedOrder.updatedAt = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString();

  // Inject a fresh collected order collected 2 hours ago (should NOT be pruned)
  const freshCollectedOrder = await OrderService.createOrder({
    items: [{ id: 'dish-test-fresh', name: 'Poha', price: 20, quantity: 1 }],
    studentName: 'Fresh Student',
  });
  freshCollectedOrder.status = 'COLLECTED';
  freshCollectedOrder.updatedAt = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const cleanupResult = await OrderService.cleanupOldOrders(24);
  console.log(`   📦 Cleaned Expired Orders: ${cleanupResult.cleanedCount}`);
  console.log(`   🛡️  Remaining Operational Orders: ${cleanupResult.remainingOrders}`);
  console.log(`   ⏱️  Retention Cutoff: ${cleanupResult.cutoffTime}`);

  const oldLookup = await OrderService.getOrderByToken(oldCollectedOrder.orderToken);
  const freshLookup = await OrderService.getOrderByToken(freshCollectedOrder.orderToken);

  if (oldLookup !== undefined) {
    throw new Error(`❌ Retention cleanup failed! Order older than 24h was not pruned.`);
  }
  if (!freshLookup) {
    throw new Error(`❌ Retention cleanup failed! Recent order under 24h was prematurely pruned.`);
  }
  console.log('   ✅ 24h Retention Policy Verified: Old records pruned, fresh records preserved.');

  // =========================================================================
  // BENCHMARK SUMMARY REPORT
  // =========================================================================
  const allMetrics = [...phase1Metrics, ...phase2Metrics];
  const totalReqs = allMetrics.length;
  const totalSuccess = allMetrics.filter((m) => m.success).length;
  const totalThrottled = allMetrics.filter((m) => !m.success).length;
  const allLatencies = allMetrics.map((m) => m.durationMs).sort((a, b) => a - b);
  const avgOverall = allLatencies.reduce((a, b) => a + b, 0) / (allLatencies.length || 1);
  const p95Overall = allLatencies[Math.floor(allLatencies.length * 0.95)] ?? 0;
  const p99Overall = allLatencies[Math.floor(allLatencies.length * 0.99)] ?? 0;
  const throughputRps = ((totalReqs / (totalDurationP1 + totalDurationP2)) * 1000).toFixed(1);

  console.log('\n' + '━'.repeat(70));
  console.log('  🏁 PILOT STRESS TEST RESULTS & TELEMETRY SUMMARY');
  console.log('━'.repeat(70));
  console.log(`  • Total Burst Requests:     ${totalReqs}`);
  console.log(`  • Successful Orders Placed: ${totalSuccess} (Strictly capped at 60)`);
  console.log(`  • Rejections (At Capacity): ${totalThrottled} (Gracefully throttled)`);
  console.log(`  • Overbooking Rate:         0.00% (Zero Race Conditions)`);
  console.log(`  • Average Latency:          ${avgOverall.toFixed(2)} ms`);
  console.log(`  • P95 Latency:              ${p95Overall} ms`);
  console.log(`  • P99 Latency:              ${p99Overall} ms`);
  console.log(`  • Peak Simulation Throughput: ${throughputRps} req/sec`);
  console.log(`  • DPDP Data Retention:      ACTIVE (24h Auto-Purge Verified)`);
  console.log('━'.repeat(70));
  console.log('  🎉 ALL BACKEND CONCURRENCY & RETENTION CRITERIA PASSED!\n');
}

runPilotStressTest().catch((err) => {
  console.error('\n❌ Pilot stress test encountered an error:', err);
  process.exit(1);
});
