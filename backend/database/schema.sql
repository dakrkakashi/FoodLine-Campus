-- ==============================================================================
-- 🚀 FOODLINE CAMPUS DINING ECOSYSTEM — SUPABASE POSTGRESQL SCHEMA (CLEAN RESET)
-- Target Campus: Sanjivani University, Kopargaon | Outlet: Cafe @7
-- ==============================================================================

-- 0. CLEAN SLATE RESET (Drop existing conflicting tables if any)
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
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cafeterias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    upi_id VARCHAR(255) NOT NULL DEFAULT '9960091371@slc',
    fssai_license_no VARCHAR(50) DEFAULT '11522036000142',
    is_pure_veg BOOLEAN DEFAULT TRUE,
    commission_rate NUMERIC(4, 2) DEFAULT 0.12,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Linked to Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    prn VARCHAR(100),
    department VARCHAR(100),
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'staff', 'kitchen', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES & MENU (44 Verified Dishes)
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

-- 5. SLOTS & CAPACITY MANAGEMENT
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

-- 6. ORDERS & ORDER ITEMS
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
    status VARCHAR(50) DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED')),
    pickup_otp VARCHAR(6),
    notes TEXT,
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

-- 7. PAYMENTS & UTR VERIFICATION
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    utr_number VARCHAR(12) UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('PENDING_VERIFICATION', 'VERIFIED', 'FAILED')),
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- ==============================================================================
-- 📦 SEED DATA: SANJIVANI UNIVERSITY CAFE @7 COMPLETE 44-DISH MENU
-- ==============================================================================

DO $$
DECLARE
    campus_uuid UUID := uuid_generate_v4();
    cafe_uuid UUID := uuid_generate_v4();
    cat_quick UUID := uuid_generate_v4();
    cat_south_north UUID := uuid_generate_v4();
    cat_sandwich UUID := uuid_generate_v4();
    cat_momo_burger UUID := uuid_generate_v4();
    cat_fries_pasta UUID := uuid_generate_v4();
    cat_bread_pizza UUID := uuid_generate_v4();
    cat_chinese_rice UUID := uuid_generate_v4();
    cat_beverages UUID := uuid_generate_v4();
BEGIN
    -- 1. Campus & Cafe
    INSERT INTO campuses (id, name, location)
    VALUES (campus_uuid, 'Sanjivani University', 'Kopargaon, Maharashtra');

    INSERT INTO cafeterias (id, campus_id, name, upi_id)
    VALUES (cafe_uuid, campus_uuid, 'Cafe @7', 'cafe7.sanjivani@upi');

    -- 2. Categories
    INSERT INTO categories (id, name, icon, display_order) VALUES
    (cat_quick, 'Quick Bites & Chaat', '🥪', 1),
    (cat_south_north, 'South & North Indian', '🥞', 2),
    (cat_sandwich, 'Loaded Sandwiches', '🥪', 3),
    (cat_momo_burger, 'Momos & Burgers', '🍔', 4),
    (cat_fries_pasta, 'Fries & Pastas', '🍟', 5),
    (cat_bread_pizza, 'Garlic Bread & Pizzas', '🍕', 6),
    (cat_chinese_rice, 'Maggi, Chinese & Rice', '🍜', 7),
    (cat_beverages, 'Beverages & Desserts', '☕', 8);

    -- 3. Menu Items (All 44 Dishes)
    -- Quick Bites & Chaat
    INSERT INTO menu_items (cafeteria_id, category_id, name, tag, price) VALUES
    (cafe_uuid, cat_quick, 'Dabeli', 'Fast Grab', 20),
    (cafe_uuid, cat_quick, 'Vada Pav', 'Campus Classic', 20),
    (cafe_uuid, cat_quick, 'Poha', 'Morning Breakfast', 25),
    (cafe_uuid, cat_quick, 'Samosa', 'Fast Grab', 20),
    (cafe_uuid, cat_quick, 'Kachori', 'Fast Grab', 20),
    (cafe_uuid, cat_quick, 'Pani Puri', 'Chaat Corner', 30),
    (cafe_uuid, cat_quick, 'Sev Puri - Dahi Puri', 'Chaat Corner', 40),
    (cafe_uuid, cat_quick, 'Mumbai Bhel', 'Chaat Corner', 40),
    (cafe_uuid, cat_quick, 'Papdi Chat', 'Chaat Corner', 40),
    (cafe_uuid, cat_quick, 'Cheese Grill Vada Pav', 'Special Grab', 50),
    (cafe_uuid, cat_quick, 'Samosa Chole Tikki', 'Chaat Special', 50),
    (cafe_uuid, cat_quick, 'Aalu Chole Tikki', 'Chaat Special', 50),
    (cafe_uuid, cat_quick, 'Dahi Kachori', 'Chaat Special', 50);

    -- South & North Indian
    INSERT INTO menu_items (cafeteria_id, category_id, name, tag, price) VALUES
    (cafe_uuid, cat_south_north, 'Masala Dosa', 'South Indian Bestseller', 50),
    (cafe_uuid, cat_south_north, 'Cheese Masala Dosa', 'South Indian Special', 80),
    (cafe_uuid, cat_south_north, 'Onion Uttapa', 'South Indian', 50),
    (cafe_uuid, cat_south_north, 'Cheese Onion Uttapa', 'South Indian Special', 80),
    (cafe_uuid, cat_south_north, 'Chole Bhature', 'North Indian Special', 100);

    -- Sandwiches
    INSERT INTO menu_items (cafeteria_id, category_id, name, tag, price) VALUES
    (cafe_uuid, cat_sandwich, 'Veg. Sandwich', 'Plain / Toasted', 60),
    (cafe_uuid, cat_sandwich, 'Veg. Cheese Sandwich', 'Cheese Loaded', 80),
    (cafe_uuid, cat_sandwich, 'Veg. Cheese Grill Sandwich', 'Hot Grill Bestseller', 100),
    (cafe_uuid, cat_sandwich, 'Bombay Grill Sandwich', 'Signature Grill', 110),
    (cafe_uuid, cat_sandwich, 'Cutlet Club Sandwich', 'Triple Decker', 90);

    -- Momos & Burgers
    INSERT INTO menu_items (cafeteria_id, category_id, name, tag, price) VALUES
    (cafe_uuid, cat_momo_burger, 'Veg Fried Momo', 'Hot Snacks', 70),
    (cafe_uuid, cat_momo_burger, 'Paneer Fried Momo', 'Premium Snacks', 90),
    (cafe_uuid, cat_momo_burger, 'Aalu Tikki Burger', 'Classic Burger', 70),
    (cafe_uuid, cat_momo_burger, 'Veg Cheese Burger', 'Cheese Burger', 80),
    (cafe_uuid, cat_momo_burger, 'Cheese Burst Burger', 'Chef Special', 90);

    -- Fries & Pastas
    INSERT INTO menu_items (cafeteria_id, category_id, name, tag, price) VALUES
    (cafe_uuid, cat_fries_pasta, 'Salted Fries', 'Crispy Fries', 60),
    (cafe_uuid, cat_fries_pasta, 'Peri Peri Fries', 'Student Favorite', 80),
    (cafe_uuid, cat_fries_pasta, 'Pink Sauce Pasta', 'Italian Fusion', 100),
    (cafe_uuid, cat_fries_pasta, 'Arrabiata Pasta', 'Red Sauce Spicy', 130),
    (cafe_uuid, cat_fries_pasta, 'White Sauce Pasta', 'Creamy Alfredo', 150);

    -- Garlic Bread & Pizzas
    INSERT INTO menu_items (cafeteria_id, category_id, name, tag, price) VALUES
    (cafe_uuid, cat_bread_pizza, 'Plain Garlic Bread', 'Oven Baked', 80),
    (cafe_uuid, cat_bread_pizza, 'Cheese Chilli Toast', 'Spicy Cheese', 100),
    (cafe_uuid, cat_bread_pizza, 'Cheese Garlic Bread', 'Melted Mozzarella', 110),
    (cafe_uuid, cat_bread_pizza, 'Veg Loaded Pizza', '7-inch Thin Crust', 130),
    (cafe_uuid, cat_bread_pizza, 'Cheese Corn Delight', 'Sweet Corn & Cheese', 130),
    (cafe_uuid, cat_bread_pizza, 'Margherita Pizza', 'Classic Cheese', 140),
    (cafe_uuid, cat_bread_pizza, 'Paneer Tandoori Pizza', 'Desi Tandoori', 150);

    -- Maggi, Chinese & Rice
    INSERT INTO menu_items (cafeteria_id, category_id, name, tag, price) VALUES
    (cafe_uuid, cat_chinese_rice, 'Plain Maggie', 'Instant 2-Min', 40),
    (cafe_uuid, cat_chinese_rice, 'Veg Cheese Maggie', 'Cheesy Maggi', 60),
    (cafe_uuid, cat_chinese_rice, 'Veg Fried Maggie', 'Wok Tossed', 80),
    (cafe_uuid, cat_chinese_rice, 'Dry Manchurian', 'Indo-Chinese', 90),
    (cafe_uuid, cat_chinese_rice, 'Veg Fried Rice', 'Wok Fried', 90),
    (cafe_uuid, cat_chinese_rice, 'Schezwan Fried Rice', 'Spicy Schezwan', 100),
    (cafe_uuid, cat_chinese_rice, 'Soya Chilli', 'Protein Wok', 110),
    (cafe_uuid, cat_chinese_rice, 'Paneer Chilli', 'Chinese Bestseller', 130);

    -- Beverages & Desserts
    INSERT INTO menu_items (cafeteria_id, category_id, name, tag, price) VALUES
    (cafe_uuid, cat_beverages, 'Special Tea', 'Campus Fuel', 10),
    (cafe_uuid, cat_beverages, 'Hot Coffee', 'Hot Brew', 20),
    (cafe_uuid, cat_beverages, 'Hot Chocolate', 'Sweet Cocoa', 30),
    (cafe_uuid, cat_beverages, 'Cold Coffee', 'Student Favorite', 50),
    (cafe_uuid, cat_beverages, 'Cold Chocolate', 'Chilled Cocoa', 50),
    (cafe_uuid, cat_beverages, 'Oreo Shake', 'Thick Shake', 90),
    (cafe_uuid, cat_beverages, 'KitKat Shake', 'Thick Shake', 90),
    (cafe_uuid, cat_beverages, 'Brownie Thick Shake', 'Gourmet Thick Shake', 110),
    (cafe_uuid, cat_beverages, 'Hot Gulab Jamun with Ice-Cream', 'Dessert Classic', 80),
    (cafe_uuid, cat_beverages, 'Hot Brownie with Ice-Cream', 'Sizzling Dessert', 100);

    -- 4. Pickup Slots
    INSERT INTO pickup_slots (cafeteria_id, label, start_time, end_time, max_capacity) VALUES
    (cafe_uuid, 'Morning Break (10:15 AM - 10:35 AM)', '10:15:00', '10:35:00', 60),
    (cafe_uuid, 'Lunch Shift 1 (11:50 AM - 12:10 PM)', '11:50:00', '12:10:00', 60),
    (cafe_uuid, 'Lunch Shift 2 (12:10 PM - 12:30 PM)', '12:10:00', '12:30:00', 60),
    (cafe_uuid, 'Lunch Shift 3 (12:30 PM - 12:50 PM)', '12:30:00', '12:50:00', 60),
    (cafe_uuid, 'Afternoon Snack (03:30 PM - 03:50 PM)', '15:30:00', '15:50:00', 60);

END $$;

-- 8. ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafeterias ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read for campuses" ON campuses FOR SELECT USING (true);
CREATE POLICY "Allow public read for cafeterias" ON cafeterias FOR SELECT USING (true);
CREATE POLICY "Allow public read for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read for menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read for pickup_slots" ON pickup_slots FOR SELECT USING (true);

-- Profiles Policies
CREATE POLICY "Allow users to read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow profile insert during signup" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders Policies
CREATE POLICY "Allow users to read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Allow users to insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow staff to update order status" ON orders FOR UPDATE USING (true);

-- Order Items Policies
CREATE POLICY "Allow public read of order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow inserting order items" ON order_items FOR INSERT WITH CHECK (true);

-- Payments Policies
CREATE POLICY "Allow users to insert payment UTR" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow staff to verify payment" ON payments FOR ALL USING (true);

-- 9. ENABLE REALTIME PUBLICATION
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE orders;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'order_items') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'menu_items') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'pickup_slots') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE pickup_slots;
    END IF;
END $$;
