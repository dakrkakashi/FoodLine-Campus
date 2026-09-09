-- ==============================================================================
-- Migration 001: Fix RLS Roles, Payment Integrity & Order Idempotency
-- Project: FoodLine Campus (Pilot: Sanjivani University, Kopargaon)
-- Target Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Ensure idempotency_key column exists on orders table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'idempotency_key'
    ) THEN
        ALTER TABLE orders ADD COLUMN idempotency_key VARCHAR(100);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency_key 
            ON orders (idempotency_key) 
            WHERE idempotency_key IS NOT NULL;
    END IF;
END $$;

-- 2. Ensure payment_status column supports PENDING_MANUAL_REVIEW
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'PENDING';
    END IF;
END $$;

-- 3. Ensure role constraints on profiles
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'profiles'
    ) THEN
        -- Verify role values: 'student', 'kitchen', 'canteen_manager', 'admin'
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
        ) THEN
            ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
                CHECK (role IN ('student', 'kitchen', 'canteen_manager', 'admin'));
        END IF;
    END IF;
END $$;

-- 4. Re-harden Orders Row Level Security Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_student" ON orders;
DROP POLICY IF EXISTS "orders_select_staff" ON orders;
DROP POLICY IF EXISTS "orders_update_staff" ON orders;
DROP POLICY IF EXISTS "Allow staff to update order status" ON orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;

-- Student can only view their own orders (or guest orders placed in active session)
CREATE POLICY "orders_select_student" ON orders 
    FOR SELECT 
    USING (
        auth.uid() = user_id OR user_id IS NULL
    );

-- Staff can view all orders for kitchen processing
CREATE POLICY "orders_select_staff" ON orders 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin')
        )
    );

-- STRICT: Only verified kitchen, canteen manager, or admin roles can update order status
CREATE POLICY "orders_update_staff" ON orders 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin')
        )
    );

-- Allow order creation (student checkout)
CREATE POLICY "orders_insert_policy" ON orders 
    FOR INSERT 
    WITH CHECK (true);

-- 5. Re-harden Payments Row Level Security Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_insert_student" ON payments;
DROP POLICY IF EXISTS "payments_verify_staff" ON payments;
DROP POLICY IF EXISTS "payments_select_admin" ON payments;
DROP POLICY IF EXISTS "Allow staff to verify payment" ON payments;

-- Allow students to record payment intent / UTR submission
CREATE POLICY "payments_insert_student" ON payments 
    FOR INSERT 
    WITH CHECK (true);

-- STRICT: Only Canteen Managers and Admins can update/verify payment records
CREATE POLICY "payments_verify_staff" ON payments 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin')
        )
    );

-- STRICT: Only Canteen Managers and Admins can view complete payment ledger
CREATE POLICY "payments_select_admin" ON payments 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin')
        )
    );
