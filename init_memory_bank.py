import os

MB_DIR_PLAN = r"C:\Users\Shivam Manoj Nirmal\Desktop\PPT OTHER TASKES\memory-bank"
MB_DIR_APP = r"C:\Users\Shivam Manoj Nirmal\Desktop\FoodLine App\memory-bank"

PROJECT_BRIEF = """# 📌 Project Brief: FoodLine Campus Ecosystem

## Mission
Eliminate collegiate break bottlenecks by providing a sub-second digital pre-ordering, algorithmic slot-throttling, and 30-second express pickup platform tailored for Indian college canteens.

## Target Pilot Campus
- **University:** Sanjivani University, Kopargaon (MH)
- **Anchor Canteen:** Cafe @7 (Main University Cafeteria)
- **Pilot Population:** 4,500 students & faculty
- **Pilot Menu:** 44 verified dishes across 12 categories (₹10 Tea to ₹150 Pizza)

## Core Value Proposition
- **Students:** Gain back 12–15 minutes of break time, eliminate queue standing, guarantee hot meals.
- **Canteen Owners:** 0% payment gateway commission (Option C UPI), slot-batched kitchen prep, zero order rush chaos.
- **University Administration:** Verified student SSO (@sanjivani.edu.in), reduced cafeteria overcrowding, enhanced campus tech infrastructure.
"""

PRODUCT_CONTEXT = """# 🎯 Product Context & User Journeys

## Why FoodLine Exists
In Indian universities, lunch breaks are short (20–40 minutes). 1,000+ students rush into canteens simultaneously, causing 14.5-minute queues, kitchen chaos, missed meals, and lost canteen revenue.

## Core User Personas
1. **The Rushed Engineering Student (Rahul):** Has a 20-minute lab break. Pre-orders Samosa Pav + Cold Coffee during lecture, arrives at 11:50 AM, flashes QR pass, and grabs hot food in 18 seconds.
2. **The Canteen Cook (Chef Ramesh):** Instead of handling 60 shouting students, views the KDS tablet showing aggregated demand for Slot 11:50 AM (e.g. 18 Dosas, 10 Coffees) and batch-cooks efficiently.
3. **The Canteen Owner (Mahesh Bhai):** Saves 2.0% + GST on every transaction via Option C direct UPI and tracks daily turnover in real time.
"""

SYSTEM_PATTERNS = """# 📐 System Patterns & Architecture

## Architecture Overview (C4 Container Model)
```
[Student Mobile PWA] ──(HTTPS/REST)──► [Next.js 15 App Router Edge API]
                                             │
                                             ├──► [Supabase PostgreSQL DB] (RLS + Transactions)
                                             ├──► [SSE Event Broker] ──► [Student Tracking HUD]
                                             └──► [Kitchen KDS Tablet] (Real-time Kanban)
```

## Architectural Patterns
1. **Option C Zero-Fee UPI & Anti-Replay Guard:** Direct merchant QR scan + 12-digit bank UTR entry + unique database constraint validation.
2. **Dynamic Slot Throttling Engine:** Capped at 60 prep-units per 10-minute slot. Automatically shifts incoming orders to subsequent slots when saturated.
3. **Server-Sent Events (SSE):** Lightweight unidirectional real-time event pipeline for instantaneous status updates (`QUEUED` ➔ `PREPARING` ➔ `READY`).
4. **Idempotency & Resilience:** `Idempotency-Key` headers on all mutating POST/PUT requests preventing duplicate orders under unstable campus cellular networks.
"""

TECH_CONTEXT = """# 🛠️ Tech Context & Specifications

## Stack Matrix
- **Frontend Framework:** Next.js 15.1 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Custom OKLCH High-Contrast Dark Tokens + Motion
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) + Sanjivani Google Workspace SSO OAuth
- **Icons & Primitives:** Lucide React SVG icons + Radix UI accessible primitives
- **Knowledge Engine:** Persistent Graphify AST Graph (3,226 nodes) + Antigravity Skills Suite (307 skills)
"""

ACTIVE_CONTEXT = """# ⚡ Active Context & Next Milestones

## Current State
- ✅ Master Planning, PRD, System Design, and Tech Stack documents established.
- ✅ Full 44-dish Cafe @7 blackboard menu catalog transcribed and mapped.
- ✅ 15-Slide interactive dark deck and PowerPoint presentation built.
- ✅ Working Next.js 15 frontend application scaffolded in `C:\\Users\\Shivam Manoj Nirmal\\Desktop\\FoodLine App`.
- ✅ 307 Antigravity skills installed globally and locally.
- ✅ College SSO & Student PRN Login flow designed and integrated.

## Immediate Next Focus
1. Connect live Supabase database instance with PostgreSQL schemas.
2. Configure live Server-Sent Events (SSE) route handlers.
3. Perform end-to-end simulation across student checkout, KDS tablet, and express QR verification.
"""

API_CONTRACTS = """# 🔌 API Contracts & REST Design Principles

Following strict `api-design-principles` standards: JSON:API resource modeling, standard HTTP verbs, predictable error envelopes, and idempotency guarantees.

## 1. Global Standard Response Envelope
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-08-27T22:19:00Z",
    "requestId": "req_8492019"
  }
}
```

## 2. Global Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "SLOT_CAPACITY_EXCEEDED",
    "message": "Selected slot 11:50 AM is fully booked. Please select 12:10 PM.",
    "details": {
      "slotId": "slot-lunch-a",
      "available": 0,
      "nextAvailableSlot": "slot-lunch-b"
    }
  }
}
```

## 3. Core REST Endpoints
| Verb | Endpoint | Description | Idempotent |
|---|---|---|---|
| `GET` | `/api/v1/campuses/:id/menu` | Retrieve active 44-dish menu with real-time stockouts | Yes |
| `GET` | `/api/v1/campuses/:id/slots` | Retrieve break slots with remaining capacity meters | Yes |
| `POST` | `/api/v1/orders` | Initiate pre-order and lock temporary slot reservation | Yes (`Idempotency-Key`) |
| `POST` | `/api/v1/payments/verify-utr` | Submit 12-digit bank UTR for verification & issue QR pass | Yes (`Idempotency-Key`) |
| `GET` | `/api/v1/orders/:token/stream` | Server-Sent Events (SSE) live tracking stream | Yes |
| `PATCH` | `/api/v1/kds/orders/:id/status` | Kitchen status progression (`PREPARING`, `READY`, `COLLECTED`) | Yes |
| `PATCH` | `/api/v1/kds/inventory/:dishId` | Toggle 1-tap stockout availability | Yes |
"""

def create_mb(target_dir):
    os.makedirs(target_dir, exist_ok=True)
    files = {
        "projectbrief.md": PROJECT_BRIEF,
        "productContext.md": PRODUCT_CONTEXT,
        "systemPatterns.md": SYSTEM_PATTERNS,
        "techContext.md": TECH_CONTEXT,
        "activeContext.md": ACTIVE_CONTEXT,
        "api-contracts.md": API_CONTRACTS,
    }
    for name, content in files.items():
        p = os.path.join(target_dir, name)
        with open(p, "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")
        print(f"Created: {p}")

def main():
    print("Initializing ADK Memory Bank in Planning Workspace...")
    create_mb(MB_DIR_PLAN)
    print("Initializing ADK Memory Bank in FoodLine App Workspace...")
    create_mb(MB_DIR_APP)
    print("Memory Bank Initialization Complete!")

if __name__ == "__main__":
    main()
