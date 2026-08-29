# FoodLine Dual Inventory System — Implementation Plan

## 🎯 Objective
Implement a **dual inventory model** for Cafe @7 that supports two distinct stock behaviors:

| Type | Examples | Behavior |
|------|----------|----------|
| **Persistent Stock** | Chips, Packaged Snacks, Beverages (Cold Coffee, Oreo Shake), Desserts | Actual inventory count tracked; decreases with each order; persists across days |
| **Daily Fresh Stock** | Poha, Uttapam, Dosa, Chole Bhature, Samosa, Kachori, Pani Puri, Sandwiches, Momos, Burgers, Fries, Pasta, Pizza, Maggi, Chinese, Rice | Made fresh daily; reset to "unavailable" at end of day; canteen manager toggles availability each morning |

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      INVENTORY SERVICE                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │  Persistent Inventory   │  │    Daily Fresh Inventory    │  │
│  │  (stock_quantity)       │  │    (is_available_today)     │  │
│  │  - Decrements on order  │  │  - Boolean toggle per day   │  │
│  │  - Persists across days │  │  - Auto-resets at midnight  │  │
│  │  - Low-stock alerts     │  │  - Manager sets each AM     │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Phase 1: Database Schema Changes

### 1.1 New Table: `daily_fresh_items`
Tracks which menu items are "daily fresh" and their daily availability.

```sql
CREATE TABLE daily_fresh_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE UNIQUE,
    is_available_today BOOLEAN DEFAULT FALSE,
    last_updated_by UUID REFERENCES profiles(id),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    reset_at TIMESTAMPTZ DEFAULT NOW(), -- Tracks daily reset
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_daily_fresh_menu_item ON daily_fresh_items(menu_item_id);
```

### 1.2 Modify `menu_items` Table
Add inventory tracking columns:

```sql
ALTER TABLE menu_items ADD COLUMN inventory_type VARCHAR(20) DEFAULT 'persistent' 
    CHECK (inventory_type IN ('persistent', 'daily_fresh'));

ALTER TABLE menu_items ADD COLUMN stock_quantity INT DEFAULT NULL; -- NULL = unlimited for daily_fresh
ALTER TABLE menu_items ADD COLUMN low_stock_threshold INT DEFAULT 10;
ALTER TABLE menu_items ADD COLUMN track_inventory BOOLEAN DEFAULT FALSE;
```

### 1.3 New Table: `inventory_logs`
Audit trail for all inventory changes:

```sql
CREATE TABLE inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    change_type VARCHAR(30) NOT NULL, -- 'ORDER_DECREMENT', 'MANUAL_ADJUSTMENT', 'DAILY_RESET', 'RESTOCK'
    quantity_before INT,
    quantity_after INT,
    changed_by UUID REFERENCES profiles(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_logs_item_date ON inventory_logs(menu_item_id, created_at DESC);
```

### 1.4 Seed Data Updates
Mark items in `menu_items` with correct `inventory_type`:

| Item Category | Inventory Type | Examples |
|--------------|----------------|----------|
| Quick Bites (Poha, Samosa, Kachori, Vada Pav, Dabeli) | **daily_fresh** | Made fresh each morning |
| Chaat Corner (Pani Puri, Sev Puri, Bhel, Papdi Chat) | **daily_fresh** | Prepared fresh |
| South Indian (Dosa, Uttapam) | **daily_fresh** | Batter made daily |
| North Indian (Chole Bhature) | **daily_fresh** | Made fresh |
| Sandwiches | **daily_fresh** | Assembled fresh |
| Momos & Burgers | **daily_fresh** | Steamed/grilled to order |
| Fries & Pasta | **daily_fresh** | Cooked to order |
| Garlic Bread & Pizza | **daily_fresh** | Baked to order |
| Maggi & Chinese | **daily_fresh** | Cooked to order |
| Beverages (Tea, Coffee, Cold Coffee, Shakes) | **persistent** | Stock-based |
| Desserts | **persistent** | Stock-based |

---

## ⚙️ Phase 2: Backend Implementation

### 2.1 New Service: `inventory-service.ts`
```typescript
// backend/src/services/inventory-service.ts

export class InventoryService {
  // Persistent stock: decrement on order
  static async decrementStock(menuItemId: string, quantity: number): Promise<void>
  
  // Persistent stock: manual restock by manager
  static async restockItem(menuItemId: string, quantity: number, userId: string): Promise<void>
  
  // Daily fresh: get today's availability
  static async getDailyAvailability(menuItemId: string): Promise<boolean>
  
  // Daily fresh: manager toggle for today
  static async setDailyAvailability(menuItemId: string, isAvailable: boolean, userId: string): Promise<void>
  
  // Daily fresh: bulk set for all daily items (morning setup)
  static async bulkSetDailyAvailability(items: { menuItemId: string; isAvailable: boolean }[], userId: string): Promise<void>
  
  // Daily fresh: auto-reset at midnight (cron job)
  static async resetDailyAvailability(): Promise<void>
  
  // Get combined availability for menu display
  static async getEffectiveAvailability(menuItemId: string): Promise<{ available: boolean; reason?: string }>
  
  // Low stock alerts
  static async getLowStockItems(): Promise<MenuItem[]>
}
```

### 2.2 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/inventory/persistent/[itemId]/decrement` | POST | Internal: called when order placed |
| `/api/inventory/persistent/[itemId]/restock` | PATCH | Manager: add stock |
| `/api/inventory/daily/[itemId]` | GET | Get today's availability |
| `/api/inventory/daily/[itemId]` | PATCH | Manager: toggle today's availability |
| `/api/inventory/daily/bulk` | PATCH | Manager: bulk set morning availability |
| `/api/inventory/low-stock` | GET | Manager: view low stock alerts |
| `/api/inventory/logs/[itemId]` | GET | Audit trail |

### 2.3 Order Creation Integration
Modify `/api/orders` route to:
1. Validate effective availability before creating order
2. Decrement persistent stock for persistent items
3. Skip stock decrement for daily_fresh items (availability controlled by daily toggle)

### 2.4 Cron Job: Daily Reset
```typescript
// backend/src/jobs/daily-inventory-reset.ts
// Runs at 00:00 IST (or configurable time)
// Sets all daily_fresh items to is_available_today = FALSE
// Logs reset in inventory_logs
```

---

## 🎨 Phase 3: Frontend Implementation

### 3.1 Updated Types (`frontend/src/lib/types.ts`)
```typescript
export type InventoryType = 'persistent' | 'daily_fresh';

export interface MenuItem {
  // ... existing fields
  inventory_type?: InventoryType;
  stock_quantity?: number | null;
  low_stock_threshold?: number;
  track_inventory?: boolean;
  is_available_today?: boolean; // For daily_fresh items
}

export interface InventoryStatus {
  itemId: string;
  available: boolean;
  inventoryType: InventoryType;
  stockQuantity?: number;
  isLowStock?: boolean;
  isAvailableToday?: boolean; // Only for daily_fresh
}
```

### 3.2 New Inventory Context (`frontend/src/context/InventoryContext.tsx`)
```typescript
// Global state for real-time inventory updates
interface InventoryContextType {
  inventoryStatus: Map<string, InventoryStatus>;
  refreshInventory: () => Promise<void>;
  subscribeToUpdates: (itemId: string) => () => void;
}
```

### 3.3 UI Components

#### A. Manager Dashboard — Inventory Management Page (`/admin/inventory`)
- **Persistent Stock Tab**: Table with stock quantity, low stock alerts, restock buttons
- **Daily Fresh Tab**: Grid of daily items with toggle switches (Available Today / Not Available)
- **Bulk Actions**: "Set All Available", "Set All Unavailable" for daily items
- **Audit Log**: View inventory_logs for each item

#### B. Menu Display Updates
- Show "Out of Stock" badge for persistent items with 0 stock
- Show "Not Available Today" badge for daily_fresh items with `is_available_today = false`
- Disable add-to-cart for unavailable items

#### C. Cart Validation
- Before checkout, verify all items still available
- Show warning if item became unavailable during session

---

## 🔄 Phase 4: Integration Points

### 4.1 Order Flow
```
User adds to cart → Select slot → Checkout
       ↓
Validate all items available (effective availability)
       ↓
Create order → Decrement persistent stock only
       ↓
Return order token
```

### 4.2 Real-time Updates
- Use existing SSE stream or Supabase Realtime
- Broadcast inventory changes to connected clients
- Update menu cards instantly when manager toggles

### 4.3 KDS Integration
- Kitchen sees effective availability
- If daily_fresh item marked unavailable, don't show in KDS queue

---

## 📋 Phase 5: Implementation Steps

### Step 1: Database Migration (Day 1)
- [ ] Run migration SQL to add columns/tables
- [ ] Update seed data with `inventory_type` for all 56 menu items
- [ ] Create `daily_fresh_items` entries for daily items
- [ ] Test RLS policies

### Step 2: Backend Services (Day 1-2)
- [ ] Create `inventory-service.ts`
- [ ] Implement all CRUD operations
- [ ] Add validation in `/api/orders` route
- [ ] Create new API routes under `/api/inventory/`
- [ ] Add cron job for daily reset (Vercel Cron or pg_cron)

### Step 3: Frontend Types & API (Day 2)
- [ ] Update `types.ts` with new fields
- [ ] Create API client functions for inventory endpoints
- [ ] Build `InventoryContext` for global state

### Step 4: Manager UI (Day 2-3)
- [ ] Create `/admin/inventory` page
- [ ] Persistent stock management table
- [ ] Daily fresh toggle grid with bulk actions
- [ ] Low stock alert banner
- [ ] Audit log viewer

### Step 5: Customer-Facing UI (Day 3)
- [ ] Update menu cards with availability badges
- [ ] Disable unavailable items in menu
- [ ] Cart validation before checkout
- [ ] Real-time updates via SSE/Supabase Realtime

### Step 6: Testing & Polish (Day 3-4)
- [ ] Test persistent stock decrement on order
- [ ] Test daily reset at midnight
- [ ] Test manager toggle persistence
- [ ] Test low stock alerts
- [ ] Test concurrent orders (race conditions)
- [ ] Load test inventory endpoints

---

## ❓ Clarifying Questions

Before implementation, I need your input on:

### 1. Daily Reset Time
> **Default**: Midnight IST (00:00)
> - Should reset happen at midnight, or at a specific time like 6 AM before canteen opens?
> - Should reset be automatic (cron) or manual (manager button)?

### 2. Persistent Stock Initialization
> - Do you have current stock counts for persistent items (chips, beverages, desserts)?
> - Should we start with a default (e.g., 100) and let manager adjust?

### 3. Low Stock Thresholds
> - Default threshold: 10 units
> - Should each item have custom threshold, or global setting?

### 4. Daily Fresh Default State
> - Morning default: **All unavailable** (manager enables what's made) ✓
> - Or: **All available** (manager disables what's not made)?
> - Recommendation: Default unavailable (safer, prevents selling unmade items)

### 5. Manager Authentication
> - Use existing `profiles` table with `role = 'kitchen'` or `role = 'admin'`?
> - Need separate "inventory manager" role?

### 6. Real-time Updates Priority
> - SSE (existing) vs Supabase Realtime?
> - SSE simpler but requires connection management
> - Supabase Realtime automatic but adds dependency

### 7. Menu Item Classification
> Please confirm which items are **daily_fresh** vs **persistent**:
> - **Daily Fresh** (made to order): Poha, Uttapam, Dosa, Samosa, Kachori, Vada Pav, Dabeli, Pani Puri, Sev Puri, Bhel, Papdi Chat, Chole Bhature, Sandwiches, Momos, Burgers, Fries, Pasta, Pizza, Maggi, Chinese, Rice
> - **Persistent** (stock-based): Tea, Hot Coffee, Hot Chocolate, Cold Coffee, Cold Chocolate, Oreo Shake, KitKat Shake, Brownie Shake, Gulab Jamun, Brownie
> - Any exceptions? (e.g., packaged chips if sold)

---

## 📦 Deliverables

1. **Migration SQL** — Ready to run on Supabase
2. **Backend Services** — `inventory-service.ts`, new API routes
3. **Frontend Types** — Updated `types.ts`
4. **Inventory Context** — Global state management
5. **Admin Page** — `/admin/inventory` with two tabs
6. **Customer Menu** — Availability badges, disabled items
7. **Cron Job** — Daily reset automation
8. **Documentation** — Updated API contracts in `types.ts`

---

## ⏱️ Estimated Timeline
- **Database & Backend**: 2 days
- **Frontend Types & API**: 0.5 days
- **Admin UI**: 1.5 days
- **Customer UI**: 1 day
- **Testing & Polish**: 1 day
- **Total**: ~6 days

---

## 🚀 Next Steps
1. **You review this plan** and answer clarifying questions
2. **I create detailed specification** for each component
3. **Implementation begins** in phases with verification at each step

---

*Plan created for FoodLine Campus Dining Ecosystem — Sanjivani University, Cafe @7*