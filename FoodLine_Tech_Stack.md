# 🛠️ FoodLine: Technology Stack & Infrastructure Specifications
**Version:** 1.0.0 · **Target Environment:** Node.js 20+ / Edge Runtime  
**Author:** Shivam Nirmal (Founder & Engineering Lead)

---

## 1. Complete Technology Matrix

| Layer | Technology | Version / Spec | Primary Rationale |
|---|---|---|---|
| **Core Framework** | **Next.js** | `15.1.x` (App Router) | Server-Side Rendering (SSR), Server Actions, Edge Middleware, fast campus initial load. |
| **View Layer** | **React** | `19.x` | React Compiler optimizations, automatic memoization, concurrent rendering. |
| **Language** | **TypeScript** | `5.7.x` (Strict Mode) | End-to-end type safety across API routes, database schemas, and client state. |
| **Styling** | **Tailwind CSS** | `v4.x` | High-performance atomic CSS engine, custom OKLCH color spaces, zero bundle bloat. |
| **Component Library** | **shadcn/ui + Radix** | Latest | WAI-ARIA accessible primitives, themeable, headless composability. |
| **Animation Engine** | **Motion** | `12.x` | Spring-physics transitions, gesture tracking (touch swipe), micro-interactions. |
| **Database** | **Supabase (PostgreSQL)** | `15.x` | ACID compliance, Row-Level Security (RLS), instant JSON relational queries. |
| **Real-Time Pipeline** | **Server-Sent Events (SSE)** | Native HTTP/2 | Zero-overhead bi-directional order status propagation to student devices. |
| **Code Intelligence** | **Graphify AST** | `0.9.x` | Knowledge graph AST analysis, modular architecture enforcement, and memory reflection. |
| **Deployment & Edge** | **Vercel Edge Network** | Global CDN | Global sub-20ms edge routing, automated CI/CD pipelines from GitHub. |

---

## 2. Component Hierarchy & Directory Architecture

```
FoodLine/
├── app/
│   ├── layout.tsx                # Global theme provider, font preloads, and metadata
│   ├── page.tsx                  # Landing & campus selector page
│   ├── menu/
│   │   └── page.tsx              # Live menu browsing with category pills
│   ├── checkout/
│   │   └── page.tsx              # Slot picker, UPI QR modal & UTR input
│   ├── order/[token]/
│   │   └── page.tsx              # Real-time SSE order tracking & dynamic QR pass
│   ├── kds/
│   │   └── page.tsx              # Kitchen Display System slot batching view
│   └── api/
│       ├── orders/route.ts       # Order lifecycle & slot throttling handler
│       ├── payments/verify.ts    # Option C UTR verification & replay guard
│       └── sse/orders/route.ts   # Event stream broadcaster
├── components/
│   ├── ui/                       # shadcn/ui components (cards, dialogs, badges, buttons)
│   ├── menu-card.tsx             # Interactive menu item with incrementor
│   ├── slot-picker.tsx           # 10-minute break slot selection grid
│   ├── upi-qr-modal.tsx          # Merchant standee display + copyable UPI ID
│   ├── qr-pass-card.tsx          # High-contrast optical QR pass for 30s handover
│   └── kds-slot-column.tsx       # Kitchen preparation batch aggregator
├── lib/
│   ├── supabase.ts               # Supabase database client instance
│   ├── throttle-engine.ts        # Algorithmic slot capacity counter
│   └── types.ts                  # Shared TypeScript interfaces
├── public/
│   └── assets/                   # Optimized WebP dish images and icons
└── graphify-out/                 # Graphify knowledge graph and code intelligence nodes
```

---

## 3. Key Dependencies (`package.json`)

```json
{
  "name": "foodline-campus",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "graphify": "graphify extract ."
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^12.0.0",
    "@supabase/supabase-js": "^2.47.0",
    "lucide-react": "^0.468.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "qrcode.react": "^4.1.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.1",
    "tailwindcss": "^4.0.0",
    "eslint": "^9.17.0"
  }
}
```

---

## 4. Performance, Caching & Scaling Strategy

1. **Edge Route Acceleration:** Static pages (menu layout, static assets) cached at edge with `stale-while-revalidate`.
2. **Dynamic Slot Cache:** Break slot booking counts cached in-memory with sub-5ms lookups to eliminate database locking during lunch rush.
3. **Optimistic UI Updates:** Client state updates immediately upon slot tap with background reconciliation, delivering instant native-app feel.
4. **Asset Optimization:** Next.js Image optimization converting all dish photos to next-gen WebP/AVIF format with adaptive quality based on device network speed.
