# 🔒 08 • Security, Fraud Prevention & Regulatory Compliance
**Project Name:** FoodLine Campus  
**Security Standard:** OWASP Top 10 + DPDP Act 2023 Compliance  
**Payment Compliance:** NPCI / UPI Direct Transfer Standards

---

## 1. The 12-Digit UTR Anti-Fraud Shield

### The Threat Model
In university canteens across India, students use apps like *FakePay* to generate spoofed payment screenshots displaying the correct canteen UPI ID and amount. In noisy rush hours, canteen cashiers cannot verify every phone screen, resulting in **₹4,000 to ₹6,000 in stolen food every single day**.

### FoodLine's 3-Tier Defensive Shield
```
[ Student Submits UTR ]
          │
          ▼
   [ Tier 1: Syntax Validation ] ── Fails ──➔ Return 400 Bad Request
          │ Passes (Exactly 12 Digits)
          ▼
   [ Tier 2: Replay Blocker ]    ── Found ──➔ Return 409 Conflict (Replay Blocked)
          │ Unique
          ▼
   [ Tier 3: Ledger Locking ]    ───────────➔ Order CONFIRMED
```

1. **Tier 1 (Format & Entropy Validation):**  
   - Pattern check: `^\d{12}$` (must be exactly 12 numeric digits).  
   - Blocks placeholder strings, test tokens, or truncated references.
2. **Tier 2 (Duplicate Replay Blocker):**  
   - Queries `orders.utr_number` with an atomic unique constraint.  
   - If the same UTR was submitted earlier (even from a different student account or different day), the request is rejected with `409 Conflict`.
3. **Tier 3 (Atomic Ledger Locking):**  
   - The order status transitions from `PENDING_PAYMENT` to `CONFIRMED` only after the UTR is successfully locked into the database transaction.

---

## 2. 100% Online DirectPay UPI Policy (Zero COD)

To completely eliminate lines at the physical counter:
- **Cash on Delivery (COD) is permanently disabled.**
- Why? Allowing cash payments forces students to stand in a payment queue, defeating the core promise of zero-queue express dining.
- By enforcing 100% online UPI pre-payment, students walk directly to the Express Pickup Rack, collect food, and leave in under 30 seconds.

---

## 3. Data Privacy & DPDP Act 2023 Compliance

Under India's **Digital Personal Data Protection (DPDP) Act 2023**, student records and dining habits must be protected:

1. **Data Minimization:**  
   We only store the student's University PRN and minimal contact information necessary for pickup verification. No credit card details, UPI PINs, or biometric data are ever processed or stored.
2. **24-Hour Automated Order Retention Purge:**  
   - An automated background cron runs every hour in `server.ts` (`OrderService.cleanupOldOrders(24)`).
   - Any order with status `COLLECTED` or `CANCELLED` older than 24 hours is automatically scrubbed from active storage.
3. **Client-Side Phone Masking:**  
   Student contact numbers are masked in all client-side console logs and publicly accessible API responses (`98******12`).

---

## 4. Secret Isolation & OWASP Defenses

- **Absolute Secret Isolation:** `.env`, `.env.local`, Supabase service role keys, and Google Cloud service account JSON keys are strictly Git-ignored and never committed.
- **SQL Injection Immunity:** 100% of database queries use parameterized calls via the official Supabase SDK. No raw SQL string concatenation is permitted anywhere in the repository.
- **Cross-Site Scripting (XSS) Prevention:** React 19 / Next.js automatic HTML escaping is enforced across all student notes, dish names, and canteen review fields.

---

## 5. Role-Based Access Control & KDS Authentication Guard

Kitchen Display System (`/api/kds/*`) and Administrative (`/api/admin/*`) endpoints are strictly protected by `requireAuth`:

- **Protected Routes:**
  - `PATCH /api/kds/orders/:id/status` (Roles: `kitchen`, `canteen_manager`, `admin`)
  - `PATCH /api/kds/inventory/:dishId` (Roles: `kitchen`, `canteen_manager`, `admin`)
  - `GET /api/admin/metrics` (Roles: `canteen_manager`, `admin`)
  - `POST /api/admin/orders/cleanup` (Roles: `admin`)
- **Dual Authentication Mechanisms:**
  1. **JWT Bearer Token:** Standard `Authorization: Bearer <jwt_token>` obtained via `/api/auth/login`. Enforces cryptographic HS256 verification and mandatory role entitlement.
  2. **Hardware Kiosk Passkey:** Physical kitchen tablets can provide the `x-staff-passkey: <passkey>` header, matched against the cryptographically secured `STAFF_PASSKEY` environment variable.
- **Enforcement:** Unauthenticated requests receive `401 Unauthorized`. Authenticated requests with mismatched roles receive `403 Forbidden`.

---

## 6. Dynamic Sliding-Window Rate Limiting & Brute-Force Defense

To protect against credential stuffing, OTP enumeration, and denial-of-service attacks, multi-tier sliding-window limiters are enforced:

| Endpoint Target | Window | Max Allowed | Defensive Objective | Rejection Code |
|---|---|---|---|---|
| `/api/auth/*` (Login & Signup) | 15 minutes | 5 attempts | Prevents credential stuffing & user enumeration | `429 Too Many Requests` |
| `/api/orders/verify-otp` | 15 minutes | 5 attempts | Protects 4-digit OTP space (10,000 combos) against brute force | `429 Too Many Requests` |
| `/api/orders` (Order Creation) | 1 minute | 10 requests | Throttles automated slot hoarding & cart flooding | `429 Too Many Requests` |
| `/api/*` (General Traffic) | 1 minute | 120 requests | General DDoS and bot scrape throttling | `429 Too Many Requests` |

All rate-limited responses return `HTTP 429 Too Many Requests` with a standard `Retry-After: <seconds>` HTTP response header.

---

## 7. Strict 64KB Payload Size Guard & Recursive Sanitization

1. **64KB Payload Guard (`payloadSizeGuard`):**  
   All incoming request bodies are capped at 64KB (65,536 bytes). Excessively large payloads designed to exhaust heap memory or trigger regex DoS are rejected immediately with `HTTP 413 Payload Too Large` before buffer allocation.
2. **Recursive Input Sanitization (`sanitizeInputsMiddleware`):**  
   - Recursively traverses all nested object keys and array values in incoming JSON.
   - Strips malicious HTML `<script>` tags, inline JavaScript handlers (`onload`, `onerror`, `onclick`), and `javascript:` pseudo-protocols.
   - Cleans zero-width Unicode evasion sequences.
   - **Prototype Pollution Blocker:** Rejects requests containing reserved JavaScript properties such as `__proto__`, `constructor`, or `prototype`.

---

## 8. Salted `scrypt` Cryptographic Password Hashing

User account credentials (students, canteen staff, and administrators) are secured using industry-standard Node.js `crypto.scrypt`:

- **Key Derivation:** `crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 })`.
- **Stored Format:** `$scrypt$<hex_salt>$<hex_derived_key>` (utilizing a cryptographically secure 32-byte pseudo-random salt).
- **Constant-Time Verification:** Compares stored hashes using `crypto.timingSafeEqual` to eliminate side-channel timing leaks.
- **Zero Plaintext Fallback:** Legacy plaintext password comparisons are completely eliminated; unhashed legacy entries trigger an explicit security validation exception requiring password reset.

---

## 9. Origin-Restricted Cross-Origin Resource Sharing (CORS)

- Browser requests are validated against a strict origin whitelist configured via `ALLOWED_ORIGINS` (e.g. `http://localhost:3000`, `http://localhost:3001`, and verified production domains).
- Wildcard `*` CORS is strictly disabled in production.
- Requests originating from unauthorized third-party domains or malicious web workers are blocked at the HTTP handshake level.

---

## 10. Reconciled UTR Ledger & Counter Verification Flag

When an Indian UPI 12-digit UTR is verified:
- In addition to checking format entropy (`^\d{12}$`) and atomic replay prevention against the database ledger, the payment verification response and database record include an explicit audit attribute:
  ```json
  "requiresCounterCheck": true
  ```
- This guarantees full accounting transparency: cashiers and accounting managers can clearly identify orders verified through automated client submission versus physical settlement checks on bank reconciliation sheets.

