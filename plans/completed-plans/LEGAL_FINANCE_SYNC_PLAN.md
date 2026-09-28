# Legal & Finance Sync: Integrate New Finance/Legal Framework into FoodLine Campus

> **Status:** `PENDING`
> **Created By:** OpenCode
> **Target Execution Agent:** Antigravity
> **Created At:** 2026-09-12

---

## 🎯 1. Objective & Problem Statement

The project currently has **three conflicting monetization models** across the codebase and legal documents. The `FoodLine_Finance_Legal_Playbook.html` has been created with the correct structure: **4% platform commission** on total order value, split **50:50 between two partners (Shivam & Kanakshree)**, entity to be registered as **FoodLine Campus LLP**, GST at **18% on commission only** (once turnover crosses ₹20L), and **Razorpay** as the payment gateway (UPI = 0% fee).

This plan syncs all of that into the actual codebase — fixing the broken fee calculations, updating legal entities, adding the canteen partner agreement, and aligning every file to a single source of truth.

**The core discrepancies being fixed:**

| Source | Current Model | Correct Model |
|---|---|---|
| `checkout/page.tsx` | 3.5% fee charged to **student** | 4% platform commission |
| `order-service.ts` | 88/12 split (₹0 student fee) | 4% platform commission, 96% to canteen |
| `README.md` / PRD | 10–12% canteen take-rate, ₹0 student fee | 4% platform commission |
| `TermsContent.tsx` | Draft placeholders for entity/Grievance Officer | FoodLine Campus LLP, named Grievance Officer |
| `MULTI_AGENT_SYNC.md` | Records 3.5% revision | Records 4% model |

---

## 🏗️ 2. Architectural Overview & Context

- **Affected Subsystems:** `frontend/` (checkout UI, legal pages, terms, refund policy, privacy), `backend/` (order-service financials, commission calculations), root-level docs (README, compliance plan, sync log)
- **Related Docs/Schemas:**
  - `FoodLine_Finance_Legal_Playbook.html` — source of truth for all financial terms
  - `COMPLIANCE_AND_LEGAL_PLAN.md` — existing 15-point compliance plan (needs update)
  - `FoodLine_Campus_Terms_Source.md` — draft ToS (needs entity/ Grievance Officer fill)
  - `supabase_schema.sql` — `payments` table (UTR fields, no schema change needed)
  - `frontend/src/lib/types.ts` — if new types are added for commission splits

---

## 📁 3. File Modification Matrix

| File Path | Action | Description |
|---|---|---|
| `frontend/src/app/checkout/page.tsx` | Edit | Change `platformMarginRate` from 0.035 → 0.04; update label text from "Convenience Fee" to "Platform Commission"; update UPI VPA if needed |
| `backend/src/services/order-service.ts` | Edit | Replace 88/12 split with 96/4 commission model; remove legacy `studentPlatformFee = 0`; update merchant payout calculation |
| `frontend/src/components/legal/TermsContent.tsx` | Edit | Replace placeholder entity name with "FoodLine Campus LLP"; fill Grievance Officer; update merchant VPA; update jurisdiction courts to Maharashtra; remove Shark Tank references |
| `frontend/src/components/legal/PrivacyContent.tsx` | Edit | Add LLP entity name, registered address placeholder, data fiduciary identification |
| `frontend/src/app/refund-policy/page.tsx` | Edit | Verify refund logic matches 4% commission model; add Razorpay refund timeline note |
| `COMPLIANCE_AND_LEGAL_PLAN.md` | Edit | Add LLP incorporation as completed item; add Razorpay as payment gateway; add 50-50 partnership structure |
| `FoodLine_Campus_Terms_Source.md` | Edit | Fill in all `[TBD]` placeholders with LLP details, Grievance Officer, jurisdiction |
| `README.md` | Edit | Update revenue model section from "10–12% canteen take-rate" to "4% platform commission"; remove Shark Tank references; update financial projections table to reflect 4% |
| `MULTI_AGENT_SYNC.md` | Append | Log this sync operation with timestamp and changes made |
| `frontend/src/app/admin/page.tsx` | Edit | Update `canteenIncome` / `founderIncome` calculations from `/1.035` to `/1.04` (or correct commission formula) |
| `plans/LEGAL_FINANCE_SYNC_PLAN.md` | Create | This plan file |

---

## 📝 4. Detailed Implementation Tasks

### Phase 1 — Core Financial Model Alignment

- [x] **Task 1: Fix checkout fee calculation**
  - Details: In `frontend/src/app/checkout/page.tsx`, change:
    - `platformMarginRate` from `0.035` to `0.04` (4%)
    - Display label: "FoodLine Fast-Pass Convenience Fee" → "FoodLine Platform Fee (4%)"
    - Verify `finalPayable = subtotal * 1.04` is correct
    - Verify UPI link amount reflects `finalPayable` with 4%
    - Update the `upiLink` amount: `am=${finalPayable.toFixed(2)}`
  - Target files: `frontend/src/app/checkout/page.tsx`
  - Acceptance: `finalPayable` for ₹100 item = ₹104.00 exactly

- [x] **Task 2: Fix backend order-service financials**
  - Details: In `backend/src/services/order-service.ts` (lines ~127–138), replace:
    - `studentPlatformFee = 0` → remove this variable
    - `merchantPayoutAmount = itemTotal * 0.88` → `itemTotal * 0.96`
    - `platformShareAmount = itemTotal * 0.12` → `itemTotal * 0.04`
    - `paymentGatewayMdr = 0` → keep as 0 for now (UTR model); add comment that Razorpay will change this
    - `totalAmountPaid = itemTotal` → `itemTotal` (student pays subtotal only; platform fee is separate)
    - Update any comments referencing "88/12 split" to "96/4 platform commission"
  - Target files: `backend/src/services/order-service.ts`
  - Acceptance: For ₹100 order: merchantPayout = ₹96.00, platformShare = ₹4.00

- [x] **Task 3: Fix admin dashboard calculations**
  - Details: In `frontend/src/app/admin/page.tsx` (lines ~222–233), change:
    - `canteenIncome = total / 1.035` → `canteenIncome = total * 0.96` (or `total / 1.04 * 0.96` if total includes the 4% fee)
    - `founderIncome = GMV − canteenIncome` → update to reflect 4% platform commission
    - Relabel from "Fast-Pass platform take rate" to "Platform Commission (4%)"
    - Add a note that 50% of platform commission goes to co-founder (internal label only, not displayed to users)
  - Target files: `frontend/src/app/admin/page.tsx`
  - Acceptance: Dashboard numbers match the 96/4 split for any test order

### Phase 2 — Legal Entity & Terms Update

- [x] **Task 4: Update TermsContent.tsx with LLP entity**
  - Details: In `frontend/src/components/legal/TermsContent.tsx`:
    - Replace `pilotCampus = 'Sanjivani University, Kopargaon (Pilot Partner: Cafe @7)'` — keep as-is
    - Replace any `[Name to be designated]` / `[TBD]` placeholders with:
      - Legal entity: "FoodLine Campus LLP"
      - Registered address: "[Address to be filled after LLP registration]"
      - Grievance Officer: "[Name to be designated]" → keep placeholder but add "foodlinecampus07@gmail.com" as contact
      - Jurisdiction courts: "Courts in Ahmednagar, Maharashtra" (Sanjivani University is in Kopargaon, Ahmednagar district)
    - Update merchant VPA references if `9960091371@slc` needs changing
    - Remove any references to "Shark Tank" or "Shark Tank pitch"
    - Add clause: "Platform fee is 4% of the order total, charged as a separate line item at checkout."
  - Target files: `frontend/src/components/legal/TermsContent.tsx`
  - Acceptance: All `[TBD]` placeholders filled; no "Shark Tank" text remains; 4% fee mentioned in payment clause

- [x] **Task 5: Update PrivacyContent.tsx with LLP data fiduciary**
  - Details: In `frontend/src/components/legal/PrivacyContent.tsx`:
    - Add data fiduciary identification: "FoodLine Campus LLP is the data fiduciary under the DPDP Act 2023."
    - Add contact for data queries: foodlinecampus07@gmail.com
    - Add note: "Payment data is processed by Razorpay and never stored on FoodLine servers."
    - Verify DPDP consent language is present
  - Target files: `frontend/src/components/legal/PrivacyContent.tsx`
  - Acceptance: Data fiduciary name and contact visible in policy

- [x] **Task 6: Update refund-policy page for 4% model**
  - Details: In `frontend/src/app/refund-policy/page.tsx`:
    - Verify refund calculations: if student pays ₹104 (₹100 + ₹4 fee), refund should return ₹104 (full) or ₹0 (no refund) — no partial scenario
    - Add note: "Platform fee (4%) is refunded in full if the order is cancelled before kitchen acceptance."
    - Add Razorpay refund timeline: "UPI refunds are typically instant; card refunds may take 3–5 business days."
    - Verify all refund rules match the `RULES` array in the file
  - Target files: `frontend/src/app/refund-policy/page.tsx`
  - Acceptance: Refund amounts correct for ₹100 + ₹4 fee order; Razorpay timeline noted

### Phase 3 — Documentation & Compliance Sync

- [x] **Task 7: Update FoodLine_Campus_Terms_Source.md**
  - Details: Fill all `[TBD]` / `[Name to be designated]` placeholders:
    - Section 24 (Grievance Officer): Name, email (foodlinecampus07@gmail.com), address
    - Section 21 (Dispute Resolution): Jurisdiction = Courts in Ahmednagar, Maharashtra
    - Add Section 26 (Platform Fee): "The Platform charges a commission of 4% on the total order value, displayed as a separate line item at checkout. This fee is inclusive of GST where applicable."
    - Remove any Shark Tank references
    - Update effective date if needed
  - Target files: `FoodLine_Campus_Terms_Source.md`
  - Acceptance: Zero `[TBD]` placeholders remain; 4% fee documented

- [x] **Task 8: Update COMPLIANCE_AND_LEGAL_PLAN.md**
  - Details: Add new items to the 15-point plan:
    - Item 16: LLP Incorporation — Status: PENDING (Form FiLLiP on MCA portal, ₹5K–10K cost)
    - Item 17: Razorpay Payment Gateway Integration — Status: PENDING (UPI 0%, cards 2%)
    - Item 18: Canteen Partner Agreement — Status: PENDING (50-50 commission split, exclusivity, termination)
    - Update Item 6 (Secure Payments): Note that Razorpay handles PCI-DSS compliance; FoodLine never touches card data
    - Update Item 1 (Privacy Policy): Add LLP as data fiduciary
    - Update Item 2 (Terms of Service): Add 4% platform fee clause
  - Target files: `COMPLIANCE_AND_LEGAL_PLAN.md`
  - Acceptance: 18-point plan (not 15); LLP + Razorpay + Canteen Agreement documented

- [x] **Task 9: Update README.md revenue model**
  - Details: In `README.md`:
    - Change revenue model from "10–12% canteen take-rate / ₹0 student fee" to "4% platform commission on total order value"
    - Remove all Shark Tank references
    - Update unit economics table: 4% commission on ₹65 AOV = ₹2.60/order (not ₹7.80)
    - Update financial projections if AOV or commission rate changed
    - Add note: "Entity: FoodLine Campus LLP (pending registration)"
    - Add note: "Payment: Razorpay (UPI = 0% fee)"
  - Target files: `README.md`
  - Acceptance: Revenue model consistent with 4% commission; no Shark Tank text; projections match

- [x] **Task 10: Log sync to MULTI_AGENT_SYNC.md**
  - Details: Append a timestamped entry to `MULTI_AGENT_SYNC.md`:
    ```
    ## 🔧 Legal & Finance Sync — [Date]
    - Fixed platform fee: 3.5% student convenience fee → 4% platform commission
    - Fixed backend split: 88/12 → 96/4
    - Updated entity: FoodLine Campus LLP (pending MCA registration)
    - Updated terms: Grievance Officer, jurisdiction (Ahmednagar, Maharashtra), 4% fee clause
    - Updated privacy: LLP as data fiduciary, Razorpay as payment processor
    - Updated refund policy: 4% fee refundable on pre-preparation cancellation
    - Added compliance items 16-18: LLP, Razorpay, Canteen Agreement
    - Removed all Shark Tank references
    ```
  - Target files: `MULTI_AGENT_SYNC.md`
  - Acceptance: Sync entry visible at bottom of file with today's date

### Phase 4 — Verification

- [x] **Task 11: Build verification**
  - Details: Run full build to confirm no type errors, no missing imports, no broken references:
    ```bash
    npm --prefix frontend run build && npm --prefix backend run build
    ```
  - Target files: N/A (build verification)
  - Acceptance: Clean build, zero errors

- [x] **Task 12: Manual checkout flow test**
  - Details: Verify the checkout page renders correctly:
    - Cart with ₹100 item shows subtotal ₹100.00
    - Platform fee shows ₹4.00 (4%)
    - Final payable shows ₹104.00
    - UPI QR link amount is ₹104.00
    - No "Shark Tank" text anywhere in the app
  - Target files: `frontend/src/app/checkout/page.tsx`
  - Acceptance: Manual visual check in browser

- [x] **Task 13: Backend order test**
  - Details: POST to `/api/orders` with a test payload, verify:
    - Response includes `merchantPayoutAmount: 96.00` and `platformShareAmount: 4.00` for ₹100 order
    - No legacy 88/12 values remain in the response
  - Target files: `backend/src/services/order-service.ts`
  - Acceptance: API response matches 96/4 split

---

## 🧪 5. Verification & Acceptance Criteria

1. **Compilation Check:**
   ```bash
   npm --prefix frontend run build && npm --prefix backend run build
   ```

2. **Behavioral Acceptance Criteria:**
   - [ ] Checkout shows 4% platform fee, not 3.5%
   - [ ] `finalPayable` for ₹100 item = ₹104.00
   - [ ] Backend `merchantPayoutAmount` for ₹100 = ₹96.00
   - [ ] Backend `platformShareAmount` for ₹100 = ₹4.00
   - [ ] Admin dashboard shows correct 4% commission (not 3.5% or 12%)
   - [ ] Terms page shows "FoodLine Campus LLP" as legal entity (or placeholder)
   - [ ] Terms page shows Ahmednagar, Maharashtra as jurisdiction
   - [ ] Privacy page identifies FoodLine Campus LLP as data fiduciary
   - [ ] Refund policy correctly handles ₹104 order (full refund = ₹104)
   - [ ] Zero "Shark Tank" references remain in the codebase
   - [ ] Zero `[TBD]` or `[Name to be designated]` placeholders in published legal pages
   - [ ] `README.md` revenue model matches 4% commission model

3. **No Breaking Changes:** Existing routes (`/menu`, `/checkout`, `/terms`, `/privacy`, `/refund-policy`, `/admin`, `/kds`) must remain functional and accessible.

---

## 📋 6. Antigravity Execution Log

*(Antigravity will fill this section during and after execution)*

- **Started At:**
- **Completed At:**
- **Verification Output:**
- **Notes / Deviations:**

---

## Appendix A: Corrected Financial Model (Single Source of Truth)

```
STUDENT SEES:
  Menu Item Price:          ₹100.00
  Platform Fee (4%):        ₹  4.00
  Total Payable:            ₹104.00

PLATFORM RECEIVES:
  Platform Commission:      ₹  4.00
  GST on Commission (18%):  ₹  0.72   ← only when annual turnover > ₹20L
  Net Platform Income:      ₹  3.28   ← (or ₹4.00 pre-GST threshold)

CANTEEN RECEIVES:
  Food Revenue:             ₹100.00
  GST on Food (5%):         ₹  5.00   ← canteen handles this
  Canteen Net:              ₹  95.00

PARTNER SPLIT (internal, not visible to students/canteens):
  Shivam (50%):             ₹  2.00 / order
  Kanakshree (50%):         ₹  2.00 / order
```

## Appendix B: Razorpay Fee Summary

```
UPI:              0%    (campus students = ~95% UPI)
Credit/Debit:     2%    (pass as convenience fee to student)
Net Banking:      2%    (pass as convenience fee to student)
Wallets:          2%    (pass as convenience fee to student)
International:    3%    (N/A for campus use)

Monthly cost at 100 orders/day: ~₹312 (negligible)
```
