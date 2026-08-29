-- ==============================================================================
-- 🚀 FOODLINE CAMPUS DINING ECOSYSTEM — SUPABASE POSTGRESQL SCHEMA (WITH USER ROLES)
-- Target Campus: Sanjivani University, Kopargaon | Outlet: Cafe @7
-- Roles: student, kitchen, canteen_manager, admin
-- ==============================================================================

-- 0. CLEAN SLATE RESET (Drop existing conflicting tables if any)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS staff_invitations CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS pickup_slots CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS cafeterias CASCADE;
DROP TABLE IF EXISTS campuses CASCADE;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CAMPUSES & OUTLETS
CREATE TABLE campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL DEFAULT 'sanjivani',
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cafeterias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL DEFAULT 'cafe7',
    upi_id VARCHAR(255) NOT NULL DEFAULT '9960091371@slc',
    fssai_license_no VARCHAR(50) DEFAULT '11522036000142',
    is_pure_veg BOOLEAN DEFAULT TRUE,
    commission_rate NUMERIC(4, 2) DEFAULT 0.035, -- 3.5% fast-pass fee
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Linked to Supabase Auth & Role-Based Access)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    prn VARCHAR(100),
    department VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'kitchen', 'canteen_manager', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    invited_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_campus ON profiles(campus_id);
CREATE INDEX idx_profiles_cafeteria ON profiles(cafeteria_id);

-- 4. STAFF INVITATIONS TABLE (7-Day Expiry)
CREATE TABLE staff_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('kitchen', 'canteen_manager')),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ
);

CREATE INDEX idx_staff_invitations_token ON staff_invitations(token);
CREATE INDEX idx_staff_invitations_email ON staff_invitations(email);

-- 5. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- 'user', 'menu_item', 'slot', 'order', 'invitation', 'financial'
    target_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- 6. CATEGORIES & MENU (44 Verified Dishes)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    display_order INT DEFAULT 0
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    prep_time_mins INT DEFAULT 5,
    is_available BOOLEAN DEFAULT TRUE,
    inventory_type VARCHAR(20) DEFAULT 'daily_fresh',
    stock_quantity INT DEFAULT NULL,
    low_stock_threshold INT DEFAULT 5,
    last_fresh_date VARCHAR(10) DEFAULT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SLOTS & CAPACITY MANAGEMENT
CREATE TABLE pickup_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT DEFAULT 60,
    current_booked INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 8. ORDERS & ORDER ITEMS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_token VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES pickup_slots(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    student_convenience_fee NUMERIC(10, 2) DEFAULT 0.00,
    merchant_payout_amount NUMERIC(10, 2) DEFAULT 0.00,
    platform_fee_amount NUMERIC(10, 2) DEFAULT 0.00,
    dpdp_consent_given BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT', 'PAY_AT_COUNTER', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED')),
    pickup_otp VARCHAR(10) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'UPI' CHECK (payment_method IN ('UPI', 'COD')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- 9. PAYMENTS & UTR FRAUD PROTECTION
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    utr_number VARCHAR(12) UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('PENDING_VERIFICATION', 'VERIFIED', 'FAILED')),
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- 10. AUTH USER REGISTRATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Campus Student'),
    'student',
    TRUE,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    last_login_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "profiles_select_manager" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
  AND role IN ('kitchen', 'canteen_manager', 'student')
);

-- Orders Policies
CREATE POLICY "orders_select_student" ON orders FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "orders_select_staff" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);
CREATE POLICY "orders_update_staff" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);

-- Menu Items Policies
CREATE POLICY "menu_items_select_public" ON menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_manage_manager" ON menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);
CREATE POLICY "menu_items_stock_kitchen" ON menu_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);

-- Categories & Slots Public Policies
CREATE POLICY "categories_select_public" ON categories FOR SELECT USING (true);
CREATE POLICY "pickup_slots_select_public" ON pickup_slots FOR SELECT USING (true);
CREATE POLICY "pickup_slots_manage_manager" ON pickup_slots FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);

-- Payments Policies
CREATE POLICY "payments_insert_student" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "payments_verify_staff" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);
CREATE POLICY "payments_select_admin" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Staff Invitations Policies
CREATE POLICY "invitations_select_admin" ON staff_invitations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
  OR email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "invitations_manage_admin" ON staff_invitations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);

-- Audit Logs Policies
CREATE POLICY "audit_logs_select_admin" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "audit_logs_select_manager" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'canteen_manager')
  AND actor_id = auth.uid()
);

-- ==============================================================================
-- 12. SEED DATA (Sanjivani University Cafe @7 Pilot)
-- ==============================================================================

-- Campuses
INSERT INTO campuses (id, name, slug, location)
VALUES ('a1111111-1111-1111-1111-111111111111', 'Sanjivani University', 'sanjivani', 'Kopargaon, Maharashtra');

-- Cafeterias
INSERT INTO cafeterias (id, campus_id, name, slug, upi_id, fssai_license_no, is_pure_veg)
VALUES ('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Cafe @7', 'cafe7', '9960091371@slc', '11522036000142', TRUE);

-- Categories
INSERT INTO categories (id, name, icon, display_order) VALUES
('c1111111-1111-1111-1111-111111111111', 'Chaat', '🥗', 1),
('c2222222-2222-2222-2222-222222222222', 'South Indian', '🥞', 2),
('c3333333-3333-3333-3333-333333333333', 'Rolls', '🌯', 3),
('c4444444-4444-4444-4444-444444444444', 'Burgers & Sandwiches', '🍔', 4),
('c5555555-5555-5555-5555-555555555555', 'Pizza', '🍕', 5),
('c6666666-6666-6666-6666-666666666666', 'Hot Snacks', '🍟', 6),
('c7777777-7777-7777-7777-777777777777', 'Beverages', '🥤', 7),
('c8888888-8888-8888-8888-888888888888', 'Desserts', '🍨', 8);

-- Break Slots
INSERT INTO pickup_slots (id, cafeteria_id, label, start_time, end_time, max_capacity, current_booked) VALUES
('d1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 'Morning Break (10:15 - 10:30 AM)', '10:15:00', '10:30:00', 60, 0),
('d2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'Lunch Break (12:30 - 01:15 PM)', '12:30:00', '13:15:00', 60, 0),
('d3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Tea Break (03:30 - 03:45 PM)', '15:30:00', '15:45:00', 60, 0),
('d4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 'Evening Snack (05:00 - 05:30 PM)', '17:00:00', '17:30:00', 60, 0);

-- Enable Realtime for orders, menu_items, pickup_slots, audit_logs
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE pickup_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
