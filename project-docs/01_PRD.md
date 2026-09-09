# 📄 01 • Product Requirements Document (PRD)
**Project Name:** FoodLine Campus  
**Target Pilot Campus:** Sanjivani University, Kopargaon (Cafe @7 & 5 Campus Canteens)  
**Document Version:** 2.0 (Production Pilot)  
**Status:** Live Production MVP

---

## 1. Executive Summary & Vision

FoodLine Campus is India's first zero-queue campus dining and express pre-ordering ecosystem built specifically for the physical dynamics of higher education institutions. 

Unlike commercial delivery aggregators (Swiggy/Zomato) that rely on external motorbikes barred from campus quads and charge high delivery fees on small orders, FoodLine is a **pure B2B on-campus pickup rail**. It allows students to pre-order food from their classroom, automatically throttles orders to match physical kitchen grill capacity, validates UPI payments against bank references to stop fraud, and enables a **30-second express pickup** using secure optical QR passes and 4-digit OTPs.

---

## 2. The Campus Problem: The 15-Minute Recess Crisis

In Indian universities, thousands of students pour out of lecture halls into cramped canteens at the exact same minute during short 15-minute breaks:

| Problem Dimension | Impact on Students | Impact on Canteen Vendors |
|---|---|---|
| **Counter Bottleneck** | 20–40 minutes spent fighting in suffocating crowds. Students gulp cold food or enter lectures late. | Peak counter capacity caps out at 150 orders/break. **38% of students walk away without buying**. |
| **Payment Fraud** | Students struggle with poor 4G connectivity at the crowded cash counter. | Canteens bleed **₹4,000 to ₹6,000 every single day** to students flashing fake Google Pay/PhonePe screenshots. |
| **Kitchen Meltdowns** | Frequent stockouts (*"Samosa Khatam!"*) after 20 minutes of waiting in line. | Inability to predict demand leads to either massive food waste or sudden mid-rush stockouts. |

---

## 3. Product Goals & Success Metrics

### Primary Goals
1. **Reduce Counter Wait Time to <30 Seconds:** Students walk to the counter, flash optical QR pass, and collect packed hot food immediately.
2. **100% Free for Students:** Exact offline canteen menu prices; ₹0 delivery fee, ₹0 convenience fee, ₹0 student subscriptions, 100% ad-free.
3. **Eliminate 100% of Fake UPI Fraud:** Every order is verified against the 12-digit bank UTR reference number before preparation.
4. **Prevent Kitchen Overbooking:** Proprietary 60-order slot throttler caps incoming volume to match physical frying and assembly limits.

### Key Performance Indicators (KPIs)
- **Pilot Traction (Live at Cafe @7):** 544+ real orders processed.
- **Repeat Purchase Rate:** ≥80% within 14 days of campus onboarding.
- **Average Order Value (AOV):** ₹65.00.
- **Overbooking Rate:** 0.00% under high-concurrency burst conditions (65 concurrent requests against 60-slot cap).
- **Vendor Revenue Increase:** +35% higher throughput during the peak 11:00 AM – 1:30 PM lunch break window.

---

## 4. Target User Personas

### Persona A: The Rush-Hour Student (Rohan, 20, B.Tech 3rd Year)
- **Pain Point:** Has only 15 minutes between lectures. If he waits in the canteen queue, he gets marked absent in the next class.
- **Behavior:** Uses smartphone continuously; highly price-sensitive (will not pay ₹30 extra for delivery).
- **Needs:** Fast pre-ordering during the last 5 minutes of class, exact menu prices, guaranteed hot food waiting at the express rack.

### Persona B: The Canteen Owner (Ramesh Bhaiya, 48, Cafe @7 Head)
- **Pain Point:** Screaming crowds, cash register errors, losing ₹5k/day to fake payment screenshots, staff stress.
- **Behavior:** Non-technical; needs large, simple buttons in Hindi/Marathi.
- **Needs:** Clear visual ticket manager, guaranteed bank-verified payments, automated order pacing so his cooks aren't overwhelmed.

### Persona C: The University Administrator (Dr. Patil, Dean of Student Affairs)
- **Pain Point:** Dangerous stampedes, campus hygiene complaints, delayed lectures, disputes over canteen vendor licenses.
- **Needs:** Modernized campus prestige, zero capital expenditure, full digital hygiene, reduced student grievances.

---

## 5. Business Model & Unit Economics

FoodLine operates a pure **B2B performance monetization model**:

1. **10% – 12% Canteen Commission:** Paid by the canteen owner on incremental digital volume (₹7.80 on ₹65 AOV). The vendor happily pays this because we eliminate ₹5k/day in fake UPI fraud and increase their capacity by 2.5x.
2. **₹2,500 / Month Kitchen KDS Hardware Lease:** Covers the rugged Android tablet, thermal ticketing printer, and express heated pickup rack staging.
3. **5% – 8% Institutional Bulk Event Fee:** Fee on college fests, academic conferences, student club bulk pre-orders, and hostel mess catering.
4. **Unit Economics per Outlet:**
   - Orders per day: 600 orders/day across break shifts.
   - Monthly Net Platform Profit: **₹1,17,000 / month** per canteen.
   - Hardware Payback Period: **4.2 months**.
