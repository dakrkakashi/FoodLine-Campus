# 📡 FoodLine Campus — API Specification & Database Schema
> **NotebookLM Knowledge Module 02** | **Domain:** API Contracts, Data Models, SQL DDL, Dual-Master Sync

## 1. Standard API Response Envelope
All Express route handlers return a strictly structured JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-09-11T07:15:00.000Z",
    "requestId": "req_fl_9831a"
  }
}
```

## 2. API Endpoint Catalog

### 2.1 Health & Diagnostics
- `GET /health` — Deep system probe returning uptime, memory usage (RSS/heap), PostgreSQL connection latency, and Google Sheets API sync status.
- `GET /api/telemetry` — Active SSE connection count, orders processed today, and average pickup latency.

### 2.2 Auth & Student Resolution
- `POST /api/auth/resolve-student` — Fast debounced endpoint matching student PRN or email against Supabase `profiles` and Google Sheets `Users` tab. Returns `{ exists: boolean, student: { prn, fullName, email, phone, department } }`.
- `POST /api/auth/signup` — Registers new student profile, hashes password, appends row to Google Sheets master, and sets 30-day session cookies.
- `POST /api/auth/login` — Verifies student credentials, generates JWT bearer token, and issues session cookie.

### 2.3 Menu & Campus Outlets
- `GET /api/campuses/geo` — Returns geographic campus hierarchy (State > District > University Campus).
- `GET /api/campuses/:id/canteens` — Returns list of active outlets for a campus (e.g., Cafe @7, South Corner, Food Junction, Nescafe, Bakery).
- `GET /api/menu` — Returns full catalog of 44 verified dishes across 8 categories with live stock availability. Supports filtering via `?cafeteriaId=...` and `?categoryId=...`.

### 2.4 Orders, Slots & Kitchen KDS
- `GET /api/slots` — Returns pickup slot windows (start time, end time, max capacity: 60, current booked count).
- `POST /api/orders` — Atomic order creation. Verifies slot capacity, reserves a temporary hold, creates an order record, issues a 4-digit pickup OTP, and broadcasts an SSE event.
- `GET /api/orders/:token` — Returns real-time order tracking details and optical QR pass.
- `PATCH /api/orders/:token/status` — Kitchen staff updates status (`PREPARING` ➔ `READY` ➔ `COLLECTED`).
- `POST /api/orders/verify-otp` — Express counter cashier validates student's 4-digit pickup OTP to finalize handover.

### 2.5 Payments & Fraud Shield
- `POST /api/payments/verify-utr` — Validates 12-digit UTR regex (`^[0-9]{12}$`), checks 7-day anti-replay memory cache, records payment under `PENDING_VERIFICATION`, and links to order token.
- `POST /api/admin/reconcile` — Staff reconciliation endpoint matching submitted UTR against soundbox logs.

### 2.6 Realtime Event Bus
- `GET /api/events` — Server-Sent Events (SSE) stream broadcasting order state changes, kitchen ticket alerts, and TV announcer calls with 15-second keep-alive heartbeats.

---

## 3. Database Schema (PostgreSQL 15 / Supabase)

- **`campuses`**: `id UUID PRIMARY KEY`, `name VARCHAR(255)`, `location VARCHAR(255)`, `created_at TIMESTAMPTZ`.
- **`cafeterias`**: `id UUID PRIMARY KEY`, `campus_id UUID FK`, `name VARCHAR(255)`, `upi_id VARCHAR(255)`, `is_active BOOLEAN`.
- **`profiles`**: `id UUID PRIMARY KEY`, `email VARCHAR(255)`, `full_name VARCHAR(255)`, `prn VARCHAR(100) UNIQUE`, `department VARCHAR(100)`, `phone VARCHAR(20)`, `role VARCHAR(50)`.
- **`categories`**: `id UUID PRIMARY KEY`, `name VARCHAR(100)`, `icon VARCHAR(50)`, `display_order INT`.
- **`menu_items`**: `id UUID PRIMARY KEY`, `cafeteria_id UUID FK`, `category_id UUID FK`, `name VARCHAR(255)`, `price NUMERIC(10,2)`, `prep_time_mins INT`, `is_available BOOLEAN`, `stock_quantity INT`.
- **`pickup_slots`**: `id UUID PRIMARY KEY`, `cafeteria_id UUID FK`, `label VARCHAR(100)`, `start_time TIME`, `end_time TIME`, `max_capacity INT DEFAULT 60`, `current_booked INT DEFAULT 0`.
- **`orders`**: `id UUID PRIMARY KEY`, `order_token VARCHAR(20) UNIQUE`, `student_prn VARCHAR(100)`, `cafeteria_id UUID FK`, `slot_id UUID FK`, `total_amount NUMERIC(10,2)`, `status VARCHAR(50)`, `pickup_otp VARCHAR(6)`, `created_at TIMESTAMPTZ`.
- **`order_items`**: `id UUID PRIMARY KEY`, `order_id UUID FK`, `menu_item_id UUID FK`, `item_name VARCHAR(255)`, `quantity INT`, `unit_price NUMERIC(10,2)`, `subtotal NUMERIC(10,2)`.
- **`payments`**: `id UUID PRIMARY KEY`, `order_id UUID FK`, `utr_number VARCHAR(12) UNIQUE`, `amount NUMERIC(10,2)`, `status VARCHAR(50)`, `verified_at TIMESTAMPTZ`.
