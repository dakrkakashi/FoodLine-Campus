# FoodLine Campus: 15-Point Legal, Compliance & Risk Mitigation Master Plan

> **Objective:** Systematically protect FoodLine Campus from legal exposure, lawsuits, regulatory penalties, and operational liabilities across all 15 compliance dimensions shown in the reference checklist.

---

## Executive Summary

As FoodLine Campus transitions to active campus deployment handling student identity data, financial transactions via UPI/Gateways, and vendor partnerships with campus canteens, compliance is critical.

This Master Plan translates the **15 Critical Legal & Compliance Safeguards** into specific technical implementations, legal documentation, and operational protocols tailored for FoodLine Campus under Indian law (DPDP Act 2023, IT Act 2000, Consumer Protection E-Commerce Rules 2020) and global best practices (GDPR, PCI-DSS, WCAG 2.2).

---

## 15-Point Compliance Breakdown & Action Plan

---

### 1. Privacy Policy
* **Legal Framework:** Digital Personal Data Protection Act (DPDP Act 2023), GDPR Art. 12-14, IT Rules 2011.
* **Current Status in FoodLine:** Partially addressed inside terms clauses; needs a dedicated /privacy route and structured policy.
* **Scope of Data Collected:**
  - Student identity: Name, College PRN, Gmail address, mobile number, campus/hostel affiliation.
  - Transaction data: UPI UTR numbers, order history, timestamps, token numbers.
  - Technical data: IP address, device fingerprints, session cookies, local storage state.
* **Action Items:**
  1. Create dedicated /privacy page (rontend/src/app/privacy/page.tsx).
  2. Disclose purpose of data processing (order routing, token generation, fraud prevention).
  3. Disclose third-party data sharing (canteen operators, payment gateways like Razorpay/Cashfree, SMS/WhatsApp notification services).
  4. Appoint and publish Grievance Redressal Officer contact details (grievance@foodlinecampus.com).

---

### 2. Terms of Service (ToS)
* **Legal Framework:** Indian Contract Act 1872, Information Technology Act 2000 Section 10A.
* **Current Status in FoodLine:** Detailed interactive /terms page already exists with clause categories and search.
* **Action Items:**
  1. Add clickwrap acceptance checkpoint on Student Signup (rontend/src/app/login/page.tsx) with explicit checkbox: *"I agree to the Terms of Service and Privacy Policy"*.
  2. Define platform role as a **technology intermediary/marketplace facilitator** under Section 79 of the IT Act (not the food manufacturer/cook).
  3. Include student code of conduct (prohibiting fraudulent UTR generation, PRN impersonation, abusive behavior at collection counters).
  4. Specify canteen vendor service commitments and pickup token validity rules.

---

### 3. Cookie Consent 🍪
* **Legal Framework:** ePrivacy Directive, GDPR Art. 6, DPDP Act 2023 consent mandate.
* **Current Status in FoodLine:** App uses localStorage (oodline_token, oodline_user, oodline_cart, oodline_menu_grid_mode) and Next.js cookies without a formal consent banner.
* **Action Items:**
  1. Build a non-intrusive Cookie & Storage Consent Banner component (rontend/src/components/ui/CookieConsentBanner.tsx).
  2. Categorize storage:
     - **Strictly Necessary:** Auth token, session management, security tokens (always enabled).
     - **Functional:** Grid/list preference, canteen selection, theme preference.
     - **Analytics/Performance:** Page load telemetry, error logging (opt-in).
  3. Provide "Accept All", "Essential Only", and "Preferences" controls.

---

### 4. GDPR & DPDP Compliance
* **Legal Framework:** India DPDP Act 2023, EU GDPR Regulation (EU) 2016/679.
* **Current Status in FoodLine:** Core architecture respects data segregation, but needs formal data fiduciary tooling.
* **Action Items:**
  1. Implement **Lawful Consent Notice** in simple English with multilingual support (Hindi/Marathi/regional campus languages where appropriate).
  2. Implement Data Subject Rights (DSR) workflows:
     - Right to Access / Export Personal Data (/api/user/export-data).
     - Right to Rectify / Update Email & Phone (/api/auth/update-email).
     - Right to Nominate / Grievance Redressal mechanism.
  3. Create a **Data Processing Agreement (DPA)** template for contracted campus canteen operators.

---

### 5. Age Verification & Student Validation
* **Legal Framework:** DPDP Act Section 9 (Processing of personal data of children), Indian Contract Act 1872 Section 11 (Competence to contract).
* **Current Status in FoodLine:** PRN and college email validation implemented on signup.
* **Action Items:**
  1. Explicit age declaration on onboarding: *"By signing up, you confirm you are at least 18 years old or an enrolled college/university student"*.
  2. Institutional verification: Validate college email domain (e.g., @college.edu.in) or verify PRN against registered student roll format.
  3. Establish parental/guardian consent protocol if high school/junior college campuses (<18) are onboarded in future expansions.

---

### 6. Secure Payments & PCI-DSS
* **Legal Framework:** RBI Guidelines on Regulation of Payment Aggregators & Payment Gateways, PCI-DSS v4.0.
* **Current Status in FoodLine:** Implemented UTR submission and gateway integration; never stores card/PIN numbers.
* **Action Items:**
  1. **Zero Raw Card/PIN Storage:** Reaffirm that no raw card numbers, CVVs, expiry dates, or UPI MPINs ever touch or persist in FoodLine databases.
  2. Implement cryptographic HMAC-SHA256 signature verification for all payment gateway webhooks.
  3. Add rate limiting on UTR verification (/api/payments/verify-utr) to prevent brute-force exploitation.
  4. Display RBI-approved SSL and Payment Partner security seals on /checkout and /payment pages.

---

### 7. Data Encryption & Security Hardening
* **Legal Framework:** IT Act Section 43A (Reasonable security practices), ISO/IEC 27001 standard.
* **Current Status in FoodLine:** JWT tokens and bcrypt hashing utilized.
* **Action Items:**
  1. **In Transit:** Enforce HTTPS with TLS 1.3, HSTS (HTTP Strict Transport Security) header in 
ext.config.js.
  2. **At Rest:** Database level encryption (AES-256) for PostgreSQL databases.
  3. **Credential Hashing:** PBKDF2 / Argon2id / bcrypt with work factor >= 12 for all passwords.
  4. **Secret Management:** Eliminate hardcoded tokens; strictly use environment variables (.env.local / Secret Manager) with automated git pre-commit scanning.

---

### 8. Accessibility Standards (WCAG 2.2 / ADA)
* **Legal Framework:** Rights of Persons with Disabilities Act 2016 (India), WCAG 2.2 Level AA guidelines.
* **Current Status in FoodLine:** High-contrast Tailwind palette; semantic icons used.
* **Action Items:**
  1. Ensure keyboard navigability across entire order flow (Tab, Shift+Tab, Enter, Esc for modals like DishInspectModal).
  2. Add missing ria-label attributes on icon-only buttons (e.g., Cart toggle, Grid/List toggle, Search clear).
  3. Verify color contrast ratios (minimum 4.5:1 for standard text, 3:1 for large text and UI components).
  4. Ensure all images have descriptive lt tags and screen readers properly announce order token status changes.

---

### 9. Copyright Check & IP Protection
* **Legal Framework:** Copyright Act 1957.
* **Current Status in FoodLine:** Lucide icons and custom vector graphics used.
* **Action Items:**
  1. **Image Audit:** Verify all dish pictures used in demo/canteen menus are either:
     - Royalty-free/commercial open license (Unsplash/Pexels with documentation), OR
     - High-res photos photographed directly from the campus canteen kitchens.
  2. Add Copyright Notice to footer: *"© 2026 FoodLine Campus. All rights reserved."*
  3. Add a **DMCA / Takedown Notice Policy** for third-party menu assets uploaded by canteen staff.

---

### 10. Trademark Search & Brand Protection
* **Legal Framework:** Trade Marks Act 1999 (India).
* **Current Status in FoodLine:** Brand identity "FoodLine Campus" established.
* **Action Items:**
  1. Conduct comprehensive search on the IP India Trademark Public Search database (Class 9 for mobile/web software, Class 35 for retail/ordering services, Class 43 for food/canteen services).
  2. Reserve domain variants (oodlinecampus.com, oodlinecampus.in).
  3. Create Brand Guidelines ensuring proper trademark notation (™ / ® upon registration) and preventing unauthorized use of college crests/logos without written MoUs.

---

### 11. Clear Disclaimers
* **Legal Framework:** Consumer Protection Act 2019, FSSAI Regulations.
* **Current Status in FoodLine:** Partial disclaimer in terms.
* **Action Items:**
  1. **Food Allergen & Health Disclaimer:** Prominent notice on menu and dish inspect modal: *"Food items may contain dairy, gluten, nuts, or other allergens. Canteen kitchens are responsible for ingredient preparation."*
  2. **Preparation Time & Rush Disclaimer:** Notice stating that live wait time estimates and slot allocations are algorithmic approximations subject to real kitchen peak volumes.
  3. **Intermediary Platform Disclaimer:** Express disclaimer stating FoodLine Campus is the software platform and does not cook, package, or guarantee individual food taste.

---

### 12. Deletion Rights ("Right to Be Forgotten")
* **Legal Framework:** DPDP Act 2023 Section 12, GDPR Art. 17.
* **Current Status in FoodLine:** Account update endpoints exist; needs permanent deletion workflow.
* **Action Items:**
  1. Create "Delete My Account" button in student profile (/profile).
  2. Build /api/user/delete-account endpoint that:
     - Anonymizes past orders (removes PRN, name, email, phone from transaction logs while retaining aggregate financial tallies for tax/accounting).
     - Deletes active sessions, tokens, and profile records from the database.
  3. Provide 30-day grace period or immediate cryptographic purge confirmation email.

---

### 13. Open Source & Third-Party License Compliance
* **Legal Framework:** Open Source Initiative (OSI) compliance, intellectual property law.
* **Current Status in FoodLine:** Dependencies managed via 
pm / package.json.
* **Action Items:**
  1. Run an automated license audit (license-checker or 
px nlf) across all frontend and backend dependencies.
  2. Verify no restrictive copyleft licenses (GPLv3 / AGPL) inadvertently contaminate proprietary commercial codebases if closed-source distribution is intended.
  3. Create an "Open Source Credits & Attributions" page (/licenses or link in /terms) listing MIT, Apache 2.0, and BSD dependencies.

---

### 14. Limitation of Liability & Indemnification
* **Legal Framework:** Indian Contract Act 1872 Section 73 & 74.
* **Current Status in FoodLine:** Included in /terms section.
* **Action Items:**
  1. **Monetary Cap:** Formally limit platform financial liability to either:
     - The total amount paid by the student for the specific order giving rise to the claim, OR
     - A predefined cap (e.g., ₹1,000 INR), whichever is lesser.
  2. **Consequential Damages Exclusion:** Exclude liability for lost study time, exam delays, incidental, punitive, or consequential damages.
  3. **Vendor Indemnity Clause:** Require canteen operators to indemnify FoodLine Campus against any consumer disputes regarding food poisoning, unhygienic conditions, or FSSAI regulatory breaches.

---

### 15. Refund & Cancellation Policy
* **Legal Framework:** Consumer Protection (E-Commerce) Rules 2020.
* **Current Status in FoodLine:** Terms mention refund policy; needs dedicated policy page and deterministic state machine.
* **Action Items:**
  1. Publish dedicated /refund-policy page directly linked in checkout, orders, and footer.
  2. Define explicit, transparent refund rules:
     - **Before Kitchen Acceptance (PLACED):** 100% instant cancellation allowed.
     - **After Kitchen Acceptance (PREPARING / READY):** Cancellation not permitted as food is already being cooked.
     - **Item Out of Stock / Rejected by Canteen:** Automatic full refund initiated immediately.
     - **Uncollected Orders:** Food held until slot expiration; no refunds for non-collection.
  3. Specify refund timelines (Instant for UPI VPA reversal, or 3-5 business days depending on student's bank).

---

## Deliverables & File Mapping

| Item | Requirement | Target File / Location | Priority |
|---|---|---|---|
| **1** | Privacy Policy Page | rontend/src/app/privacy/page.tsx | **Critical** |
| **2** | Clickwrap Agreement | rontend/src/app/login/page.tsx | **Critical** |
| **3** | Cookie Consent Banner | rontend/src/components/ui/CookieBanner.tsx | **High** |
| **4** | DPDP / Data Subject Rights | rontend/src/app/api/user/export/route.ts | **Medium** |
| **5** | Age Verification Check | rontend/src/app/login/page.tsx | **Critical** |
| **6** | Payment Security Headers | rontend/src/app/checkout/page.tsx | **High** |
| **7** | Data Encryption & HSTS | rontend/next.config.ts | **High** |
| **8** | Accessibility Audit | All interactive UI components & buttons | **Medium** |
| **9** | Copyright & Asset Check | rontend/src/components/footer.tsx | **Medium** |
| **10** | Trademark Search Report | Document in docs/legal/trademark-search.md | **Medium** |
| **11** | Allergen & Rush Disclaimers | rontend/src/components/3d/DishInspectModal.tsx | **High** |
| **12** | Account Deletion Workflow | rontend/src/app/profile/page.tsx & /api/user/delete | **High** |
| **13** | License Compliance / SBOM | rontend/src/app/licenses/page.tsx | **Low** |
| **14** | Liability Limitation | Embedded in /terms & vendor contract template | **Critical** |
| **15** | Refund Policy Page | rontend/src/app/refund-policy/page.tsx | **Critical** |
