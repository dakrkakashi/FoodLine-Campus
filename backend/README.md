# ⚡ FoodLine Backend Engine & Services

Specialist Owner: **Antigravity (Backend Specialist)**  
Target Pilot: **Sanjivani University, Kopargaon (Cafe @7)**

## 🚀 Features
- **RESTful API Service:** Express + TypeScript REST API providing menu, slots, orders, payments, KDS, and analytics.
- **Dynamic Slot Throttler:** Enforces strict 60-order max capacity across campus break windows.
- **Option C Bank UTR Verifier:** 12-digit UPI transaction reference validation and anti-replay cache.
- **Server-Sent Events (SSE) Live Stream:** Real-time bi-directional status updates for student order screens (`/api/order/:token/stream`).
- **PostgreSQL Database:** Supabase DDL schema with RLS policies, indexing, and 44-dish menu seed.

## 🛠️ Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run backend dev server
npm run dev

# Server will listen on http://localhost:4000
```
