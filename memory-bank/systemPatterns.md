# 📐 System Patterns & Architecture

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
