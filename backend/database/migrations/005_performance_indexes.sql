-- ==============================================================================
-- ⚡ FOODLINE CAMPUS — PERFORMANCE & HIGH-CONCURRENCY INDEXES (MIGRATION 005)
-- Target: Zero-lag peak rush queries (Break 1: 10:45 AM, Lunch: 1:15 PM)
-- ==============================================================================

-- 1. KDS Realtime Query Index (Instant loading of active kitchen queue)
CREATE INDEX IF NOT EXISTS idx_orders_kds_lookup
  ON orders (cafeteria_id, status, created_at DESC)
  WHERE status IN ('CONFIRMED', 'PREPARING', 'READY');

-- 2. Student Order History Index (Fast lookup of past orders by user)
CREATE INDEX IF NOT EXISTS idx_orders_user_history
  ON orders (user_id, created_at DESC);

-- 3. Slot Capacity Throttling Index (Count active reservations per slot)
CREATE INDEX IF NOT EXISTS idx_orders_slot_capacity
  ON orders (slot_id, status)
  WHERE status NOT IN ('CANCELLED');

-- 4. Order Token Lookup
CREATE INDEX IF NOT EXISTS idx_orders_token_lookup
  ON orders (order_token);

-- 5. Order Items Foreign Key Join Index (Fast hydration of order receipts & KDS items)
CREATE INDEX IF NOT EXISTS idx_order_items_order_fk
  ON order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_fk
  ON order_items (menu_item_id);

-- 6. Menu Filter Index (Active dishes by cafeteria and category)
CREATE INDEX IF NOT EXISTS idx_menu_items_canteen_available
  ON menu_items (cafeteria_id, is_available, category_id);

-- 7. Payment Verification & UTR Deduplication Index
CREATE INDEX IF NOT EXISTS idx_payments_utr_lookup
  ON payments (utr_number)
  WHERE utr_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_status_reconcile
  ON payments (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_order_fk
  ON payments (order_id);
