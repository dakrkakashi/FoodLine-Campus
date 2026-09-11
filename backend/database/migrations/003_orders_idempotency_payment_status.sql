-- Migration 003: Add missing orders columns used by checkout API
-- Fixes: Could not find the 'idempotency_key' column of 'orders' in the schema cache

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(100);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'PENDING';

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key
  ON public.orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- Refresh PostgREST schema cache (Supabase)
NOTIFY pgrst, 'reload schema';
