const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../notebooklm');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// -------------------------------------------------------------
// SOURCE 1: System Architecture & Tech Stack
// -------------------------------------------------------------
const source1Content = `# 🚀 FoodLine Campus — System Architecture & Tech Stack

## Executive Summary
FoodLine Campus is a category-defining B2B2C campus dining infrastructure ecosystem designed to eliminate 25-minute recess lunch lines across college campuses in India. It connects students directly with on-campus canteens through express pre-ordering, 60-order slot throttling, 12-digit UTR payment verification, and Kitchen Display System (KDS) automation.

## Core Architecture & Stack Overview
- **Frontend Layer**: Next.js 15.5 App Router, React 19, Tailwind CSS v4, Motion (Framer Motion), Lucide React, and Custom Luxury Ambient Lighting.
- **Backend Layer**: Express.js REST API engine, TypeScript (Node 22), Vitest test suite, zero-dependency structured JSON logger, and SSE (Server-Sent Events) realtime broadcaster.
- **Database Layer**: Dual-Master Architecture:
  1. Supabase PostgreSQL with strict Row Level Security (RLS) policies.
  2. Google Sheets API v4 Dual-Master Synchronization for real-time account ledger logging and order backups.
- **Mobile Bridge**: Capacitor 8 native Android wrapper compiling to a 4.1 MB standalone APK (\`FoodLine_Campus.apk\`), supporting Android 7.0+ (API 24+) to Android 16 (API 36).

## Key Operational Innovations
1. **60-Order Slot Throttling Governor**: Enforces atomic 60-order limit per 10-minute break slot to guarantee zero kitchen overbooking and maintain <45-second express pickup SLA.
2. **12-Digit UTR Replay Protection**: Every UPI transaction reference is checked against an in-memory cache and database index to prevent duplicate payment claims and screenshot fraud.
3. **Student Account Auto-Detection**: Flexible leading-zero PRN normalizer checks Google Sheets & Supabase to detect returning students instantly, preserving login mode and auto-filling checkout details.
4. **Kitchen Display System (KDS)**: 1-tap touch status updates (\`PREPARING\` -> \`READY FOR PICKUP\` -> \`COMPLETED\`) with optional soundbox chimes and optical QR pass validation.
`;

// -------------------------------------------------------------
// SOURCE 2: API Specification & Database Schema
// -------------------------------------------------------------
const source2Content = `# 📡 FoodLine Campus — API Specification & Database Schema

## Standard API Response Envelope
All API route handlers return standard JSON envelopes:
\`\`\`json
{
  "success": boolean,
  "data": any,
  "error": string,
  "meta": object
}
\`\`\`

## Key API Endpoints

### Auth & Student Resolution
- \`GET /api/auth/resolve-student?prn=<PRN>\`: High-speed resolver checking student registration across Google Sheets Master and Supabase. Responds in <50ms.
- \`POST /api/auth/student-login\`: Validates PRN and password/OTP credentials, issues JWT token with 30-day session cookies.
- \`POST /api/auth/student-signup\`: Creates new student account, appends row to Google Sheets Master, and generates Supabase profile.

### Menu & Canteens
- \`GET /api/campuses/geo\`: Returns geographic hierarchy of states, districts, towns, campuses, and registered canteens.
- \`GET /api/menu\`: Returns active canteen menu items, category filters, stock availability, and dish pricing.

### Orders & Payments
- \`POST /api/orders\`: Validates 60-slot throttling cap, checks idempotency key, creates order record, and broadcasts SSE update to KDS.
- \`POST /api/payments/verify-utr\`: Validates 12-digit UTR regex, checks anti-replay defense, and sets status to \`PENDING_MANUAL_REVIEW\`.
- \`POST /api/payments/reconcile\`: Staff endpoint to reconcile manual UTR payments against bank soundbox statements.

## Database Schemas (PostgreSQL / Supabase)
- **\`profiles\`**: \`id\`, \`prn\`, \`full_name\`, \`email\`, \`phone\`, \`role\` (\`student\`, \`kitchen\`, \`canteen_manager\`, \`admin\`).
- **\`canteens\`**: \`id\`, \`campus_id\`, \`name\`, \`slug\`, \`upi_vpa\`, \`is_active\`.
- **\`dishes\`**: \`id\`, \`canteen_id\`, \`name\`, \`price\`, \`category\`, \`in_stock\`, \`prep_time_mins\`.
- **\`orders\`**: \`id\`, \`token\`, \`student_prn\`, \`canteen_id\`, \`items\`, \`total_amount\`, \`status\`, \`idempotency_key\`, \`slot_time\`.
- **\`payments\`**: \`id\`, \`order_id\`, \`utr_number\`, \`status\`, \`reconciled_by\`.
`;

// -------------------------------------------------------------
// SOURCE 3: Business Plan & Investor Pitch
// -------------------------------------------------------------
const source3Content = `# 💼 FoodLine Campus — Investor Business Plan & Traction Summary

## Executive Pitch Summary
FoodLine Campus is scaling the B2B2C campus dining rail across Indian higher education institutions. By solving the 15-minute recess break bottleneck, FoodLine captures 100% of student dining demand while enabling canteen operators to increase daily revenue by up to 300%.

## Proven Pilot Traction
- **Meals Delivered**: 544+ hot meals delivered during Sanjivani University pilot.
- **Gross Merchandise Value (GMV)**: ₹35,360+ GMV processed.
- **Student Retention Rate**: 82% repeat order rate among registered students.
- **Average Express Pickup Time**: <45 seconds from arrival to collection.
- **Overbooking Rate**: 0% overbooking enforced by 60-slot throttling governor.

## Unit Economics & Take Rate
- **Average Order Value (AOV)**: ₹65 per meal combo.
- **Performance Commission Model**: 3.5% take rate per completed order (₹2.275 net/order).
- **Canteen Break-Even Threshold**: ~659 orders/month vs pilot run-rate of 1,500 - 2,000 orders/month.
- **TAM / SAM / SOM**: ₹35,000 Cr ($4.2B) Indian campus dining TAM growing at 18.4% CAGR.
`;

// -------------------------------------------------------------
// SOURCE 4: Canteen Manager Growth & Profit Pitch
// -------------------------------------------------------------
const source4Content = `# 📈 FoodLine Campus — Canteen Manager Growth & Profit Guide

## Core Canteen Business Value
1. **3x Order Volume Growth**: Canteens serve 450-600+ meals per break instead of being capped at ~150-180 counter meals.
2. **100% Payment Security**: Automatic 12-digit UTR verification eliminates fake screenshot fraud and unpaid orders during rush hour.
3. **80% Less Food Waste**: Pre-order demand forecasting tells kitchen staff exact dish quantities needed before cooking.
4. **Higher Average Basket Size**: Pre-order combos increase average ticket size from ₹45 to ₹65 (+30% growth).

## Financial Comparison for Canteen Operators
| Metric | Traditional Counter | With FoodLine Campus | Net Canteen Gain |
| :--- | :--- | :--- | :--- |
| Break Meals Served | 180 Meals | 550 Meals | **+370 Meals / Day** |
| Average Order Value | ₹45 | ₹65 | **+₹20 Basket Size** |
| Daily Revenue | ₹8,100 | ₹35,750 | **+₹27,650 / Day Revenue** |
| Monthly Canteen Sales | ₹1.78 Lakhs | ₹7.86 Lakhs | **+₹6.08 Lakhs / Month** |
| Est. Net Monthly Profit | ₹44,500 | ₹1,96,500 | **+₹1,52,000 Net Profit / Month** |
`;

// -------------------------------------------------------------
// SOURCE 5: Statutory Legal Terms & DPDP Compliance
// -------------------------------------------------------------
const source5Content = `# 📜 FoodLine Campus — Statutory Legal Terms & DPDP Compliance

## Master Terms Structure
The 25-section master terms document governs all student, canteen, and institutional interactions:
1. **Governance & Entity (Sections 1-4)**: Seller of record, campus licensing, FSSAI compliance (Lic #11522036000142).
2. **Ordering & Slot Throttling (Sections 5-8)**: 60-order slot cap rules, order lock times, student cancellation SLAs.
3. **Refunds & Thermal Holding (Sections 9-11)**: 20-minute thermal holding SLA, automated refund triggers for stockouts.
4. **Kitchen Operations & KDS (Sections 12-13)**: Staff KDS duties, soundbox verification rules.
5. **Data Privacy & DPDP Act 2023 (Sections 14-15)**: Student data minimization (PRN, minimal contact), encrypted storage, zero telemetry sales.
6. **Intellectual Property & Multi-Campus (Sections 16-19)**: Campus clustering rules, logo usage standards.
7. **Dispute Resolution & Grievances (Sections 20-25)**: 3-tier grievance escalation hierarchy and statutory SLA solver.
`;

fs.writeFileSync(path.join(outputDir, '01_System_Architecture_and_Tech_Stack.md'), source1Content);
fs.writeFileSync(path.join(outputDir, '02_API_Specification_and_Database_Schema.md'), source2Content);
fs.writeFileSync(path.join(outputDir, '03_Business_Plan_and_Investor_Pitch.md'), source3Content);
fs.writeFileSync(path.join(outputDir, '04_Canteen_Manager_Growth_and_Profit_Pitch.md'), source4Content);
fs.writeFileSync(path.join(outputDir, '05_Legal_Terms_and_DPDP_Compliance.md'), source5Content);

console.log('✅ NotebookLM sources generated successfully in notebooklm/ folder:');
console.log('  1. notebooklm/01_System_Architecture_and_Tech_Stack.md');
console.log('  2. notebooklm/02_API_Specification_and_Database_Schema.md');
console.log('  3. notebooklm/03_Business_Plan_and_Investor_Pitch.md');
console.log('  4. notebooklm/04_Canteen_Manager_Growth_and_Profit_Pitch.md');
console.log('  5. notebooklm/05_Legal_Terms_and_DPDP_Compliance.md');
