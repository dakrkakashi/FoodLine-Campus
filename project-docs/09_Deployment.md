# 🚀 09 • Deployment, Production Staging & Mobile Build Guide
**Project Name:** FoodLine Campus  
**Environments:** Local Development (`localhost`), Production Cloud Staging, Android APK Kiosk

---

## 1. Environment Variables Configuration

### Frontend Environment (`frontend/.env.local` / `.env.production`)
```env
# Supabase PostgreSQL Cloud Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ylweomuodekukjjpjrgx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend High-Concurrency Engine URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
# Production: NEXT_PUBLIC_BACKEND_URL=https://api.foodlinecampus.com

# Target Pilot Campus Identification
NEXT_PUBLIC_DEFAULT_CAMPUS_ID=a1111111-1111-1111-1111-111111111111
NEXT_PUBLIC_DEFAULT_CANTEEN_ID=b2222222-2222-2222-2222-222222222222
```

### Backend Environment (`backend/.env` / `.env.production`)
```env
PORT=4000
NODE_ENV=production
SUPABASE_URL=https://ylweomuodekukjjpjrgx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secure-service-role-key

# Google Sheets Master Spreadsheet
GOOGLE_SHEETS_SPREADSHEET_ID=1UjpWRpsDuBx6aCsZLREx__zSapeEdICM3o7WosWZCW8
GOOGLE_SERVICE_ACCOUNT_EMAIL=foodline-backend@foodline-campus-07.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# CORS Allowed Origins
CORS_ORIGINS=http://localhost:3000,https://foodlinecampus.com
```

---

## 2. Cloud Staging & Production Deployment

### 1. Frontend Web Application (Next.js 15)
- **Recommended Platform:** **Vercel** or **Cloudflare Pages**
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node.js Version:** `20.x`

### 2. Backend Engine (Express HTTP/2 + SSE Stream)
- **Recommended Platform:** **Railway**, **Render**, or **DigitalOcean Droplet (Docker)**
- **Root Directory:** `backend`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `GET /api/telemetry` (returns `200 OK` with memory & stream counts)
- **Important:** Ensure the cloud host supports long-lived HTTP connections for Server-Sent Events without 60-second gateway timeouts.

---

## 3. Android Tablet KDS Kiosk Build (`frontend/android`)

To deploy FoodLine as a dedicated fullscreen Android app for the Cafe @7 kitchen tablet:

### 1. Sync Capacitor Assets
```bash
cd frontend
npm run build
npx cap sync android
```

### 2. Compile Standalone Debug APK
```bash
cd android
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
./gradlew assembleDebug
```
- **Generated APK Output:** `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Kitchen Tablet Kiosk Configuration
- Install APK on a rugged 10-inch Android tablet.
- In Android Settings ➔ **Lock Task Mode / App Pinning**: Pin FoodLine KDS (`/kds`) to prevent cooks or staff from exiting to other apps.
- Set tablet volume to **100%** and ensure Web Audio autoplay permissions are enabled for order chimes.

---

## 4. Verification & Pre-Flight Checklist

Before opening the campus pilot at 8:00 AM:
1. Run API Audit: `npm --prefix backend run test:api` (All 11 endpoints passing).
2. Run Concurrency Stress Test: `npm --prefix backend run test:stress` (0% overbooking).
3. Ping Telemetry: Check `http://localhost:4000/api/telemetry` (Supabase latency <50ms).
4. Verify Cashfree/Bank UPI: Ensure Cafe @7 merchant UPI ID (`9960091371@slc`) is active.
