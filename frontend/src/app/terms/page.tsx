'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  ShieldCheck,
  Clock,
  CreditCard,
  QrCode,
  RotateCcw,
  Utensils,
  Lock,
  AlertTriangle,
  Scale,
  Building2,
  Search,
  Printer,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Tag,
  UserCheck,
  CalendarClock,
  Leaf,
  SlidersHorizontal,
  WifiOff,
  BookOpen,
  Info,
  MapPin,
  Users,
  KeyRound,
  Bell,
  HeartHandshake,
  Landmark,
  Code2,
  Check,
  Copy,
  Layers,
  Radio,
  FileSpreadsheet,
  AlertCircle,
  CheckSquare,
  Square,
  ShieldAlert,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';

interface ClauseSection {
  id: string;
  number: string;
  category: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  summary: string;
  content: React.ReactNode;
}

export default function TermsAndConditionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSectionId, setActiveSectionId] = useState<string>('definitions');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('stockout');
  const [showPrePubModal, setShowPrePubModal] = useState<boolean>(false);

  const lastUpdated = 'September 8, 2026';
  const effectiveDate = 'September 1, 2026';
  const pilotCampus = 'Sanjivani University, Kopargaon (Pilot Partner: Cafe @7)';
  const merchantVpa = '9960091371@slc';

  // Check URL hash on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      setActiveSectionId(hashId);
      const el = document.getElementById(hashId);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      }
    }
  }, []);

  const handleCopyLink = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/terms#${sectionId}`;
      navigator.clipboard.writeText(url);
      setCopiedId(sectionId);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const categories = [
    { id: 'all', label: 'All 25 Clauses', count: 25 },
    { id: 'governance', label: '🏛️ Governance & Scope', count: 4 },
    { id: 'ordering', label: '🍱 Ordering, Slots & UPI', count: 4 },
    { id: 'refunds', label: '🔄 Refunds, Safety & Conduct', count: 3 },
    { id: 'staff', label: '👨‍🍳 Staff, KDS & Partner', count: 2 },
    { id: 'privacy', label: '🛡️ DPDP Act 2023 & Alerts', count: 2 },
    { id: 'campus', label: '🏫 Multi-Campus & IP', count: 4 },
    { id: 'legal', label: '⚖️ Disputes & Grievance', count: 6 },
  ];

  const scenarioLookup: Record<
    string,
    { title: string; trigger: string; remedy: string; sla: string; badge: string }
  > = {
    stockout: {
      title: 'Kitchen Stockout / Dish Runs Out',
      trigger: 'Ordered dish cannot be cooked due to sudden raw ingredient depletion.',
      remedy: 'Instant Direct UPI Refund to originating VPA or equivalent chef substitution.',
      sla: 'Within 15 Minutes Direct UPI Refund',
      badge: '100% Refund Guarantee',
    },
    delay: {
      title: 'Kitchen Handover Delay (> 3 Mins Past Slot)',
      trigger: 'Student arrives within slot window but kitchen batch is still cooking.',
      remedy: 'Priority express pass handover + complimentary hot beverage voucher for next break.',
      sla: 'Priority Release in < 2 Mins',
      badge: 'Freshness SLA',
    },
    lecture: {
      title: 'Lecture / Lab Overtime Extension',
      trigger: 'Professor or practical session extends past the 11:50 AM break slot window.',
      remedy: 'Automatic 15-minute slot rollover to 2:30 PM without forfeiture or penalty.',
      sla: 'Instant Counter Rollover',
      badge: 'Academic Flexibility',
    },
    utr_mismatch: {
      title: 'Bank App Lag / Delayed UTR Generation',
      trigger: 'Bank app debits student account but takes 5 minutes to generate 12-digit UTR.',
      remedy: 'Show official bank debit SMS with timestamp to counter lead for manual verification.',
      sla: 'Manual Clearance in < 1 Min',
      badge: 'Offline Fallback',
    },
    network_drop: {
      title: 'Campus Wi-Fi / Cellular Network Drop',
      trigger: 'Campus network fails right after completing payment before order page loads.',
      remedy: 'Offline KDS ledger checks your PRN and released tray against soundbox statement.',
      sla: 'Instant Offline Verification',
      badge: 'Zero Network Barrier',
    },
  };

  const statutoryReferences = [
    {
      regulation: 'Digital Personal Data Protection (DPDP) Act 2023',
      clauseRef: 'Sections 6, 12 & 14',
      scope: 'Data minimization (PRN/UTR only), 24h terminal cleanup, zero third-party sale, and statutory Right to Erasure.',
    },
    {
      regulation: 'Information Technology Act 2000',
      clauseRef: 'Section 66D',
      scope: 'Strict legal prohibition of counterfeit/fake UTR submissions, electronic impersonation, and bot abuse.',
    },
    {
      regulation: 'Food Safety & Standards Act 2006 (FSSAI)',
      clauseRef: 'Schedule 4 Part II',
      scope: 'Cafe @7 License #11522036000142, >65°C thermal holding, and 100% pure vegetarian kitchen sanitation.',
    },
    {
      regulation: 'RBI Payment Aggregator Framework 2020',
      clauseRef: 'DPSS.CO.PD Circular',
      scope: 'Option C Direct Merchant Settlement. 100% funds settle direct to merchant VPA; zero escrow fund custody.',
    },
    {
      regulation: 'Consumer Protection (E-Commerce) Rules 2020',
      clauseRef: 'Rules 4, 5 & 6',
      scope: 'Transparent all-inclusive price display, 15-minute stockout refund SLA, and nodal grievance officer.',
    },
    {
      regulation: 'UGC Student Grievance Redressal Regulations 2023',
      clauseRef: 'Regulation 5',
      scope: 'Statutory 3-tier campus escalation hierarchy via Cafe @7 Lead, Grievance Officer, and Dean of Student Welfare.',
    },
  ];

  const faqs = [
    {
      q: 'What happens if my money is debited via UPI but the 7-minute reservation timer runs out?',
      a: 'If your payment was completed but you submitted the UTR after the 7-minute countdown expired, our backend automatically detects the verified UTR. If the slot has remaining capacity, your order is confirmed immediately; if the slot reached full 60-order capacity in the interim, an automated 100% refund is initiated to your bank account within 15 minutes.',
    },
    {
      q: 'Can a roommate or classmate pick up my meal on my behalf?',
      a: 'Yes. Simply share your 4-digit pickup OTP or optical QR pass screenshot with your peer. Cafe @7 staff will release the tray once the OTP is validated on the Kitchen KDS terminal.',
    },
    {
      q: 'Why is there no in-room hostel or classroom delivery option?',
      a: 'FoodLine is strictly designed as an Express Pickup system to eliminate third-party delivery fees, protect campus security, and prevent academic lecture interruptions.',
    },
    {
      q: 'How do bulk or departmental group orders (> 10 items) work?',
      a: 'Orders with more than 10 total items must be pre-ordered at least 2 hours in advance to allow kitchen staff to schedule ingredient prep without depleting slot capacity for individual peers.',
    },
    {
      q: 'How long will my meal stay warm if I arrive late to Cafe @7?',
      a: 'Prepared meals are placed in insulated thermal heating lanes (> 65°C) and held for exactly 20 minutes past the scheduled break window. If unclaimed after 20 minutes, meals must be safely disposed of per FSSAI hygiene codes without refund.',
    },
    {
      q: 'Are there any hidden packaging or platform convenience charges?',
      a: 'No. FoodLine operates on a strict 0% Student Surcharge Guarantee. The price you pay on UPI is 100% identical to the chalkboard prices listed at Cafe @7.',
    },
    {
      q: 'What should I do if a dish has an allergen or I need Jain preparation (no onion/garlic)?',
      a: 'Add your dietary note in the "Custom Notes" field during checkout. For severe life-threatening allergies, we advise speaking directly with the counter chef before placing your batch pre-order.',
    },
    {
      q: 'How do I escalate an unresolved dispute or payment mismatch?',
      a: 'Follow our 3-Tier Grievance Matrix: First speak with the Cafe @7 Counter Lead (< 2 mins). If unresolved, email grievance@foodline.campus (< 48 hours). For institutional policy issues, contact the Sanjivani University Dean of Student Welfare (< 24 hours).',
    },
  ];

  const prePubChecklist = [
    { title: 'Operating Legal Entity Name & Registered Address', status: 'Pending Formal Corporate Incorporation (Ahmednagar/Kopargaon)', done: false },
    { title: 'Seller of Record Designation', status: 'Cafe @7 is the Seller of Record for Food/FSSAI Compliance; FoodLine is Technology Rail', done: true },
    { title: 'Payment Architecture (Manual UTR vs Gateway)', status: 'Option C Direct UPI with Bank UTR Replay Shield active; Gateway fallback clause included', done: true },
    { title: 'DPDP Act 2023 Data Protection Consultant Review', status: 'Data minimization, 24h terminal cleanup, and user right to erasure designed into architecture', done: true },
    { title: 'Minimum Age Policy (16+ Campus Population)', status: 'Verified aligned with university undergraduate and diploma student age guidelines', done: true },
    { title: 'Designated Statutory Grievance Officer', status: 'Designation placeholder established with 48h acknowledgment and 15-day resolution SLA', done: false },
    { title: 'Cafeteria Partner Counter-Signature', status: 'Partner operational obligations codified in Schedule 1 of institutional Cafe @7 MoU', done: true },
    { title: 'Bilingual Localization (Marathi & Hindi)', status: 'English master text authored; Marathi and Hindi translations scheduled for pilot staging', done: false },
  ];

  const clauses: ClauseSection[] = useMemo(
    () => [
      // 1. DEFINITIONS
      {
        id: 'definitions',
        number: '01',
        category: 'governance',
        title: 'Definitions & Legal Interpretations',
        icon: <BookOpen className="text-(--accent-orange)" size={20} />,
        badge: 'Statutory Taxonomy',
        summary:
          'Defines key domain entities: Platform, User, Cafeteria Partner, Staff User, Order, Pickup Slot, UTR, Pickup OTP, and Personal Data.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>For the purpose of these Terms &amp; Conditions (&quot;Terms&quot;), the following capitalized terms shall have the specific meanings assigned to them below:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-white uppercase text-xs tracking-wider">Platform / Service</span>
                <p className="text-xs text-zinc-400">The FoodLine Campus web application, Android/iOS PWA, and server APIs facilitating food pre-ordering, slot metering, and express counter coordination.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-white uppercase text-xs tracking-wider">User / Student</span>
                <p className="text-xs text-zinc-400">Any enrolled student, faculty member, administrative staff, or authorized campus guest holding an active PRN or campus credential who places an Order.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-white uppercase text-xs tracking-wider">Cafeteria Partner</span>
                <p className="text-xs text-zinc-400">The on-campus food enterprise (specifically Cafe @7 at Sanjivani University) solely responsible for preparing, packaging, and fulfilling food orders.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-white uppercase text-xs tracking-wider">Staff User</span>
                <p className="text-xs text-zinc-400">An authorized kitchen lead, cashier, or cafeteria worker operating the Kitchen Display System (KDS) for inventory toggling, UTR reconciliation, and OTP validation.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-white uppercase text-xs tracking-wider">Pickup Slot</span>
                <p className="text-xs text-zinc-400">A defined campus recess time-window (e.g. 11:50 AM–12:10 PM) capped at 60 orders max capacity during which pre-ordered food must be collected.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-white uppercase text-xs tracking-wider">12-Digit Bank UTR</span>
                <p className="text-xs text-zinc-400">The unique 12-digit numeric UPI Transaction Reference Number generated by your banking application (Google Pay, PhonePe, Paytm, BHIM, CRED) as proof of payment.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-white uppercase text-xs tracking-wider">Pickup OTP &amp; QR Pass</span>
                <p className="text-xs text-zinc-400">The 4-digit verification code and dynamic optical QR pass generated per order, presented at Counter #2 for identity confirmation before tray release.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-bold text-white uppercase text-xs tracking-wider">Personal Data (DPDP Act)</span>
                <p className="text-xs text-zinc-400">Has the meaning given under the Digital Personal Data Protection Act, 2023, restricted to student name, phone number, PRN, email, and transaction references.</p>
              </div>
            </div>
          </div>
        ),
      },

      // 2. ACCEPTANCE OF TERMS
      {
        id: 'acceptance',
        number: '02',
        category: 'governance',
        title: 'Acceptance of Terms & Tripartite Binding Effect',
        icon: <Building2 className="text-(--accent-amber)" size={20} />,
        badge: 'Tripartite MoU',
        summary:
          'Legally binding tripartite agreement governing student, faculty, cafeteria staff, and platform operations.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              2.1. By accessing, browsing, creating an account on, or placing a transaction through the <strong>FoodLine Campus Platform</strong>, the User unconditionally agrees to be bound by these Terms, the Privacy Policy, and any campus-specific dining policies displayed at checkout.
            </p>
            <p>
              2.2. FoodLine operates as an authorized digital pre-ordering partner under an institutional Memorandum of Understanding (MoU) executed between <strong>Sanjivani University Administration</strong>, the <strong>Student Welfare Committee</strong>, and <strong>Cafe @7 Cafeteria Management</strong>. If you do not agree with any provision of these Terms, you must discontinue using the Platform immediately.
            </p>
            <p>
              2.3. These Terms apply to all Users, Staff Users, and Cafeteria Partners, with specialized operational and fiduciary duties set forth in Sections 12 and 13.
            </p>
            <p>
              2.4. Continued use of the Platform after any published revision constitutes full legal acceptance of the updated Terms (see Section 23).
            </p>
          </div>
        ),
      },

      // 3. ELIGIBILITY & REGISTRATION
      {
        id: 'eligibility',
        number: '03',
        category: 'governance',
        title: 'Eligibility, Age Limits & Account Registration',
        icon: <UserCheck className="text-(--accent-teal)" size={20} />,
        badge: '16+ Campus Scope',
        summary:
          'Requirements for campus student PRN, institutional Google SSO, age thresholds, and credential protection.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              3.1. <strong>Age Threshold:</strong> The Platform is intended for individuals affiliated with a partnered campus who are at least 16 years of age. Where a User is a minor under Indian law, use must occur with parental or legal guardian consent or as authorized by university admission policies.
            </p>
            <p>
              3.2. <strong>Account Information:</strong> Account creation requires accurate, verifiable credentials including: full name, verified mobile phone number, student PRN (Permanent Registration Number), and institutional email address (e.g. <code>@sanjivani.edu.in</code>).
            </p>
            <p>
              3.3. <strong>Credential Secrecy:</strong> Users are solely responsible for maintaining the confidentiality of their session tokens, passwords, and 4-digit pickup OTPs. Any transaction originating from an authenticated student session is legally presumed authorized by that student.
            </p>
            <p>
              3.4. <strong>Anti-Impersonation:</strong> Attempting to register or order using another peer&apos;s PRN or student credentials constitutes electronic misrepresentation under Section 66D of the IT Act 2000 and will be referred to the Sanjivani University Disciplinary Council.
            </p>
            <p>
              3.5. FoodLine reserves the right to refuse service or terminate accounts that supply forged registration data or violate institutional codes of conduct.
            </p>
          </div>
        ),
      },

      // 4. NATURE OF SERVICE
      {
        id: 'nature-of-service',
        number: '04',
        category: 'governance',
        title: 'Nature of the Service (Technology Platform vs. Food Provider)',
        icon: <Layers className="text-[#8B5CF6]" size={20} />,
        badge: 'Technology Rail',
        summary:
          'FoodLine is a technology coordinator and slot-metering rail. Cafe @7 is solely responsible for food preparation and FSSAI compliance.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#8B5CF6]" />
                Sole Food Preparation Responsibility
              </div>
              <p className="text-xs text-zinc-300">
                4.1. FoodLine is an independent <strong>technology platform</strong> that enables slot-metered pre-ordering. FoodLine does <strong>not</strong> prepare, cook, package, or sell food.
              </p>
              <p className="text-xs text-zinc-300">
                4.2. <strong>Cafe @7</strong> (the Cafeteria Partner) is solely responsible for kitchen hygiene, food temperature, raw ingredient sourcing, culinary fulfillment, and statutory compliance with the Food Safety and Standards Act, 2006 (FSSAI).
              </p>
            </div>
            <p>
              4.3. FoodLine&apos;s scope is strictly limited to: presenting the live menu as supplied by the Cafeteria Partner, managing 60-order slot throttling capacity, verifying 12-digit UTR payment references, and streaming real-time status updates via Server-Sent Events (SSE).
            </p>
            <p>
              4.4. Nothing in these Terms creates an employer-employee, agency, partnership, or joint venture relationship between FoodLine and Cafe @7.
            </p>
          </div>
        ),
      },

      // 5. ORDERING & PRICING
      {
        id: 'ordering-pricing',
        number: '05',
        category: 'ordering',
        title: 'Ordering, Menu Pricing & Real-Time Availability',
        icon: <Tag className="text-[#FF8A3D]" size={20} />,
        badge: '0% Surcharge Parity',
        summary:
          'Strict zero-markup pricing matching counter chalkboard rates. Real-time stockout handling and order acceptance.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              5.1. <strong>Zero-Surge Guarantee:</strong> All menu item prices displayed on the Platform are inclusive of applicable taxes and 100% identical to the physical chalkboard rates at Cafe @7. FoodLine levies ₹0 platform fees, ₹0 convenience fees, and 0% surge charges.
            </p>
            <p>
              5.2. <strong>Real-Time Stockout Depletion:</strong> If an ordered dish becomes unavailable before checkout is completed, the platform alerts the user immediately and automatically re-balances the cart total.
            </p>
            <p>
              5.3. <strong>Pricing Corrections:</strong> If an inadvertent pricing error occurs prior to preparation, the student will be notified and provided the option to accept the corrected price or receive a 100% immediate UPI refund.
            </p>
            <p>
              5.4. <strong>Order Acceptance Threshold:</strong> An order is deemed accepted by Cafe @7 only upon successfully transitioning to <code>CONFIRMED</code> or <code>PREPARING</code> status. Payment submission alone does not guarantee ingredient stock availability.
            </p>
            <p>
              5.5. <strong>Dietary Badges:</strong> Vegetarian, Jain, and allergen indicators are provided in good faith based on Cafeteria Partner declarations. Patrons with severe medical allergies must confirm directly with kitchen chefs (see Section 10).
            </p>
          </div>
        ),
      },

      // 6. PICKUP SLOTS & 60-ORDER CAP
      {
        id: 'pickup-slots',
        number: '06',
        category: 'ordering',
        title: 'Pickup Slots & 60-Order Capacity Throttling',
        icon: <Clock className="text-[#F59E0B]" size={20} />,
        badge: 'Kitchen Rush SLA',
        summary:
          '15-minute express pickup windows capped at 60 orders per slot to eliminate physical queues and preserve food heat.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              6.1. To prevent crowding and guarantee sub-45-second counter pickups, FoodLine meters break periods into <strong>60-Order Hard-Capped Slots</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FF8A3D]/10 border border-[#FF8A3D]/25">
                <div className="text-[#FF8A3D] font-black text-xs uppercase tracking-wider mb-1">
                  11:50 AM — 12:10 PM Slot (Morning Recess)
                </div>
                <div className="text-xs text-zinc-300">
                  Morning Break Rush • Capped strictly at 60 Orders • Pre-orders lock 10 minutes prior to batch start.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/25">
                <div className="text-[#00D4AA] font-black text-xs uppercase tracking-wider mb-1">
                  02:30 PM — 02:50 PM Slot (Afternoon Break)
                </div>
                <div className="text-xs text-zinc-300">
                  Afternoon Break Rush • Capped strictly at 60 Orders • Synchronized kitchen batch cooking.
                </div>
              </div>
            </div>
            <p>
              6.2. <strong>7-Minute Reservation Hold:</strong> When checkout initiates, your slot capacity is held for <strong>7 minutes</strong>. If UTR submission is not completed within this hold, the slot releases back to the student pool automatically.
            </p>
            <p>
              6.3. <strong>Collection Responsibility:</strong> Students are required to arrive at Cafe @7 Counter #2 within their booked slot window. Orders unclaimed after the slot window enter the 20-minute thermal grace holding protocol (Section 9.2).
            </p>
            <p>
              6.4. Slot timings and capacity limits may be recalibrated dynamically to align with university exam timetables, symposiums, or academic calendar shifts.
            </p>
          </div>
        ),
      },

      // 7. PAYMENTS & UTR VERIFICATION
      {
        id: 'payments-utr',
        number: '07',
        category: 'ordering',
        title: 'Payments (Option C Direct UPI & 12-Digit Bank UTR Verification)',
        icon: <CreditCard className="text-[#00D4AA]" size={20} />,
        badge: 'RBI Option C Model',
        summary:
          'Direct peer-to-merchant UPI transfer to Cafe @7 VPA (9960091371@slc). Cryptographic anti-replay UTR verification and fraud shields.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Direct Merchant Settlement VPA</span>
                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 font-bold">
                  {merchantVpa}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                7.1. 100% of order funds flow directly from your banking application to Cafe @7 proprietor under the <strong>Option C Direct Merchant Settlement Architecture</strong> (RBI Payment Aggregator Framework). FoodLine holds zero escrow funds.
              </p>
            </div>
            <p>
              7.2. <strong>Reference Verification Protocol:</strong> Students scan the dynamic QR, transfer the exact bill amount, and submit the authentic 12-digit UTR generated by their banking app. Our backend validates UTR regex format and checks uniqueness to prevent duplicate claims.
            </p>
            <p>
              7.3. <strong>Anti-Replay &amp; Fraud Shield:</strong> Entering arbitrary, altered, expired, or recycled UTR numbers constitutes criminal electronic deception under Section 66D of the IT Act 2000. Forged submissions trigger immediate order cancellation, PRN blacklisting, and referral to university authorities.
            </p>
            <p>
              7.4. <strong>Pending Manual Review:</strong> If an entered UTR exhibits a bank latency delay or amount mismatch, the order transitions to <code>PENDING_MANUAL_REVIEW</code>. Counter leads verify the transaction against the physical soundbox announcement or statement before tray release.
            </p>
            <p>
              7.5. <strong>Future Gateway Clause:</strong> FoodLine reserves the right to introduce automated UPI Intent/Collect payment gateway rails, which will supersede manual UTR entry while maintaining zero student fees.
            </p>
            <p>
              7.6. Users must retain their bank debit SMS or UPI transaction screenshot until their meal is collected.
            </p>
          </div>
        ),
      },

      // 8. ORDER STATUS & PICKUP OTP
      {
        id: 'status-otp',
        number: '08',
        category: 'ordering',
        title: 'Order Status Tracking, 4-Digit Pickup OTP & Handover',
        icon: <QrCode className="text-[#38BDF8]" size={20} />,
        badge: 'Sub-45s Pickup Handover',
        summary:
          'Real-time Server-Sent Events status progression, 4-digit numeric OTP, optical QR pass, and peer proxy delegation.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              8.1. <strong>Live SSE Telemetry:</strong> Order progress transitions in real time across 5 defined operational milestones: <code>PLACED</code> &rarr; <code>PENDING_MANUAL_REVIEW</code> &rarr; <code>PREPARING</code> &rarr; <code>READY</code> &rarr; <code>COLLECTED</code>.
            </p>
            <p>
              8.2. <strong>Pickup Verification Credentials:</strong> Every confirmed order generates a unique <strong>4-digit numeric OTP</strong> and an optical QR pass. Present either to cafeteria staff at Counter #2 for validation on the Kitchen KDS tablet.
            </p>
            <p>
              8.3. <strong>Peer Proxy Delegation:</strong> If detained in an exam, lab practical, or lecture, students may delegate pickup to a trusted peer by sharing the 4-digit OTP. The platform and cafeteria are not liable for food collected by unauthorized individuals who obtained the OTP through student negligence.
            </p>
            <p>
              8.4. <strong>Finality of Fulfillment:</strong> Once validated on the KDS and transitioned to <code>COLLECTED</code>, the order is deemed conclusively fulfilled and cannot be cancelled, re-ordered, or refunded under the same token.
            </p>
          </div>
        ),
      },

      // 9. CANCELLATIONS, NO-SHOWS & REFUNDS
      {
        id: 'refunds-cancellations',
        number: '09',
        category: 'refunds',
        title: 'Cancellations, No-Shows & 15-Minute Refund SLA',
        icon: <RotateCcw className="text-[#6366F1]" size={20} />,
        badge: '100% Refund Guarantee',
        summary:
          'Full refunds on pre-cooking cancellation or kitchen stockouts within 15 minutes. 20-minute thermal holding grace period.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-0.5 rounded shrink-0">
                  User Cancel
                </span>
                <div className="text-xs text-zinc-300">
                  9.1. Orders may be cancelled with a 100% full refund at any time before the status transitions to <code>PREPARING</code>. Once active kitchen cooking starts, ingredients are committed and cancellations cannot be accepted.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded shrink-0">
                  No-Show SLA
                </span>
                <div className="text-xs text-zinc-300">
                  9.2. Orders are held in insulated thermal heating lanes (&gt;65°C) for a <strong>20-minute grace period</strong> past the slot window. Perishable food unclaimed after 20 minutes is safely discarded per FSSAI hygiene codes without refund.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded shrink-0">
                  Kitchen Stockout
                </span>
                <div className="text-xs text-zinc-300">
                  9.3. If Cafe @7 cannot fulfill an order due to ingredient depletion or emergency kitchen closure, an automated 100% Direct UPI Refund is executed within <strong>15 minutes</strong> to the originating VPA.
                </div>
              </div>
            </div>
            <p>
              9.4. <strong>Refund Routing:</strong> All refunds are routed directly back to the original UPI bank account used to pay. FoodLine maintains zero proprietary wallets or store credits.
            </p>
            <p>
              9.5. <strong>Dispute Window:</strong> Any payment discrepancy or refund dispute must be submitted within <strong>7 days</strong> of order date via <code>grievance@foodline.campus</code> accompanied by bank debit proof.
            </p>
          </div>
        ),
      },

      // 10. FOOD SAFETY, ALLERGENS & FSSAI
      {
        id: 'food-safety',
        number: '10',
        category: 'refunds',
        title: 'Food Safety, Allergens & FSSAI Disclosures',
        icon: <Utensils className="text-[#10B981]" size={20} />,
        badge: 'FSSAI Lic #11522036000142',
        summary:
          '100% Pure Vegetarian kitchen certification, Schedule 4 FSSAI sanitation standards, and student allergen obligations.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              10.1. <strong>Statutory FSSAI Registration:</strong> Cafe @7 operates under active Food Safety &amp; Standards Authority of India (FSSAI) License #11522036000142, adhering strictly to Schedule 4 Part II sanitation requirements.
            </p>
            <p>
              10.2. <strong>100% Pure Vegetarian Kitchen:</strong> Cafe @7 maintains strict culinary segregation with zero animal fats, gelatin, or non-vegetarian ingredients present on cafeteria premises.
            </p>
            <p>
              10.3. <strong>Allergen Notice:</strong> Kitchen operations utilize common food preparations that may contain gluten (wheat), dairy (milk, paneer, butter), peanuts, tree nuts, and mustard seeds. Cross-contact risks in high-volume rush periods cannot be guaranteed zero.
            </p>
            <p>
              10.4. FoodLine disclaims liability for adverse allergic reactions or culinary preparation claims, except where caused by FoodLine&apos;s own willful misrepresentation of partner-supplied dietary data.
            </p>
          </div>
        ),
      },

      // 11. USER CONDUCT & PROHIBITED USES
      {
        id: 'user-conduct',
        number: '11',
        category: 'refunds',
        title: 'User Conduct & Prohibited Platform Exploitations',
        icon: <AlertTriangle className="text-[#EF4444]" size={20} />,
        badge: 'Disciplinary Code',
        summary:
          'Prohibitions on fake UTR submissions, bot scalping, PRN impersonation, SQL injection, and counter staff harassment.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>All patrons agree strictly to refrain from the following prohibited activities:</p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li><strong>11.1. Payment Fraud:</strong> Submitting fake, altered, forged, or recycled 12-digit UTR numbers as payment proof.</li>
              <li><strong>11.2. Bot Automation:</strong> Utilizing automated scripts, crawlers, or headless browsers to scalp slot capacity.</li>
              <li><strong>11.3. Identity Misrepresentation:</strong> Ordering under another student&apos;s PRN or utilizing unauthorized session links.</li>
              <li><strong>11.4. Security Tampering:</strong> Attempting SQL injection, Cross-Site Scripting (XSS), prototype pollution, or payload tampering in order notes.</li>
              <li><strong>11.5. Staff Harassment:</strong> Engaging in verbal abuse, intimidation, or disorderly conduct towards cafeteria workers at Counter #2.</li>
              <li><strong>11.6. Commercial Resale:</strong> Reselling meals acquired via FoodLine for third-party commercial markup.</li>
              <li><strong>11.7. Institutional Violations:</strong> Utilizing the platform to breach Sanjivani University student bylaws.</li>
            </ul>
            <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/25 text-xs text-zinc-300">
              Violations trigger immediate account termination, forfeiture of pending orders, and formal reporting to the Sanjivani University Proctorial Board.
            </div>
          </div>
        ),
      },

      // 12. STAFF / KDS USERS
      {
        id: 'staff-kds',
        number: '12',
        category: 'staff',
        title: 'Staff & Kitchen Display System (KDS) Operational Governance',
        icon: <SlidersHorizontal className="text-[#3B82F6]" size={20} />,
        badge: 'KDS Touch Tablet SLA',
        summary:
          'Operational standards for cafeteria staff using the KDS tablet. Prohibition on premature status updates and OTP leaks.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              12.1. <strong>Authorized Operational Use:</strong> Access to the Kitchen Display System (KDS) and Staff Admin Dashboard is restricted to certified Cafe @7 personnel for live order queuing, stockout toggles, and payment verification.
            </p>
            <p>
              12.2. <strong>Integrity of Status Progression:</strong> Staff Users must never transition an order to <code>READY</code> or <code>COLLECTED</code> without physically cooking the food and validating the customer&apos;s 4-digit OTP on the KDS terminal.
            </p>
            <p>
              12.3. <strong>OTP &amp; Data Protection:</strong> Staff Users must not disclose student pickup codes or order histories to unauthorized third parties and must operate under isolated cafeteria credentials.
            </p>
            <p>
              12.4. Misuse of administrative KDS privileges will result in immediate credential revocation and reporting to cafeteria enterprise management.
            </p>
          </div>
        ),
      },

      // 13. CAFETARIA PARTNER OBLIGATIONS
      {
        id: 'partner-obligations',
        number: '13',
        category: 'staff',
        title: 'Cafeteria Partner & Enterprise Management Obligations',
        icon: <Building2 className="text-[#10B981]" size={20} />,
        badge: 'Partner Service SLA',
        summary:
          'Partner duties: real-time stockout toggles, maintaining active FSSAI licensing, and strict protection of student contact data.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              13.1. <strong>Menu Accuracy:</strong> Cafe @7 is obligated to maintain accurate dish pricing, portion descriptions, and instantaneous 1-tap stockout toggling when ingredients run out.
            </p>
            <p>
              13.2. <strong>Regulatory Licensing:</strong> The Cafeteria Partner warrants continuous maintenance of active FSSAI registration, municipal health clearances, and statutory labor law compliances.
            </p>
            <p>
              13.3. <strong>Fulfillment SLA:</strong> Cafe @7 warrants timely staging of meals in express thermal holding racks matching the 60-order slot schedule.
            </p>
            <p>
              13.4. <strong>Student Data Confidentiality:</strong> The Cafeteria Partner is strictly prohibited from exporting, sharing, or monetizing student phone numbers or PRNs for promotional campaigns outside of order fulfillment.
            </p>
          </div>
        ),
      },

      // 14. DATA PRIVACY & DPDP ACT 2023
      {
        id: 'privacy-dpdp',
        number: '14',
        category: 'privacy',
        title: 'Data Collection, Privacy & DPDP Act 2023 Compliance',
        icon: <Lock className="text-[#00D4AA]" size={20} />,
        badge: 'DPDP Act 2023 Compliant',
        summary:
          'Strict data minimization, 24-hour terminal cleanup, zero third-party monetization, and statutory Right to Erasure.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              14.1. <strong>Data Minimization:</strong> FoodLine collects only strictly necessary operational data: student full name, PRN, mobile phone number, institutional email, and 12-digit payment reference. We store zero credit card numbers or UPI MPINs.
            </p>
            <p>
              14.2. <strong>Statutory Processing Law:</strong> Data is handled in rigorous compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
            </p>
            <p>
              14.3. <strong>Purpose Limitation:</strong> Personal data is processed exclusively for order fulfillment, pickup notifications, payment verification, and fraud prevention. Zero student data is ever sold or shared with commercial advertising brokers.
            </p>
            <p>
              14.4. <strong>24-Hour Terminal Data Cleanup:</strong> In accordance with DPDP Act minimization standards, completed operational order records are pruned after 24 hours, retaining only encrypted accounting ledger entries required by tax and audit statutes.
            </p>
            <p>
              14.5. <strong>Authorized Infrastructure Processors:</strong> Limited encrypted data is processed via secure infrastructure partners: Supabase PostgreSQL (encrypted database hosting), WhatsApp Business/Meta (pickup notifications), SMS gateways, and Google Sheets (partner audit ledger).
            </p>
            <p>
              14.6. <strong>Statutory Student Rights:</strong> Under the DPDP Act, students retain full rights to: (a) Access personal data held, (b) Correct inaccuracies, (c) Request complete account erasure upon graduation, and (d) Nominate a representative. Contact the Grievance Officer in Section 24 to exercise these rights.
            </p>
            <p>
              14.7. <strong>Data Breach Protocols:</strong> In the unlikely event of a security incident, FoodLine will notify affected users and the Data Protection Board of India within statutory notification timelines.
            </p>
          </div>
        ),
      },

      // 15. NOTIFICATIONS CONSENT
      {
        id: 'notifications-consent',
        number: '15',
        category: 'privacy',
        title: 'Transactional Notifications (WhatsApp, SMS & Push) Consent',
        icon: <Bell className="text-[#EC4899]" size={20} />,
        badge: 'Real-Time Telemetry Alerts',
        summary:
          'Explicit consent for essential order status alerts, OTP delivery, and payment receipts via WhatsApp Business and SMS.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              15.1. By providing your mobile number, you give explicit consent to receive essential transactional communications including: <em>&quot;Order Confirmed&quot;</em>, <em>&quot;Batch Ready for Pickup at Counter #2&quot;</em>, 4-digit pickup OTPs, and payment reconciliation updates.
            </p>
            <p>
              15.2. <strong>Pure Transactional Scope:</strong> These notifications are purely transactional and critical to service delivery. Users cannot opt out of operational order alerts while maintaining active orders.
            </p>
            <p>
              15.3. Standard carrier message and data rates may apply to cellular SMS fallbacks during campus Wi-Fi interruptions.
            </p>
          </div>
        ),
      },

      // 16. INTELLECTUAL PROPERTY
      {
        id: 'intellectual-property',
        number: '16',
        category: 'campus',
        title: 'Intellectual Property Rights & Anti-Scraping Covenants',
        icon: <Code2 className="text-[#6366F1]" size={20} />,
        badge: 'Proprietary IP',
        summary:
          'Protection of FoodLine software, algorithms, trademarks, and partner culinary assets. Prohibition of scrapers.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              16.1. The FoodLine Campus trademarks, brand assets, software architecture, slot-throttling algorithms, and user interface designs are the exclusive intellectual property of FoodLine (and its licensors).
            </p>
            <p>
              16.2. Menu dish names, descriptions, and culinary photography provided by Cafe @7 remain the proprietary IP of the respective enterprise partner.
            </p>
            <p>
              16.3. Users are strictly prohibited from copying, decompiling, reverse engineering, scraping, or creating derivative works of the Platform or its APIs without express written authorization.
            </p>
          </div>
        ),
      },

      // 17. MULTI-CAMPUS & MULTI-TENANT
      {
        id: 'multi-campus',
        number: '17',
        category: 'campus',
        title: 'Multi-Campus & Multi-Tenant Operational Scoping',
        icon: <MapPin className="text-[#38BDF8]" size={20} />,
        badge: 'Multi-Tenant Isolation',
        summary:
          'Uniform platform rules across campuses with localized partner menus, slot rules, and isolated role permissions.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              17.1. <strong>Uniform Governance:</strong> Where FoodLine operates across multiple university campuses, these Master Terms apply uniformly, supplemented by local campus addenda published in the <code>/select-campus</code> portal.
            </p>
            <p>
              17.2. <strong>Role Scoping &amp; Tenant Isolation:</strong> Kitchen staff, managerial roles, and audit telemetry are strictly isolated to their authorized campus and cafeteria outlet. Staff at Cafe @7 hold zero access to other university dining rails.
            </p>
            <p>
              17.3. Pricing, slot duration, and menu selections are determined locally by each campus dining establishment and clearly displayed at checkout.
            </p>
          </div>
        ),
      },

      // 18. DISCLAIMERS & LIABILITY
      {
        id: 'liability-disclaimers',
        number: '18',
        category: 'campus',
        title: 'Disclaimers & Statutory Limitation of Liability',
        icon: <Scale className="text-[#F59E0B]" size={20} />,
        badge: 'Order Value Cap',
        summary:
          'Platform provided "as-is". Total liability strictly capped at the individual order transaction amount.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              18.1. <strong>As-Is Warranty:</strong> The Platform is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of uninterrupted uptime or error-free network conditions.
            </p>
            <p>
              18.2. <strong>Liability Ceiling:</strong> To the maximum extent permitted under Indian law, FoodLine&apos;s total aggregate liability for any claim arising out of a transaction is strictly limited to the <strong>total monetary value paid by the student for the specific order</strong> giving rise to the dispute.
            </p>
            <p>
              18.3. <strong>Excluded Liabilities:</strong> FoodLine disclaims liability for: (a) Food preparation, temperature, or hygiene (sole responsibility of Cafe @7 under Section 4.2), (b) Meal loss due to shared OTPs, (c) Bank network or UPI server delays, and (d) Indirect or consequential damages.
            </p>
            <p>
              18.4. Nothing in these Terms limits consumer rights that cannot be excluded under the Consumer Protection Act, 2019 or Consumer Protection (E-Commerce) Rules, 2020.
            </p>
          </div>
        ),
      },

      // 19. INDEMNIFICATION
      {
        id: 'indemnification',
        number: '19',
        category: 'campus',
        title: 'Indemnification & Legal Hold-Harmless Covenants',
        icon: <ShieldAlert className="text-[#EF4444]" size={20} />,
        badge: 'Fraud Indemnity',
        summary:
          'User agreement to indemnify FoodLine and Cafe @7 against damages arising from fraudulent UTRs or unlawful conduct.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Users agree to indemnify, defend, and hold harmless FoodLine, its founders, university coordinators, and Cafe @7 management from any claims, legal liabilities, penalties, or expenses (including reasonable attorney fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li>Submitting fraudulent, counterfeit, or forged UPI UTR payment references;</li>
              <li>Misusing another student&apos;s PRN, account credentials, or pickup OTPs;</li>
              <li>Violating these Terms, university campus codes of conduct, or statutory Indian laws.</li>
            </ul>
          </div>
        ),
      },

      // 20. SUSPENSION & TERMINATION
      {
        id: 'suspension-termination',
        number: '20',
        category: 'legal',
        title: 'Account Suspension, Deactivation & Termination',
        icon: <AlertCircle className="text-[#EF4444]" size={20} />,
        badge: 'Account Lifecycle',
        summary:
          'Procedures for voluntary account deactivation via /profile, suspension grounds, and clause survival post-termination.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              20.1. <strong>Platform Suspension Grounds:</strong> FoodLine reserves the right to suspend or terminate accounts for Terms violations, suspected UPI reference fraud, harassment of kitchen workers, or at the formal request of Sanjivani University Proctorial authorities.
            </p>
            <p>
              20.2. <strong>Voluntary Deactivation:</strong> Students may request account deactivation at any time via <code>/profile</code> settings or by emailing support, provided all pending orders have been picked up or cancelled.
            </p>
            <p>
              20.3. <strong>Surviving Clauses:</strong> Provisions governing payment reconciliations, intellectual property, data retention limits, liability disclaimers, and dispute resolution shall survive account termination.
            </p>
          </div>
        ),
      },

      // 21. DISPUTE RESOLUTION & GOVERNING LAW
      {
        id: 'dispute-resolution',
        number: '21',
        category: 'legal',
        title: 'Dispute Resolution, Amicable Negotiation & Governing Law',
        icon: <Scale className="text-[#8B5CF6]" size={20} />,
        badge: 'Jurisdiction Maharashtra',
        summary:
          'Governed by Indian law. Mandatory 30-day amicable negotiation via Grievance Officer; courts at Kopargaon / Ahmednagar.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              21.1. <strong>Governing Law:</strong> These Terms and all operational contracts shall be governed exclusively by the substantive laws of the Republic of India.
            </p>
            <p>
              21.2. <strong>Mandatory 30-Day Negotiation:</strong> In the event of any operational or contractual dispute, the parties shall first attempt in good faith to resolve the issue through amicable negotiation via the Grievance Officer (Section 24) within 30 days.
            </p>
            <p>
              21.3. <strong>Court Jurisdiction:</strong> Any legal proceeding arising hereunder shall be subject to the exclusive territorial jurisdiction of competent courts situated in <strong>Kopargaon / Ahmednagar District, Maharashtra</strong>.
            </p>
            <p>
              21.4. <strong>Consumer Commission Rights:</strong> Nothing in this clause prevents a student from approaching a Consumer Disputes Redressal Commission under the Consumer Protection Act, 2019 where applicable.
            </p>
          </div>
        ),
      },

      // 22. FORCE MAJEURE
      {
        id: 'force-majeure',
        number: '22',
        category: 'legal',
        title: 'Force Majeure & Campus Institutional Emergencies',
        icon: <CalendarClock className="text-[#F59E0B]" size={20} />,
        badge: 'Emergency Defense',
        summary:
          'Relief from service obligations during unforeseen campus closures, natural events, power outages, or telecom failures.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Neither FoodLine nor Cafe @7 shall be held legally liable for delay or failure to fulfill orders where caused by events beyond reasonable operational control, including:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li>Severe natural events, lightning, floods, or inclement weather;</li>
              <li>Campus administrative shutdowns, student strikes, or sudden university closures;</li>
              <li>Statewide telecommunications blackouts, NPCI/UPI banking server crashes, or power grid failures.</li>
            </ul>
            <p>
              In the event of an emergency campus shutdown, all unfulfilled confirmed orders shall receive a <strong>100% automated UPI refund</strong> within 24 hours.
            </p>
          </div>
        ),
      },

      // 23. CHANGES TO TERMS
      {
        id: 'changes-to-terms',
        number: '23',
        category: 'legal',
        title: 'Amendments & Revisions to Operational Terms',
        icon: <FileText className="text-[#38BDF8]" size={20} />,
        badge: '7-Day Notice SLA',
        summary:
          '7-day advance notice for material contractual changes via in-app banners or WhatsApp. Last Updated date tracking.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              23.1. FoodLine reserves the right to update these Terms periodically to reflect platform improvements (such as automated payment gateway integration, new campus rollouts, or regulatory amendments).
            </p>
            <p>
              23.2. <strong>7-Day Material Notice:</strong> Material changes affecting pricing models or refund policies will be communicated at least <strong>7 days in advance</strong> via in-app notice, WhatsApp broadcast, or banner.
            </p>
            <p>
              23.3. Continued use of the Platform following the effective date of updated Terms establishes binding acceptance of all revised clauses.
            </p>
          </div>
        ),
      },

      // 24. GRIEVANCE OFFICER & CONTACT
      {
        id: 'grievance-contact',
        number: '24',
        category: 'legal',
        title: 'Statutory Grievance Officer & 3-Tier Redressal Hierarchy',
        icon: <Landmark className="text-[#00D4AA]" size={20} />,
        badge: 'DPDP & IT Rules Nodal Office',
        summary:
          'Statutory grievance channel under IT Rules and DPDP Act 2023. 48-hour acknowledgment and 15-day resolution SLA.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              In compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Section 14 of the Digital Personal Data Protection Act, 2023, FoodLine provides a dedicated statutory Grievance Officer:
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Statutory Nodal Officer Contact</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div><span className="text-zinc-500">Designated Officer:</span> <strong className="text-white">Legal Redressal &amp; Privacy Officer</strong></div>
                <div><span className="text-zinc-500">Official Grievance Email:</span> <a href="mailto:foodlinecampus07@gmail.com" className="text-[#00D4AA] hover:underline font-mono">foodlinecampus07@gmail.com</a></div>
                <div><span className="text-zinc-500">Campus Helpline:</span> <a href="tel:+919876543210" className="text-accent-orange font-bold hover:underline font-mono">+91-98765-43210</a></div>
                <div><span className="text-zinc-500">Response Acknowledgment:</span> <strong className="text-white">&lt; 48 Hours</strong></div>
                <div><span className="text-zinc-500">Target Resolution SLA:</span> <strong className="text-white">Within 15 Business Days</strong></div>
                <div className="sm:col-span-2"><span className="text-zinc-500">Campus Physical Office:</span> <span className="text-zinc-300">FoodLine Desk, Student Welfare Complex, Sanjivani University, Kopargaon - 423603</span></div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/25 space-y-1">
              <div className="text-[#00D4AA] font-black text-xs uppercase tracking-wider">3-Tier Campus Escalation Matrix</div>
              <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-300">
                <li><strong>Tier 1 (Instant):</strong> Cafe @7 Counter Lead at Counter #2 (Resolves in &lt; 2 minutes).</li>
                <li><strong>Tier 2 (Official):</strong> FoodLine Grievance Officer via email (Acknowledged &lt; 48h, resolved &lt; 15 days).</li>
                <li><strong>Tier 3 (Institutional):</strong> Dean of Student Welfare / University Administration (<a href="mailto:foodlinecampus07@gmail.com" className="text-[#00D4AA] underline">foodlinecampus07@gmail.com</a>).</li>
              </ol>
            </div>
          </div>
        ),
      },

      // 25. SEVERABILITY & ENTIRE AGREEMENT
      {
        id: 'severability-agreement',
        number: '25',
        category: 'legal',
        title: 'Severability, Integration & Entire Master Agreement',
        icon: <HeartHandshake className="text-(--accent-orange)" size={20} />,
        badge: 'Entire Agreement',
        summary:
          'Severability of unenforceable terms. Master agreement integrating all policies and campus addenda.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              25.1. <strong>Severability:</strong> If any provision of these Terms is adjudicated to be unlawful, void, or unenforceable by a court of competent jurisdiction, such provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions.
            </p>
            <p>
              25.2. <strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy, the Campus MoU, and published cafeteria checkout addenda, constitute the entire legal and operational agreement between the User and FoodLine, superseding all prior oral or written representations.
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-zinc-400 space-y-1">
              <div className="font-bold text-white uppercase text-[10px] tracking-wider">End of Master Terms &amp; Conditions</div>
              <p>Executed for Sanjivani University, Kopargaon • Pilot Cafeteria Partner: Cafe @7 • Powered by FoodLine Campus Ecosystem.</p>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  // Filter clauses based on category & search query
  const filteredClauses = useMemo(() => {
    return clauses.filter((clause) => {
      const matchesCategory = selectedCategory === 'all' || clause.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        clause.title.toLowerCase().includes(q) ||
        clause.summary.toLowerCase().includes(q) ||
        clause.number.toLowerCase().includes(q) ||
        clause.id.toLowerCase().includes(q)
      );
    });
  }, [clauses, selectedCategory, searchQuery]);

  return (
    <PageTransition className="min-h-screen bg-(--bg-canvas) text-(--text-primary) pb-24 relative overflow-hidden transition-colors duration-500">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 relative z-10 space-y-10 sm:space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--accent-orange)/10 text-(--accent-orange) border border-(--accent-orange)/25 text-xs font-extrabold uppercase tracking-widest">
            <FileText size={14} />
            <span>Master Service Agreement &amp; Campus Bylaws</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-(--text-primary) tracking-tight leading-tight">
            Terms &amp; <br />
            <span className="bg-linear-to-r from-(--accent-orange) via-(--accent-amber) to-(--accent-teal) bg-clip-text text-transparent">
              Conditions of Service
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-(--text-secondary) font-normal max-w-2xl mx-auto leading-relaxed">
            Official legal and operational framework governing food pre-ordering, Option C direct UPI settlement, break-slot capacity throttling, and express counter pickups at {pilotCampus}.
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-xs text-(--text-secondary)">
            <span className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass)">
              🗓 Effective: <strong className="text-(--text-primary)">{effectiveDate}</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass)">
              🔄 Last Updated: <strong className="text-(--text-primary)">{lastUpdated}</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 font-bold">
              ✓ 25 Comprehensive Clauses
            </span>
            <button
              onClick={() => setShowPrePubModal(true)}
              className="px-3 py-1 rounded-xl bg-(--accent-amber)/10 hover:bg-(--accent-amber)/20 text-(--accent-amber) border border-(--accent-amber)/25 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <CheckSquare size={13} />
              <span>Compliance Checklist</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE SLA & SCENARIO LOOKUP WIDGET */}
        <section className="bg-linear-to-br from-black/40 to-black/60 dark:from-[#12121A]/80 dark:to-[#0A0A10]/90 border border-(--border-glass) rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-(--accent-orange) flex items-center gap-2">
                <Sparkles size={14} />
                Instant Student Rights &amp; SLA Solver
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                What Happens in Your Situation?
              </h2>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-xl bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/25 font-bold self-start sm:self-auto">
              {scenarioLookup[selectedScenario].badge}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {Object.entries(scenarioLookup).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setSelectedScenario(key)}
                className={`p-3 rounded-2xl text-left transition cursor-pointer border ${
                  selectedScenario === key
                    ? 'bg-(--accent-orange)/15 border-(--accent-orange)/40 text-white shadow-lg'
                    : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="font-extrabold text-xs line-clamp-1">{item.title}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">When this happens:</span>
              <p className="text-zinc-300">{scenarioLookup[selectedScenario].trigger}</p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Guaranteed Remedy:</span>
              <p className="text-[#00D4AA] font-bold">{scenarioLookup[selectedScenario].remedy}</p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Official SLA:</span>
              <p className="text-white font-black">{scenarioLookup[selectedScenario].sla}</p>
            </div>
          </div>
        </section>

        {/* Toolbar: Category Pills, Search, and Print Action */}
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-(--accent-orange) text-white border-(--accent-orange) shadow-md shadow-(--accent-orange)/20'
                    : 'bg-black/20 dark:bg-white/5 text-zinc-400 hover:text-white border-(--border-glass)'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-black/20 dark:bg-white/[0.03] border border-(--border-glass) backdrop-blur-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clauses (e.g., 'refund', 'UTR', 'slot', 'OTP', 'DPDP', 'FSSAI', 'grievance')..."
                className="w-full pl-10 pr-12 py-2 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-orange) transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-(--border-glass) text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer"
                title="Print or export to PDF"
              >
                <Printer size={14} />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main 12-Column Grid: Sticky Table of Contents + Clause Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-black/30 dark:bg-[#101018]/80 border border-(--border-glass) rounded-3xl p-5 backdrop-blur-2xl shadow-xl space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles size={14} className="text-(--accent-amber)" />
                  Clause Index ({filteredClauses.length})
                </span>
                <span className="text-[10px] text-zinc-500">25 Total</span>
              </div>

              <div className="space-y-1 max-h-[62vh] overflow-y-auto pr-1 scrollbar-thin">
                {filteredClauses.map((clause) => (
                  <a
                    key={clause.id}
                    href={`#${clause.id}`}
                    onClick={() => setActiveSectionId(clause.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition group ${
                      activeSectionId === clause.id
                        ? 'bg-(--accent-orange)/15 text-(--accent-orange) border border-(--accent-orange)/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300 shrink-0">
                        {clause.number}
                      </span>
                      <span className="truncate">{clause.title}</span>
                    </span>
                    <ChevronRight size={12} className="opacity-40 group-hover:opacity-100 shrink-0 ml-1" />
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Immediate dispute help?</span>
                <a href="#grievance-contact" className="text-[#00D4AA] font-bold hover:underline">
                  Grievance Officer &rarr;
                </a>
              </div>
            </div>
          </aside>

          {/* Clauses Content */}
          <div className="lg:col-span-8 space-y-6">
            {filteredClauses.length === 0 ? (
              <div className="text-center py-16 bg-black/20 border border-(--border-glass) rounded-3xl p-8 space-y-3">
                <HelpCircle size={36} className="mx-auto text-zinc-500" />
                <h3 className="text-lg font-bold text-white">No clauses matching &quot;{searchQuery}&quot;</h3>
                <p className="text-xs text-zinc-400">
                  Try searching for terms like &quot;refund&quot;, &quot;slot&quot;, &quot;bulk&quot;, &quot;DPDP&quot;, &quot;FSSAI&quot;, or &quot;UTR&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-xs text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredClauses.map((clause) => (
                <section
                  key={clause.id}
                  id={clause.id}
                  className="bg-black/30 dark:bg-[#101018]/80 border border-(--border-glass) rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-xl space-y-4 transition duration-300 hover:border-white/20 scroll-mt-28"
                >
                  {/* Clause Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {clause.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-(--accent-orange) font-black">
                            SECTION {clause.number}
                          </span>
                          {clause.badge && (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 font-bold">
                              {clause.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                          {clause.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyLink(clause.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs transition cursor-pointer"
                      title="Copy anchor link to clause"
                    >
                      {copiedId === clause.id ? (
                        <>
                          <Check size={12} className="text-[#00D4AA]" />
                          <span className="text-[#00D4AA] font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Legal Summary Banner */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-200">Clause Intent:</strong> {clause.summary}
                  </div>

                  {/* Deep Clause Content */}
                  <div className="pt-1">{clause.content}</div>
                </section>
              ))
            )}
          </div>
        </div>

        {/* STATUTORY REGULATORY REFERENCES MATRIX */}
        <section className="bg-black/30 dark:bg-[#101018]/80 border border-(--border-glass) rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center shrink-0">
              <Landmark size={20} className="text-[#00D4AA]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#00D4AA]">
                Statutory Compliance
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Indian Regulatory Framework &amp; Acts
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {statutoryReferences.map((ref, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-(--accent-orange) font-bold">{ref.clauseRef}</span>
                  <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                </div>
                <h4 className="text-xs font-extrabold text-white">{ref.regulation}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{ref.scope}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE FAQ ACCORDION */}
        <section className="bg-black/30 dark:bg-[#101018]/80 border border-(--border-glass) rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-(--accent-amber)/10 border border-(--accent-amber)/20 flex items-center justify-center shrink-0">
              <HelpCircle size={20} className="text-(--accent-amber)" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-(--accent-amber)">
                Frequently Asked Questions
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Practical Student &amp; Staff Guidance
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 overflow-hidden transition bg-white/[0.01]"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm text-white">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-(--accent-orange)' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRE-PUBLICATION CHECKLIST MODAL */}
        <AnimatePresence>
          {showPrePubModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#12121A] border border-(--border-glass) rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <CheckSquare size={20} className="text-(--accent-amber)" />
                    <h3 className="text-lg font-black text-white">Pre-Publication Legal Compliance Checklist</h3>
                  </div>
                  <button
                    onClick={() => setShowPrePubModal(false)}
                    className="text-zinc-400 hover:text-white p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-zinc-400">
                  This checklist audits statutory Indian legal requirements (DPDP Act 2023, FSSAI 2006, RBI Payment Aggregator) prior to publishing final legal versions for university counsel review:
                </p>

                <div className="space-y-2.5">
                  {prePubChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs"
                    >
                      <div className="pt-0.5 shrink-0">
                        {item.done ? (
                          <CheckCircle2 size={16} className="text-[#00D4AA]" />
                        ) : (
                          <AlertCircle size={16} className="text-(--accent-amber)" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">{item.title}</div>
                        <div className="text-[11px] text-zinc-400">{item.status}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400">
                  <strong className="text-white">Legal Notice:</strong> This document is structured for pilot operational compliance at Sanjivani University. Formal execution occurs in conjunction with the Cafeteria Partner Tripartite Agreement.
                </div>

                <button
                  onClick={() => setShowPrePubModal(false)}
                  className="w-full py-2.5 rounded-xl bg-(--accent-orange) hover:bg-(--accent-orange)/90 text-white font-bold text-xs transition cursor-pointer"
                >
                  Close Checklist
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Back to Menu */}
        <div className="text-center pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-(--accent-orange) to-(--accent-amber) text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-(--accent-orange)/20 hover:scale-105 transition"
          >
            <span>Proceed to Cafe @7 Menu</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}
