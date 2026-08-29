# 🎯 FoodLine Engineering Task: Public Counter TV Display & Multilingual Voice Announcer (`/display`)

## 🏢 1. Campus Pilot Context & Objective
* **Target Campus:** Sanjivani University, Kopargaon (Cafe @7 Pilot).
* **Problem:** During 10-minute campus break slots (e.g. 11:50 AM – 12:00 PM), over 60 students crowd around the counter asking staff: *"Is my order FL-1842 ready yet?"* This creates bottlenecks and degrades the 30-second express pickup SLA.
* **Solution:** Build a dedicated, full-screen **Public Counter Display Screen** (`/display`) designed to run on a 43"–55" TV/monitor mounted above the Cafe @7 counter, paired with an automated **Web Speech Multilingual Voice Calling Engine** (Digital SoundBox).

---

## 🖥️ 2. Screen Architecture & Visual Layout (`/display`)

The page must run in **16:9 Full-Screen TV Mode** (1080p/4K) with ultra-high contrast dark aesthetics (`#07070B`), visible and readable from **25+ feet away** in bright cafeteria ambient lighting.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🍔 FOODLINE CAFE @7  │  🕒 11:54:20 AM  │  ⏳ 11:50 BREAK ENDS IN: 05m 40s  │ [🔊/⚙️] [⛶ Fullscreen]
├──────────────────────────────────────┬──────────────────────────────────────┤
│  🔥 NOW PREPARING (8 Orders)         │  🚀 READY FOR PICKUP (4 Orders)      │
│  (Amber Accent #FFB347 - 45% Width)  │  (Emerald Accent #00D4AA - 55% Width)│
├──────────────────────────────────────┼──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │  ┌────────────────────────────────┐  │
│  │ 🟡 FL-1845  ~2m remaining      │  │  │ 🟢 FL-1793  COUNTER 1          │  │
│  │ 2x Vada Pav, 1x Tea            │  │  │ 🔔 [JUST ANNOUNCED]            │  │
│  └────────────────────────────────┘  │  │ 🏷️ Have OTP Ready: ****         │  │
│  ┌────────────────────────────────┐  │  └────────────────────────────────┘  │
│  │ 🟡 FL-1849  ~4m remaining      │  │  ┌────────────────────────────────┐  │
│  │ 1x Masala Dosa                 │  │  │ 🟢 FL-1788  COUNTER 2          │  │
│  └────────────────────────────────┘  │  │ 1x Cold Coffee, 1x Brownie     │  │
│  ┌────────────────────────────────┐  │  └────────────────────────────────┘  │
│  │ 🟡 FL-1852  ~5m remaining      │  │                                      │
│  │ 1x Veg Burger, Fries           │  │                                      │
│  └────────────────────────────────┘  │                                      │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ 📢 TICKER: Average Grab Speed: 26s • 100% Veg FSSAI Certified • Have 4-digit OTP ready at pickup! │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 3. UX & Visual Design System Requirements

1. **Header Banner:**
   * Live digital clock (`HH:MM:SS AM/PM`) updating every second.
   * Active Campus Slot indicator with real-time countdown timer (e.g. *"11:50 AM Break: 05m 40s remaining"*).
   * TV Fullscreen button (`requestFullscreen()` toggle) and Screen Wake Lock API (keeps TV display awake 24/7 without dimming).
   * Audio/Voice Settings Quick Toggle.

2. **Left Column — "Now Preparing" (Amber Theme - 45% Width):**
   * High-contrast glassmorphism cards with amber borders (`border-amber-500/30`, `bg-amber-950/20`).
   * Displays Order Token (`FL-1845`), item summary, and a subtle pulsing progress indicator (`animate-pulse`).
   * Supports smooth layout transitions when orders reorder or leave the queue.

3. **Right Column — "Ready for Pickup" (Emerald Hero Theme - 55% Width):**
   * **Giant typography:** Token names in 48pt–72pt JetBrains Mono / Outfit font (`text-emerald-300 font-black`).
   * **Spotlight Flare Animation:** When an order transitions from `PREPARING` to `READY`, the card expands with a spring animation (`scale: [0.9, 1.05, 1.0]`), pulses with an emerald spotlight flare, and displays a `"JUST READY"` badge.
   * Counter assignment badge: *"Counter 1 (Express Hot)"* or *"Counter 2 (Beverages & Quick Bites)"*.
   * **Auto-Drop Timer:** When kitchen marks order `COLLECTED`, the token remains on the display with a faded checkmark for 45 seconds before smoothly exiting.

4. **Footer Ticker / Marquee Bar:**
   * Smooth infinite CSS/Framer Motion scrolling ticker with live campus metrics:
     * ⚡ Average Pickup Speed: `26 seconds`
     * 🥪 Dishes Served Today: `180+`
     * 🛡️ FSSAI Pure Veg Guarantee • Sanjivani Cafe @7

---

## 🔊 4. Audio & Web Speech Voice Engine (Digital SoundBox)

1. **Synthesized Chime Sound:**
   * Uses Web Audio API `AudioContext` to generate a two-tone clean airport/metro announcement chime (Sine wave frequency: `587.33Hz` [D5] ➔ `880Hz` [A5]) before speaking.

2. **Multilingual Text-to-Speech (TTS):**
   * Uses browser `window.speechSynthesis`.
   * **Announcement Phrase:**
     * *English:* `"Token FL-1793, please collect your order at Counter 1."`
     * *Hindi:* `"टोकन FL-1793, कृपया काउंटर 1 से अपना ऑर्डर प्राप्त करें।"`
     * *Marathi:* `"टोकन FL-1793, कृपया काउंटर 1 वरून तुमची ऑर्डर घ्या."`
   * **Voice Queue Controller:** Prevents audio collisions. If 3 orders finish at the same second, they are queued and announced sequentially with a 1.2-second pause.

3. **Audio Settings Modal / Drawer:**
   * Sound Master Switch (`ON` / `MUTE`).
   * Volume Slider (`0%` to `100%`).
   * Voice Language / Accent Selector (`en-IN`, `hi-IN`, `mr-IN`).
   * "Test Voice Chime" preview button.
   * Stores user preferences in `localStorage('foodline_tv_sound_settings')`.

---

## ⚡ 5. Realtime Data & Event Synchronization

1. **Supabase Realtime Stream:**
   * Listens to `postgres_changes` on `orders` table for updates (`status = 'PREPARING' | 'READY' | 'COLLECTED'`).
   * On event, triggers immediate UI re-render and dispatches the voice announcement.

2. **Simulation / Demo Mode Toggle:**
   * Includes a hidden/accessible `"Demo Mode"` toggle in the settings drawer that simulates an active lunch rush (adds a mock order every 15 seconds) for offline demos, presentations, and testing.

---

## 📋 6. Implementation Deliverables Expected from OpenCode

Please create a detailed implementation plan in `.opencode/plans/COUNTER_DISPLAY_PLAN.md` covering:
1. **File Hierarchy:**
   * `frontend/src/app/display/page.tsx` — Main Full-Screen TV route.
   * `frontend/src/components/display/PreparingColumn.tsx` — Left pane order cards.
   * `frontend/src/components/display/ReadyColumn.tsx` — Right pane glowing token cards.
   * `frontend/src/components/display/DisplayHeader.tsx` — Clock, slot timer, wake-lock.
   * `frontend/src/components/display/DisplayTicker.tsx` — Bottom marquee ticker.
   * `frontend/src/lib/voice-announcer.ts` — Web Audio Chime + Web Speech TTS Queue.
2. **State Management & Wake Lock implementation.**
3. **Open Questions / API Requirements for Antigravity (Backend Specialist).**
