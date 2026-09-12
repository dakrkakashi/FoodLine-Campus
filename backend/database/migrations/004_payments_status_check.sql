-- Migration 004: Expand payments status check constraint to support PENDING_MANUAL_REVIEW
-- Ensures compatibility between backend domain types and database checks

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_status_check;

ALTER TABLE public.payments ADD CONSTRAINT payments_status_check
  CHECK (status IN ('PENDING_VERIFICATION', 'PENDING_MANUAL_REVIEW', 'VERIFIED', 'FAILED'));

NOTIFY pgrst, 'reload schema';
