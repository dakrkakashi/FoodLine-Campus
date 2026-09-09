# ⚡ 02 • Core Feature Specifications & Workflows
**Project Name:** FoodLine Campus  
**Module Suite:** Student Client, Kitchen KDS, Counter Display, Admin Hub

---

## 1. Feature Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                         FOODLINE CAMPUS MODULES                        │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│ 📱 Student PWA   │ 👨‍🍳 Kitchen KDS  │ 📺 TV Announcer  │ 📊 Admin Hub  │
│  /menu           │  /kds            │  /display        │  /admin       │
│  /checkout       │  OTP Validation  │  Audio Chimes    │  Ledger Audit │
│  /order/[token]  │  1-Tap Stockout  │  Marathi/Hindi/EN│  88/12 Splits │
└──────────────────┴──────────────────┴──────────────────┴───────────────┘
```

---

## 2. Deep-Dive Feature Specifications

### F-01: 60-Order Slot Throttling Governor
- **Purpose:** Kitchens have finite physical fryer and grill space (50–60 items per 15 minutes). Uncontrolled orders crash the kitchen.
- **Specification:**
  - Campus breaks are divided into 15-minute intervals (e.g. `10:45 AM – 11:00 AM`, `11:00 AM – 11:15 AM`, `1:00 PM – 1:15 PM`).
  - Each slot enforces a hard physical cap of **60 orders**.
  - Capacity reservations are atomic in PostgreSQL/in-memory lock manager.
  - When booked count reaches 60, the slot is locked (`is_full: true`) and the UI nudges the student to the next available interval.
  - **Stress Test Verification:** 65 concurrent burst requests yield exactly 60 accepted and 5 throttled (0.00% overbooking).

### F-02: 12-Digit Bank UTR Verification Shield
- **Purpose:** Canteens lose ₹5k/day because staff cannot verify mobile payment screenshots during peak rush hours.
- **Specification:**
  - Student selects DirectPay UPI and transfers exact order total.
  - Student inputs the **12-digit UPI Bank UTR Reference Number** (Unified Transaction Reference).
  - Validation rules:
    - Must be exactly 12 numeric digits (`^\d{12}$`).
    - Single-use uniqueness enforcement (prevents reusing an old UTR from a previous day).
    - Checks atomic UTR ledger in database before transitioning order status to `CONFIRMED`.
    - Duplicates or malformed inputs return `409 Conflict` or `400 Bad Request`.

### F-03: High-Contrast Optical QR Pass & 4-Digit Pickup OTP
- **Purpose:** Fast, unambiguous food handover without shouting names or token slips.
- **Specification:**
  - When an order is confirmed, the student receives a live tracking screen at `/order/[token]`.
  - Displays:
    1. **Order Token:** High-entropy token (e.g. `FL-1793`).
    2. **High-Contrast Optical QR Code:** Readable by camera scanners even in direct sunlight or dim cafeteria lighting.
    3. **4-Digit Pickup OTP:** Secret PIN (e.g. `6065`) known only to the student.
  - Handover Protocol: Kitchen staff enters or scans the 4-digit OTP. The backend validates and transitions the order to `COLLECTED`, releasing the slot capacity.

### F-04: Kitchen Display System (KDS) Tablet (`/kds`)
- **Purpose:** Replaces messy paper tickets with a rugged touch-optimized kitchen terminal.
- **Specification:**
  - Real-time column queue: `CONFIRMED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COLLECTED`.
  - Batching Counters: Summarizes total active items (e.g. `18 Samosas`, `12 Cutting Chais`, `8 Dosas`) so chefs cook in batches.
  - 1-Tap Quick Stockout Toggle: Kitchen staff can tap any dish to instantly mark it *Sold Out* across all student menus.
  - Large Touch Numeric Keypad: Allows cooks with kitchen gloves to easily tap the 4-digit OTP.
  - Visual Time Warnings: Color-coded elapsed ticket alerts (`⏱️ 2m Normal`, `⚠️ 8m Rush`, `🚨 15m Delayed`).

### F-05: Multilingual Counter TV Announcer Screen (`/display`)
- **Purpose:** Large-screen TV mounted above the counter announcing ready orders.
- **Specification:**
  - Split counter dispatching:
    - Counter 1: Hot Cooked Food & Meals.
    - Counter 2: Express Beverages, Snacks & Quick Bites.
  - Multilingual Web Audio TTS: Synthesizes crystal-clear natural speech in **English (`en-IN`)**, **Hindi (`hi-IN`)**, and **Marathi (`mr-IN`)**:
    - *"Order FL-1793 is ready at Counter 1!"*
    - *"ऑर्डर FL-1793 काउंटर 1 वर तयार आहे!"*
  - Dual chime audio alerts with gesture-unlocked AudioContext singleton.

### F-06: Multi-Canteen & Geo-Campus Engine (`/select-campus`, `/canteens`)
- **Purpose:** Allows scaling across thousands of campuses with multiple dining outlets per campus.
- **Specification:**
  - 4-Tier Geo Drilldown: `State` $\rightarrow$ `District` $\rightarrow$ `City/Town` $\rightarrow$ `Campus`.
  - Pilot Outlets at Sanjivani University:
    1. *Cafe @7* (Main Academic Quad)
    2. *South Corner Dosa Bar* (Central Library Block)
    3. *Nescafe Campus Kiosk* (Mechanical Lawns)
    4. *MBA Block Cafeteria* (Executive Wing)
    5. *Central Hostel Dining Mess* (Hostel Complex)
  - Live filtering by canteen: displays opening hours, prep times, and outlet-specific menu items.

### F-07: Server-Sent Events (SSE) Real-Time Broadcast
- **Purpose:** Sub-millisecond order status streaming without battery-draining polling.
- **Specification:**
  - Endpoint: `GET /api/order/:token/stream`.
  - Connection payload: `ORDER_SNAPSHOT` containing initial order details.
  - Live updates: `ORDER_UPDATE` payload broadcast immediately when kitchen transitions status.
  - Auto-reconnect resilience with exponential backoff on client drop.

### F-08: DPDP 24-Hour Automated Order Retention Purge
- **Purpose:** Compliance with India's Digital Personal Data Protection (DPDP) Act 2023.
- **Specification:**
  - Student orders contain personal student PRN and phone contacts.
  - Hourly background cron automatically purges `COLLECTED` and `CANCELLED` order logs older than 24 hours.
  - Keeps database lightweight and guarantees student privacy.
