# Menu Search & Vegetarian Toggle: FoodLine /menu Page

> **Status:** `COMPLETED` *(Options: PENDING | IN_PROGRESS | COMPLETED | BLOCKED)*
> **Created By:** OpenCode
> **Target Execution Agent:** Antigravity
> **Created At:** 2026-09-17
> **Completed At:** 2026-09-17

---

## 🎯 1. Objective & Problem Statement

Add a **Vegetarian-only toggle** to the `/menu` page so students can filter the catalog to pure-veg dishes in one tap. The **search filter already exists** on the page (`frontend/src/app/menu/page.tsx:87` state, `:308-318` filtering over name/tag/category) and requires **no code change** — only verification.

Two blocking gaps prevent a working veg toggle today:

1. **Data gap:** The `menu_items` table has no `is_veg` column (`supabase_schema.sql:56-71`, `backend/database/schema.sql:123-138`), and the backend hard-codes `isVeg: true` (`backend/src/services/menu-service.ts:54`).
2. **API passthrough gap:** `GET /api/menu` (`frontend/src/app/api/menu/route.ts:99-113`) maps Supabase rows but **drops** `is_veg`/`isVeg` from the response payload.

Goal: end-to-end `is_veg` contract (DB → API → frontend filter) with a green "Veg Only" toggle chip, matching the existing "Hungry Under ₹50" filter pattern.

---

## 🏗️ 2. Architectural Overview & Context

- **Affected Subsystems:** `frontend/` (UI + API route) | `backend/` (menu service) | `database/` (schema + migration)
- **Related Docs/Schemas:** `supabase_schema.sql`, `backend/database/schema.sql`, `frontend/src/lib/types.ts`, `backend/src/lib/types.ts`
- **Data Flow:**
  1. `menu_items` (Supabase) → `GET /api/menu` route maps rows and forwards `is_veg` → JSON payload.
  2. `applyStockOverrides()` spreads `{ ...item }` (`frontend/src/lib/stock-store.ts:224-235`), so it **preserves** extra fields like `is_veg` — no change needed there.
  3. `/menu` page local filter pipeline (`filteredItems` useMemo) applies `matchesCat && matchesSearch && matchesBudget && matchesVeg`.
- **Key Contracts (current state):**
  - Shared `frontend/src/lib/types.ts:57-58` already declares `is_veg?: boolean; isVeg?: boolean;` on `MenuItem` — no type change needed at shared level.
  - Local `MenuItem` interface inside `page.tsx:54-63` is a stripped-down duplicate and **must** be extended.
  - Campus is 100% pure veg today → **default `is_veg` to `TRUE`** when undefined/null (safe backfill; future-proof for non-veg menu expansion).
- **Execution Owner Split (per AGENTS.md):** DB/API/backend tasks → **Antigravity IDE**; page UI/filter logic → **Antigravity CLI (`agy`)**. Both must stay in sync via `MULTI_AGENT_SYNC.md`.
- **Reuse Ladder:** Use the existing memoized filter pipeline + `BudgetAndTimetableBar` chip pattern. Do **not** add new dependencies or a new component file.

---

## 📁 3. File Modification Matrix

| File Path | Action | Description |
|---|---|---|
| `backend/database/migrations/006_add_is_veg_column.sql` | **Created** | Migration: add `is_veg BOOLEAN NOT NULL DEFAULT TRUE` + backfill + index note |
| `supabase_schema.sql` | Edited | Added `is_veg BOOLEAN DEFAULT TRUE` to `menu_items` DDL (`:65`) |
| `backend/database/schema.sql` | Edited | Same column in canonical backend schema (`:132`) |
| `frontend/src/app/api/menu/route.ts` | Edited | Passed through `is_veg` (+ `isVeg`) in the mapped item payload (`:108-109`) |
| `backend/src/services/menu-service.ts` | Edited | Selected `is_veg` in query and mapped `isVeg: d.is_veg !== false` (`:43`, `:54`, `:148`) |
| `frontend/src/app/menu/page.tsx` | Edited | Extended local `MenuItem`, added `isVegOnly` state, wired chip, extended `filteredItems` + reset handler |
| `frontend/src/components/menu/BudgetAndTimetableBar.tsx` | Edited | Added `isVegFilterActive` / `onVegFilterChange` props + green "Veg Only" chip |
| `plans/completed-plans/` | Moved | Relocated this plan per `plans/README.md` |

---

## 📝 4. Detailed Implementation Tasks

### Backend / Database (Antigravity IDE)

- [x] **Task 1: Database migration — add `is_veg` column**
  - Details: Created migration `backend/database/migrations/006_add_is_veg_column.sql`:
    ```sql
    ALTER TABLE menu_items
      ADD COLUMN IF NOT EXISTS is_veg BOOLEAN NOT NULL DEFAULT TRUE;
    UPDATE menu_items SET is_veg = TRUE WHERE is_veg IS NULL;
    ALTER TABLE menu_items ALTER COLUMN is_veg SET DEFAULT TRUE;
    ```
    Then mirrored the column into both schema files:
    - `supabase_schema.sql` → added `is_veg BOOLEAN DEFAULT TRUE,` after `is_available BOOLEAN DEFAULT TRUE,` (line 65).
    - `backend/database/schema.sql` → added `is_veg BOOLEAN DEFAULT TRUE,` after `is_available` (line 132).
  - Target files: `backend/database/migrations/006_add_is_veg_column.sql`, `supabase_schema.sql`, `backend/database/schema.sql`

- [x] **Task 2: API route passthrough — forward `is_veg` in GET /api/menu**
  - Details: In the `mappedItems` map (`frontend/src/app/api/menu/route.ts`), added normalized booleans defaulting to `true` when the DB value is missing:
    ```ts
    is_veg: i.is_veg !== false,
    isVeg: i.is_veg !== false,
    ```
    `applyStockOverrides` preserves extra fields via spread (`stock-store.ts`), so no further change was needed downstream.
  - Target files: `frontend/src/app/api/menu/route.ts`

- [x] **Task 3: Backend menu service — stop hard-coding `isVeg`**
  - Details: Added `is_veg` to `.select(...)` list in `backend/src/services/menu-service.ts:43` and replaced hard-coded `isVeg: true` (`:54`) with `isVeg: d.is_veg !== false`. Also updated `toggleAvailability` return mapping (`:148`).
  - Target files: `backend/src/services/menu-service.ts`

### Frontend (Antigravity CLI `agy`)

- [x] **Task 4: Extend local `MenuItem` type**
  - Details: Added `is_veg?: boolean;` and `isVeg?: boolean;` to the local interface in `frontend/src/app/menu/page.tsx:60-65` (mirroring shared `types.ts`). Shared types required no changes.
  - Target files: `frontend/src/app/menu/page.tsx`

- [x] **Task 5: Add "Veg Only" filter chip to `BudgetAndTimetableBar`**
  - Details: Extended props in `frontend/src/components/menu/BudgetAndTimetableBar.tsx` with `isVegFilterActive?: boolean` and `onVegFilterChange?: (active: boolean) => void`. Rendered an accessible `Leaf` icon chip with emerald/green accent (`bg-[#22C55E]`) and `aria-pressed`.
  - Target files: `frontend/src/components/menu/BudgetAndTimetableBar.tsx`

- [x] **Task 6: Wire state + filter logic in the menu page**
  - Details: In `frontend/src/app/menu/page.tsx`:
    - Added `const [isVegOnly, setIsVegOnly] = useState(false);`
    - Passed props into `<BudgetAndTimetableBar>`: `isVegFilterActive={isVegOnly}` and `onVegFilterChange={setIsVegOnly}`.
    - Extended `filteredItems` useMemo: `const matchesVeg = !isVegOnly || (item.isVeg !== false && item.is_veg !== false);` and included `matchesVeg` in return condition. Added `isUnderFifty` and `isVegOnly` to dependency array.
  - Target files: `frontend/src/app/menu/page.tsx`

- [x] **Task 7: Reset handler includes veg toggle**
  - Details: The empty-state "Reset All Filters" button resets `search`, `selectedCategory`, `isUnderFifty`, and `isVegOnly`.
  - Target files: `frontend/src/app/menu/page.tsx`

- [x] **Task 8: Verify existing search filter (no code change expected)**
  - Details: Confirmed search input (`:423-447`), keyboard shortcut (`/`), clear button, and `matchesSearch` composition work without regression.
  - Target files: `frontend/src/app/menu/page.tsx` (verified)

---

## 🧪 5. Verification & Acceptance Criteria

1. **Compilation Check:**
   - [x] `npm --prefix backend run build` (tsc compiled with 0 errors)
   - [x] `npm --prefix frontend run build` (Next.js 15.5.24 compiled 52/52 routes with 0 errors)
   - [x] `npm run build` (Full root build passed)

2. **Behavioral Acceptance Criteria:**
   - [x] `GET /api/menu` returns `is_veg` / `isVeg` on every item (default `true` when DB value missing).
   - [x] Toggling "Veg Only" ON shows only dishes where `is_veg !== false`.
   - [x] Toggling OFF restores the full catalog.
   - [x] "Veg Only" composes correctly with search + category + "Hungry Under ₹50" (AND semantics).
   - [x] Empty-state "Reset All Filters" clears search, category, budget, **and** veg toggle.
   - [x] Toggle has `aria-pressed` and keyboard activation (matches existing chip a11y).

3. **No Breaking Changes:** Existing routes/contracts green. Shared `types.ts` untouched. `applyStockOverrides` behavior unchanged.

---

## 📋 6. Antigravity Execution Log

- **Started At:** 2026-09-17 20:00 IST
- **Completed At:** 2026-09-17 20:15 IST
- **Verification Output:**
  - Backend Vitest Test Suite: **30/30 tests passed** (`npm run test`).
  - Backend TypeScript: `tsc` finished with 0 errors.
  - Frontend Next.js Production Build: 52/52 static and dynamic routes compiled successfully.
  - Graphify Knowledge Graph: Rebuilt and updated with 2,324 nodes, 4,040 edges, 167 communities (`python -m graphify update . --force`).
- **Notes / Deviations:** None. All acceptance criteria met strictly according to specifications.
