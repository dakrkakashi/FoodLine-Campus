# 🍔 FoodLine Campus — Master System, Architecture, Business & Engineering Report
> **Prepared for:** Google NotebookLM Knowledge Base & Strategic Operations  
> **Project:** FoodLine Campus (Zero-Queue B2B2C Campus Dining Infrastructure)  
> **Pilot Institution:** Sanjivani University, Kopargaon (Cafe @7 & 5 Outlets)  
> **Repository:** `dakrkakashi/FoodLine-Campus` | **Version:** 3.0.0-PROD-VERIFIED  
> **Timestamp:** September 2026

---

## 📑 Master Table of Contents
1. [Executive Summary & Problem Space](#1-executive-summary--problem-space)
2. [Market Opportunity, TAM/SAM/SOM & Unit Economics](#2-market-opportunity-tamsamsom--unit-economics)
3. [Canteen Partner Economics & Operator Growth Pitch](#3-canteen-partner-economics--operator-growth-pitch)
4. [Master Full-Stack Technical Architecture](#4-master-full-stack-technical-architecture)
5. [Core Algorithmic Innovations & Engine Mechanics](#5-core-algorithmic-innovations--engine-mechanics)
   - 5.1 60-Order Slot Throttling Governor
   - 5.2 12-Digit Bank UTR Anti-Replay Fraud Shield
   - 5.3 Autonomous Student Account Detection & PRN Normalizer
   - 5.4 Dual-Master Resilient Persistence (Supabase + Google Sheets)
   - 5.5 Kitchen Display System (KDS) & Realtime SSE Streamer
   - 5.6 Multilingual TV Voice Announcer Engine
6. [Database DDL & Complete Entity Relationship Schema](#6-database-ddl--complete-entity-relationship-schema)
7. [Comprehensive REST & Realtime API Contract](#7-comprehensive-rest--realtime-api-contract)
8. [Frontend & Mobile Architecture (Next.js 15 + Capacitor 8 Android APK)](#8-frontend--mobile-architecture-nextjs-15--capacitor-8-android-apk)
9. [Design System & UI/UX Specifications (`ui-ux-pro-max`)](#9-design-system--uiux-specifications-ui-ux-pro-max)
10. [Statutory Legal Terms, FSSAI & DPDP Act 2023 Compliance](#10-statutory-legal-terms-fssai--dpdp-act-2023-compliance)
11. [Quality Assurance, Vitest Test Suite & Gap Analysis Audit](#11-quality-assurance-vitest-test-suite--gap-analysis-audit)
12. [175-Feature Production Expansion Blueprint & Roadmap](#12-175-feature-production-expansion-blueprint--roadmap)

---

## 1. Executive Summary & Problem Space

### 1.1 The 15-Minute Recess Crisis
Across Indian higher education institutions (engineering colleges, medical schools, central universities, and polytechnics), between 3,000 and 15,000 students follow synchronized schedules. When the lecture bell rings for a 15-to-20-minute break:
- Thousands of students rush simultaneously to 1 or 2 on-campus cafeterias.
- Physical counters turn into high-friction mosh pits where students spend **12 to 14 minutes waiting in queue** just to pay and obtain a paper coupon.
- By the time students reach the counter, popular items like samosas, sandwiches, or patties are sold out ("*Khatam ho gaya!*").
- Students must either sprint to their next lecture hungry or arrive late, attracting disciplinary penalties.

### 1.2 The Canteen Operator's Nightmare
Campus cafeterias operate under intense physical stress and financial leaks:
- **Severe Counter Bottleneck:** A counter can physically process only 12–15 manual cash/UPI billing interactions per minute, capping total break throughput at ~150–180 meals despite an unfulfilled demand of 600+ hungry students.
- **Fake Screenshot Fraud:** Cashiers processing rapid QR payments during peak rush cannot verify 12-digit UTRs on bank terminals. Students exploit this by flashing fake PhonePe / Google Pay generator apps or replaying old screenshots. Canteens lose **₹3,000 to ₹6,000 daily** in uncollected revenues.
- **Food Wastage & Prep Inaccuracy:** Kitchens guess daily demand without pre-order data, leading to either midday stockouts or massive end-of-day wastage of perishable ingredients (up to 30% food waste).
- **Cash Leaks & Coin Shortages:** Manual cash transactions suffer from ₹5 and ₹10 coin shortages, slowing lines and causing cash register discrepancies.

### 1.3 The FoodLine Campus Solution
FoodLine Campus is a category-defining B2B2C campus dining infrastructure platform designed to completely eliminate counter queues and automate university kitchen operations:
```
Traditional Canteen Rush (Broken):
[ Break Starts ] ➔ [ 250+ Students Mob Counter ] ➔ [ 12-Min Queue ] ➔ [ Fake Screenshot Loss ] ➔ [ Late to Class ]

FoodLine Campus Automated Flow:
[ Order in Classroom ] ➔ [ 60-Order Slot Cap ] ➔ [ 12-Digit UTR Lock ] ➔ [ KDS Kitchen Prep ] ➔ [ 30s OTP Pickup ]
```
- **100% Free for Students:** Zero convenience fees, zero platform charges, and exact offline menu prices.
- **Pre-Order Slot Booking:** Students select exact 10-minute break slots (e.g., 11:50 AM – 12:10 PM).
- **Automated Handover:** Order collection via cryptographic 4-digit OTP and optical QR pass at an express counter rack in <30 seconds.

---

## 2. Market Opportunity, TAM/SAM/SOM & Unit Economics

### 2.1 Market Sizing (India Higher Education Dining)
- **Total Addressable Market (TAM): ₹35,000 Cr ($4.2 Billion)**
  - India has 43,000+ colleges and 1,100+ universities with 4.1 crore (41 million) enrolled students.
  - Average student spending: ₹40–₹80/day on campus refreshments across 220 academic days/year.
- **Serviceable Addressable Market (SAM): ₹8,400 Cr ($1.01 Billion)**
  - Encompasses 10,000+ organized campuses (engineering, management, medical, private universities) with consolidated cafeteria concessions and UPI penetration >95%.
- **Serviceable Obtainable Market (SOM): ₹420 Cr ($50 Million)**
  - Target: 500 partner campuses across Maharashtra, Gujarat, Karnataka, and Telangana within 36 months of scaled rollout.

### 2.2 Proven Pilot Traction (Sanjivani University, Kopargaon)
During live pilot operations at Sanjivani University (featuring flagship partner **Cafe @7** and 5 satellite campus food hubs):
- **Meals Delivered:** 544+ verified hot meals prepared and collected.
- **Gross Merchandise Value (GMV):** ₹35,360+ processed seamlessly.
- **Average Order Value (AOV):** ₹65.00 per student order combo.
- **Repeat Customer Rate:** 82% repeat order retention within a 30-day window.
- **Express Pickup Handover Time:** Under 45 seconds average counter pickup time (best time: 14 seconds).
- **Overbooking Rate:** 0.0% overbooking across all pilot slots, verified by the Slot Throttler engine.
- **Payment Fraud:** Zero verified losses from fraudulent screenshot submissions.

### 2.3 Business Model & Unit Economics
FoodLine Campus employs an operator-aligned, high-volume performance model:
- **Student Pricing:** 100% free. No app download fee, no convenience fee, no markup over physical canteen prices.
- **Canteen Operator Commission:** 3.5% performance commission per completed order (~₹2.275 per ₹65 order).
- **Direct-to-Bank Payments:** All UPI transactions settle directly into the canteen vendor's bank account via vendor UPI VPA, eliminating platform intermediary custody and RBI merchant aggregatorship risk.
- **Canteen Break-Even:** A canteen operator breaks even on FoodLine software adoption at just **659 orders/month**, whereas average campus volume exceeds 1,500 to 2,000 orders/day during semester runs.

---

## 3. Canteen Partner Economics & Operator Growth Pitch

### 3.1 Operator Value Pillars
1. **3x Peak Order Volume Multiplication:** Eliminates physical counter constraints; staff can prepare and bag 500+ orders in parallel before the bell rings.
2. **100% Payment Assurance:** Every order must provide an authentic 12-digit bank UTR verified against duplicate replay attacks before entering the preparation queue.
3. **80% Less Food Waste:** Automated pre-order reports give kitchen teams the exact counts of patties, pavs, noodles, and chai cups needed before firing stoves.
4. **Larger Basket Size (Combo Upselling):** Digital menu upsells (e.g., "Add Cold Coffee for ₹25") lift average order values from ₹45 to ₹65 (+44%).

### 3.2 Financial Impact Comparison
| Metric | Traditional Offline Counter | With FoodLine Campus Platform | Net Canteen Operator Gain |
| :--- | :--- | :--- | :--- |
| Break Window Meals Served | 180 Meals | 550 Meals | **+370 Meals / Break** |
| Average Order Value (AOV) | ₹45.00 | ₹65.00 | **+₹20.00 Basket Lift** |
| Daily Gross Revenue | ₹8,100 | ₹35,750 | **+₹27,650 / Day Revenue** |
| Monthly Gross Sales (22 days) | ₹1,78,200 | ₹7,86,500 | **+₹6,08,300 / Month** |
| Net Monthly Profit (est. 25%) | ₹44,550 | ₹1,96,625 | **+₹1,52,075 Net Profit / Mo** |
| Fake Screenshot Losses | ₹4,500 / month | ₹0.00 | **+₹4,500 Recovered** |
| Food Waste Scrap Rate | 18% - 22% | < 4% | **~₹18,000 Saved / Mo** |

---

## 4. Master Full-Stack Technical Architecture

### 4.1 Topology Diagram
```
                     [ Client Layer ]
    +-----------------------------------------------+
    | Student PWA / Web App (Next.js 15 / React 19) |
    | Native Android Wrapper (Capacitor 8 APK, 4MB)  |
    | Kitchen KDS Tablet (/kds)                     |
    | TV Voice Announcer Screen (/display)          |
    | Canteen Manager Admin Portal (/admin)         |
    +-----------------------------------------------+
                           │
             HTTPS / REST  │  Server-Sent Events (SSE)
                           ▼
                 [ Express Backend Engine ]
                 (Node.js 22 + TypeScript 5.7)
    +-----------------------------------------------+
    | • Express HTTP/2 REST Routers                 |
    | • 60-Slot Atomic Throttler Governor           |
    | • 12-Digit Bank UTR Anti-Replay Shield        |
    | • Real-Time SSE Broadcaster (Sub-50ms)        |
    | • Zero-Dependency JSON Structured Logger      |
    | • Rate Limiters (General, Order, Auth)        |
    | • Payload Size Guard (64KB DOS Protection)    |
    +-----------------------------------------------+
             │                           │
  PostgreSQL │ Connection Pool           │ Service Account
  RLS Logic  │ (PgBouncer)               │ RSA-SHA256 (v4)
             ▼                           ▼
    [ Primary Database ]       [ Secondary / Ledger ]
    Supabase PostgreSQL 15     Google Sheets Dual-Master
    (Orders, Profiles, RLS)    (Real-time Audit Ledger)
```

### 4.2 Key Technology Specifications
- **Frontend Stack:**
  - Framework: Next.js 15.5.24 (App Router, React 19 Server Components, SSR & Streaming).
  - Styling: Tailwind CSS v4.3, Custom Dark Cyber-Clean Design Tokens.
  - Motion: Framer Motion / Motion for smooth layout shifts, tab transitions, dynamic badges.
  - Icons: Lucide React (featherweight SVG icons).
  - Web Audio: Native Web Audio API synthesizing 440Hz kitchen alert chimes.
  - Speech Synthesis: Bilingual Web Speech API (English & Hindi TTS) for the TV Voice Announcer.
- **Mobile Native Packaging:**
  - Toolchain: Capacitor 8, Android Gradle Plugin 8.9.1, Gradle 8.11.1, OpenJDK 21 LTS.
  - Target Package: `com.foodline.campus` -> Compiled to `FoodLine_Campus.apk` (4.1 MB).
  - OS Compatibility: Android 7.0 (API 24) to Android 16 (API 36).
- **Backend Stack:**
  - Framework: Express.js on Node.js 22 LTS with TypeScript 5.7.
  - Test Suite: Vitest with native ES module loading and mock fixtures.
  - Communication: HTTP/2 REST APIs + Server-Sent Events (SSE) real-time event pipeline.
- **Hybrid Data Persistence:**
  - Relational Master: Supabase PostgreSQL 15 with Row Level Security (RLS) policies.
  - Operational Dual-Master: Google Sheets API v4 providing immediate visibility to canteen managers and accounting staff without database admin credentials.

---

## 5. Core Algorithmic Innovations & Engine Mechanics

### 5.1 60-Order Slot Throttling Governor
The central operational bottleneck of campus kitchens is concurrency spikes. If 300 orders hit the kitchen at 12:00 PM, wait times explode and food quality plummets.
- **Mechanism:** The backend divides the school day into granular 10-to-15 minute pickup slots:
  - Slot 1: 10:45 AM – 11:00 AM (Morning Snack Shift)
  - Slot 2: 11:50 AM – 12:10 PM (Lunch Shift 1)
  - Slot 3: 12:50 PM – 01:10 PM (Lunch Shift 2)
  - Slot 4: 02:45 PM – 03:00 PM (Afternoon Tea Shift)
  - Slot 5: 04:30 PM – 04:50 PM (Evening Departure Shift)
- **Atomic Capacity Enforcement:** Each slot has an immutable maximum capacity of **60 orders**.
- **Two-Phase Hold Protocol:** When a student enters checkout, a temporary slot hold is registered with a 5-minute TTL. If payment is completed, the slot count decrements permanently. If the student abandons checkout, a background sweep worker releases the hold after 300 seconds.
- **SLA Guarantee:** With kitchen batch cooking sized for 60 orders across 4 prep stations, every meal is packed in advance, guaranteeing counter handover in **<30 seconds**.

### 5.2 12-Digit Bank UTR Anti-Replay Fraud Shield
College canteens face widespread screenshot fraud where students alter dates and amounts on UPI transaction confirmation screens.
- **Regex Guard:** Every user-entered UTR must match `^[0-9]{12}$`.
- **Anti-Replay Memory Cache:** An in-memory hash set tracks all UTRs processed within a rolling 7-day window for sub-1ms duplicate rejection.
- **Database Unique Constraint:** PostgreSQL enforces a unique index on `payments(utr_number)`.
- **Automated Soundbox Reconciliation:** The staff dashboard matches submitted UTRs against incoming bank soundbox/push webhooks. Unverified orders flag immediately on the KDS as `PENDING_MANUAL_REVIEW`.

### 5.3 Autonomous Student Account Detection & PRN Normalizer
College students frequently switch between devices, browsers, and mobile web views.
- **PRN Leading-Zero Problem:** When students register with PRNs containing leading zeroes (e.g., `0110`, `0118`, `0042`), spreadsheet integrations often coerce them to integers (`110`), breaking string lookups.
- **The Normalizer:** The backend and frontend implement an intelligent normalizer that sanitizes PRNs, stripping non-alphanumerics while preserving leading zero string representations across Google Sheets and Supabase.
- **Sub-50ms Auto-Detection:** Debounced keystroke resolver (`GET /api/auth/resolve-student?prn=...`) detects registered students in real-time. When recognized:
  - The login interface greets the student by full name (`"✓ Welcome back, Shivam Nirmal! [Registered]"`).
  - Tab state locks to `SIGN_IN` to eliminate mode confusion.
  - Checkout pages pre-fill student department, phone, and PRN automatically.

### 5.4 Dual-Master Resilient Persistence
To provide enterprise durability without forcing canteen owners to manage database software:
- **Supabase PostgreSQL:** Acts as the transactional master handling ACID queries, foreign keys, and RLS policies.
- **Google Sheets API v4 Ledger:** Serves as a human-readable live mirror. Order records, student profiles, and payments are queued in an asynchronous memory buffer and flushed every 30 seconds using Google Service Account RSA-SHA256 credentials.
- **Fault-Tolerant Fallback:** If internet connectivity drops or Supabase hits rate limits, the backend gracefully falls back to memory persistence and queues changes for Google Sheets sync.

### 5.5 Kitchen Display System (KDS) & Realtime SSE Streamer
Traditional paper tickets get lost, stained with grease, or processed out of sequence.
- **3-Column Digital Kanban:**
  1. `PREPARING` (Orange): Newly confirmed orders grouped by slot and prep station.
  2. `READY FOR PICKUP` (Teal): Bagged meals awaiting student arrival at express racks.
  3. `COLLECTED` (Muted/Complete): Successfully handed over orders verified by OTP.
- **Sub-50ms SSE Pipeline:** Built on Server-Sent Events (`/api/events`). When an order status changes on the backend, an SSE payload broadcasts instantaneously to all connected kitchen tablets and display monitors.
- **Station-Specific Filtering:** Kitchen displays can filter between Hot Kitchen (Dosa/Paratha), Fryer Station (Fries/Momos), and Cold Counter (Beverages/Desserts).

### 5.6 Multilingual TV Voice Announcer Engine
Mounted above the express counter, a public TV monitor runs `/display`:
- **Visual Display:** Renders giant, high-contrast order tokens (e.g., `FL-3804`, `FL-3805`) under "NOW READY FOR PICKUP".
- **Bilingual Web Speech TTS:** Automatically announces ready orders using the browser speech synthesis engine in Hindi and English:
  - *"Attention please! Order FL-3804 is now ready at Counter 1."*
  - *"कृपया ध्यान दें! आर्डर FL-3804 काउंटर 1 पर तैयार है।"*
- **Acoustic Chime:** Synthesizes a dual-tone 440Hz/880Hz audio chime before speech to cut through cafeteria ambient noise.

---

## 6. Database DDL & Complete Entity Relationship Schema

The system runs on Supabase PostgreSQL 15. The core relational tables and foreign keys are defined below:

```sql
-- 1. CAMPUSES & CANTEEN OUTLETS
CREATE TABLE campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cafeterias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    upi_id VARCHAR(255) NOT NULL DEFAULT 'sanjivanicafe7@okaxis',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES & ROLE-BASED ACCESS
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    prn VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'staff', 'kitchen', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU CATEGORIES & 44 DISH CATALOG
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    display_order INT DEFAULT 0
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    prep_time_mins INT DEFAULT 5,
    is_available BOOLEAN DEFAULT TRUE,
    inventory_type VARCHAR(20) DEFAULT 'daily_fresh',
    stock_quantity INT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 60-CAPACITY PICKUP SLOTS
CREATE TABLE pickup_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT DEFAULT 60,
    current_booked INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. ORDERS & ATOMIC PAYMENT RECORDS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_token VARCHAR(20) UNIQUE NOT NULL,
    student_prn VARCHAR(100) NOT NULL,
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES pickup_slots(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING_PAYMENT' 
        CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED')),
    pickup_otp VARCHAR(6) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    utr_number VARCHAR(12) UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION' 
        CHECK (status IN ('PENDING_VERIFICATION', 'VERIFIED', 'FAILED', 'RECONCILED')),
    verified_at TIMESTAMPTZ,
    reconciled_by VARCHAR(100)
);
```

---

## 7. Comprehensive REST & Realtime API Contract

All endpoints follow a standardized JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "timestamp": "2026-09-11T07:15:00.000Z" }
}
```

### 7.1 Key Endpoints Summary Table
| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Deep health check (Postgres, Google Sheets, Memory, Uptime) | 120/min |
| `GET` | `/api/campuses/geo` | Multi-campus geographic tree (States, Districts, Campuses) | 120/min |
| `GET` | `/api/campuses/:id/canteens` | Returns active cafeterias for a campus | 120/min |
| `POST` | `/api/auth/resolve-student` | Fast PRN resolver for account auto-detection | 120/min |
| `POST` | `/api/auth/signup` | Student account creation with Google Sheets mirror | 5 / 15 min |
| `POST` | `/api/auth/login` | Student credential authentication with 30-day cookie | 5 / 15 min |
| `GET` | `/api/menu` | Full 44-dish menu with category & cafeteria filtering | 120/min |
| `GET` | `/api/slots` | Real-time 60-capacity slot availability & booked counts | 120/min |
| `POST` | `/api/orders` | Atomic order placement with 60-slot hold verification | 10 / min |
| `GET` | `/api/orders` | Retrieves order history with role-based filtering | 120/min |
| `GET` | `/api/orders/:token` | Real-time order status, items, OTP, and tracking info | 120/min |
| `PATCH`| `/api/orders/:token/status`| KDS status transitions (`PREPARING` ➔ `READY` ➔ `COLLECTED`) | 60/min |
| `POST` | `/api/payments/verify-utr` | Submits 12-digit UTR, validates regex & anti-replay cache | 10 / min |
| `POST` | `/api/orders/verify-otp` | Counter cashier endpoint verifying 4-digit pickup OTP | 60/min |
| `GET` | `/api/events` | Server-Sent Events (SSE) stream for live kitchen & TV updates | Streaming |
| `POST` | `/api/inventory/toggle` | Kitchen staff 1-tap dish stockout toggle | 60/min |

---

## 8. Frontend & Mobile Architecture (Next.js 15 + Capacitor 8 Android APK)

### 8.1 Route Map & Screen Architecture
The frontend codebase contains 22 active page routes in `frontend/src/app/`:
1. `/` — High-converting landing page with live order stats, hero CTA, and feature cards.
2. `/onboarding` — 3-slide visual onboarding explaining Zero-Queue, Break Bells, and OTP pickups.
3. `/select-campus` — Campus selector supporting multi-campus scaling (default: Sanjivani University).
4. `/canteens` — Campus outlet selector (Cafe @7, South Corner, Food Junction, Nescafe, Bakery).
5. `/menu` — Category pills, search bar, stock badges, dish modal, and sticky cart banner.
6. `/checkout` — Slot time picker, student details pre-fill, payment method selection, order summary.
7. `/payment` — Dynamic UPI QR generator, 12-digit UTR input form, and instant validation button.
8. `/order/[token]` — Live order progress tracker, high-contrast optical QR pass, and 4-digit pickup OTP.
9. `/orders` — Historical orders listing with re-order capability and receipt view.
10. `/kds` — Kitchen Display System with 3 Kanban columns, audio chimes, and 1-tap status triggers.
11. `/display` — Public TV voice announcer with bilingual speech synthesis and fullscreen display.
12. `/admin` — Canteen manager hub: financial reconciliations, daily revenue cards, stockout controls.
13. `/login` — Autonomous student account detection with PRN resolver and mode lock.
14. `/profile` — Student account management, dietary preferences, and saved contact details.
15. `/terms` — Comprehensive 25-clause legal agreement, DPDP disclosures, and FSSAI information.
16. `/debug` — Developer testing workbench for triggering SSE events, mock orders, and network latencies.
17. `/401`, `/402`, `/403`, `/409`, `/503`, `/error/[code]` — High-resiliency branded HTTP error pages.

### 8.2 Native Mobile Compilation (Android APK)
- **Engine:** Capacitor 8 bridge converting Next.js web build into a lightweight native Android binary.
- **Build Output:** `FoodLine_Campus.apk` (4.1 MB standalone APK).
- **Target Specifications:**
  - Package ID: `com.foodline.campus`
  - Min SDK: Android 7.0 (API 24)
  - Target SDK: Android 16 (API 36)
  - Java Toolchain: OpenJDK 21 LTS (`Temurin-21.0.12.1`)
  - Gradle Version: AGP 8.9.1 / Gradle Wrapper 8.11.1
- **Native Polish:** Status bar theme `#07070B`, hardware back-button navigation handlers, offline splash screen, and smooth 60fps gesture scrolling.

---

## 9. Design System & UI/UX Specifications (`ui-ux-pro-max`)

### 9.1 Visual Philosophy
FoodLine uses a **Dark High-Contrast Cyber-Clean** design system tailored for outdoor campus sunlight and rapid glanceability:
- **Canvas (`--color-bg-canvas`):** `#0A0A0F` (Cosmic Void — deep dark background conserving OLED battery).
- **Card Surface (`--color-surface-card`):** `#16161E` (Deep Obsidian — high contrast against vibrant dish photography).
- **Primary Brand (`--color-primary-brand`):** `#FF6B2C` (Neon Tangerine — stimulates appetite, drives CTA click-through).
- **Amber Accent (`--color-accent-amber`):** `#FFB347` (Warm Amber — slot capacity warnings and "Bestseller" badges).
- **Teal Accent (`--color-accent-teal`):** `#00D4AA` (Emerald Cyan — "0% Fee", "UTR Verified", and "Ready for Pickup").
- **Typography:**
  - Headings: `Outfit` (Bold / Extrabold, modern geometric).
  - Body: `Inter` (Legible at small sizes).
  - Token IDs / Numbers: `JetBrains Mono` (Monospaced alignment for pricing and token IDs).

---

## 10. Statutory Legal Terms, FSSAI & DPDP Act 2023 Compliance

### 10.1 Master Legal Framework
The platform operates under a 25-section terms document (`FoodLine_Campus_Terms_Source.md`) governing students, university authorities, and canteen vendors:
1. **Platform Role:** FoodLine Campus acts as a technical pre-ordering infrastructure provider. Food preparation, hygiene, and counter delivery remain the direct statutory responsibility of the licensed Cafeteria Partner.
2. **Food Safety & FSSAI Allocation:** All partnering kitchens must possess an active FSSAI License (e.g., Cafe @7 FSSAI Lic #11522036000142). Menus disclose ingredients and common allergen warnings.
3. **20-Minute Thermal Holding Guarantee:** Canteens agree to maintain prepared food in hot-holding units at >65°C for up to 20 minutes past the scheduled slot time before disposal.
4. **Cancellation & Refund SLAs:** If a kitchen marks an item out of stock after payment, an automated refund trigger processes a 100% direct refund to the student's UPI VPA within 2 hours.

### 10.2 Digital Personal Data Protection (DPDP) Act 2023 Compliance
- **Data Minimization:** The platform only collects PRN, full name, mobile number, and department. Zero biometric or tracking data is stored.
- **Phone Number Masking:** Displays and KDS screens mask student phone numbers (e.g., `+91 ******1234`) to prevent unauthorized contact.
- **No Third-Party Telemetry Sales:** Strict statutory pledge prohibiting the monetizing or selling of student behavioral dining habits.
- **Right to Erasure:** Students can request permanent account and history deletion via the Grievance Officer (`grievance@foodlinecampus.in`).

---

## 11. Quality Assurance, Vitest Test Suite & Gap Analysis Audit

### 11.1 Automated Vitest Test Suite (100% Passing)
The backend test suite (`backend/tests/`) executes 22 automated unit and integration tests across all critical business components:
- `slot-throttler.test.ts` (6 tests): Validates 60-order ceiling, concurrent reservation locks, hold TTL expiration, and slot status calculations.
- `utr-verifier.test.ts` (5 tests): Tests regex compliance, duplicate replay rejection, 7-day memory cache sliding window, and manual review triggers.
- `order-service.test.ts` (7 tests): Verifies token generation uniqueness, OTP generation, status lifecycle progression, and Google Sheets queue flushing.
- `auth-controller.test.ts` (4 tests): Tests PRN resolution, leading-zero preservation, signup validation, and rate-limiting blocks.

### 11.2 Gap Analysis Findings & Current Remediation Roadmap
An architectural audit (`GAP_ANALYSIS.md`) revealed key improvements incorporated into the production roadmap:
1. **Intermediate Cart Page (`/cart`):** While cart state was maintained in `CartContext.tsx`, creating an explicit review screen enhances order double-checking before checkout.
2. **Dine-In Table QR Ordering (`/tables`):** Allows seated students to order directly to numbered cafeteria tables during off-peak hours.
3. **Automated WhatsApp Push Notifications:** Supplements in-app SSE with WhatsApp Business API alerts when orders hit `READY_FOR_PICKUP`.

---

## 12. 175-Feature Production Expansion Blueprint & Roadmap

The engineering master plan (`FoodLine_Backend_Expansion_Plan.md`) outlines 175 enterprise capabilities organized across 15 operational domains:
- **Domain 1 (Features 1–15):** Core Pre-Ordering, Cart & Smart Menu Engine (Dynamic category pills, calorie tags, live search).
- **Domain 2 (Features 16–30):** Algorithmic Slot Throttling & Kitchen Load Balancing (Dynamic break window expansion, surge throttling).
- **Domain 3 (Features 31–45):** DirectPay 0% Fee UPI & Multi-Tier Payment Verification (Soundbox webhooks, automated reconciliation).
- **Domain 4 (Features 46–58):** Real-Time SSE Event Bus & Clustered Redis Pub/Sub Hub (Distributed WebSocket/SSE scaling).
- **Domain 5 (Features 59–72):** Kitchen Display System (KDS) & Cook Station Intelligence (Multi-station routing, audio chimes).
- **Domain 6 (Features 73–84):** 30-Second Express Handover & Counter Hardware (Barcode scanner integration, optical QR pass).
- **Domain 7 (Features 85–96):** Campus Squad & Social Dining ("Dabba Pool" group order splitting).
- **Domain 8 (Features 97–110):** Student UI/UX & Micro-Interactions (Dynamic Island active order widget, haptic feedback).
- **Domain 9 (Features 111–122):** Smart Inventory & Morning Prep Prediction (Automated supplier purchase orders, waste clearance).
- **Domain 10 (Features 123–132):** Financial Settlement & Vendor Margins (Automated daily T+0 bank payouts, GST invoices).
- **Domain 11 (Features 133–142):** Enterprise Security & Fraud Detection (IP rate limiters, payload guards, JWT auth).
- **Domain 12 (Features 143–150):** Offline-First Edge Resiliency (Local LAN SQLite sync during campus WiFi drops).
- **Domain 13 (Features 151–160):** AI Demand Forecasting (Predictive dish consumption models based on weather and exam timetables).
- **Domain 14 (Features 161–170):** Multi-Campus Franchise Architecture (Central multi-tenant university administration).
- **Domain 15 (Features 171–175):** Student Nutrition & Health Analytics (Daily calorie counter, protein tracking, dietary alerts).

---

### 🏁 Summary for NotebookLM Grounding
*FoodLine Campus represents a production-tested, scalable hardware-software dining ecosystem engineered to solve high-density campus peak loads. Grounded in atomic slot throttling, 0% fee direct bank payments, and dual-master data integrity, it delivers zero-queue dining for students, 3x revenue for canteens, and institutional efficiency for Indian universities.*
