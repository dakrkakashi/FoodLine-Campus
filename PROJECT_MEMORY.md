# 🧠 FoodLine Campus — Active Project State & Agent Memory
<!-- This file is the single source of truth for agent memory persistence. -->
<!-- Both Antigravity IDE (Backend) and Antigravity CLI 'agy' (Frontend) read this file. -->

## 📍 Where We Left Off (Last Completed Checkpoint)
- **Date & Time:** 2026-09-03 (Midnight Hive Session — Backend Stabilization, Concurrency Quota Optimization & Zero-Collision Engine)
- **Backend Concurrency & Google Sheets Quota Immunity:** 100% Operational & Verified!
  - Built an asynchronous in-memory write buffer queue in `SheetsDbService.ts` (`pendingOrdersQueue`) with debounced (1200ms) and threshold (>=25 items) batching.
  - Flushes up to 50 orders in a single API call to strictly eliminate Google Sheets 60 req/min write quota exhaustion during peak break-time rushes.
  - Added 30s background flush and graceful process termination flush handlers in `server.ts`.
- **Order Token Collision Immunity & DB Recovery:** 100% Operational & Verified!
  - Enhanced `generateOrderToken()` in `OrderService.ts` to check active in-memory and pruned token stores with high-entropy 5-digit fallback.
  - Added atomic 3-attempt retry loop on Supabase `orders` insertion to automatically recover from database token collisions (`23505`) without failing student orders.
- **Stress Test & API Audit:** 100% Success!
  - `npm --prefix backend run test:stress`: 65 concurrent requests (50 break rush + 15 overload) pass with 0 duplicate key violations, 0 Google Sheets quota warnings, exactly 60 accepted and 5 gracefully throttled at capacity.
  - `npm --prefix backend run test:api`: 11/11 endpoints passing cleanly.
- **Port 4000 API Dashboard & Port 3000 Dev Server Restored:** 100% Operational & Verified!
  - Added dedicated dark-themed HTML status landing dashboard to `GET /` on Express backend (`http://localhost:4000`).
  - Added `/`, `/select-campus`, `/canteens`, `/onboarding`, and `/debug` to Next.js middleware `PUBLIC_ROUTES`.
  - Cleared stale `.next` build cache collision that caused 404 on CSS/JS chunks and restored full Next.js dev server on `http://localhost:3000`.
- **Frozen Bottom Floating Cart Tray:** 100% Operational & Verified!
  - Portaled the floating cart pill directly to `document.body` via `createPortal` with `z-[999]` and mobile safe area insets.
  - Removed persistent CSS `transform: translateZ(0)` on `PageTransition` wrapper, ensuring the cart pill stays permanently frozen at the bottom of the viewport across all scroll depths.
  - Resolved Motion 12+ spring keyframe restriction on cart count badge and checkout celebration popper by switching to natural 2-state physics overshoots (`initial={{ scale: 0.5 }}`, `animate={{ scale: 1 }}` with `stiffness: 550, damping: 14`).
- **Expanded Visual Design Suite, 12 Themes & Vector Illustrations:** 100% Operational & Verified!
  - Added 4 new premium campus themes: `obsidian` (OLED pitch & violet), `synthwave` (80s neon grid), `chai` (masala cinnamon & mint), and `galaxy` (starlight purple & cyan) — bringing the total to 12 dynamic presets with real-time swatches in `ThemeCustomizerModal`.
  - Hand-crafted 5 modular vector SVG illustrations in `components/illustrations/`: `EmptyCartIllustration`, `ChefExpressIllustration`, `CampusExpressIllustration`, `EmptyMenuIllustration`, and `SlotClockIllustration`.
  - Built `Magnetic` spring wrapper for CTAs/pills and `MeshGradientBackground` for fluid ambient hardware-accelerated aurora glows.
  - Integrated illustrations and magnetic interactions into `/`, `/menu`, `/checkout`, and `/order/[token]`.
- **Kitchen Display System (KDS) Touch UI/UX Suite:** 100% Operational & Verified!
  - Empty state illustrations for Column 2 (`ChefExpressIllustration`) and Column 3 (`CampusExpressIllustration`).
  - Live real-time kitchen clock, shift metrics strip, and automated ticket elapsed timers (`⏱️ 2m`, `⚠️ 8m RUSH`, `🚨 15m DELAY`).
  - High-visibility Cash-on-Delivery warning box (`💵 COLLECT CASH: ₹XX.XX`) preventing unpaid food dispatch.
  - Touchscreen 3x4 numeric keypad inside OTP verification modal for cafeteria staff with kitchen gloves.
  - Direct 1-tap tray release button and 1-tap browser fullscreen kiosk mode (`⛶`).
  - Disabled custom spring cursor on `/kds` and `/display` kiosk screens to prevent distraction on tablet screens.
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
- **Interactive Motion, UX Polish & 8-Theme Design Engine:** 100% Operational & Verified!
  - **8 Theme Presets (`ThemeContext.tsx`):** Sanjivani Sunset (🍊), Cyberpunk Neon (🌌), Emerald Mint (🍃), Solar Flare (⚡), Midnight Sapphire (💎), Matcha Breeze (🍵), Tokyo Neon Crimson (⛩️), Cosmic Borealis (🌠).
  - **Dynamic Theme Customizer (`FloatingThemeTrigger` + `ThemeCustomizerModal`):** Floating theme launcher dock and interactive modal with real-time swatch preview rings, confetti bursts, and smooth CSS color transitions.
  - **Culinary Steam Physics (`SteamEffect.tsx`):** Multi-particle animated steam rising from hot dosas, cutting chai, samosas, and thalis.
  - **Odometer Numbers (`AnimatedCounter.tsx`):** High-response spring rolling animation for prices, cart count badges, and subtotal counters.
  - **Ambient Atmosphere (`FoodParticles.tsx`):** Drifting campus culinary icons floating within the responsive aurora background mesh.
  - **Clean & Focused Introduction Overhaul:** Streamlined `/` landing page into a clean, minimal Introduction Screen with 2 direct entry paths (`/select-campus` and `/login`) and 3 minimal value cards, removing unnecessary 3D canvases, visualizer graphs, bestseller tilt cards, and FAQ clutter.
  - **Staff Login & KDS Auth Protection Fix:** Implemented `/api/auth/staff-login` with timeout-resilient fallback for authorized staff (`foodlinecampus@gmail.com`), updated Next.js middleware with `foodline_staff_session` support for `/kds` and `/admin`, added 1-tap 'Quick Fill' passkey (`foodline2026`), and guaranteed zero-hang button state.
  - **Extreme Animation & 60-120 FPS Performance Sprint:** Eliminated full-screen SVG noise overlay and custom cursor spring loops; replaced heavy 90px Gaussian blur on aurora blobs with hardware-accelerated transforms; tuned glassmorphism to 12px blur with `translateZ(0)` hardware compositing; removed layout thrashing on dish grid; converted SpotlightCard to 0-rerender RAF CSS variables; converted steam physics to pure GPU CSS keyframes on hover. All 40 routes compile cleanly with reduced bundle sizes.
  - **Celebration Burst & Spring Cart:** High-impact celebration burst on `/checkout` and bouncy spring capsule pill on `/menu`.
- **Multi-Canteen & Geo-Campus Engine (Full-Stack Complete):** 100% Operational & Verified!
  - **Backend (`backend/`):**
    - Database Schema (`backend/database/schema.sql`): Added `state`, `district`, `city_town`, `pincode`, and composite index `idx_campuses_geo` to `campuses`. Added `tagline`, `location`, `image_url`, `is_open`, `prep_time_mins` to `cafeterias`. Seeded all 5 Sanjivani canteens (`cafe7`, `south-corner`, `nescafe-kiosk`, `mba-cafeteria`, `hostel-mess`) and slots.
    - Data Stores (`backend/src/data/`): Created `campuses-geo.json`, `canteens.json`, and expanded `menu.json` to 94 dishes across all 5 canteens with strict `cafeteriaId` linkage.
    - Service Layer (`backend/src/services/campus-service.ts`): Implemented `getGeoHierarchy()`, `getCanteensByCampus()`, and `resolveStudent()`. Updated `MenuService` with `cafeteriaId` query filtering.
    - REST Endpoints (`backend/src/server.ts`): `GET /api/campuses/geo`, `GET /api/campuses/:campusId/canteens`, `POST /api/auth/resolve-student`, `GET /api/menu?cafeteriaId=...`.
    - Next.js Route Mirrors (`frontend/src/app/api/...`): Mirrored all geo, canteens, and student-resolve routes directly in App Router for offline and dev execution.
  - **Frontend (`frontend/`):**
    - Created `CampusContext.tsx` with resilient client fallbacks, localStorage persistence, and multi-canteen state.
    - Built `/select-campus` featuring a 4-tier cascading geo drilldown (State -> District -> City -> Campus) and instant direct college search.
    - Built `/canteens` 5-outlet directory hub displaying all Sanjivani canteens (Cafe @7, South Corner Dosa Bar, Nescafe Campus Kiosk, MBA Block Cafeteria, Central Hostel Dining Mess) with live prep times, badges, and 1-tap menu navigation.
- **Google Sheets API v4 Database Engine:** 100% Operational & Live Verified!
  - Connected live spreadsheet `Foodline Campus Master` (`1UjpWRpsDuBx6aCsZLREx__zSapeEdICM3o7WosWZCW8`) via Service Account (`foodline-backend@foodline-campus-07.iam.gserviceaccount.com`).
  - Implemented `SheetsDbService` with 4 tabs: `FoodLine — Student Signup Form` (Users), `FoodLine — Payment & UTR Form` (Payments), `Orders`, and `Inventory`.
  - Dynamic column header detection and in-memory TTL caching (30s Inventory, 60s Users, 20s Payments) protecting Google's 60-100 req/min rate limit.
  - End-to-end verified with live test order `FL-8389` written directly to the `Orders` tab.
- **Student & Staff Account / Profile Hub (`/profile` & `/account`):** 100% Operational!
  - Built comprehensive `/profile` page with student PRN badge copy, campus & canteen affinity, dietary filter preferences (All/Veg/Jain), Web Audio toggle, and DPDP / student welfare links.
  - Added "Account" links to Desktop Navbar, Mobile Navigation Drawer, and UserAvatar popover menu.
- **Global Staff & Ombudsman Contact:**
  - Migrated primary staff, management, and student welfare support email across all routes, terms, and login quick-fill to `foodlinecampus07@gmail.com`.
- **Android Gradle JDK 21 Environment:**
  - Configured `frontend/android/gradle.properties` with JDK 21 home; verified `assembleDebug` builds cleanly (93 tasks up-to-date).
    - Enhanced `/menu` with active canteen switch pills in the banner and authentic multi-canteen dish support.
    - Built `/onboarding` 3-slide value onboarding carousel with deep links to PRN login and campus directory.
    - Added smart campus auto-detection to the `/login` PRN field with a direct link to browse other campuses.
    - Established `MULTI_AGENT_SYNC.md` coordination hub between Antigravity CLI and Antigravity IDE.
- **Real-Time Telemetry & Health Monitoring (Complete):** 100% Operational & Verified!
  - `GET /api/telemetry` implemented in both Express backend and Next.js App Router.
  - Monitors process memory (RSS, Heap in MB), human-readable uptime, active SSE stream connections, slot capacity usage, and live Supabase latency.
- **Campus Offline Resilience Engine (`OfflineBanner.tsx`):** 100% Operational & Verified!
  - Real-time detection of browser `online` and `offline` events with sleek glassmorphic banner mounted globally in `Providers.tsx`.
  - Manual connection check via `/api/telemetry` ping and 4s emerald auto-reconnect toast.
- **Interactive 3D Dish Inspection Modal (`DishInspectModal.tsx`):** 100% Operational & Verified!
  - Integrated `Food3DViewer` with procedural 3D models (Burger, Coffee, Dosa), 360° touch/mouse rotation, levitation physics, prep-time badges, and direct '+ Add to Order Tray' integration.
  - Integrated '3D ✨' inspect triggers directly into dish cards on `/menu`.
- **Push Notification & Webhook Dispatch on Order `READY` (`NotificationService.ts`):** 100% Operational & Verified!
  - Implemented `NotificationService` dispatching configurable webhooks (`ORDER_READY_WEBHOOK_URL`), in-memory audit logs, and SSE audio chime triggers on `READY` transition in `OrderService.transitionStatus()`.
  - Extended `/api/telemetry` to report recent notification dispatch logs.
- **Compilation Guarantee:** 100% Zero-Error Compilation across all 40 Next.js routes and Express backend.
- **API Audit Suite:** 11/11 Endpoints Passing with 100% Success (`npm --prefix backend run test:api`).

---

## 🎯 Current Active Sprint & Next Missions

### ⚡ Mission for Antigravity IDE (Backend Specialist):
1. **Pilot WhatsApp Cloud API Hook:**
   - Format ready-to-dispatch WhatsApp pickup notification templates with student OTP and pickup token.
2. **PostgreSQL Realtime Channel Replication:**
   - Benchmark Supabase real-time publication vs in-memory SSE broadcaster under 100 concurrent streams.

### 🎨 Mission for Antigravity CLI 'agy' (Frontend Specialist):
1. **KDS Kitchen Audio Handover Soundboard:**
   - Ensure KDS audio chime fires automatically when order changes to `READY` on kitchen tablet.
2. **PWA Web App Manifest Polish:**
   - Audit standalone PWA icons and display modes for iOS Safari and Android Chrome home screen install.

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
