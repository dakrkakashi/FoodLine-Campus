# Counter Display & Voice Announcer — Implementation Plan

**Target:** `/display` route for 43"–55" TV above Cafe @7 counter  
**Owner:** OpenCode (Frontend Design Specialist)  
**Backend Dependencies:** Supabase Realtime on `orders` table (already configured)

---

## 1. File Hierarchy

```
frontend/
├── src/
│   ├── app/
│   │   └── display/
│   │       ├── page.tsx                    # Main TV route (full-screen, no navbar)
│   │       └── layout.tsx                  # Minimal layout: no Navbar, full-screen, wake lock
│   ├── components/
│   │   └── display/
│   │       ├── DisplayHeader.tsx           # Clock, slot countdown, fullscreen, wake lock, audio toggle
│   │       ├── PreparingColumn.tsx         # Left pane (amber) - PREPARING orders
│   │       ├── ReadyColumn.tsx             # Right pane (emerald) - READY orders with spotlight
│   │       ├── DisplayTicker.tsx           # Bottom marquee ticker
│   │       ├── AudioSettingsDrawer.tsx     # Sound settings modal (localStorage persistence)
│   │       └── index.ts                    # Barrel exports
│   ├── lib/
│   │   ├── voice-announcer.ts              # Web Audio chime + Web Speech TTS queue (en/hi/mr)
│   │   ├── display-utils.ts                # Time formatting, slot calculations, token parsing, counter routing
│   │   └── supabase/display-realtime.ts    # Realtime subscription hook for /display
│   └── hooks/
│       ├── useWakeLock.ts                  # Screen Wake Lock API wrapper
│       └── useRealtimeOrders.ts            # Supabase Realtime orders subscription
```

---

## 2. Component Specifications

### 2.1 `display/layout.tsx`
- **No Navbar** — full-screen TV mode
- **Background:** `bg-[var(--bg-canvas,#07070B)]` + `aurora-mesh` (slower, subtler)
- **Font:** `Outfit` for headers, `JetBrains Mono` for tokens
- **Injects:** Wake Lock on mount, releases on unmount
- **Audio Unlock Overlay:** Shows "Tap anywhere to enable Audio SoundBox" if `AudioContext` suspended (auto-hides on first user gesture)

### 2.2 `DisplayHeader.tsx`
| Element | Spec |
|---------|------|
| Brand | `🍔 FOODLINE CAFE @7` (Outfit, 28pt, white) |
| Clock | Live `HH:MM:SS AM/PM` (JetBrains Mono, 36pt, emerald) |
| Slot Timer | Active break label + countdown `MM:SS` (amber, 24pt) |
| Fullscreen Btn | `document.documentElement.requestFullscreen()` |
| Wake Lock | `navigator.wakeLock.request('screen')` with visibilitychange re-acquire |
| Audio Toggle | Opens `AudioSettingsDrawer` |
| Offline Pill | Amber pill "Reconnecting..." when Supabase channel drops (via `channel.state === 'closed'`) |

### 2.3 `PreparingColumn.tsx` (45% width, amber theme)
- **Grid:** Single column, cards stack vertically
- **Card Style:** `glass-card` with `border-amber-500/30`, `bg-amber-950/20`
- **Content per card:**
  - Token: `FL-XXXX` (JetBrains Mono, 24pt, amber)
  - Items: `"2x Vada Pav, 1x Tea"` (14pt, zinc-300)
  - **Payment Badge:** `UPI PAID` (emerald) or `CASH ON DELIVERY` (amber) — top-right
  - Progress: `~Xm remaining` calculated client-side: `createdAt + max(item.prep_time_mins)`
- **Animation:** `motion.div` layout stagger, `animate-pulse` on progress

### 2.4 `ReadyColumn.tsx` (55% width, emerald hero theme)
- **Card Style:** Giant token display — `text-6xl md:text-8xl font-black text-emerald-300 font-mono`
- **Spotlight Flare on Transition:**
  ```tsx
  // Framer Motion: when status changes PREPARING → READY
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
  // Add emerald ring pulse via CSS keyframe
  ```
- **Badge:** `JUST READY` (emerald bg, black text, animate-in)
- **Payment Badge:** Prominent `CASH ON DELIVERY` tag (amber bg, white text) or `PAID` (emerald)
- **Counter Assignment (Smart Dynamic Routing + COD Override):**
  - **Counter 1 (Hot Kitchen & Snacks + COD Collection):** Orders containing cooked meals (Dosa, Burgers, Vada Pav, Maggi, Pizza, Sandwiches, Momos, Fries, Pasta, Garlic Bread, Chaat, Chole Bhature) **OR** any COD order
  - **Counter 2 (Beverages & Express Desserts):** Orders with ONLY beverages/desserts (Tea, Cold Coffee, Shakes, Hot Chocolate, Brownie, Gulab Jamun) **AND** prepaid (UPI)
  - Logic in `display-utils.ts`: `getCounterForOrder(orderItems, paymentMode)` → `1 | 2`
  - **COD always routes to Counter 1** for cash collection
- **Auto-Drop on COLLECTED:** Fade + checkmark, stay 45s (uses `updated_at`), then `AnimatePresence` exit

### 2.5 `DisplayTicker.tsx`
- **CSS-only marquee** (no JS animation loop for performance)
- **Content:** Template strings from `display-utils.ts`:
  - `⚡ Average Pickup Speed: 26s`
  - `🥪 Dishes Served Today: {count}+`
  - `🛡️ FSSAI Pure Veg Guarantee • Sanjivani Cafe @7`
- **Animation:** `animation: marquee 30s linear infinite` on inner track

### 2.6 `AudioSettingsDrawer.tsx`
- **State:** `localStorage('foodline_tv_sound_settings')` → `{ enabled: true, volume: 0.8, lang: 'en-IN' }`
- **Controls:**
  - Master toggle (mutes chime + TTS)
  - Volume slider (0–100%, applies to `gain.gain.value`)
  - Language select: `en-IN` | `hi-IN` | `mr-IN`
  - "Test Voice" button → plays chime + speaks test phrase
  - **Hidden:** Long-press "Test Voice" 3s → toggles Demo Mode
- **UI:** Slide-over from right, glassmorphism, 400px wide

---

## 3. Voice Announcer (`voice-announcer.ts`)

### 3.1 Chime Generator (Web Audio API)
```ts
function playChime(ctx: AudioContext, volume: number) {
  // D5 (587.33Hz) → A5 (880Hz), sine, 0.25s each
  [587.33, 880].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime + i * 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.25);
    osc.stop(ctx.currentTime + (i + 1) * 0.25);
  });
}
```

### 3.2 TTS Queue Controller with COD Support
```ts
interface QueuedAnnouncement {
  token: string;
  counter: 1 | 2;
  lang: 'en-IN' | 'hi-IN' | 'mr-IN';
  paymentMode: 'UPI' | 'COD';
  resolve: () => void;
}

const queue: QueuedAnnouncement[] = [];
let isSpeaking = false;

function announce(token: string, counter: 1 | 2, paymentMode: 'UPI' | 'COD', settings: SoundSettings) {
  return new Promise<void>(resolve => {
    queue.push({ token, counter, lang: settings.lang, paymentMode, resolve });
    processQueue(settings);
  });
}

async function processQueue(settings: SoundSettings) {
  if (isSpeaking || queue.length === 0) return;
  isSpeaking = true;
  const item = queue.shift()!;
  
  // 1. Play chime
  await playChime(audioCtx, settings.volume);
  await delay(200);
  
  // 2. Speak phrase (COD-specific phrasing)
  const phrases = {
    'en-IN': {
      UPI: `Token ${item.token}, please collect your order at Counter ${item.counter}.`,
      COD: `Token ${item.token}, cash on delivery at Counter ${item.counter}. Please pay on collection.`,
    },
    'hi-IN': {
      UPI: `टोकन ${item.token}, कृपया काउंटर ${item.counter} से अपना ऑर्डर प्राप्त करें।`,
      COD: `टोकन ${item.token}, काउंटर ${item.counter} पर नकद भुगतान। कृपया भुगतान करके ऑर्डर लें।`,
    },
    'mr-IN': {
      UPI: `टोकन ${item.token}, कृपया काउंटर ${item.counter} वरून तुमची ऑर्डर घ्या.`,
      COD: `टोकन ${item.token}, काउंटर ${item.counter} वर नगद देय. कृपया देय करून ऑर्डर घ्या.`,
    },
  };
  const utter = new SpeechSynthesisUtterance(phrases[item.lang][item.paymentMode]);
  utter.lang = item.lang;
  utter.volume = settings.volume;
  utter.rate = 0.95;
  utter.onend = () => { item.resolve(); isSpeaking = false; processQueue(settings); };
  speechSynthesis.speak(utter);
}
```

### 3.3 Audio Unlock (Auto on First Gesture)
```ts
// In display/layout.tsx or voice-announcer.ts init
function ensureAudioUnlocked() {
  if (audioCtx.state === 'suspended') {
    const unlock = async () => {
      await audioCtx.resume();
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      hideAudioUnlockOverlay();
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    showAudioUnlockOverlay(); // "Tap anywhere to enable Audio SoundBox"
  }
}
```

### 3.4 Integration Point
- Call `announce(orderToken, counter, paymentMode, settings)` from `ReadyColumn` when order enters READY
- Debounce: if multiple orders flip to READY in same tick, they queue naturally

---

## 4. State Management

### 4.1 `useRealtimeOrders.ts` (supabase/display-realtime.ts)
```ts
export function useDisplayOrders() {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // 1. Initial fetch
    supabase.from('orders')
      .select('*, order_items(*)')
      .in('status', ['PREPARING', 'READY', 'COLLECTED'])
      .order('created_at', { ascending: true })
      .then(({ data }) => setOrders(data || []));
    
    // 2. Realtime subscription (dedicated channel per backend spec)
    const channel = supabase
      .channel('display-orders-live')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: 'status=in.(PREPARING,READY,COLLECTED)'
      }, payload => {
        const updated = payload.new as DisplayOrder;
        setOrders(prev => {
          const idx = prev.findIndex(o => o.id === updated.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], ...updated };
            return next;
          }
          if (['PREPARING', 'READY'].includes(updated.status)) {
            return [...prev, updated];
          }
          return prev;
        });
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });
    
    return () => supabase.removeChannel(channel);
  }, []);
  
  // Derived views
  const preparing = orders.filter(o => o.status === 'PREPARING');
  const ready = orders.filter(o => o.status === 'READY');
  const justCollected = orders.filter(o => o.status === 'COLLECTED' && Date.now() - new Date(o.updated_at).getTime() < 45000);
  
  return { preparing, ready, justCollected, all: orders, isConnected };
}
```

### 4.2 `DisplayOrder` Type (extend `frontend/src/lib/types.ts`)
```ts
export type PaymentMode = 'UPI' | 'COD';

export interface DisplayOrder extends Order {
  order_items: OrderItem[];
  payment_mode?: PaymentMode;       // 'UPI' | 'COD' (from orders.payment_mode)
  estimatedReadyAt?: string;        // calculated client-side: createdAt + max(item.prep_time_mins)
  counter?: 1 | 2;                  // derived via getCounterForOrder(order_items, payment_mode)
}
```

### 4.3 `useWakeLock.ts`
```ts
export function useWakeLock() {
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    const request = async () => {
      try { wakeLock = await navigator.wakeLock.request('screen'); }
      catch (e) { console.warn('Wake Lock denied:', e); }
    };
    request();
    const handleVisibility = () => { if (document.visibilityState === 'visible') request(); };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => { wakeLock?.release(); document.removeEventListener('visibilitychange', handleVisibility); };
  }, []);
}
```

---

## 5. Cash on Delivery (COD) — New Section

### 5.1 Data Model Changes (Backend)

**Orders Table Addition:**
```sql
-- Add to orders table
ALTER TABLE orders ADD COLUMN payment_mode VARCHAR(10) DEFAULT 'UPI' 
  CHECK (payment_mode IN ('UPI', 'COD'));
```

**Order Creation Flow:**
- Checkout page: Add payment method selector (UPI / Cash on Delivery)
- COD orders: `status = 'CONFIRMED'` immediately (no UTR verification needed)
- UPI orders: `status = 'PENDING_PAYMENT'` → `CONFIRMED` after UTR verification
- COD orders bypass `/api/payments/verify-utr` entirely

### 5.2 Frontend Display Logic

**Payment Badge Component (`PaymentBadge.tsx`):**
```tsx
// Reusable badge for both columns
export function PaymentBadge({ mode }: { mode: 'UPI' | 'COD' }) {
  return mode === 'COD' ? (
    <span className="px-2 py-0.5 rounded text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
      💰 COD
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
      ✓ PAID
    </span>
  );
}
```

**Counter Assignment with COD Override (`display-utils.ts`):**
```ts
export function getCounterForOrder(
  items: DisplayOrder['order_items'], 
  paymentMode: PaymentMode = 'UPI'
): 1 | 2 {
  // COD ALWAYS goes to Counter 1 (cash collection point)
  if (paymentMode === 'COD') return 1;
  
  // Prepaid: Smart Dynamic Routing
  const hasCookedMeal = items.some(item => 
    COOKED_CATEGORIES.has(item.category) || 
    COOKED_TAGS.has(item.tag)
  );
  return hasCookedMeal ? 1 : 2;
}

const COOKED_CATEGORIES = new Set([
  'South Indian', 'North Indian', 'Sandwiches', 
  'Momos & Burgers', 'Fries & Pasta', 'Garlic Bread & Pizza',
  'Maggi & Chinese', 'Quick Bites', 'Chaat Corner'
]);

const COOKED_TAGS = new Set([
  'Bestseller', 'Special Grab', 'Campus Classic', 'Fast Grab',
  'Hot Grill', 'Signature', 'Chef Special', 'Student Fav', 'Spicy'
]);
```

### 5.3 Voice Announcer COD Phrases
- **English COD:** `"Token FL-1793, cash on delivery at Counter 1. Please pay on collection."`
- **Hindi COD:** `"टोकन FL-1793, काउंटर 1 पर नकद भुगतान। कृपया भुगतान करके ऑर्डर लें।"`
- **Marathi COD:** `"टोकन FL-1793, काउंटर 1 वर नगद देय. कृपया देय करून ऑर्डर घ्या."`

### 5.4 COD Order Lifecycle on Display
| Stage | Preparing Column | Ready Column |
|-------|------------------|--------------|
| **PREPARING** | Amber card + `COD` badge (amber) | — |
| **READY** | — | Emerald card + `COD` badge (amber) + **Voice: "cash on delivery..."** |
| **COLLECTED** | — | Fade + checkmark (45s) → "Payment Collected" text briefly |

### 5.5 Kitchen Workflow Impact
- **KDS (Kitchen Display):** COD orders show same as UPI — kitchen doesn't care about payment mode
- **Counter Staff:** At Counter 1, staff collects cash, then marks `COLLECTED`
- **No UTR verification step** for COD — simplifies checkout flow

---

## 6. Demo Mode

### 6.1 Toggle Location
- Hidden in `AudioSettingsDrawer` (long-press "Test Voice" 3s) OR `localStorage.setItem('foodline_demo_mode', 'true')`

### 6.2 Behavior
```ts
useEffect(() => {
  if (localStorage.getItem('foodline_demo_mode') !== 'true') return;
  const interval = setInterval(() => {
    // Generate mock order with random items + random payment mode
    const mockOrder = generateMockOrder({ 
      paymentMode: Math.random() > 0.5 ? 'UPI' : 'COD' 
    });
    setOrders(prev => [...prev, mockOrder]);
    setTimeout(() => flipToReady(mockOrder.id), random(10000, 30000));
  }, 15000);
  return () => clearInterval(interval);
}, []);
```

### 6.3 Optional Backend Seed Endpoint
- `POST /api/display/seed` — Creates 5–10 mock orders in Supabase (dev only)
- Called once on demo mode activation if online

---

## 7. Design Token Extensions (add to `globals.css`)

```css
:root {
  /* Display-specific */
  --display-amber: #FFB347;
  --display-amber-glow: rgba(255, 179, 71, 0.35);
  --display-emerald: #00D4AA;
  --display-emerald-glow: rgba(0, 212, 170, 0.5);
  --display-token-font: 'JetBrains Mono', monospace;
  --display-header-font: 'Outfit', sans-serif;
}

.display-card-preparing {
  @apply glass-card border-[var(--display-amber)]/30 bg-amber-950/20;
}
.display-card-ready {
  @apply glass-card border-[var(--display-emerald)]/40 bg-emerald-950/20;
}
.marquee-track {
  display: flex;
  animation: marquee 30s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.spotlight-flare {
  animation: flare-in 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes flare-in {
  0% { box-shadow: 0 0 0 0 var(--display-emerald-glow); }
  50% { box-shadow: 0 0 60px 20px var(--display-emerald-glow); }
  100% { box-shadow: 0 0 0 0 var(--display-emerald-glow); }
}

/* Audio unlock overlay */
.audio-unlock-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm text-white text-xl font-medium;
}
.offline-pill {
  @apply fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-300 text-sm font-medium animate-pulse;
}

/* Payment badges */
.badge-cod {
  @apply px-2 py-0.5 rounded text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30;
}
.badge-paid {
  @apply px-2 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30;
}
```

---

## 8. Backend Answers — Resolved

| # | Question | Resolution |
|---|----------|------------|
| 1 | **Counter assignment** | **Smart Dynamic Routing** (client-side): Beverages/desserts only → Counter 2; Any cooked meal → Counter 1. **COD Override:** All COD → Counter 1. Logic in `display-utils.ts`. |
| 2 | **Estimated ready time** | **Client-side calculation**: `createdAt + max(item.prep_time_mins)` from `order_items`. No backend field needed. |
| 3 | **Order items relation** | **Confirmed** — `SELECT *, order_items(*)` works via Supabase. |
| 4 | **Realtime channel** | **Dedicated channel** `display-orders-live` (separate from KDS). |
| 5 | **COLLECTED timestamp** | **Confirmed** — `updated_at` = NOW() on status change to COLLECTED. |
| 6 | **Demo seed endpoint** | **Optional** `POST /api/display/seed` (dev only). Demo mode works client-side without it. |

---

## 9. Implementation Order

| Phase | Files | Dependencies |
|-------|-------|--------------|
| **1. Foundation** | `display/layout.tsx`, `display/page.tsx`, `display-realtime.ts`, `useWakeLock.ts`, `display-utils.ts` (counter routing, time calc, COD logic) | None |
| **2. Header & Ticker** | `DisplayHeader.tsx`, `DisplayTicker.tsx`, CSS tokens, offline pill | Phase 1 |
| **3. Columns** | `PreparingColumn.tsx`, `ReadyColumn.tsx`, `PaymentBadge.tsx` (counter badge, spotlight flare, COD badges) | Phase 1–2 |
| **4. Voice Engine** | `voice-announcer.ts` (chime, TTS queue, audio unlock, COD phrases), `AudioSettingsDrawer.tsx` | Phase 3 (needs READY trigger) |
| **5. Polish** | Spotlight flare, auto-drop 45s, demo mode, fullscreen persistence, offline resilience | Phase 1–4 |

---

## 10. Acceptance Criteria

1. **TV-ready:** Loads at `/display`, enters fullscreen on mount, wake lock prevents sleep
2. **Real-time:** Orders appear in PREPARING → READY columns within 500ms of Supabase update
3. **Voice:** Chime + TTS announces each READY order in selected language, queued sequentially
4. **COD Voice:** COD orders announce "cash on delivery at Counter X, please pay on collection"
5. **Audio Unlock:** First tap/click enables audio, overlay disappears permanently
6. **Offline Resilience:** "Reconnecting..." pill appears if Supabase drops; existing cards persist
7. **Payment Badges:** UPI = green "PAID", COD = amber "COD" on all order cards
8. **COD Routing:** All COD orders route to Counter 1 regardless of items
9. **Readable:** Token text ≥ 48pt, visible at 25ft in bright ambient light
10. **Persistent:** Audio settings survive reload; demo mode toggle works
11. **No console errors:** Clean hydration, no Supabase channel leaks
12. **Performance:** 60fps on 4K TV (test with Chrome DevTools Performance tab)

---

## 11. Estimated Effort

| Component | Complexity | Est. Hours |
|-----------|------------|------------|
| Layout + Realtime + Wake Lock + Utils | Medium | 3 |
| Header + Ticker + Offline Pill | Low | 2 |
| Preparing/Ready Columns + Animations + COD Badges | High | 5 |
| Voice Announcer + Queue + Settings + Audio Unlock + COD Phrases | High | 4.5 |
| Demo Mode + Polish + Resilience | Medium | 2 |
| **Total** | | **~16.5 hours** |

---

## 12. Key Implementation Notes

1. **Counter routing is purely client-side** — no backend changes needed for routing logic. Uses `order_items` category/tags + `payment_mode` to determine counter.

2. **Estimated ready time is client-side** — `createdAt` + `Math.max(...order_items.map(i => i.prep_time_mins || 5))` minutes.

3. **Offline pill** — Track `isConnected` from Supabase channel state; render amber pill fixed bottom-center when `false`.

4. **Audio unlock overlay** — Full-screen semi-transparent overlay with "Tap anywhere to enable Audio SoundBox" text. Listens for `click`/`touchstart` once, resumes `AudioContext`, hides overlay.

5. **Dedicated realtime channel** — `display-orders-live` separate from KDS `kds-orders-live` to avoid coupling.

6. **Backend COD support needed:**
   - Add `payment_mode` column to `orders` table
   - Checkout API: accept `payment_mode: 'COD' | 'UPI'`
   - COD orders: auto-confirm (skip UTR verification)
   - KDS: no changes needed (payment mode irrelevant to kitchen)

---

**Plan complete.** COD section added with full data model, display logic, voice announcer phrases, and backend requirements. Ready for execution phase.