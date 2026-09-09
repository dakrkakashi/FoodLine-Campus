# 🎨 03 • UI/UX Design System & Anti-Vibecoding Standards
**Project Name:** FoodLine Campus  
**Design System:** Glassmorphic Campus Minimalist  
**CSS Framework:** Tailwind CSS v4 + Vanilla CSS Custom Properties  
**Font Stack:** Outfit (Headings), Plus Jakarta Sans (Body), JetBrains Mono (Codes & Metrics)

---

## 1. Core Visual Tokens & CSS Custom Properties

All styling uses centralized CSS custom properties declared on `:root` and mirrored in Tailwind CSS v4 `@theme`:

```css
:root {
  /* Dynamic Canvas & Surface */
  --bg-canvas: #09070B;
  --bg-card: rgba(255, 107, 44, 0.05);
  --bg-card-hover: rgba(255, 107, 44, 0.10);
  --border-card: rgba(255, 107, 44, 0.14);
  --border-card-hover: rgba(255, 107, 44, 0.30);

  /* Typography */
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;

  /* Theme Accents (Default: Sanjivani Sunset) */
  --accent-primary: #FF6B2C;
  --accent-secondary: #FFB347;
  --accent-highlight: #00D4AA;
  --glow-primary: rgba(255, 107, 44, 0.35);

  /* Elevation & Glassmorphism */
  --glass-blur: 12px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
}
```

---

## 2. The 12 Dynamic Themes

FoodLine features **12 curated, responsive campus themes** switchable in real-time via `ThemeContext.tsx`:

| Theme Key | Name | Visual Persona | Primary Accent | Background Canvas |
|---|---|---|---|---|
| `sunset` | **Sanjivani Sunset (Default)** | Warm saffron & citrus energy | `#FF6B2C` (Tangerine) | `#09070B` (Obsidian) |
| `obsidian` | **Obsidian OLED** | Pure pitch black & violet | `#8B5CF6` (Violet) | `#000000` (OLED Pitch) |
| `cyberpunk` | **Cyberpunk Neon** | 80s synthwave neon grid | `#EC4899` (Hot Pink) | `#0B0813` (Deep Void) |
| `mint` | **Emerald Mint** | Eco campus green & gold | `#10B981` (Emerald) | `#060F0C` (Forest Deep) |
| `solar` | **Solar Flare** | High-contrast yellow & fire | `#F59E0B` (Amber Gold) | `#0E0B04` (Charcoal) |
| `sapphire` | **Midnight Sapphire** | Deep university blue & cyan | `#3B82F6` (Electric Blue) | `#060B14` (Deep Ocean) |
| `matcha` | **Matcha Breeze** | Calming zen green tea | `#84CC16` (Lime Matcha) | `#0A0F08` (Moss) |
| `crimson` | **Tokyo Neon Crimson** | Bold red torii gate aesthetic | `#EF4444` (Crimson Red) | `#120606` (Burgundy Dark)|
| `gold` | **Royal Ivory & Gold** | Luxury investor presentation | `#D4AF37` (Royal Gold) | `#0D0B06` (Rich Bronze) |
| `chai` | **Masala Chai** | Cinnamon spice & ginger | `#D97706` (Cinnamon) | `#0F0C08` (Chai Brown) |
| `galaxy` | **Cosmic Borealis** | Starlight purple & cyan aurora | `#A855F7` (Cosmic Purple)| `#080612` (Cosmos) |
| `light` | **Campus Daylight** | Pure clean academic daylight | `#EA580C` (Warm Rust) | `#FFF8F3` (Pure Warm White)|

---

## 3. The "Anti-Vibecoding" Quality Standards

To ensure FoodLine feels like a **world-class production application** rather than a disposable AI toy, all developers and AI agents must strictly follow these rules:

### ❌ What We Forbid (The 10 Vibecoding Clichés):
1. **NO Generic Purple-on-Black Glow:** Do not default every page to generic `#8B5CF6` blurry background radial orbs.
2. **NO Empty Bento Grids:** Do not create bento boxes filled with fake charts or generic marketing buzzwords.
3. **NO "It's not X, it's Y" Copywriting:** Avoid clichés like *"It's not a canteen, it's a culinary supercomputer"*. Speak with clear, grounded facts.
4. **NO Fake Testimonials:** Never create placeholder reviews from "Sarah J., Product Designer at Google". All pilot quotes must be real students and canteen staff from Sanjivani University.
5. **NO Unstyled Blank Loading States:** Never leave users staring at blank white screens while data fetches.
6. **NO Unbounded Animations:** Do not put infinite spinning badges or constant bouncing arrows on static content.
7. **NO Missing Legal Pages:** Always provide real, accessible Terms of Service (`/terms`) and Privacy Policies.
8. **NO Broken Image Placeholders:** Every dish must have an authentic photo or an elegant, styled SVG food illustration fallback.
9. **NO Desktop-Only Views:** Every single screen must be 100% fluid on mobile screens with zero horizontal overflow.
10. **NO Unstyled Text Dropdowns:** Use custom accessible selection pills rather than raw browser select boxes.

### ✅ What We Enforce (Production Excellence):
1. **Buttery-Smooth Skeleton Shimmer Loaders:** Every dynamic route (`/menu`, `/orders`, `/canteens`, `/kds`) must display animated skeleton shapes while data loads.
2. **Mobile Ergonomics & Safe Areas:**
   - Adhere strictly to `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
   - Numeric inputs must specify `inputMode="numeric"` and `pattern="[0-9]*"` for mobile keypads.
   - 1-tap copy buttons must trigger subtle vibration haptics (`navigator.vibrate(20)`).
3. **Defensive Component States:** Every component must gracefully handle:
   - `Loading` (skeleton shimmer)
   - `Empty` (clean illustration + call-to-action)
   - `Error` (toast or friendly retry button)
   - `Success` (subtle haptic or celebration badge)
4. **Accessible Touch Targets:** Minimum 44px × 44px clickable touch areas for mobile fingers.
