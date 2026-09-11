# 🚀 FoodLine Campus — System Architecture & Tech Stack
> **NotebookLM Knowledge Module 01** | **Domain:** Architecture, Tech Stack, Concurrency & Mobile Bridge

## 1. Executive Overview
FoodLine Campus is a category-defining B2B2C campus dining infrastructure ecosystem engineered to eliminate 15-minute recess bottlenecks in Indian universities. It orchestrates student pre-ordering, kitchen workload batching, zero-fee direct UPI settlements, and express <30s OTP handovers.

## 2. Full-Stack Layer Architecture
```
[ Client Layer ]
├── Student Web App: Next.js 15.5 App Router + React 19 + Tailwind CSS v4
├── Mobile Native Bridge: Capacitor 8 Native Android Wrapper (4.1 MB standalone APK)
├── Kitchen Display System (KDS): Interactive touch Kanban (/kds) with Web Audio chimes
├── TV Voice Announcer: Multilingual Web Speech API (/display)
└── Canteen Manager Portal: Analytics, settlements, inventory toggles (/admin)

[ API & Concurrency Layer ]
├── Express.js HTTP/2 Engine (Node.js 22 LTS + TypeScript 5.7)
├── 60-Slot Atomic Throttling Governor (0% overbooking rate)
├── 12-Digit Bank UTR Anti-Replay Engine (sub-1ms cache check)
├── Server-Sent Events (SSE) Multiplexer (sub-50ms live broadcast)
└── Rate Limiters & 64KB Payload Size Guards

[ Hybrid Persistence Layer ]
├── Primary Relational Master: Supabase PostgreSQL 15 with Row Level Security (RLS)
├── Dual-Master Ledger Mirror: Google Sheets API v4 (30-second batch queue flush)
└── Client Session Cache: Synchronized localStorage + 30-day max-age cookies
```

## 3. Core Operational Innovations
1. **60-Order Slot Throttling Governor:** Divides the campus schedule into discrete 10-to-15-minute break windows. Strictly caps each window at 60 orders to match kitchen prep capacity, guaranteeing counter wait times under 30 seconds.
2. **12-Digit Bank UTR Replay Shield:** Direct UPI payment to canteen VPA verified against an in-memory 7-day rolling cache and a database unique constraint, completely preventing screenshot forgery.
3. **Student Account Auto-Detection & PRN Normalizer:** Real-time debounced resolver checks Google Sheets and Supabase. Normalizes leading-zero numeric IDs (e.g., `0110`), welcomes returning students by name, locks login mode to Sign-In, and auto-fills checkout.
4. **Kitchen Display System (KDS) & Realtime SSE Streamer:** Sub-50ms live dispatch across 3 Kanban columns (`PREPARING`, `READY FOR PICKUP`, `COLLECTED`) without polling.

## 4. Mobile Engineering (Android APK)
- **Toolchain:** OpenJDK 21 LTS, Android Gradle Plugin 8.9.1, Gradle 8.11.1, Capacitor 8.
- **Output:** `FoodLine_Campus.apk` (4.1 MB standalone release APK).
- **Target Matrix:** Supports Android 7.0 (API 24) through Android 16 (API 36).
- **Native Polish:** Cosmic Void status bar (`#07070B`), hardware back-button interceptor, offline splash screen, and smooth 60fps scrolling.
