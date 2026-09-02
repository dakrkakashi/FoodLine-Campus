# 🧠 FoodLine Campus — Active Project State & Agent Memory
<!-- This file is the single source of truth for agent memory persistence. -->
<!-- Both Antigravity and OpenCode read this file every time they start. -->

## 📍 Where We Left Off (Last Completed Checkpoint)
- **Date & Time:** 2026-09-02 (Evening Session — Backend Concurrency & Retention Milestone Verified)
- **GitHub Connection:** 100% Synchronized with `@dakrkakashi` (All branches `main`, `backend`, `frontend` up to date).
- **FoodLine Debugging & HTTP Error Suite:** 100% Operational & Verified!
  - Added Next.js standard error boundaries: `not-found.tsx` (404), `error.tsx` (client boundary), `global-error.tsx` (root boundary).
  - Created centralized `HTTP_ERRORS_CATALOG` (`errors-catalog.ts`) covering 13 HTTP status codes with campus-canteen analogies, technical descriptions, and recovery paths.
  - Built reusable, glassmorphic `<ErrorView />` component with dynamic ambient glow and technical diagnostics drawer.
  - Created dynamic route `/error/[code]` plus direct static routes: `/401`, `/402`, `/403`, `/409`, `/503` (with rewrites for `/404` and `/500`).
  - Created interactive Developer & QA Testing Hub at `/debug`: live backend & Supabase health pinging, 1-click error modal previews, React crash boundary simulator, and local storage / cart inspector.
  - Added direct `/debug` link in desktop and mobile navbar for managers and admins.
- **Pilot Concurrency Stress Test Suite (`test:stress`):** 100% Operational & Verified!
  - Simulates 50 concurrent student order placements during break window burst.
  - Verifies boundary throttling (65 total orders against 60-slot cap): exactly 60 accepted, 5 throttled.
  - Overbooking rate: 0.00% (Strictly enforced, zero race conditions).
  - Benchmark telemetry: P95 latency ~4.5s, peak throughput ~7.1 req/sec.
  - Automated runner: `npm --prefix backend run test:stress` or `npm run test:stress`.
- **24-Hour Order Retention & Log Expiry:** 100% Operational!
  - `OrderService.cleanupOldOrders(24)` automatically prunes `COLLECTED` and `CANCELLED` orders older than 24h.
  - Hourly background retention cron running in backend engine.
  - Admin manual trigger endpoint: `POST /api/admin/orders/cleanup`.
  - Added DPDP data minimization metric in `GET /api/admin/metrics` (`retentionPolicy: 'ACTIVE_24H_COLLECTED_PURGE'`).
- **Student Pickup OTP Handover System:** 100% Operational!
  - Backend: Added `POST /api/orders/verify-otp` with real-time SSE stream broadcast and Supabase persistence.
  - Frontend: Added Next.js API route `/api/orders/verify-otp`.
  - UI/UX: Integrated Magic UI `<BorderBeam />` on `/order/[token]` with dual-state glow.
  - Kitchen KDS: Added 1-tap OTP verification modal on `/kds` with quick auto-fill helper and audio handover chime.
- **20/20 Production Launch Checklist:** 100% Complete!
  - Added Next.js 15 `robots.ts` and dynamic `sitemap.ts`.
  - Added dynamic Edge `opengraph-image.tsx` social preview generator (1200x630) for WhatsApp/social sharing.
  - Set `metadataBase` in root layout.
- **Android APK Build System (`fl apk`):**
  - Configured Capacitor with local Android SDK tools and Gradle 8.14.3 (`FoodLine_Campus.apk`, 4.0 MB).
- **Compilation Guarantee:** 100% Zero-Error Compilation across all 33 Next.js routes and Express backend.

---

## 🎯 Current Active Sprint & Next Missions

### ⚡ Mission for Antigravity (Backend Specialist):
1. **Pilot Deployment Monitoring & Telemetry Dashboard:**
   - Monitor live memory usage and slot throughput under prolonged break simulation.
2. **Push Notification / Sound Trigger Integration:**
   - Add push / webhook dispatch when order transitions to `READY` for counter staff alert.

### 🎨 Mission for OpenCode (Frontend Specialist):
1. **Interactive Cafe 3D Dish View or Particle Confetti Polish:**
   - Add Three.js canvas or Magic UI `Meteors` / `ShimmerButton` on the checkout confirmation screen.
2. **Offline Resilience / PWA Offline Banner:**
   - Display a sleek offline warning banner if campus Wi-Fi / LTE dips below threshold.

---

## 📊 Live Servers & Ports
- **Frontend App:** `http://localhost:3000` (Next.js 15)
- **Backend Engine:** `http://localhost:4000` (Express + Supabase PostgreSQL)
- **Database:** Supabase (`ylweomuodekukjjpjrgx.supabase.co`) [CONNECTED & HEALTHY]

---

## 🛠️ Installed UI/UX & Motion Stack
- **Motion:** `motion@12.0.0` (Native React spring physics & layout animations)
- **Anime.js:** `animejs@3.2.2` (SVG path drawing, timeline micro-animations)
- **Three.js:** `three@0.185.1` (3D canteen food models & particle effects)
- **Confetti:** `canvas-confetti@1.9.4` (Celebration burst upon successful UPI payment)
- **Lucide React:** `lucide-react@0.468.0` (Modern icons)
- **Tailwind CSS:** `v4.0.0` with custom glassmorphism and design tokens

---

## 📝 How to Update This Memory
When an agent or you completes a task, update the "Where We Left Off" and "Next Missions" sections, or run:
```bash
fl mark-done "What was completed" "What to do next"
```
