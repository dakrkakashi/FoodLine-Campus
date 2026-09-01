# 🧠 FoodLine Campus — Active Project State & Agent Memory
<!-- This file is the single source of truth for agent memory persistence. -->
<!-- Both Antigravity and OpenCode read this file every time they start. -->

## 📍 Where We Left Off (Last Completed Checkpoint)
- **Date & Time:** 2026-09-02 (00:07 AM - Night Session Closed / Shutdown Ready)
- **GitHub Connection:** 100% Synchronized with `@dakrkakashi` (All branches `main`, `backend`, `frontend` up to date).
- **20/20 Production Launch Checklist:** 100% Complete!
  - Added Next.js 15 `robots.ts` and dynamic `sitemap.ts`.
  - Added dynamic Edge `opengraph-image.tsx` social preview generator (1200x630) for WhatsApp/social sharing.
  - Set `metadataBase` in root layout.
- **Student Pickup OTP Handover System:** 100% Operational!
  - Backend: Added `POST /api/orders/verify-otp` with real-time SSE stream broadcast and Supabase persistence.
  - Frontend: Added Next.js API route `/api/orders/verify-otp`.
  - UI/UX: Integrated Magic UI `<BorderBeam />` on `/order/[token]` with dual-state glow.
  - Kitchen KDS: Added 1-tap OTP verification modal on `/kds` with quick auto-fill helper and audio handover chime.
- **Auth UI Polish:**
  - Added Show/Hide Password toggle with Eye/EyeOff icons on student and staff login inputs.
- **Vercel Cloud Resilience:**
  - Configured safe production fallbacks in `route-client.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, and `utils/supabase/middleware.ts` so Vercel builds never fail from missing env keys.
- **Master Shortcuts Cheatsheet:**
  - Created `FOODLINE_ALL_SHORTCUTS.txt` with exact "Where to Use" and "When to Use" guidance on Desktop and Project Root.
- **Compilation Guarantee:** 100% Zero-Error Compilation across all 27 Next.js routes and Express backend.

---

## 🎯 Current Active Sprint & Next Missions

### ⚡ Mission for Antigravity (Backend Specialist):
1. **Pilot Stress Test Simulation:**
   - Simulate 50 concurrent student order placements within a 2-minute break window to verify 60-slot throttling cap under stress.
2. **Audit & Log Expiry:**
   - Add automated cleanup / retention for completed `COLLECTED` order records older than 24 hours.

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
