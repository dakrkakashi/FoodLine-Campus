# 🛠️ 04 • Technical Stack & Vertical Slice Architecture
**Project Name:** FoodLine Campus  
**Architecture Paradigm:** Clean Vertical Slice & Modular Monolith

---

## 1. The "Vertical Slice" Philosophy

Rather than spreading across 12 third-party hosted SaaS services or over-engineering microservices with Kubernetes, FoodLine uses a **tight, resilient, battle-tested vertical slice**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FOODLINE VERTICAL SLICE                         │
├───────────────────┬────────────────────────────────────────────────────┤
│ Presentation Tier │ Next.js 15 App Router + React 19 + Tailwind CSS v4 │
├───────────────────┼────────────────────────────────────────────────────┤
│ Application Tier  │ Node.js / Express HTTP/2 Engine + SSE Streaming    │
├───────────────────┼────────────────────────────────────────────────────┤
│ Caching Tier      │ In-Memory 30s TTL Read-Through Cache + Edge CDN    │
├───────────────────┼────────────────────────────────────────────────────┤
│ Persistence Tier  │ Supabase PostgreSQL 15 + Google Sheets API v4 Sync │
├───────────────────┼────────────────────────────────────────────────────┤
│ Mobile Tier       │ Capacitor Native Android Platform (APK Build)      │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 2. Frontend Dependency Catalog (`frontend/package.json`)

| Package | Version | Purpose & Rationale |
|---|---|---|
| `next` | `15.5.24` | Next.js App Router for server components, route handlers, and streaming. |
| `react` & `react-dom` | `19.0.0` | React 19 core runtime with native actions, transitions, and hooks. |
| `typescript` | `^5.0.0` | Strict static typing across all props, API interfaces, and state slices. |
| `tailwindcss` | `^4.0.0` | Utility-first CSS using modern CSS variables and `@theme` definitions. |
| `motion` | `^12.0.0` | Native spring physics for cart badges, drawer slideouts, and page transitions. |
| `three` | `^0.185.1` | Lightweight 3D rendering for procedural food models in `DishInspectModal`. |
| `lucide-react` | `^0.468.0` | Consistent vector iconography across buttons, badges, and navigation. |
| `canvas-confetti` | `^1.9.4` | Micro-celebration confetti burst upon successful UPI payment confirmation. |
| `@capacitor/core` & `@capacitor/android` | `^6.0.0` | Native Android APK bridge for canteen tablet kiosk deployment. |

---

## 3. Backend Dependency Catalog (`backend/package.json`)

| Package | Version | Purpose & Rationale |
|---|---|---|
| `express` | `^4.19.2` | High-throughput HTTP REST engine and long-lived SSE streaming server. |
| `@supabase/supabase-js` | `^2.45.0` | Official client SDK for Supabase PostgreSQL with RLS and parameterization. |
| `googleapis` | `^144.0.0` | Official Google APIs client for real-time Google Sheets v4 synchronization. |
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing middleware configured for frontend origins. |
| `dotenv` | `^16.4.5` | Secure environment variable injection for local and staging development. |
| `ts-node` & `typescript` | `^10.9.2` / `^5.5.4` | TypeScript compilation and rapid execution for automated testing suites. |

---

## 4. Hardware & Operating Environment

- **Development OS:** Linux (Ubuntu/Debian-compatible) / POSIX Shell.
- **Node.js Runtime:** v18.18+ or v20 LTS.
- **Mobile SDK:** Android Gradle JDK 21 (`frontend/android/gradle.properties`).
- **Database Engine:** PostgreSQL 15.1 hosted on Supabase (`ylweomuodekukjjpjrgx.supabase.co`).
- **Google Sheets API Engine:** Service Account authentication via RSA-SHA256 (`foodline-backend@foodline-campus-07.iam.gserviceaccount.com`).
- **Office & Presentation Engine:** Headless LibreOffice (`soffice`) for PDF conversions and `pptxgenjs` for PowerPoint generation.

---

## 5. Port Allocation & Local Dev Topology

| Port | Service | Tech Stack | Responsibility |
|---|---|---|---|
| `3000` | **Frontend Web Application** | Next.js 15 (Turbopack) | Student ordering, UI routes, KDS display, TV screen. |
| `4000` | **Backend Concurrency Engine** | Express + TypeScript | Slot capacity throttling, 12-digit UTR shield, SSE stream. |
| `5432` | **PostgreSQL Database** | Supabase Cloud | Primary ACID relational database. |
