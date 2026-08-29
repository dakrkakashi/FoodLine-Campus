# FoodLine Dual Inventory — Frontend Implementation Plan (OpenCode Scope)

## 🎯 Scope Summary
Build **3 deliverables** under `frontend/src/`:
1. **Admin Inventory Page** (`/admin/inventory`) — Morning prep checklist + persistent stock controls
2. **Menu Badges** — Low-stock (amber) & Sold-out (red) indicators on all menu cards
3. **Checkout Cart Validation** — Real-time block if item stock hits 0 before payment

---

## 📐 Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND INVENTORY STATE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │  /api/menu      │────▶│  Inventory      │────▶│  Components     │       │
│  │  (merged w/     │     │  Context        │     │  (MenuCard,     │       │
│  │   stock data)   │     │  (React state)  │     │   Badge, Cart)  │       │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘       │
│          │                       │                       │                  │
│          ▼                       ▼                       ▼                  │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │  Supabase Realtime Channel: 'menu-inventory-live'               │       │
│  │  - LISTEN: menu_items (is_available, stock_quantity,           │       │
│  │    inventory_type, low_stock_threshold)                        │       │
│  │  - BROADCAST: admin inventory changes → instant UI sync        │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Phase 1: Core Types & API Layer

### 1.1 Updated Types (`frontend/src/lib/types.ts`)
```typescript
// ADD to existing MenuItem interface
export interface MenuItem {
  // ... existing fields
  inventory_type?: 'daily_fresh' | 'persistent';
  stock_quantity?: number | null;        // NULL for daily_fresh
  low_stock_threshold?: number;          // default 5
  last_fresh_date?: string;              // 'YYYY-MM-DD' for lazy reset
  is_available?: boolean;                // DB column
  isAvailable?: boolean;                 // merged from stock-store
}

// NEW: Inventory status for UI
export interface InventoryStatus {
  itemId: string;
  inventoryType: 'daily_fresh' | 'persistent';
  isAvailable: boolean;                  // effective availability
  stockQuantity?: number | null;         // only for persistent
  isLowStock: boolean;                   // stock_quantity <= threshold
  lastFreshDate?: string;                // for daily_fresh lazy reset
}

// NEW: Admin inventory payload
export interface MorningPrepPayload {
  date: string;                          // 'YYYY-MM-DD'
  dailyFreshItemIds: string[];           // IDs marked "prepared today"
}

export interface PersistentStockUpdate {
  itemId: string;
  stockQuantity: number;                 // new absolute quantity
}
```

### 1.2 API Client Functions (`frontend/src/lib/api.ts`)
```typescript
// ADD to existing api.ts
export async function fetchInventoryStatus(): Promise<InventoryStatus[]>
export async function fetchFullMenuWithInventory(): Promise<{ categories: Category[]; items: MenuItem[] }>
export async function postMorningPrep(payload: MorningPrepPayload): Promise<{ success: boolean }>
export async function patchPersistentStock(update: PersistentStockUpdate): Promise<{ success: boolean }>

// Realtime subscription
export function subscribeToInventoryUpdates(
  callback: (status: InventoryStatus) => void
): () => void;
```

---

## 🧠 Phase 2: Inventory Context (Global State)

### 2.1 New File: `frontend/src/context/InventoryContext.tsx`
```typescript
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { InventoryStatus, MenuItem, subscribeToInventoryUpdates } from '@/lib/api';

interface InventoryContextType {
  statusMap: Map<string, InventoryStatus>;
  isLoading: boolean;
  getStatus: (itemId: string) => InventoryStatus | null;
  getEffectiveAvailability: (item: MenuItem) => boolean;
  isLowStock: (item: MenuItem) => boolean;
  refresh: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [statusMap, setStatusMap] = useState<Map<string, InventoryStatus>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const statuses = await fetchInventoryStatus();
      setStatusMap(new Map(statuses.map(s => [s.itemId, s])));
    } catch (e) {
      console.error('Inventory refresh failed:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToInventoryUpdates((status) => {
      setStatusMap(prev => new Map(prev).set(status.itemId, status));
    });
    return () => unsubscribe();
  }, [refresh]);

  const getStatus = (itemId: string) => statusMap.get(itemId) || null;

  const getEffectiveAvailability = (item: MenuItem): boolean => {
    const status = getStatus(item.id);
    if (status) return status.isAvailable;
    return item.is_available !== false && item.isAvailable !== false;
  };

  const isLowStock = (item: MenuItem): boolean => {
    const status = getStatus(item.id);
    if (!status || status.inventoryType !== 'persistent') return false;
    return status.isLowStock;
  };

  return (
    <InventoryContext.Provider value={{ statusMap, isLoading, getStatus, getEffectiveAvailability, isLowStock, refresh }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}
```

### 2.2 Integrate in Providers (`frontend/src/components/Providers.tsx`)
```tsx
// Wrap app with InventoryProvider alongside CartProvider
<CartProvider>
  <InventoryProvider>
    {children}
  </InventoryProvider>
</CartProvider>
```

---

## 🛠️ Phase 3: Admin Inventory Page (`/admin/inventory`)

### 3.1 New File: `frontend/src/app/admin/inventory/page.tsx`
**Route**: `/admin/inventory` (new tab in admin nav)

#### UI Structure:
```
┌────────────────────────────────────────────────────────────────────┐
│  📦 Cafe @7 Inventory Management                                    │
├────────────────────────────────────────────────────────────────────┤
│  [TODAY'S FRESH BATCH]          [PERSISTENT STOCK]                 │
│  ┌─────────────────────────┐   ┌─────────────────────────────┐   │
│  │ ☕ Common Breakfast      │   │ 🥤 Beverages & Shakes       │   │
│  │    ☑ Poha (25)           │   │    Cold Coffee:  [=====] 28 │   │
│  │    ☑ Uttapam (50)        │   │    Oreo Shake:   [====] 22  │   │
│  │    ☑ Dosa (50)           │   │    Cold Chocolate: [==] 12  │   │
│  │    ☐ Samosa (20)         │   │    Brownie Shake:  [=]  5⚠️ │   │
│  │    ☐ Vada Pav (20)       │   │    Special Tea:    [===] 18  │   │
│  │    ☐ Kachori (20)        │   │    Hot Coffee:     [===] 18  │   │
│  │    ☐ Dabeli (20)         │   │    Hot Chocolate:  [===] 18  │   │
│  │    ☐ Pani Puri (30)      │   │                              │   │
│  │    ☐ Sev Puri (40)       │   │ 🍮 Packaged Desserts        │   │
│  │    ☐ Bhel (40)           │   │    Gulab Jamun:    [====] 24 │   │
│  │    ☐ Papdi Chat (40)     │   │    Hot Brownie:    [===] 18  │   │
│  │                          │   │                              │   │
│  │ [SELECT ALL BREAKFAST]   │   │ [SAVE ALL STOCK LEVELS]     │   │
│  │ [SAVE TODAY'S BATCH]     │   │                              │   │
│  └─────────────────────────┘   └─────────────────────────────┘   │
│                                                                     │
│  ⚡ Real-time: Changes sync instantly to student menus & KDS       │
└────────────────────────────────────────────────────────────────────┘
```

#### Key Components:
```typescript
// Daily Fresh Section
interface DailyFreshItem {
  id: string;
  name: string;
  price: number;
  tag?: string;
  isPreparedToday: boolean;    // from last_fresh_date === today
}

function DailyFreshChecklist({ items, onToggle, onSave, onSelectAllBreakfast }) {
  // Group by category for better UX
  // Checkbox grid with price tags
  // "Select All Breakfast" = Poha, Uttapam, Dosa, Idli, Vada, Samosa, etc.
  // "Save Today's Batch" → POST /api/admin/inventory/morning-prep
}

// Persistent Stock Section
interface PersistentStockItem {
  id: string;
  name: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

function PersistentStockControls({ items, onChange, onSave }) {
  // Slider/input for each beverage item
  // Visual indicator: green (OK), amber (≤5), red (0)
  // "Save All Stock Levels" → PATCH /api/admin/inventory/persistent (batch)
}
```

#### API Endpoints (Backend - Antigravity to implement):
```
POST   /api/admin/inventory/morning-prep     { date, dailyFreshItemIds }
PATCH  /api/admin/inventory/persistent       [{ itemId, stockQuantity }]
GET    /api/admin/inventory/status           → full inventory status
```

---

## 🏷️ Phase 4: Menu Badges (Customer-Facing)

### 4.1 New Component: `frontend/src/components/ui/InventoryBadge.tsx`
```tsx
'use client';

import { MenuItem } from '@/lib/types';
import { useInventory } from '@/context/InventoryContext';

interface InventoryBadgeProps {
  item: MenuItem;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'inline';
}

export function InventoryBadge({ item, size = 'md', position = 'top-right' }: InventoryBadgeProps) {
  const { getEffectiveAvailability, isLowStock, getStatus } = useInventory();
  
  const available = getEffectiveAvailability(item);
  const lowStock = isLowStock(item);
  const status = getStatus(item.id);

  if (available && !lowStock) return null;

  const badgeStyle = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
  }[size];

  if (!available) {
    return (
      <span className={`absolute ${position === 'top-right' ? 'top-2 right-2' : 'top-2 left-2'} 
        ${badgeStyle} rounded-xl bg-red-950/90 border border-red-500/50 
        text-red-300 font-black uppercase tracking-wider flex items-center gap-1`}>
        <span className="relative w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
          <span className="absolute inset-0 rounded-full bg-red-400" />
        </span>
        Sold Out Today
      </span>
    );
  }

  if (lowStock) {
    const qty = status?.stockQuantity ?? 0;
    return (
      <span className={`absolute ${position === 'top-right' ? 'top-2 right-2' : 'top-2 left-2'} 
        ${badgeStyle} rounded-xl bg-amber-950/90 border border-amber-500/50 
        text-amber-300 font-black uppercase tracking-wider flex items-center gap-1`}>
        <span className="relative w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
          <span className="absolute inset-0 rounded-full bg-amber-400" />
        </span>
        Only {qty} Left
      </span>
    );
  }

  return null;
}
```

### 4.2 Update Menu Page (`/menu/page.tsx`)
- Wrap `SpotlightCard` with `position: relative`
- Add `<InventoryBadge item={dish} size="md" position="top-right" />` inside card
- Keep existing grayscale overlay for unavailable items

### 4.3 Update Menu Card Component (`/components/menu-card.tsx`)
- Add `InventoryBadge` for consistent display across all menu surfaces

---

## ✅ Phase 5: Checkout Cart Validation

### 5.1 Update Checkout Page (`/checkout/page.tsx`)

#### Add Pre-Submit Validation:
```tsx
const { getEffectiveAvailability, isLowStock } = useInventory();

// In handlePlaceOrder, BEFORE API call:
const validateInventory = () => {
  for (const item of items) {
    const available = getEffectiveAvailability({ ...item, id: item.id });
    if (!available) {
      setErrorMsg(`❌ "${item.name}" is no longer available. Please remove it from your tray.`);
      return false;
    }
    // Optional: warn but don't block for low stock
    if (isLowStock({ ...item, id: item.id })) {
      // Could show warning toast but allow proceed
    }
  }
  return true;
};

const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateInventory()) return;
  // ... existing logic
};
```

#### Real-time Warning Banner:
```tsx
// Add at top of checkout form
const unavailableItems = items.filter(item => !getEffectiveAvailability({ ...item, id: item.id }));

{unavailableItems.length > 0 && (
  <motion.div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 mb-6">
    <div className="font-bold mb-2">⚠️ Items Unavailable</div>
    <ul className="text-sm space-y-1">
      {unavailableItems.map(item => (
        <li key={item.id}>• {item.name} — Sold out for today</li>
      ))}
    </ul>
    <p className="text-[11px] mt-2">Please remove unavailable items to continue.</p>
  </motion.div>
)}
```

---

## 🔄 Phase 6: Realtime Sync Integration

### 6.1 Supabase Realtime Channel (in `InventoryContext`)
```typescript
// Channel name: 'menu-inventory-live'
// Events: INSERT, UPDATE on menu_items table
// Filter: inventory_type IN ('daily_fresh', 'persistent')

const channel = supabase
  .channel('menu-inventory-live')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'menu_items',
    filter: "inventory_type=in.('daily_fresh','persistent')"
  }, (payload) => {
    const newStatus = mapPayloadToInventoryStatus(payload.new);
    callback(newStatus);
  })
  .subscribe();
```

### 6.2 Backend Requirements (Antigravity):
- Add `inventory_type`, `stock_quantity`, `low_stock_threshold`, `last_fresh_date` columns to `menu_items`
- Enable Realtime publication on `menu_items` table
- `/api/menu` merges stock data: 
  - For `daily_fresh`: `is_available = (last_fresh_date === today)`
  - For `persistent`: `is_available = (stock_quantity > 0)`

---

## 📋 Implementation Checklist

### Phase 1: Types & API (Day 1)
- [ ] Update `types.ts` with inventory fields
- [ ] Add API functions in `api.ts`
- [ ] Test `/api/menu` response includes new fields

### Phase 2: Inventory Context (Day 1)
- [ ] Create `InventoryContext.tsx`
- [ ] Add to `Providers.tsx`
- [ ] Test realtime subscription works

### Phase 3: Admin Inventory Page (Day 2)
- [ ] Create `/admin/inventory/page.tsx`
- [ ] Build `DailyFreshChecklist` component
- [ ] Build `PersistentStockControls` component
- [ ] Add "Select All Breakfast" helper (pre-defined item IDs)
- [ ] Add save buttons with optimistic UI
- [ ] Style with existing design system (glass cards, orange/green accents)

### Phase 4: Menu Badges (Day 2)
- [ ] Create `InventoryBadge.tsx`
- [ ] Integrate in `/menu/page.tsx`
- [ ] Integrate in `MenuCard.tsx`
- [ ] Test visual states: available, low-stock, sold-out

### Phase 5: Checkout Validation (Day 1)
- [ ] Add `useInventory` to checkout page
- [ ] Add pre-submit validation
- [ ] Add unavailable items warning banner
- [ ] Test edge case: item sells out during checkout flow

### Phase 6: Polish & Testing (Day 1)
- [ ] Test realtime sync: admin toggle → instant menu update
- [ ] Test KDS sync: admin toggle → KDS stock modal updates
- [ ] Test lazy daily reset: `last_fresh_date` logic
- [ ] Mobile responsive check on all new components

---

## 🎨 Design System Consistency

| Element | Style Reference |
|---------|----------------|
| Cards | `glass-card` / `glass-card-heavy` |
| Badges | Existing `Badge` component + custom inventory variants |
| Buttons | Gradient primary (`#FF6B2C` → `#FFB347`), ghost secondary |
| Inputs | `bg-black/50 border-white/10 focus:border-[#FF6B2C]` |
| Colors | Available: `#00D4AA` (emerald), Low: `#FFB347` (amber), Unavailable: `#FF6B2C` (red) |
| Typography | `font-black` for labels, `text-[10px]` for micro-copy |

---

## 🔗 Integration Points with Backend (Antigravity)

| Frontend Need | Backend Endpoint | Status |
|---------------|------------------|--------|
| Fetch full menu + inventory | `GET /api/menu` | Extend existing |
| Morning prep submit | `POST /api/admin/inventory/morning-prep` | **New** |
| Persistent stock update | `PATCH /api/admin/inventory/persistent` | **New** |
| Realtime inventory changes | Supabase channel `menu-inventory-live` | **New** |
| Order creation validates stock | `POST /api/orders` | Extend existing |

---

## 📱 Mobile-First Considerations

1. **Admin Inventory Page**:
   - Stack tabs vertically on mobile
   - Checklist: full-width cards with large touch targets (48px min)
   - Sliders: native `<input type="range">` with custom thumb

2. **Menu Badges**:
   - `sm` size on mobile cards
   - Position: `top-right` with safe area inset

3. **Checkout Validation**:
   - Full-width warning banner
   - Auto-scroll to first unavailable item

---

## ⏱️ Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1-2 | Day 1 AM | Types, API, Context |
| 3 | Day 1 PM - Day 2 AM | Admin Inventory Page |
| 4 | Day 2 AM | Menu Badges |
| 5 | Day 2 PM | Checkout Validation |
| 6 | Day 3 | Realtime Sync, Testing, Polish |

**Total: ~3 days**

---

## 🚨 Open Questions for Backend (Antigravity)

1. **Menu API Response Format**: Will `/api/menu` return merged inventory fields (`inventory_type`, `stock_quantity`, `last_fresh_date`) in each item, or separate endpoint?
2. **Realtime Channel**: Confirm Supabase Realtime enabled on `menu_items` with filter support?
3. **Lazy Reset Logic**: Backend handles `last_fresh_date` comparison on read, or frontend computes `is_available`?
4. **Batch Persistent Update**: Single PATCH with array, or individual PATCH per item?
5. **Auth Guard**: Admin inventory endpoints protected by `role IN ('admin', 'kitchen')`?

---

*Plan ready for execution. Awaiting backend schema deployment to begin Phase 1.*