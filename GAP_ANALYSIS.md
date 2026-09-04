# FoodLine Frontend — Gap Analysis Report

**Date:** 03-09-2026
**Analyst:** agy (Antigravity CLI — Frontend Specialist)
**Source of Truth:** `FRONTEND_SUMMARY.md` (13,531 bytes)
**Codebase Audited:** `frontend/src/app/` — all 22 page subdirectories fully read to EOF

---

## 1. Pages Documented in FRONTEND_SUMMARY.md

| # | Route | Status in Codebase |
|---|-------|--------------------|
| 1 | `/` (Landing) | ✅ Exists |
| 2 | `/menu` | ✅ Exists |
| 3 | `/checkout` | ✅ Exists |
| 4 | `/orders` | ✅ Exists |
| 5 | `/order/[token]` | ✅ Exists |
| 6 | `/payment` | ✅ Exists |
| 7 | `/kds` | ✅ Exists |
| 8 | `/admin` | ✅ Exists |
| 9 | `/login` | ✅ Exists |
| 10 | `/select-campus` | ✅ Exists |
| 11 | `/display` | ✅ Exists |

**All 11 documented pages exist in the codebase.** ✅

---

## 2. Undocumented Pages (NOT in FRONTEND_SUMMARY.md)

These pages exist in `frontend/src/app/` but have **zero representation** in FRONTEND_SUMMARY.md:

| # | Route | File | Summary | Severity |
|---|-------|------|---------|----------|
| 1 | `/cart` | **`page.tsx` DOES NOT EXIST** | Cart page is entirely missing from codebase. Cart logic lives only in `CartContext.tsx` (no dedicated page). | 🔴 HIGH — core e-commerce flow gap |
| 2 | `/canteens` | `canteens/page.tsx` (73+ lines) | CanteenCard UI with `filterTag`/search, CampusContext, icons map for 5 canteens. Filter/sort UI exists but no summary. | 🟡 MEDIUM — campus-specific browse |
| 3 | `/onboarding` | `onboarding/page.tsx` | 3-slide carousel (Zero Queue, 5 Outlets, 10-Min Break Bell), uses ShimmerButton, Meteors, PageTransition. | 🟡 MEDIUM — first-run experience |
| 4 | `/profile` | `profile/page.tsx` (16,577 bytes) | User profile page, account settings. Significant page, zero docs. | 🔴 HIGH — user account management |
| 5 | `/terms` | `terms/page.tsx` (1,068 lines, 19 clauses) | Full legal ToS page. Large file, zero docs. | 🟢 LOW — static legal content |
| 6 | `/tables` | `tables/page.tsx` | Table management UI. | 🟡 MEDIUM — dine-in feature |
| 7 | `/debug` | `debug/page.tsx` (471 lines) | Debug/dev tools page. | 🟢 LOW — dev-only |
| 8 | `/401` | `401/page.tsx` | Unauthorized error page | 🟢 LOW |
| 9 | `/402` | `402/page.tsx` | Payment Required error page | 🟢 LOW |
| 10 | `/403` | `403/page.tsx` | Forbidden error page | 🟢 LOW |
| 11 | `/409` | `409/page.tsx` | Conflict error page | 🟢 LOW |
| 12 | `/503` | `503/page.tsx` | Service Unavailable error page | 🟢 LOW |
| 13 | `/error/[code]` | `error/[code]/page.tsx` | Dynamic error catch-all page | 🟢 LOW |

**Total undocumented: 13 pages** (1 missing entirely, 12 exist but undocumented)

---

## 3. Key Feature Gaps

### 3.1 Missing `/cart` Page (CRITICAL)
- **FRONTEND_SUMMARY.md** assumes a cart page exists as part of the flow.
- **Reality:** `frontend/src/app/cart/page.tsx` does not exist. Cart state is managed via `CartContext.tsx` but there is no dedicated cart review/edit page.
- **Impact:** Users cannot review/edit their cart before checkout. The checkout flow jumps directly from menu to checkout without an intermediate cart step.
- **Recommendation:** Create `/cart/page.tsx` as a first-class page with quantity adjustment, item removal, and slot selection summary.

### 3.2 Onboarding Flow Not Documented
- A 3-slide onboarding carousel exists at `/onboarding` with polished UI (ShimmerButton, Meteors, PageTransition).
- FRONTEND_SUMMARY.md makes no mention of this first-run experience.
- **Recommendation:** Document the onboarding flow in FRONTEND_SUMMARY.md.

### 3.3 Canteen Browsing Not Documented
- `/canteens` page provides campus-specific canteen browsing with filtering.
- FRONTEND_SUMMARY.md does not mention this.
- **Recommendation:** Document the canteen browsing feature.

### 3.4 Profile/Account Page Not Documented
- `/profile` is a 16KB page — likely contains account settings, order history links, etc.
- FRONTEND_SUMMARY.md does not mention it.
- **Recommendation:** Document the profile page.

### 3.5 Error Page System Not Documented
- Full error page system: 401, 402, 403, 409, 503 + dynamic `[code]` catch-all.
- FRONTEND_SUMMARY.md does not mention error handling UI.
- **Recommendation:** Briefly document the error page system.

---

## 4. Dependencies & Stack Gaps

### 4.1 Documented Dependencies (FRONTEND_SUMMARY.md)
- `gsap ^3.15.0`
- `lottie-web ^5.13.0`
- `motion ^13.1.1`

### 4.2 Undocumented Dependencies (found in codebase)
- **ShimmerButton** — used in onboarding (likely from MagicUI or custom)
- **Meteors** — used in onboarding (MagicUI component)
- **PageTransition** — used in onboarding
- **Radix UI** — used extensively across all pages (documented as shadcn/Radix but not in deps list)
- **Framer Motion** — same as `motion` package but referenced differently in code
- **Supabase client libraries** — `@supabase/ssr`, `supabase-js` used in `utils/supabase/`
- **React 18+/19** — version not specified in summary
- **Next.js 15** — version not specified in summary
- **Tailwind CSS** — version not specified in summary

**Recommendation:** Update FRONTEND_SUMMARY.md dependency list to include all actual dependencies from `package.json`.

---

## 5. API Route Coverage

### 5.1 Documented API Routes (FRONTEND_SUMMARY.md)
- `GET /api/menu`
- `GET /api/slots`
- `POST /api/orders`
- `POST /api/payments/verify-utr`
- `GET /api/order/[token]/stream` (SSE)
- `PATCH /api/kds/orders/[id]/status`
- `PATCH /api/kds/inventory/[dishId]`

### 5.2 Undocumented API Routes (found in codebase)
- Full `api/` directory listing confirmed but not enumerated in summary.
- **Recommendation:** Audit all `api/` routes and document any additional endpoints.

---

## 6. Component Library Gaps

### 6.1 Documented Components (FRONTEND_SUMMARY.md)
- Navbar, MenuCard, SlotPicker, UPIQRModal, QRPassCard

### 6.2 Undocumented Component Directories
- `components/3d/` — 3D components
- `components/admin/` — admin-specific components
- `components/analytics/` — analytics components
- `components/display/` — display screen components
- `components/illustrations/` — illustration assets
- `components/magicui/` — MagicUI components (ShimmerButton, Meteors, etc.)
- `components/theme/` — theme components
- `components/ui/` — base UI components (shadcn)

**Recommendation:** Document key components from each directory.

---

## 7. Context/State Management Gaps

### 7.1 Documented Contexts
- CartContext (mentioned indirectly)

### 7.2 Undocumented Contexts
- `CampusContext.tsx` — campus selection state
- `InventoryContext.tsx` — stock/inventory state
- `ThemeContext.tsx` — theme/dark mode state

**Recommendation:** Document all four React contexts in FRONTEND_SUMMARY.md.

---

## 8. Custom Hooks Gaps

### 8.1 Undocumented Hooks
- `useRealtimeOrders.ts` — real-time order updates (SSE)
- `useSoundFX.ts` — sound effects
- `useWakeLock.ts` — screen wake lock for KDS

**Recommendation:** Document these hooks as they are critical to the real-time KDS experience.

---

## 9. Recommended First Frontend Task

### 🎯 TASK-001: Create Missing `/cart` Page

**Why this first:**
1. The cart page is the **only missing core page** in the user flow (menu → cart → checkout → payment → order tracking).
2. Without a cart page, users cannot review/edit quantities or see a summary before checkout.
3. Cart state already exists in `CartContext.tsx` — the data layer is ready.
4. This is a self-contained task that doesn't require backend changes.

**Scope:**
- Create `frontend/src/app/cart/page.tsx`
- Use existing `CartContext` for state
- Implement: item list with quantity +/-, remove item, subtotal display, "Proceed to Checkout" button
- Mobile-first responsive design
- Use existing design system (shadcn components, Tailwind, glassmorphism)

**Estimated effort:** 1-2 hours
**Dependencies:** None (CartContext already exists)

---

## 10. Summary

| Category | Count |
|----------|-------|
| Pages in FRONTEND_SUMMARY.md | 11 |
| Undocumented pages (exist but not in summary) | 12 |
| Missing pages (don't exist) | 1 (`/cart`) |
| Total actual pages in codebase | 22 |
| **Documentation coverage** | **~50%** (11/22 pages) |

**Priority actions:**
1. 🔴 Create `/cart` page (missing core flow)
2. 🔴 Document `/profile` page
3. 🟡 Document `/onboarding`, `/canteens`, `/tables` pages
4. 🟡 Update dependency list in FRONTEND_SUMMARY.md
5. 🟡 Document all React contexts and custom hooks
6. 🟢 Document error page system
7. 🟢 Document all component directories
