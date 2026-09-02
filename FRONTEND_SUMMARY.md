# FoodLine Frontend Codebase Comprehensive Summary

## Project Type & Framework

**Framework:** Next.js 15 (App Router) with React 18+
**Language:** TypeScript (strict mode)
**UI Library:** Custom shadcn-inspired component library with Radix UI underpinnings
**Styling:** Tailwind CSS v3.x with custom design tokens in `globals.css`
**State Management:** React Context (CartContext, ThemeContext, CampusContext, InventoryContext) + SWR/data fetching
**Animations:** Framer Motion (`motion/react`) for all transitions and physics-based animations
**HTTP Client:** Native `fetch` API + Supabase JS client for realtime
**Utilities:** `clsx`, `tailwind-merge`, `lodash` utilities

**Package Dependencies (from package.json):**
- `gsap`: ^3.15.0 — JavaScript animation library for complex timelines
- `lottie-web`: ^5.13.0 — Lottie animation rendering for illustrations
- `motion`: ^13.1.1 — Framer Motion for React animations

## Key UI Pages & Their Purpose

| Page Path | Purpose | Key Features |
|---|---|---|
| `/` (`page.tsx`) | Introduction/Hero Landing | Full-screen aurora background, value props, campus canteens showcase, PRN login CTA |
| `/menu` (`page.tsx`) | Interactive Menu Browser | Category pills, search, 44+ dishes with tags (Bestseller/StudentFav/FastGrab/Spicy), Add-to-tray functionality, 3D inspect modal |
| `/checkout` (`page.tsx`) | 3-Step Order Flow | Cart review → Slot selection → UPI payment/UTR verification → Order submission |
| `/orders` (`page.tsx`) | Order History & Tracking | View past orders, filter by active/completed, search by token/OTP/dish, 1-tap reorder |
| `/order/[token]` (`page/[token]/page.tsx`) | Live Order Tracking | SSE + Supabase Realtime, stepper status tracker, optical QR pass, pickup OTP display |
| `/select-campus` | Campus selection (not fully explored) | |
| `/login` | Student authentication | Google SSO + PRN login with OTP |
| `/canteens` | Canteen browser | View all 5 campus canteens |
| `/kds` | Kitchen Display System | 3-column kanban board for order status management |
| `/admin` / `/debug` | Admin tools | Staff/manager functions |

## Design System Details

### Color Tokens (from `globals.css` `:root`)

**Canvas & Surfaces:**
- `--bg-canvas: #07070B` — Deep obsidian global background
- `--bg-card: #12121A` — Card surface default
- `--bg-card-hover: #191924` — Hover state
- `--bg-glass: rgba(18, 18, 26, 0.72)` — Glassmorphism backdrop
- `--border-glass: rgba(255, 255, 255, 0.08)` — Glass border default

**Brand & Vibrant Accents (primary design palette):**
- `--accent-orange: #FF6B2C` — Primary brand orange (CTAs, active states)
- `--accent-orange-glow: rgba(255, 107, 44, 0.4)` — Orange glow effect
- `--accent-amber: #FFB347` — Warm amber (bestseller badges, secondary highlights)
- `--accent-amber-glow: rgba(255, 179, 71, 0.35)` — Amber glow
- `--accent-teal: #00D4AA` — Emerald cyan (success, 0% fee, verified states)
- `--accent-teal-glow: rgba(0, 212, 170, 0.4)` — Teal glow
- `--accent-purple: #8B5CF6` — Purple accent (special tags)
- `--accent-rose: #F43F5E` — Rose pink (spicy variant)
- `--accent-blue: #3B82F6` — Blue accent
- `--accent-rose: #F43F5E` — Rose/red accent

**Typography Text:**
- `--text-primary: #F5F5F7` — White highest contrast
- `--text-secondary: #A1A1AA` — Medium contrast secondary
- `--text-muted: #71717A` — Muted text

### Typography Scale (from Design System doc)
- **Display Hero:** `clamp(2.5rem, 6vw, 4.5rem)` · `font-weight: 900` · `letter-spacing: -0.04em`
- **Section Heading (H1):** `clamp(1.75rem, 3.5vw, 2.5rem)` · `font-weight: 800`
- **Card Title (H2/H3):** `clamp(1.1rem, 2vw, 1.35rem)` · `font-weight: 700`
- **Body Text:** `1rem (16px)` · `line-height: 1.5` · `font-weight: 400`
- **Token & PIN Numbers:** `font-family: JetBrains Mono` · `font-weight: 800` · `letter-spacing: 0.1em`

**Font Families:**
- `--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` — UI body
- `--font-heading: 'Outfit', 'Inter', sans-serif` — Headings, cards, titles
- `--font-mono: 'JetBrains Mono', monospace` — Token IDs, numbers, UTR codes

### Glassmorphism System (from `globals.css`)
- `.glass-card`: `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`
- `.glass-card-heavy`: `backdrop-filter: blur(16px)`, darker backdrop
- `.glass-interactive`: `backdrop-filter: blur(10px)`, with hover transition transform

### Component Variations

**Buttons (`ui/Button.tsx`):**
- Variants: `primary`, `secondary`, `glass`, `danger`, `ghost`
- Sizes: `sm`, `md`, `lg`
- Primary: `bg-gradient-to-r from-[#FF6B2C] via-[#FF8A3D] to-[#FFB347]`
- Secondary: `bg-[#00D4AA] text-black`
- Glass: `bg-[#16161E]/80 backdrop-blur-xl border border-white/10`

**Badges (`ui/Badge.tsx`):**
- Variants: `veg`, `bestseller`, `studentFav`, `fastGrab`, `spicy`, `live`, `full`, `available`, `custom`
- Veg: `bg-emerald-950/40 border-emerald-500/40` with green circle
- Seller: `bg-[#FF6B2C]/15 border-[#FF6B2C]/40 text-[#FF8A3D]`
- Student Fav: `bg-[#FFB347]/15 border-[#FFB347]/40 text-[#FFB347]`
- Fast Grab: `bg-[#00D4AA]/15 border-[#00D4AA]/40 text-[#00D4AA]`

**Progress Bar (`ui/ProgressBar.tsx`):**
- Color coding: >80% → red, >50% → amber, <50% → teal
- With glow shadows matching color scheme

### UI Patterns & Conventions

**1. Aurora Background Mesh**
- `.aurora-mesh` position: absolute, `inset: 0`
- `.aurora-blob` with `filter: blur(40px)`, `border-radius: 9999px`, `opacity: 0.16`
- CSS animations: `aurora-flow` (24s), `blob-slow` (16s), `blob-drift` (20s)

**2. Glassmorphism Cards**
- Used extensively for modals, spotlights, stepper containers
- Always with `backdrop-filter: blur()` and subtle borders

**3. Magnetic Hover Effect**
- `Magnetic` component uses Framer Motion `whileHover` with physics spring
- Applied to buttons, navigation links, category pills
- Strength prop ranges 0.1-0.3

**4. Stepper Progress Pattern**
- Horizontal steppers with circle indicators
- Completed steps: teal bg (`#00D4AA`)
- Active step: orange bg (`#FF6B2C`) with pulse animation
- Connector lines transition from gray to teal

**5. Spotlight Card Pattern**
- Reusable component with optional `spotlightColor` prop
- `rounded-[2rem]`, `border-white/10`, `backdrop-blur-md`
- Used for cart summary, slot selection, payment options, order cards

**6. Quantity Control Pattern**
- `+`-`-` buttons with `bg-black/40 border-white/10 rounded-xl`
- Scale animations on hover/tap (0.94-1.06)
- Disabled state with `opacity-40 cursor-not-allowed`

**7. Toast/Feedback Patterns**
- Confetti + fireworks on successful order (`fireConfettiSuccess`, `fireFireworks`)
- Custom cursor (`CustomCursor`)
- Global click effect (`GlobalClickEffect`)
- Sound FX (`useSoundFX`) - sine wave chimes on clicks, success melodies

**8. Order Status Flow**
- Pipeline: `PENDING_PAYMENT` → `PAY_AT_COUNTER`/`CONFIRMED` → `PREPARING` → `READY` → `COLLECTED` → `CANCELLED`
- Status badges with consistent color scheme
- Live tracking via SSE + Supabase Realtime

**9. UTR Verification Pattern**
- 12-digit numeric input with auto-formatting
- Real-time digit count display (`utrNumber.length/12`)
- Input mode: `numeric`, `maxLength: 12`

**10. Slot Capacity Visualization**
- Progress bar inside slot selection (`ProgressBar` component)
- Color-coded: Green < 80%, Amber > 80%, Red = FULL
- Text: `${availableSlots} left (${booked}/${maxCapacity})`

## Available npm Packages for UI Enhancement

### Already Installed:
| Package | Version | Usage |
|---|---|---|
| `gsap` | ^3.15.0 | Complex timeline animations, scroll triggers |
| `lottie-web` | ^5.13.0 | Rendering Lottie animations for illustrations |
| `motion` | ^13.1.1 | Framer Motion - page transitions, physics animations, drag gestures |

### UI/UX Enhancement Opportunities:
- **`@radix-ui/react-icons`** — Already using lucide-react, but radix provides accessible component versions
- **`@headlessui/react`** — Unstyled, accessible UI primitives (if not already integrated)
- **`swiper`** — For category carousel or dish slider on mobile
- **`react-hot-toast`** — For toast notifications instead of confetti-only feedback
- **`nuka-carousel`** — For image/card carousels
- **`react-toastify` — Alternative toast system
- **`framer-motion`** (already v13) — Full physics engine for complex animations
- **`clsx` / `tailwind-merge`** (already used) — Conditional className management
- **`lucide-react`** — Already comprehensive icon set (200+ icons)

### Design System Enhancements Available:
- **Tailwind CSS Forms** — Already customized, but could add `tailwindcss-forms` plugin
- **`@tailwind/typography`** — For content areas with auto-styling
- **`@tailwind/aspect-ratio`** — Consistent image aspect ratios (CLS prevention)
- **`daisyui`** — Additional pre-styled components if needed alongside custom UI

## File Structure Overview

```
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── 401/, 402/, 403/, 503/ # Error pages
│   ├── admin/              # Admin dashboard
│   ├── api/                # Route handlers (auto-exported)
│   ├── canteens/           # Canteen browser
│   ├── checkout/           # 3-step order flow
│   ├── kds/                # Kitchen Display System
│   ├── layout.tsx          # Root layout with Providers + globals.css
│   ├── login/              # Auth entrance
│   ├── menu/               # Interactive menu grid
│   ├── order/[token]/      # Live order tracking
│   ├── orders/             # Order history
│   ├── payment/            # Payment page
│   ├── profile/            # User profile
│   ├── select-campus/      # Campus selection
│   └── globals.css         # Design tokens + Tailwind imports
│
├── components/             # Reusable UI components
│   ├── ui/                 # Core UI primitives (25 components)
│   │   ├── Button.tsx      # Primary CTA component
│   │   ├── Badge.tsx       # Tag/badges component
│   │   ├── ProgressBar.tsx # Capacity/status bar
│   │   ├── Stepper.tsx     # Workflow step indicator
│   │   ├── Skeleton.tsx    # Loading states
│   │   ├── AnimatedCard.tsx # Card with entrance animation
│   │   ├── PageTransition.tsx # Page enter/exit transitions
│   │   ├── Magnetic.tsx    # Magnetic hover physics
│   │   ├── SpotlightCard.tsx # Glass card with accent
│   │   ├── Stepper.tsx     # Progress workflow
│   │   └── ... (20+ more)
│   ├── magicui/            # High-impact magic UI components
│   │   ├── shimmer-button.tsx # Animated gradient button
│   │   ├── border-beam.tsx    # Decorative animated border
│   │   ├── meteors.tsx        # Background meteor effect
│   │   ├── number-ticker.tsx  # Animated counters
│   │   └── animated-shiny-text.tsx
│   ├── auth/               # Auth-related components
│   ├── 3d/                 # 3D dish inspection modal
│   ├── illustrations/      # Custom illustrated components
│   ├── theme/              # Theme customizer
│   └── Providers.tsx       # All context providers wrapper
│
├── context/                # React Context providers
│   ├── ThemeContext.tsx    # 13 theme configurations
│   ├── CartContext.tsx     # Cart state + item management
│   ├── CampusContext.tsx   # Campus/canteen selection
│   └── InventoryContext.tsx # Stock availability tracking
│
├── hooks/                  # Custom React hooks
│   └── useSoundFX.ts       # Web Audio synth for clicks/success
│
├── lib/                    # Utilities & types
│   ├── types.ts            # Single source of truth TypeScript interfaces
│   ├── auth/               # Auth utilities
│   └── order-history-store.ts # Local storage order history
│
└── utils/                  # Helper utilities
    └── supabase/           # Supabase client configuration
```

## Key Design Conventions

1. **Dark High-Contrast Theme**: Default `#07070B` canvas with `#F5F5F7` text
2. **Glassmorphism Everywhere**: All modals/cards use blur backgrounds with subtle borders
3. **Brand Orange as Primary Accent**: `#FF6B2C` is the dominant CTA color
4. **Teal for Success/Zero Fee**: `#00D4AA` indicates success/zero surcharge states
5. **Amber for Bestsellers/Warnings**: `#FFB347` marks popular items/caution states
6. **Magnetic Physics on Interactions**: All tappable buttons have subtle pull/push animations
7. **Aurora Background**: Present on almost every page for visual continuity
8. **3D Inspect Modal**: Dishes can be inspected in 3D via `DishInspectModal`
9. **Confetti Celebration**: Order success triggers particle effects + fireworks
10. **OTP + PIN Security**: 4-digit backup PIN alongside 12-digit UTR verification
11. **Zero-Payment Fee UPI**: `DirectPay` emphasizes 0% gateway fee throughout UI
12. **Touch Target Minimums**: All `+`, `-` buttons and interactive elements meet 48px minimum
13. **Focus Rings**: `focus-visible:ring-2 ring-[#FF6B2C]` on all interactive elements
14. **Reduced Motion Support**: `@media (prefers-reduced-motion)` disables heavy transforms
15. **CLS Prevention**: All dish cards have fixed aspect-ratio placeholders