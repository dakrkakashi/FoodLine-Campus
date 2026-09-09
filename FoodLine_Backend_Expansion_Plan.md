# 🏛️ FoodLine: Ultra-Scale Master Architecture & 175-Feature Enterprise Blueprint

> **Target Campus:** Sanjivani University, Kopargaon (Pilot Outlet: Cafe @7)  
> **Core Architecture:** Express.js + Next.js 15 App Router + Supabase PostgreSQL + Redis 7 + Native SSE Streamer + BullMQ  
> **Scale Targets:** 2,500+ concurrent students, 60-order/10-min slot throttling, ≤30s counter handover, 0% payment gateway loss  
> **Version:** 3.0.0-ULTRA-ENTERPRISE · **Author:** Antigravity (Backend Specialist) & Engineering Team  

---

## 📑 Master Table of Contents
1. [Executive Summary & Vision](#1-executive-summary--vision)
2. [Current Prototype vs. Ultra-Scale Production Target](#2-current-prototype-vs-ultra-scale-production-target)
3. [Master System Architecture & Topology Diagrams](#3-master-system-architecture--topology-diagrams)
4. [The Complete 175 Production Features Matrix](#4-the-complete-175-production-features-matrix)
   - [Domain 1: Core Pre-Ordering, Cart & Smart Menu Engine (Features 1–15)](#domain-1-core-pre-ordering-cart--smart-menu-engine-features-115)
   - [Domain 2: Algorithmic Slot Throttling & Kitchen Workstation Load Balancing (Features 16–30)](#domain-2-algorithmic-slot-throttling--kitchen-workstation-load-balancing-features-1630)
   - [Domain 3: DirectPay 0% Fee UPI & Multi-Tier Payment Verification (Features 31–45)](#domain-3-directpay-0-fee-upi--multi-tier-payment-verification-features-3145)
   - [Domain 4: Real-Time SSE Event Bus & Clustered Redis Pub/Sub Hub (Features 46–58)](#domain-4-real-time-sse-event-bus--clustered-redis-pubsub-hub-features-4658)
   - [Domain 5: Kitchen Display System (KDS) & Cook Station Intelligence (Features 59–72)](#domain-5-kitchen-display-system-kds--cook-station-intelligence-features-5972)
   - [Domain 6: 30-Second Express Handover & Counter Hardware (Features 73–84)](#domain-6-30-second-express-handover--counter-hardware-features-7384)
   - [Domain 7: Campus Squad, Group Pooling & Social Dining ("Dabba Pool") (Features 85–96)](#domain-7-campus-squad-group-pooling--social-dining-features-8596)
   - [Domain 8: Student UI/UX, Dynamic Island & Micro-Interactions (Features 97–110)](#domain-8-student-uiux-dynamic-island--micro-interactions-features-97110)
   - [Domain 9: Smart Inventory, Morning Prep & Food Waste Clearance (Features 111–122)](#domain-9-smart-inventory-morning-prep--food-waste-clearance-features-111122)
   - [Domain 10: Financial Settlement, Vendor Margins & FSSAI/DPDP Compliance (Features 123–132)](#domain-10-financial-settlement-vendor-margins--fssaidpdp-compliance-features-123132)
   - [Domain 11: Enterprise Security, Rate Limiting & Fraud Detection (Features 133–142)](#domain-11-enterprise-security-rate-limiting--fraud-detection-features-133142)
   - [Domain 12: Offline-First Edge Resiliency & IoT Soundbox Integration (Features 143–150)](#domain-12-offline-first-edge-resiliency--iot-soundbox-integration-features-143150)
   - [Domain 13: AI Demand Forecasting & Smart Kitchen Prep Prediction (Features 151–160)](#domain-13-ai-demand-forecasting--smart-kitchen-prep-prediction-features-151160)
   - [Domain 14: Multi-Campus & Multi-Tenant Franchise Expansion (Features 161–170)](#domain-14-multi-campus--multi-tenant-franchise-expansion-features-161170)
   - [Domain 15: Student Nutrition, Calorie & Health Profiles (Features 171–175)](#domain-15-student-nutrition-calorie--health-profiles-features-171175)
5. [Complete PostgreSQL Database DDL, RLS & Trigger Architecture](#5-complete-postgresql-database-ddl-rls--trigger-architecture)
6. [Production-Ready Service Implementations](#6-production-ready-service-implementations)
   - [6.1 Atomic Slot Throttler Service (`slot-throttler.ts`)](#61-atomic-slot-throttler-service)
   - [6.2 Payment & UTR Fraud Guard Service (`payment-service.ts`)](#62-payment--utr-fraud-guard-service)
   - [6.3 Clustered Redis Pub/Sub SSE Hub (`sse-broadcaster.ts`)](#63-clustered-redis-pubsub-sse-hub)
7. [Full REST & SSE API Matrix](#7-full-rest--sse-api-matrix)
8. [Edge Gateway & NGINX Configuration](#8-edge-gateway--nginx-configuration)
9. [Docker Compose & Cluster Deployment Architecture](#9-docker-compose--cluster-deployment-architecture)
10. [8-Week Phased Production Roadmap](#10-8-week-phased-production-roadmap)
11. [2,500-Concurrency Load Testing Protocol](#11-2500-concurrency-load-testing-protocol)

---

## 1. Executive Summary & Vision

FoodLine is the next-generation campus dining and express pickup ecosystem purpose-built for Indian universities. During congested 20–30 minute lecture breaks, thousands of students storm limited campus cafeterias, creating 15-minute billing lines, kitchen chaos, and payment friction.

FoodLine transforms this broken model with:
- **Algorithmic 10-minute break slots** capped strictly at 60 orders per window.
- **DirectPay 0% fee UPI payment** directly to vendor bank VPAs.
- **Sub-50ms real-time status broadcasting** via Redis-backed SSE.
- **30-second express handover** with optical QR passes and 4-digit PINs.

---

## 2. Current Prototype vs. Ultra-Scale Production Target

| Layer | In-Memory Prototype | 3.0 Ultra-Scale Target (This Plan) |
|---|---|---|
| **Persistence** | `Map<string, Order>` in memory | Supabase PostgreSQL 15 with connection pooling (PgBouncer), RLS policies, foreign keys, and indexes |
| **Slot Throttling** | In-memory integer checks | Atomic SQL queries with row locking (`FOR UPDATE`) + BullMQ 10-min TTL hold release queue |
| **Authentication** | Plain request body names | Native Supabase Auth (Phone OTP + Email Magic Link) + RBAC (`student`, `faculty`, `kitchen`, `cashier`, `admin`) |
| **Payments** | Basic regex & Set lookup | 3-tier state machine + Soundbox webhook listener + Composite daily anti-replay index |
| **Real-Time** | Single-server Node SSE Map | Multi-worker Redis 7 Pub/Sub channel multiplexer broadcasting across PM2/Docker instances |
| **Kitchen Sync** | Basic PATCH status route | Multi-station KDS dashboard with burner capacity grouping, audio chimes & dish stockout toggles |
| **Compliance** | Hardcoded text strings | Automated DPDP phone masking (`+91 ******1234`), FSSAI license stamps, automated T+0 daily settlements |
| **Resilience** | Single point of failure | Local LAN edge proxy with SQLite sync during campus internet blackouts |

---

## 3. Master System Architecture & Topology Diagrams

```mermaid
graph TD
    subgraph ClientDevices [📱 Client & Hardware Edge Layer]
        C1[Student PWA / Native App]
        C2[KDS Tablet: Cook Station Display]
        C3[Cashier Terminal: 2D Optical Scanner]
        C4[Public TV Announcer Display]
        C5[Paytm / PhonePe IoT Soundbox]
    end

    subgraph EdgeProxy [🛡️ Cloudflare & NGINX Edge Layer]
        N1[NGINX Reverse Proxy: HTTP/2 & SSE Buffering OFF]
        N2[Express-Rate-Limit + Helmet WAF]
        N3[Supabase JWT Bearer Auth Guard]
    end

    subgraph ServiceMesh [⚡ Clustered Express Modular Services]
        S1[Order & Cart Lifecycle Service]
        S2[Atomic Slot Throttling Engine]
        S3[Payment & UTR Reconciliation Service]
        S4[KDS Cook Station Dispatch Service]
        S5[Dynamic Inventory & Waste Service]
        S6[Daily Settlement & Compliance Service]
        S7[Clustered Redis SSE Broadcaster]
        S8[AI Demand Forecasting Worker]
    end

    subgraph DataInfrastructure [🗄️ Database, Message Bus & Queues]
        PG[(Supabase PostgreSQL 15 + PgBouncer)]
        RD[(Redis 7 Cache & Pub/Sub Channels)]
        BMQ[(BullMQ Async Job Queues)]
    end

    C1 & C2 & C3 & C4 -->|HTTPS / WSS| N1
    C5 -->|Webhook HTTP POST| N1
    N1 --> N2 --> N3
    N3 --> S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8
    S1 & S2 & S3 & S4 & S5 & S6 <--> PG
    S7 <--> RD
    S2 & S3 & S5 & S8 <--> BMQ
    S7 -->|Sub-50ms Real-Time SSE Stream| C1 & C2 & C4
```

---

## 4. The Complete 175 Production Features Matrix

### Domain 1: Core Pre-Ordering, Cart & Smart Menu Engine (Features 1–15)
1. **Dynamic Category Navigation:** Categorized pills (`Quick Bites`, `South Indian`, `Sandwiches`, `Chinese`, `Beverages`) with smooth layout animations.
2. **Sub-10ms Fuzzy Search:** Client-side Fuse.js fuzzy search filtering across 44 dishes with typo tolerance.
3. **Dietary Preference Filters:** 1-Tap filters for 🟢 100% Veg, 🌿 Jain (No Onion/Garlic), and 🕉️ Fasting (Upvas) dishes.
4. **Portion & Add-On Customization:** Interactive modal for dish customizations (Extra Cheese +₹15, Butter Toss +₹10, Double Tikki +₹20).
5. **Real-Time Out-of-Stock Badging:** Live greying out of dishes with instant disablement upon kitchen stockout.
6. **Smart Bundle Recommendations:** "Frequently Bought Together" prompts at cart entry (e.g., Vada Pav + Cutting Chai).
7. **Dynamic Cooking Time Estimator:** Real-time calculation of cumulative order prep time based on current kitchen ticket depth.
8. **Persistent Cart Tray:** Synchronized LocalStorage + Supabase sync preventing cart drops during mobile network switches.
9. **Minimum/Maximum Order Guardrails:** Validation enforcing minimum ₹20 ticket and capping single orders at 20 items.
10. **Special Cooking Notes:** 150-character custom note input (e.g. "extra spicy chutney", "separate sambar").
11. **"My Usual" 1-Tap Fast Reorder:** Floating home screen widget allowing 2-tap reordering of frequent student favorites.
12. **WebP CDN Asset Delivery:** Optimized dish photo delivery with blur-hash placeholders for 2G/3G campus dead spots.
13. **Combo Dish Builder:** Custom lunch combo engine (e.g., 1 Dosa + 1 Beverage for special student bundle price).
14. **Live Price Adjustment Sync:** Instant reflection of cafeteria price updates without requiring app restart.
15. **Multi-Item Quantity Stepper:** Spring-animated plus/minus incrementor with vibration haptic feedback.

---

### Domain 2: Algorithmic Slot Throttling & Kitchen Workstation Load Balancing (Features 16–30)
16. **10-Minute Break Slot Partitioning:** Dynamic time windows aligned with class bells (11:50–12:00, 12:00–12:10, 12:10–12:20, 12:20–12:30).
17. **Atomic PostgreSQL Slot Reservation:** Concurrency-safe SQL queries (`UPDATE pickup_slots SET current_booked = current_booked + $qty WHERE current_booked + $qty <= max_capacity`).
18. **10-Minute TTL Slot Hold:** Automatic reservation lock while student pays; auto-released by BullMQ if payment expires.
19. **Capacity Visual Progress Meter:** Color-coded meter (Green/Yellow/Red) showing real-time slot occupancy (e.g., "42/60 booked").
20. **Dynamic Slot Auto-Greying:** Automated disabling of slots reaching 60 orders, nudging traffic to subsequent windows.
21. **Workstation-Specific Quotas:** Independent limits per kitchen station (Max 15 Dosas, Max 25 Deep Fryer items, Max 12 Grilled Sandwiches per slot).
22. **Smart Slot Recommendation Engine:** Algorithmic recommendation of optimal pickup slot based on lecture hall proximity and class end time.
23. **Faculty Express Slot Quota:** Dedicated 5-order reserve per slot exclusively accessible to `@sanjivani.edu.in` verified staff.
24. **Admin Slot Capacity Override:** Kitchen manager toggle to dynamically increase slot capacity (+10 slots) during high-staff shifts.
25. **Automated Slot Rollover Worker:** Background cron archiving morning break slots and initializing afternoon tea slots.
26. **Emergency Slot Freezing:** 1-Tap panic button for kitchen supervisor to freeze incoming orders during kitchen equipment breakdown.
27. **Prep Staggering Engine:** Internal dispatch offset staggering complex items (e.g., Club Sandwich) 4 minutes before fast grabs (e.g., Dabeli).
28. **Buffer Time Insertion:** Automatic 2-minute safety buffer between consecutive slots during peak lunch volume.
29. **Slot Utilization Heatmap:** Historical visualization of booking density to help canteen staff plan raw material prep.
30. **Cross-Slot Overflow Guard:** Validation preventing an order containing items for multiple distinct time slots.

---

### Domain 3: DirectPay 0% Fee UPI & Multi-Tier Payment Verification (Features 31–45)
31. **Merchant Standee QR Display:** In-app rendering of Cafe @7's official merchant UPI QR code (`sanjivanicafe7@okaxis`) with exact order rupee sum.
32. **Deep-Link UPI Intent Trigger:** Direct buttons launching Google Pay, PhonePe, Paytm, or BHIM with prefilled payment parameters.
33. **1-Tap VPA & Amount Copy:** Clipboard copy button for UPI VPA and exact payable amount with visual copy toast.
34. **12-Digit Bank UTR Input Mask:** Auto-formatting numeric mask ensuring strict 12-digit UPI reference number entry.
35. **Composite Anti-Replay Guard:** Unique composite index `UNIQUE (utr_number, (created_at::date))` preventing reuse of old transaction references.
36. **3-Tier Payment State Machine:** Order progression through `PENDING_PAYMENT` -> `AWAITING_VERIFICATION` -> `CONFIRMED` -> `COLLECTED`.
37. **UPI Soundbox Webhook Listener:** Real-time bridge receiving Paytm/PhonePe soundbox notifications to auto-confirm payments in < 2s.
38. **Cashier Fast-Match Verification:** Counter tablet view highlighting recent UTR submissions for 1-tap manual confirmation.
39. **Duplicate Order Idempotency Key:** Client-generated UUID preventing duplicate order creation on rapid double-tap.
40. **Payment Recovery Flow:** Seamless retry modal allowing students to resubmit corrected UTRs without losing held cart items.
41. **Partial Payment Detection:** Automatic flagging if UTR amount is less than total order value.
42. **Automated Refund Token Generator:** Admin refund workflow generating a cryptographically signed UPI refund token for cancelled orders.
43. **Digital Cashier Reconciliation Sheet:** Daily UTR audit ledger comparing bank statement deposits against FoodLine order tokens.
44. **Cash-on-Counter Fallback Mode:** Admin toggle enabling manual cash verification for students without active UPI balances.
45. **Suspicious UTR Rate-Limiter:** Automatic account suspension upon 3 consecutive invalid UTR submissions within 10 minutes.

---

### Domain 4: Real-Time SSE Event Bus & Clustered Redis Pub/Sub Hub (Features 46–58)
46. **Multi-Worker Redis 7 Pub/Sub Broadcaster:** Clustered message broker distributing order events across all active Express server instances.
47. **Native HTTP/2 SSE Stream:** Persistent, unidirectional event stream to student browsers without WebSocket connection overhead.
48. **Initial State Snapshot on Connect:** Immediate `ORDER_SNAPSHOT` payload sent as soon as the student opens the live tracking screen.
49. **Live Status State Propagation:** Instant streaming of `ORDER_UPDATE`, `PREPARING`, `READY`, and `COLLECTED` events.
50. **Auto-Reconnect with Exponential Backoff:** Client-side SSE reconnect logic with jitter to avoid thundering herd reconnection storms.
51. **Connection Heartbeat / Keepalive:** 15-second ping packet preventing mobile carrier proxies and NAT gateways from dropping connections.
52. **Kitchen Broadcast Channel:** Dedicated Redis channel `kds:updates:cafeteriaId` broadcasting new confirmed orders to kitchen screens.
53. **Public Counter TV Stream:** Real-time SSE stream powering the public dining hall pickup announcer display.
54. **Multi-Tenant Channel Namespacing:** Isolated channel namespaces (`campus:cafeteria:orderToken`) guaranteeing multi-outlet data privacy.
55. **SSE Stream Compaction:** Payload minimization stripping unnecessary fields to ensure < 1KB network frames over 4G networks.
56. **Client Disconnect Garbage Collector:** Automatic release of Redis subscriptions and memory references upon client socket close.
57. **Broadcast Latency Monitor:** Built-in instrumentation tracking time-to-broadcast from KDS status tap to student screen render.
58. **SSE Event Fallback to Short Polling:** Automatic fallback to 5-second polling if client browser environment blocks persistent event streams.

---

### Domain 5: Kitchen Display System (KDS) & Cook Station Intelligence (Features 59–72)
59. **Break Slot Columnar Aggregator:** Orders grouped by 10-minute pickup slot columns for clear kitchen batching.
60. **Dish Batch Prep Counter:** Summarized item counts at the top of each slot column (e.g. *"Cook: 14x Masala Dosa, 9x Samosa Pav"*).
61. **1-Tap Order Status Advancement:** Big touch-friendly button to move orders from `QUEUED` -> `PREPARING` -> `READY`.
62. **Cook Station Routing:** Separate sub-views for Tawa Station, Chaat Counter, Sandwich Griller, and Beverage Bar.
63. **Late Order Visual Alerts:** Flashing amber/red border when an order is within 3 minutes of slot start time and not marked ready.
64. **1-Tap Dish Stockout Toggle:** Kitchen staff button to instantly mark any dish unavailable across the entire campus.
65. **Audible Kitchen Chimes:** Distinct audio alerts when new batch orders arrive or when high-priority faculty orders drop.
66. **Order Item Strikethrough:** Touch-to-strike individual dishes on multi-item tickets as the cook plates each item.
67. **KDS Dark Mode / High Contrast:** High-visibility UI optimized for bright, steamy kitchen tablet environments.
68. **Historical Completed Orders Drawer:** Quick recall drawer allowing kitchen staff to view and undo mistakenly completed tickets.
69. **Burner Capacity Load Balancer:** Algorithmic distribution of cooking tickets across multiple physical burners or fryers.
70. **Cook Station Performance Metrics:** Live metrics displaying average prep time per dish and ticket completion speed.
71. **Ticket Priority Reordering:** Ability for head chef to drag and prioritize urgent dietary or faculty tickets.
72. **KDS Fullscreen Lock (Kiosk Mode):** PWA kiosk mode preventing kitchen staff from accidentally navigating away or exiting the app.

---

### Domain 6: 30-Second Express Handover & Counter Hardware (Features 73–84)
73. **High-Contrast Optical QR Pass:** Full-screen high-contrast SVG QR code encoding the unique `order_token` and verification hash.
74. **Auto-Screen Brightness Trigger:** Screen brightness boost to 100% when student opens the pickup pass.
75. **Large 4-Digit Pickup PIN Display:** Bold 48px PIN (`6065`) for rapid human-readable verification from 2 meters away.
76. **Counter Camera & USB Barcode Gun Support:** Sub-300ms scanning using standard 2D optical barcode guns connected to the counter laptop.
77. **Pickup Success Sound & Haptic FX:** Celebratory chime and haptic buzz confirming order handover on both cashier and student screens.
78. **Counter Zone Directing Badge:** Explicit counter allocation tag on pass (e.g. `COUNTER 1: HOT MEALS`, `COUNTER 2: BEVERAGES`).
79. **Proxy Pickup Authorization:** Ability to generate a 1-time secure share link allowing a classmate to pick up the meal.
80. **Expired / Double Pickup Prevention:** Immediate invalidation of QR pass upon first successful handover scan.
81. **Offline QR Verification Token:** Cryptographically signed JWT QR pass allowing cashier verification even if counter internet drops.
82. **Digital Receipt Generator:** Instant downloadable PDF receipt with FSSAI license, UTR stamp, and itemized tax breakdown.
83. **Counter Handover Velocity Tracker:** Real-time measurement of seconds elapsed from student QR presentation to cashier confirmation.
84. **Audio Ticket Number Announcer:** Automated synthesized speech chime announcing completed tokens on counter speakers.

---

### Domain 7: Campus Squad, Group Pooling & Social Dining ("Dabba Pool") (Features 85–96)
85. **Squad Order Room Creation:** Student creates a "Dabba Pool" room and shares a 6-character room code or WhatsApp link with friends.
86. **Real-Time Group Cart Sync:** Up to 6 classmates add their items to a shared live cart tray.
87. **Single Unified Slot Reservation:** The entire group order claims a single consolidated pickup slot for synchronized dining.
88. **Split Bill Calculation Display:** In-app summary calculating exact individual rupee shares for easy group settlement.
89. **Master Pickup Token Generation:** Single master QR pass allowing 1 designated friend to pick up all meals in one tray.
90. **Hostel Wing Pooling:** Scheduled bulk evening dinner orders grouped by hostel block for unified pickup.
91. **Bill Breakdown Receipts:** Individual digital itemized slips generated for each member in the squad order.
92. **Squad Leader Payment Delegator:** Option for squad leader to pay total bill upfront via single UPI transaction.
93. **Individual UPI Payment Slices:** Micro-payment gateway allowing each squad member to pay their slice independently before batch lock.
94. **Squad Chat & Item Notes:** Ephemeral room chat allowing group members to coordinate dietary preferences.
95. **Hostel Room Delivery Routing:** Optional delivery tag attaching hostel wing and room number to pooled bulk orders.
96. **Squad Order Lock Timer:** 3-minute countdown forcing all members to finalize items before claiming the shared break slot.

---

### Domain 8: Student UI/UX, Dynamic Island & Micro-Interactions (Features 97–110)
97. **Floating Dynamic Island / Live Activity Pill:** Floating tracking pill updating live (`In Kitchen` -> `On Tawa` -> `Ready at Counter 2`).
98. **Glassmorphic Cyber-Canteen Aesthetic:** Deep slate dark mode with emerald neon accents, frosted glass cards, and crisp typography.
99. **Spring-Physics Micro-Interactions:** Smooth Framer Motion / Motion-One animations on buttons, cart additions, and modal triggers.
100. **Campus Rush Crowding Meter:** Real-time widget showing canteen congestion levels (🟢 Calm, 🟡 Filling Fast, 🔴 Peak Rush).
101. **Haptic Feedback Integration:** Native device vibrations on item additions, slot selection, and order ready events.
102. **Web Audio Soundscape:** Crisp mechanical click on item increment, pleasant chime on order placement, and fanfare on pickup.
103. **Celebratory Confetti Engine:** Canvas confetti burst upon successful payment verification.
104. **Pull-to-Refresh & Live Polling Fallback:** Seamless swipe-to-refresh if device briefly enters airplane mode or background state.
105. **PWA Standalone Installation:** Installable Progressive Web App with offline home icon and zero browser URL bar clutter.
106. **Multi-Language UI Support:** 1-Tap toggle between English, Marathi (मराठी), and Hindi (हिंदी).
107. **Smart Keyboard Auto-Dismiss:** Mobile-optimized keyboard management preventing viewport jumping on Android/iOS devices.
108. **OLED Battery-Saving Theme:** True-black background mode maximizing phone battery life during long college lecture days.
109. **Gesture-Driven Cart Swipe:** Swipe-to-delete item interactions in cart tray with spring restoration physics.
110. **Campus Map Pickup Locator:** Interactive mini-map showing exact walking route from academic blocks to Cafe @7 counter.

---

### Domain 9: Smart Inventory, Morning Prep & Food Waste Clearance (Features 111–122)
111. **Daily Morning Prep Sheet:** Kitchen manager module to log morning cooked quantities (e.g., 100 Samosas, 50 Dabelis, 20L Chai).
112. **Automatic Real-Time Stock Deduction:** Ingredient and item quantities automatically decremented upon payment confirmation.
113. **Low-Stock Warning Badges:** Amber warning indicator when item stock drops below 5 units.
114. **4:30 PM Flash Waste Clearance:** Automated dynamic discount engine (30% off remaining perishable snacks for evening hostel students).
115. **Inventory Usage Analytics:** Daily report detailing planned prep vs actual sold items to optimize next-day ingredient purchases.
116. **Ingredient Batch Cost Tracking:** Cost-of-goods-sold (COGS) tracking calculating gross profit margins per dish.
117. **Supplier Purchase Logging:** Admin portal to log raw dairy, bread, and vegetable purchases with receipt uploads.
118. **End-of-Day Unsold Item Logging:** Waste tracking module recording unsold quantities to calculate kitchen efficiency score.
119. **Perishable Expiry Date Alerts:** Automated notifications alerting kitchen staff when dairy or bread batches reach shelf-life limits.
120. **Menu Item Margin Optimizer:** Algorithmic suggestions recommending price adjustments based on fluctuating ingredient costs.
121. **Automated Purchase Order Generator:** One-tap generation of daily supplier order lists based on projected break demand.
122. **Central Storage vs Outlet Inventory Sync:** Multi-depot inventory tracking syncing stock between campus central store and Cafe @7.

---

### Domain 10: Financial Settlement, Vendor Margins & FSSAI/DPDP Compliance (Features 123–132)
123. **Automated T+0 Daily Settlement Engine:** End-of-day batch calculation generating Cafe @7 net payout and platform fee breakdown.
124. **88/12 Revenue Split Calculator:** Automated computation: `Merchant Payout = GMV * 0.88`, `Platform Fee = GMV * 0.12`.
125. **Zero Student Platform Fee Guarantee:** Invariant validation ensuring student pays exactly menu price (₹0 convenience fee).
126. **FSSAI License Display Stamp:** Mandatory inclusion of Cafe @7 FSSAI license number (`11522036000142`) on all digital receipts.
127. **DPDP Act 2023 Student Phone Masking:** Automatic masking of student phone numbers (`+91 ******3819`) on all public and kitchen screens.
128. **GST / Tax Exemption Handling:** Campus educational catering tax compliance rule engine.
129. **Monthly Merchant Payout Ledger:** Exportable PDF and CSV financial ledger for canteen vendor accounting.
130. **Audit Trail Logging:** Immutable logging of all status transitions, price changes, and refunds with actor IDs in `audit_logs`.
131. **Section 194O TDS Ledger:** Automated tracking of 1% TDS deduction compliance for digital e-commerce facilitator reporting.
132. **Student Data Erasure Request (DPDP):** 1-Tap profile data anonymization portal honoring student right-to-be-forgotten requests.

---

### Domain 11: Enterprise Security, Rate Limiting & Fraud Detection (Features 133–142)
133. **Zod Strict Request Schema Validation:** Runtime validation on every incoming API request payload.
134. **Tiered Redis Rate Limiting:** Endpoint-specific limits (5 login attempts/15m, 10 orders/min, 5 UTR submissions/min, 100 KDS reqs/s).
135. **Supabase Auth JWT Bearer Guard:** Cryptographic verification of user sessions on all protected routes with role checks.
136. **Security Headers (Helmet & Strict CORS):** Production CORS whitelisting (`foodline.in`, `localhost:3000`) and OWASP security headers.
137. **Suspicious UTR Pattern Detector:** Automatic flagging and rate-locking of accounts submitting invalid or rapid sequential UTRs.
138. **SQL Injection & XSS Guard:** Sanitization pipeline eliminating malformed input vectors across all student and admin fields.
139. **Tamper-Proof OTP Hasher:** Bcrypt / Argon2 hashing of counter pickup PINs preventing unauthorized order redemptions.
140. **CSRF Double-Submit Cookie Guard:** Cross-site request forgery tokens protecting state-modifying admin and KDS routes.
141. **IP Geofence Campus Validator:** Optional security policy restricting faculty slot booking to on-campus IP subnets or GPS bounds.
142. **DDoS Burst Shield:** Automated Redis token bucket throttling filtering bot traffic during peak lunch hour transitions.

---

### Domain 12: Offline-First Edge Resiliency & IoT Soundbox Integration (Features 143–150)
143. **Local LAN Wi-Fi Proxy Resiliency:** KDS local SQLite cache continuing kitchen operations even during campus internet blackouts.
144. **IoT Hardware Soundbox Webhook Listener:** Bluetooth/Webhook integration receiving instantaneous audio box payment receipts.
145. **Public Counter TV Announcer Screen:** Fullscreen big-screen dashboard (`/display`) with Text-to-Speech audio calls (`"Order FL-1793 is Ready at Counter 1"`).
146. **Local Peer-to-Peer Tablet Sync:** Multi-tablet kitchen communication over local Wi-Fi router via mDNS without external internet.
147. **Automated Cloud Re-Sync Worker:** Background queue reconciling local offline SQLite transactions back to Supabase upon link restoration.
148. **Thermal Kitchen Ticket Printer Bridge:** Optional ESC/POS Bluetooth/USB printer integration printing paper kitchen tickets automatically.
149. **Battery-Backup Edge Node:** Micro-edge server (Raspberry Pi / mini-PC) maintaining local token queue during campus power switchovers.
150. **Hardware Health Watchdog:** Heartbeat monitor pinging counter tablets and soundboxes, alerting manager if a device goes offline.

---

### Domain 13: AI Demand Forecasting & Smart Kitchen Prep Prediction (Features 151–160)
151. **Break Rush Predictive Modeling:** AI time-series forecasting calculating expected dish volume based on university timetable and day of week.
152. **Weather-Driven Snack Recommender:** Dynamic promotion of hot Chai and Pakoras during rainy monsoon days in Kopargaon.
153. **Exam Schedule Volume Adjuster:** Automatic downward adjustment of morning slot capacities during university exam periods.
154. **Batter & Dough Morning Prep Predictor:** Algorithmic calculation estimating exact kilograms of Dosa batter and sandwich bread loaves required.
155. **Kitchen Burnout Warning System:** AI monitor detecting ticket backlog buildup and recommending temporary 5-minute slot throttling.
156. **Dish Churn & Popularity Heatmap:** Machine learning clustering identifying declining menu items for seasonal replacement.
157. **Dynamic Prep Offset Adjuster:** Self-learning model refining estimated prep times per dish based on historical cook completion times.
158. **Cross-Outlet Demand Balancer:** Predictive routing nudging students to secondary campus kiosks when Cafe @7 reaches saturation.
159. **Personalized Smart Dietary Recommendations:** Contextual recommendations prioritizing high-protein or quick-grab items based on past history.
160. **Automated Raw Material Reorder Triggers:** AI trigger dispatching WhatsApp supply requests to dairy and bakery vendors when stock hits critical thresholds.

---

### Domain 14: Multi-Campus & Multi-Tenant Franchise Expansion (Features 161–170)
161. **Multi-Campus Tenant Partitioning:** Unified platform architecture supporting multiple universities (Sanjivani, MIT, COEP) on isolated tenant schemas.
162. **Multi-Outlet Canteen Management:** Single campus portal managing Cafe @7, Engineering Canteen, and Hostel Night Mess independently.
163. **Franchise Royalty & Commission Ledger:** Multi-tiered revenue share engine supporting customized commission agreements per campus.
164. **Universal Student Campus ID Card (RFID/NFC):** Optional tap-to-pay integration supporting student RFID smart identity cards.
165. **Centralized Brand Menu Publisher:** Multi-outlet menu management enabling headquarters to push standardized recipes and pricing.
166. **Cross-Campus Analytics Benchmark:** Executive dashboard comparing order throughput, average prep latency, and revenue across universities.
167. **Tenant-Isolated Supabase RLS Policies:** PostgreSQL security rules guaranteeing zero data leakage between competing canteen vendors.
168. **Custom Subdomain Routing:** Dynamic tenant routing (`sanjivani.foodline.in`, `mit.foodline.in`) with customized campus branding.
169. **University Admin Oversight Dashboard:** Vice-Chancellor and Registrar reporting view tracking campus hygiene scores and queue reduction KPIs.
170. **Bulk Student Onboarding via SIS Integration:** Automated CSV/LDAP sync importing new student rosters and PRNs at the start of each academic year.

---

### Domain 15: Student Nutrition, Calorie & Health Profiles (Features 171–175)
171. **Macro & Calorie Breakdown:** Nutritional summary displaying protein, carbs, fats, and calories for all 44 Cafe @7 dishes.
172. **Allergen Warning Badges:** Explicit warning tags for dairy, gluten, nuts, and soy on dish cards.
173. **Daily Calorie Tracker Widget:** Student profile health tracker logging cumulative calories consumed across campus dining sessions.
174. **Fitness & Gym-Friendly Tagging:** Curated "High Protein / Post-Workout" menu filter for student athletes (e.g. Paneer Bhurji, Sattu Drink).
175. **Clean Eating Milestone Badges:** Gamified badges rewarded to students choosing balanced, fruit, or sprout-based breakfast options.

---

## 5. Complete PostgreSQL Database DDL, RLS & Trigger Architecture

```sql
-- ==============================================================================
-- 🚀 FOODLINE 175-FEATURE ENTERPRISE SCHEMA (SUPABASE POSTGRESQL 15)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CAMPUSES & TENANTS
CREATE TABLE IF NOT EXISTS campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cafeterias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    upi_id VARCHAR(255) NOT NULL DEFAULT 'sanjivanicafe7@okaxis',
    fssai_license VARCHAR(50) DEFAULT '11522036000142',
    merchant_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campus_id, slug)
);

-- 2. USER PROFILES (Supabase Auth Integrated)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    prn VARCHAR(100),
    department VARCHAR(100),
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'kitchen', 'cashier', 'admin', 'superadmin')),
    dietary_preference VARCHAR(50) DEFAULT 'ALL' CHECK (dietary_preference IN ('ALL', 'VEG', 'JAIN', 'UPVAS')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU CATEGORIES & ITEMS
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    prep_time_mins INT DEFAULT 5 CHECK (prep_time_mins > 0),
    is_available BOOLEAN DEFAULT TRUE,
    is_veg BOOLEAN DEFAULT TRUE,
    is_jain_available BOOLEAN DEFAULT FALSE,
    is_upvas_special BOOLEAN DEFAULT FALSE,
    workstation VARCHAR(50) DEFAULT 'MAIN_KITCHEN' CHECK (workstation IN ('MAIN_KITCHEN', 'TAWA', 'FRYER', 'GRILL', 'BEVERAGE', 'CHAAT')),
    inventory_type VARCHAR(20) DEFAULT 'daily_fresh',
    stock_quantity INT DEFAULT NULL,
    low_stock_threshold INT DEFAULT 5,
    calories INT DEFAULT NULL,
    protein_grams NUMERIC(5, 1) DEFAULT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BREAK PICKUP SLOTS (Capacity Throttling)
CREATE TABLE IF NOT EXISTS pickup_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT DEFAULT 60 CHECK (max_capacity > 0),
    current_booked INT DEFAULT 0 CHECK (current_booked >= 0),
    faculty_reserved INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_slot_max_capacity CHECK (current_booked <= max_capacity)
);

-- 5. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_token VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES pickup_slots(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount > 0),
    status VARCHAR(50) DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT', 'AWAITING_VERIFICATION', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED')),
    pickup_otp VARCHAR(6) NOT NULL,
    notes TEXT,
    is_squad_order BOOLEAN DEFAULT FALSE,
    squad_room_id VARCHAR(50) DEFAULT NULL,
    counter_id VARCHAR(50) DEFAULT 'COUNTER_1',
    idempotency_key UUID UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    customization JSONB DEFAULT '{}'::jsonb,
    is_completed_by_cook BOOLEAN DEFAULT FALSE
);

-- 6. PAYMENTS & ANTI-REPLAY RECONCILIATION
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    utr_number VARCHAR(12) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('PENDING_VERIFICATION', 'VERIFIED', 'FAILED', 'REFUNDED')),
    verification_method VARCHAR(50) DEFAULT 'UTR_MANUAL' CHECK (verification_method IN ('UTR_MANUAL', 'SOUNDBOX_WEBHOOK', 'CASHIER_SCAN', 'UPI_INTENT')),
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_utr_daily_replay ON payments(utr_number, (created_at::date));

-- 7. 10-MINUTE SLOT CAPACITY HOLDS
CREATE TABLE IF NOT EXISTS slot_holds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES pickup_slots(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
    is_released BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUDIT LOGS & FINANCIAL SETTLEMENTS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
    settlement_date DATE NOT NULL,
    total_orders INT NOT NULL DEFAULT 0,
    gross_volume NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    merchant_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    platform_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tds_deducted NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payout_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payout_status IN ('PENDING', 'PROCESSED', 'FAILED')),
    payout_reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cafeteria_id, settlement_date)
);

-- INDEXES FOR HIGH-THROUGHPUT LOOKUPS
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_slot_id ON orders(slot_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(order_token);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_slot_holds_active ON slot_holds(expires_at) WHERE is_released = FALSE;
CREATE INDEX IF NOT EXISTS idx_menu_items_cafeteria ON menu_items(cafeteria_id);
```

---

## 6. Production-Ready Service Implementations

### 6.1 Atomic Slot Throttler Service
```typescript
// backend/src/services/slot-throttler.ts
import { supabase } from '../lib/supabase.js';
import { PickupSlot } from '../lib/types.js';

export class SlotThrottlerService {
  /**
   * Concurrency-safe atomic slot reservation in PostgreSQL
   */
  public static async reserveSlotAtomic(
    slotId: string,
    quantity: number,
    orderId: string
  ): Promise<PickupSlot> {
    // 1. Atomic decrement of capacity in PostgreSQL
    const { data: updatedSlot, error: slotError } = await supabase.rpc(
      'reserve_slot_capacity',
      {
        p_slot_id: slotId,
        p_quantity: quantity,
      }
    );

    if (slotError || !updatedSlot) {
      throw new Error(
        'Selected break slot has reached maximum capacity (60 orders limit).'
      );
    }

    // 2. Create 10-minute hold record
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await supabase.from('slot_holds').insert({
      order_id: orderId,
      slot_id: slotId,
      quantity,
      expires_at: expiresAt,
      is_released: false,
    });

    return updatedSlot as PickupSlot;
  }

  /**
   * Release slot hold on payment failure or expiry
   */
  public static async releaseSlotHold(orderId: string): Promise<void> {
    const { data: hold } = await supabase
      .from('slot_holds')
      .select('*')
      .eq('order_id', orderId)
      .eq('is_released', false)
      .single();

    if (hold) {
      // Re-increment slot capacity
      await supabase.rpc('release_slot_capacity', {
        p_slot_id: hold.slot_id,
        p_quantity: hold.quantity,
      });

      // Mark hold as released
      await supabase
        .from('slot_holds')
        .update({ is_released: true })
        .eq('id', hold.id);
    }
  }
}
```

### 6.2 Payment & UTR Fraud Guard Service
```typescript
// backend/src/services/payment-service.ts
import { supabase } from '../lib/supabase.js';
import { sseBroadcaster } from './sse-broadcaster.js';

export class PaymentService {
  /**
   * Validate 12-digit UTR and transition to AWAITING_VERIFICATION
   */
  public static async submitUtr(
    orderToken: string,
    utrNumber: string,
    amount: number
  ): Promise<{ success: boolean; status: string; message: string }> {
    // 1. Strict 12-digit numeric regex check
    if (!/^\d{12}$/.test(utrNumber)) {
      throw new Error('Invalid UTR format. Bank reference must be exactly 12 digits.');
    }

    // 2. Lookup order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('order_token', orderToken)
      .single();

    if (orderErr || !order) {
      throw new Error(`Order ${orderToken} not found.`);
    }

    // 3. Record payment with composite anti-replay index
    const { error: payErr } = await supabase.from('payments').insert({
      order_id: order.id,
      utr_number: utrNumber,
      amount,
      status: 'PENDING_VERIFICATION',
      verification_method: 'UTR_MANUAL',
    });

    if (payErr) {
      if (payErr.code === '23505') {
        throw new Error('This UTR reference has already been used for another order today.');
      }
      throw new Error(payErr.message);
    }

    // 4. Advance order state
    const { data: updatedOrder } = await supabase
      .from('orders')
      .update({ status: 'AWAITING_VERIFICATION', updated_at: new Date().toISOString() })
      .eq('id', order.id)
      .select()
      .single();

    // 5. Broadcast to student and KDS via Redis SSE Hub
    await sseBroadcaster.notifyOrderUpdate(updatedOrder, 'ORDER_UPDATE');

    return {
      success: true,
      status: 'AWAITING_VERIFICATION',
      message: 'UTR submitted successfully. Kitchen preparing meal.',
    };
  }

  /**
   * Confirm payment via Paytm/PhonePe Soundbox or Cashier Scan
   */
  public static async confirmPayment(
    orderId: string,
    method: 'SOUNDBOX_WEBHOOK' | 'CASHIER_SCAN',
    actorId?: string
  ): Promise<void> {
    await supabase
      .from('payments')
      .update({
        status: 'VERIFIED',
        verification_method: method,
        verified_by: actorId || null,
        verified_at: new Date().toISOString(),
      })
      .eq('order_id', orderId);

    const { data: order } = await supabase
      .from('orders')
      .update({ status: 'CONFIRMED', updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (order) {
      await sseBroadcaster.notifyOrderUpdate(order, 'ORDER_UPDATE');
    }
  }
}
```

### 6.3 Clustered Redis Pub/Sub SSE Hub
```typescript
// backend/src/services/sse-broadcaster.ts
import { Response } from 'express';
import Redis from 'ioredis';
import { Order } from '../lib/types.js';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const publisher = new Redis(redisUrl);
const subscriber = new Redis(redisUrl);

interface SseClient {
  id: string;
  orderToken: string;
  res: Response;
}

export class SseBroadcaster {
  private static clients: Map<string, SseClient> = new Map();

  public static initialize(): void {
    // Subscribe to multi-worker Redis pattern
    subscriber.psubscribe('order:channel:*', (err) => {
      if (err) console.error('Redis subscription failed:', err);
    });

    subscriber.on('pmessage', (pattern, channel, message) => {
      const { order, eventType } = JSON.parse(message);
      const token = channel.replace('order:channel:', '');

      // Broadcast to local connected clients matching token
      for (const client of SseBroadcaster.clients.values()) {
        if (client.orderToken === token) {
          client.res.write(`event: ${eventType}\n`);
          client.res.write(`data: ${JSON.stringify(order)}\n\n`);
        }
      }
    });
  }

  public static addClient(orderToken: string, res: Response): string {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable NGINX SSE buffering
    });

    res.write(':\n\n'); // SSE comment ping

    SseBroadcaster.clients.set(clientId, { id: clientId, orderToken, res });
    return clientId;
  }

  public static removeClient(clientId: string): void {
    SseBroadcaster.clients.delete(clientId);
  }

  public static async notifyOrderUpdate(order: Order, eventType: string): Promise<void> {
    const payload = JSON.stringify({ order, eventType });
    await publisher.publish(`order:channel:${order.orderToken}`, payload);
  }
}
```

---

## 7. Full REST & SSE API Matrix

All API endpoints strictly adhere to the standard JSON:API envelope:
```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "2026-08-30T19:35:00Z" }
}
```

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/menu` | Public | List all 44 Cafe @7 dishes grouped by categories |
| `GET` | `/api/slots` | Public | Fetch live 10-minute break slots with capacity meters |
| `POST` | `/api/orders` | Public / Student | Create order and claim atomic 10-min slot hold |
| `POST` | `/api/payments/verify-utr` | Public / Student | Submit 12-digit UTR for anti-replay verification |
| `POST` | `/api/payments/soundbox-hook` | Webhook Secret | Soundbox instant payment verification listener |
| `GET` | `/api/order/:token` | Public | Fetch current state snapshot for order token |
| `GET` | `/api/order/:token/stream` | Public | Live Redis-backed SSE stream for student PWA |
| `PATCH` | `/api/kds/orders/:id/status` | Kitchen / Admin | Transition order status (`PREPARING` -> `READY` -> `COLLECTED`) |
| `PATCH` | `/api/kds/inventory/:dishId` | Kitchen / Admin | 1-Tap dish stockout toggle |
| `POST` | `/api/squad/create` | Student | Create pooled group order room |
| `GET` | `/api/admin/metrics` | Admin | Live GMV, 88/12 split, handover latency & FSSAI metrics |
| `GET` | `/api/admin/settlements/daily` | Admin | Daily T+0 vendor payout breakdown report |

---

## 8. Edge Gateway & NGINX Configuration

```nginx
# /etc/nginx/conf.d/foodline.conf

upstream express_backend {
    server 127.0.0.1:4000;
    server 127.0.0.1:4001;
    keepalive 64;
}

server {
    listen 80;
    server_name api.foodline.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.foodline.in;

    ssl_certificate /etc/letsencrypt/live/foodline.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/foodline.in/privkey.pem;

    # Gzip configuration
    gzip on;
    gzip_types text/plain application/json text/css application/javascript;

    # General API Routes
    location /api/ {
        proxy_pass http://express_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # CRITICAL: SSE Stream Buffering Disabled
    location ~* /api/order/.*/stream {
        proxy_pass http://express_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;
        proxy_read_timeout 24h;
    }
}
```

---

## 9. Docker Compose & Cluster Deployment Architecture

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: foodline-redis
    restart: always
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data

  backend-worker-1:
    build: ./backend
    container_name: foodline-api-1
    restart: always
    environment:
      - PORT=4000
      - NODE_ENV=production
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${SUPABASE_KEY}
    depends_on:
      - redis
    ports:
      - "4000:4000"

  backend-worker-2:
    build: ./backend
    container_name: foodline-api-2
    restart: always
    environment:
      - PORT=4001
      - NODE_ENV=production
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${SUPABASE_KEY}
    depends_on:
      - redis
    ports:
      - "4001:4001"

volumes:
  redis_data:
```

---

## 10. 8-Week Phased Production Roadmap

```mermaid
gantt
    title FoodLine 175-Feature Production Delivery Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Engine & DB
    Supabase DDL & Migration Scripts       :p1_1, 2026-09-01, 7d
    Atomic Slot Engine & TTL Holds         :p1_2, after p1_1, 7d
    section Phase 2: Payments & Auth
    Supabase Auth & RBAC Middleware        :p2_1, 2026-09-15, 6d
    3-Tier UTR Engine & Soundbox Webhook   :p2_2, after p2_1, 8d
    section Phase 3: Real-Time & KDS
    Redis Pub/Sub SSE Broadcaster Hub      :p3_1, 2026-09-29, 6d
    KDS Station Aggregator & Audio Chimes  :p3_2, after p3_1, 8d
    section Phase 4: Express Handover & UI
    High-Contrast Optical QR & PIN         :p4_1, 2026-10-13, 6d
    Dynamic Island Tracking Pill & PWA     :p4_2, after p4_1, 8d
    section Phase 5: Campus Pilot Launch
    Load Testing (2,500 Concurrency)       :p5_1, 2026-10-27, 4d
    Sanjivani University Cafe @7 Go-Live   :p5_2, after p5_1, 3d
```

---

## 11. 2,500-Concurrency Load Testing Protocol

```bash
# Automated Concurrency Simulation Script (Autocannon)
npx autocannon -c 2500 -d 30 -m POST \
  -H "Content-Type: application/json" \
  -b '{"slotId":"b872f04e-289d-4e92-9752-04b39e6c1df8","items":[{"id":"97a06c3a-8149-411a-8212-00566ff050c1","name":"Vada Pav","price":20,"quantity":2}]}' \
  http://localhost:4000/api/orders
```

### Target Performance Benchmarks
- **Concurrent Connections:** 2,500 simultaneous users.
- **Order Placement Latency (P95):** < 80ms.
- **SSE Broadcast Latency:** < 40ms from KDS tap to student screen.
- **Slot Capacity Violation Rate:** Exactly 0.00% (0 overbooked slots).
- **Payment UTR Collision Rate:** Exactly 0.00% (0 duplicate UTRs permitted).

---

*FoodLine: Skip the Line, Not the Meal. Built with engineering precision for Sanjivani University, Kopargaon.*
