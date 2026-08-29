'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';

interface ClauseSection {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  summary: string;
  content: React.ReactNode;
}

export default function TermsAndConditionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('eligibility');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('stockout');

  const lastUpdated = 'August 29, 2026';
  const effectiveDate = 'September 1, 2026';
  const pilotCampus = 'Sanjivani University, Kopargaon (Cafe @7 Pilot)';

  const scenarioLookup: Record<
    string,
    { title: string; trigger: string; remedy: string; sla: string; badge: string }
  > = {
    stockout: {
      title: 'Kitchen Stockout / Dish Runs Out',
      trigger: 'When an ordered dish cannot be prepared due to raw ingredient stockout.',
      remedy: 'Instant Direct UPI Refund to originating VPA or equivalent value chef substitution.',
      sla: 'Within 15 Minutes Direct UPI Refund',
      badge: '100% Refund Guarantee',
    },
    delay: {
      title: 'Kitchen Handover Delay (> 3 Mins Past Slot)',
      trigger: 'Student arrives within slot window but kitchen batch is still cooking.',
      remedy: 'Priority express pass handover + complimentary hot beverage voucher for next break.',
      sla: 'Priority Release within 2 Mins',
      badge: 'Freshness SLA',
    },
    lecture: {
      title: 'Lecture / Lab Overtime Extension',
      trigger: 'Professor or lab session extends past the 11:50 AM break slot window.',
      remedy: 'Automatic 15-minute slot rollover to 2:30 PM without forfeiture or penalty.',
      sla: 'Instant Counter Rollover',
      badge: 'Academic Flexibility',
    },
    utr_mismatch: {
      title: 'Bank App Lag / Delayed UTR Generation',
      trigger: 'Bank app debits student account but takes 5 minutes to show 12-digit UTR.',
      remedy: 'Show official bank debit SMS with timestamp to counter lead for manual verification.',
      sla: 'Manual Clearance in < 1 Min',
      badge: 'Offline Fallback',
    },
  };

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
      a: 'Follow our 3-Tier Grievance Matrix: First speak with the Cafe @7 Counter Lead (< 2 mins). If unresolved, email foodlinecampus@gmail.com (< 2 hours). For institutional policy issues, contact the Sanjivani University Dean of Student Welfare (< 24 hours).',
    },
  ];

  const statutoryReferences = [
    {
      regulation: 'Digital Personal Data Protection (DPDP) Act 2023',
      clauseRef: 'Section 6 & 12',
      scope: 'Data minimization (PRN/UTR only), zero third-party monetization, and statutory Right to Erasure.',
    },
    {
      regulation: 'Information Technology Act 2000',
      clauseRef: 'Section 66D',
      scope: 'Strict legal prohibition of counterfeit/fake UTR submissions and electronic impersonation.',
    },
    {
      regulation: 'Food Safety & Standards Act 2006 (FSSAI)',
      clauseRef: 'Schedule 4 Part II',
      scope: 'License #11522036000142, > 65°C thermal food holding, and 100% pure vegetarian kitchen isolation.',
    },
    {
      regulation: 'RBI Payment Aggregator Framework 2020',
      clauseRef: 'DPSS.CO.PD Circular',
      scope: 'Option C Direct Settlement Architecture. Zero escrow fund retention by platform.',
    },
    {
      regulation: 'Consumer Protection (E-Commerce) Rules 2020',
      clauseRef: 'Rule 4, 5 & 6',
      scope: 'Transparent all-inclusive price display, 15-minute stockout refund SLA, and nodal grievance officer.',
    },
    {
      regulation: 'UGC Student Grievance Redressal Regulations 2023',
      clauseRef: 'Regulation 5',
      scope: 'Statutory 3-tier campus escalation hierarchy via Dean of Student Welfare.',
    },
  ];

  const clauses: ClauseSection[] = useMemo(
    () => [
      {
        id: 'eligibility',
        number: '01',
        title: 'Acceptance of Terms & Campus Eligibility Scope',
        icon: <Building2 className="text-[var(--accent-orange)]" size={20} />,
        badge: 'Tripartite Contract',
        summary:
          'Legally binding tripartite agreement governing student, faculty, and visitor access within Sanjivani University.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              By accessing, browsing, creating an account on, or placing a transaction through the <strong>FoodLine Campus Dining Ecosystem</strong> (&quot;Platform&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;our&quot;), you (&quot;User&quot;, &quot;Student&quot;, &quot;Faculty&quot;) unconditionally agree to be bound by these Terms and Conditions (&quot;Terms&quot;) and all operational policies incorporated by reference.
            </p>
            <p>
              FoodLine operates as an authorized digital pre-ordering and slot-metering partner under an institutional Memorandum of Understanding (MoU) executed between <strong>Sanjivani University Administration</strong>, the <strong>Student Welfare Committee</strong>, and <strong>Cafe @7 Cafeteria Management</strong>. If you do not agree with any provision of these Terms, you must discontinue using the Platform immediately.
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00D4AA]" />
                Institutional Eligibility Criteria
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
                <li>Active Student Permanent Registration Number (PRN), Faculty ID, or authorized campus guest credential at Sanjivani University.</li>
                <li>Valid Indian UPI-enabled bank account (BHIM, PhonePe, Google Pay, Paytm, Amazon Pay, CRED, or mobile banking).</li>
                <li>Commitment to physical collection or designated proxy pickup at the Cafe @7 express pickup counter during the booked break window.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'slot-capacity',
        number: '02',
        title: 'Break-Slot Scheduling & 60-Order Capacity Throttling',
        icon: <Clock className="text-[var(--accent-amber)]" size={20} />,
        badge: 'Kitchen Rush SLA',
        summary:
          '15-minute express pickup windows capped at 60 orders per slot to eliminate physical queuing.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              To maintain kitchen food temperature standards and eliminate crowding at Cafe @7, FoodLine implements strict <strong>real-time slot capacity metering</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#FF8A3D]/10 border border-[#FF8A3D]/25">
                <div className="text-[#FF8A3D] font-black text-xs uppercase tracking-wider mb-1">
                  11:50 AM — 12:20 PM Slot
                </div>
                <div className="text-xs text-zinc-300">
                  Morning Recess Rush • Hard cap of 60 Orders • Pre-orders lock 10 minutes prior to window start.
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/25">
                <div className="text-[#00D4AA] font-black text-xs uppercase tracking-wider mb-1">
                  02:30 PM — 03:00 PM Slot
                </div>
                <div className="text-xs text-zinc-300">
                  Afternoon Break Rush • Hard cap of 60 Orders • Kitchen batches cook in synchronized sequences.
                </div>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li><strong>Automated Slot Lock:</strong> Once a slot reaches 60 confirmed orders, the platform transitions the slot to &apos;SOLD OUT&apos;. No administrative or counter override can inject extra orders into an active batch.</li>
              <li><strong>Temporary 7-Minute Reservation Timer:</strong> When you initiate checkout, your slot is temporarily held for <strong>7 minutes</strong> while you complete UPI payment. If unconfirmed within this window, the slot automatically releases to the student queue.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'payment-utr',
        number: '03',
        title: 'Option C Direct UPI & 12-Digit Bank UTR Verification',
        icon: <CreditCard className="text-[#00D4AA]" size={20} />,
        badge: 'RBI & NPCI Compliant',
        summary:
          'Direct peer-to-merchant UPI settlement. Zero student surcharges. Anti-replay UTR verification.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              FoodLine operates exclusively under the <strong>Option C Direct Merchant Settlement Architecture</strong> in compliance with Reserve Bank of India (RBI) 2020 Guidelines for Payment Aggregators & Gateways:
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Direct Merchant VPA</span>
                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 font-bold">
                  9960091371@slc
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                100% of the funds flow directly from your banking application to Cafe @7 proprietor without passing through any intermediary wallet, escrow balance, or custodial account.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">12-Digit Bank UTR Verification & Anti-Replay Rules:</h4>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
                <li>You must enter the authentic 12-digit Unique Transaction Reference (UTR / UPI Ref ID) provided by your payment application.</li>
                <li><strong>Anti-Replay Protection:</strong> Our backend cryptographically validates the uniqueness of every UTR. Duplicate, expired, or already-claimed UTR numbers are rejected instantly with an anti-fraud alert.</li>
                <li><strong>Fraudulent Submissions:</strong> Entering arbitrary or fabricated UTR strings constitutes criminal electronic misrepresentation under Section 66D of the Information Technology Act 2000 and will result in permanent PRN blacklisting and formal student disciplinary referral.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'pickup-sla',
        number: '04',
        title: 'Pickup OTP, Optical QR Pass & 20-Minute Grace Window',
        icon: <QrCode className="text-[var(--accent-teal)]" size={20} />,
        badge: 'Express Counter SLA',
        summary:
          'Present 4-digit OTP or optical QR pass at Cafe @7 counter. 20-minute hot holding policy.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Meals are prepared fresh and staged in thermal holding racks at the <strong>Cafe @7 Express Pickup Counter</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-[#00D4AA]">●</span> 4-Digit Pickup OTP
                </div>
                <p className="text-xs text-zinc-400">
                  A high-entropy numeric OTP is issued upon payment confirmation. Staff will verify this on the Kitchen Display System (KDS) before releasing your tray.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-[var(--accent-orange)]">●</span> 20-Minute Grace Window
                </div>
                <p className="text-xs text-zinc-400">
                  Orders remain in the express heating lane for 20 minutes past scheduled break conclusion. Unclaimed perishable meals will be discarded per food safety hygiene codes without refund.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'refunds-cancellations',
        number: '05',
        title: 'Cancellations, Stockouts & Instant UPI Refund SLA',
        icon: <RotateCcw className="text-[#6366F1]" size={20} />,
        badge: 'Consumer Protection',
        summary:
          '100% refund guarantee on kitchen stockouts or preparation delays exceeding service thresholds.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              We believe in radical student fairness and zero unearned retention:
            </p>
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded shrink-0">
                  Stockout
                </span>
                <div className="text-xs text-zinc-300">
                  If any ordered dish runs out of kitchen inventory, staff will immediately offer an equivalent item substitution or execute an <strong>Instant Direct UPI Refund</strong> to your original VPA within 15 minutes.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-[#FF8A3D] bg-[#FF8A3D]/10 px-2 py-0.5 rounded shrink-0">
                  Student Cancel
                </span>
                <div className="text-xs text-zinc-300">
                  Orders may be cancelled with a 100% full refund up to <strong>15 minutes before the slot preparation cycle commences</strong> (i.e. before status transitions to &apos;PREPARING&apos;). Once active cooking begins, cancellation is restricted.
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'food-hygiene',
        number: '06',
        title: 'FSSAI Food Hygiene & 100% Pure Vegetarian Standards',
        icon: <Utensils className="text-[#10B981]" size={20} />,
        badge: 'FSSAI Certified',
        summary:
          'Strict adherence to Food Safety & Standards Authority of India (FSSAI) guidelines and pure veg kitchen sanitation.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Cafe @7 operates under active <strong>FSSAI Registration & Licensing (#11522036000142)</strong>, adhering to Schedule 4 sanitary requirements:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li><strong>100% Pure Vegetarian:</strong> Guaranteed zero contamination with non-vegetarian ingredients, egg products, or animal gelatins.</li>
              <li><strong>Fresh Cook Batches:</strong> Snack items (Vada Pav, Samosa, Sandwiches) and hot beverages (Tea, Coffee) are prepared in synchronized batches matching slot demand to prevent stale storage.</li>
              <li><strong>Allergen Advisory:</strong> Dishes may contain nuts, dairy (paneer, milk, butter), gluten, or mustard. Students with severe allergies should inform counter staff directly.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'pricing-zero-surge',
        number: '07',
        title: 'Student Pricing, Transparent Breakdown & Zero-Surge Guarantee',
        icon: <Tag className="text-[#FF8A3D]" size={20} />,
        badge: '0% Surcharge Guarantee',
        summary:
          'Menu rates exactly match counter chalkboard prices. Zero platform fees, zero packing surcharges, zero rain/exam surge.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              FoodLine enforces strict <strong>zero-markup parity</strong> with physical cafeteria counters:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-base font-black text-[#00D4AA]">₹0</div>
                <div className="font-bold text-white mt-0.5">Platform Fee</div>
                <div className="text-[10px] text-zinc-500 mt-1">Zero convenience charge added</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-base font-black text-[#00D4AA]">₹0</div>
                <div className="font-bold text-white mt-0.5">Packing Surcharge</div>
                <div className="text-[10px] text-zinc-500 mt-1">Free food-grade packaging</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-base font-black text-[#00D4AA]">0%</div>
                <div className="font-bold text-white mt-0.5">Surge Surcharge</div>
                <div className="text-[10px] text-zinc-500 mt-1">No exam / monsoon price spikes</div>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              The total amount shown on your payment QR is the exact sum of item base prices as listed on the Cafe @7 physical menu.
            </p>
          </div>
        ),
      },
      {
        id: 'proxy-pickup',
        number: '08',
        title: 'Peer Proxy Pickup & Order Delegation Protocol',
        icon: <UserCheck className="text-[#38BDF8]" size={20} />,
        badge: 'Campus Peer Delegation',
        summary:
          'Authorize a classmate or friend to collect your order by sharing the 4-digit OTP and optical QR pass.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              To accommodate back-to-back lectures or lab practicals, students may designate a peer proxy:
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Info size={14} className="text-[#38BDF8]" />
                Proxy Delegation Guidelines
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
                <li>You may share your optical QR pass screenshot or 4-digit pickup OTP with a verified classmate.</li>
                <li>Counter staff will surrender the meal to any individual who physically presents the matching OTP on the Kitchen KDS terminal.</li>
                <li><strong>User Responsibility:</strong> Once an order is validated and redeemed via the authentic OTP, the transaction is deemed fulfilled. FoodLine cannot entertain claims of unauthorized collection if you disclosed your OTP.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'academic-rescheduling',
        number: '09',
        title: 'Academic Rescheduling & Institutional Force Majeure',
        icon: <CalendarClock className="text-[#A855F7]" size={20} />,
        badge: 'University Timetable Policy',
        summary:
          'Automatic slot flexibility or refund adjustments during unexpected university timetable changes and exam extensions.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              In the event of institutional academic schedule changes mandated by Sanjivani University:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li><strong>Sudden Class Extensions:</strong> If a scheduled lecture, lab practical, or university viva runs overtime, the student can request an automatic 15-minute slot shift by contacting the counter lead via in-app help.</li>
              <li><strong>Campus Closure / Emergency:</strong> In the event of unforeseen university closures, power grid failures, or inclement weather, all active unfulfilled orders will receive a 100% direct UPI refund within 24 hours.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'dietary-customizations',
        number: '10',
        title: 'Dietary Notes, Allergens & Custom Preparation Boundaries',
        icon: <SlidersHorizontal className="text-[#EAB308]" size={20} />,
        badge: 'Kitchen Customization',
        summary:
          'Handling of student cooking notes (e.g. Jain options, extra spicy, less butter) and kitchen liability limits.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Students may add brief preparation instructions (e.g., &quot;No onions/garlic&quot;, &quot;Extra spicy&quot;, &quot;Less oil&quot;) during checkout:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li>Cafe @7 staff will make commercially reasonable efforts to honor reasonable dietary and spice adjustments.</li>
              <li>Customization requests cannot alter the base pricing or substitute premium ingredients (e.g., requesting extra paneer without ordering the addon).</li>
              <li><strong>Severe Allergies:</strong> FoodLine does not guarantee allergen-free isolation in high-volume rush hours. Patrons with life-threatening food allergies must exercise personal discretion.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'eco-packaging',
        number: '11',
        title: 'Eco-Packaging & Sanjivani Green Campus Cleanliness',
        icon: <Leaf className="text-[#22C55E]" size={20} />,
        badge: 'Green Campus Initiative',
        summary:
          'Biodegradable bagasse meal containers and student commitment to campus waste segregation.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              In alignment with the <strong>Sanjivani University Green Campus Charter</strong>:
            </p>
            <div className="p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 space-y-2">
              <div className="text-white font-bold text-xs">Zero Single-Use Plastic Policy</div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Cafe @7 serves all pre-orders in 100% compostable sugarcane bagasse bowls, paper beverage cups, and wooden cutleries.
              </p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs">
                <li>Students must dispose of packaging materials in designated wet/dry waste bins around the cafeteria.</li>
                <li>Littering of takeaway containers in academic corridors constitutes a violation of university civic bylaws.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'offline-resilience',
        number: '12',
        title: 'Offline Resilience, Network Outages & Manual Fallback Protocol',
        icon: <WifiOff className="text-[#EC4899]" size={20} />,
        badge: 'Network Failover',
        summary:
          'Standard operating procedure for counter handover during campus Wi-Fi or cellular network drops.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              To ensure uninterrupted meal handover even during campus cellular outages:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-bold">Offline SMS / Bank SMS Proof</div>
                <p className="text-zinc-400">
                  If local internet fails, showing the official bank debit SMS with matching 12-digit UTR and timestamp allows counter staff to log manual clearance.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-bold">Counter Ledger Synchronization</div>
                <p className="text-zinc-400">
                  The Kitchen KDS maintains an offline encrypted cache that syncs automatically when network connectivity is restored.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'geofencing-express',
        number: '13',
        title: 'Campus Geofencing & Express Pickup Only (No In-Room Delivery)',
        icon: <MapPin className="text-[#38BDF8]" size={20} />,
        badge: 'Zero Delivery Scope',
        summary:
          'FoodLine is strictly an on-premise express counter pickup platform with zero hostel or classroom delivery.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              To maintain food heat freshness, eliminate delivery surcharge fees, and comply with campus safety regulations:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li><strong>Express Counter Pickup Only:</strong> All orders must be physically collected at Cafe @7 Counter #2 in the Main Campus Quadrangle.</li>
              <li><strong>Zero Hostel/Classroom Delivery:</strong> FoodLine does not dispatch delivery personnel to student hostel rooms, administrative departments, or lecture halls.</li>
              <li><strong>Geofenced Authorization:</strong> Slot reservation telemetry is geofenced to authorized patrons within the Sanjivani University geographical perimeter.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'bulk-orders',
        number: '14',
        title: 'Bulk, Club & Departmental Group Order SLA (> 10 Items)',
        icon: <Users className="text-[#F59E0B]" size={20} />,
        badge: 'Event & Club Catering',
        summary:
          'Orders exceeding 10 items require 2-hour advance booking to safeguard individual student slot capacity.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              For student clubs, technical symposiums, hackathons, and departmental faculty gatherings:
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="text-white font-bold text-xs">Bulk Order Advance Notice Requirement</div>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
                <li>Orders containing <strong>more than 10 total portions</strong> must be placed at least <strong>2 hours prior</strong> to the requested break slot.</li>
                <li>This ensures kitchen staff can prepare specialized bulk batches without starving the 60-order automated slot capacity reserved for individual peer orders.</li>
                <li>For custom event bulk orders exceeding 50 portions, contact Cafe @7 management directly or email <code className="text-[#F59E0B]">foodlinecampus@gmail.com</code>.</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'account-security',
        number: '15',
        title: 'Account Security, Session Tokens & Device Responsibility',
        icon: <KeyRound className="text-[#6366F1]" size={20} />,
        badge: 'Authentication & Tokens',
        summary:
          'Users are solely responsible for maintaining session token security on personal smartphones and laptops.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              FoodLine utilizes cryptographic session tokens stored locally on your device to maintain cart and order tracking state:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li><strong>Session Confidentiality:</strong> You must not share your authenticated session link or PRN credentials with unauthorized third parties.</li>
              <li><strong>Device Security:</strong> Any transaction originating from your device session with a verified bank UTR is legally deemed authorized by you.</li>
              <li><strong>Session Revocation:</strong> In the event of device loss or suspected unauthorized access, you can immediately invalidate all active sessions by clicking &apos;Logout&apos; or contacting platform security.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'electronic-consent',
        number: '16',
        title: 'Electronic Transactional Alerts & Communications Consent',
        icon: <Bell className="text-[#EC4899]" size={20} />,
        badge: 'Real-Time Telemetry Alerts',
        summary:
          'Consent to receive live Server-Sent Events (SSE) kitchen progress updates and transactional receipts.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              By placing an order, you provide explicit consent to receive essential real-time operational communications:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-bold">Transactional Notifications</div>
                <p className="text-zinc-400">
                  Live SSE push updates for &apos;PENDING_PAYMENT&apos; ➔ &apos;CONFIRMED&apos; ➔ &apos;PREPARING&apos; ➔ &apos;READY&apos; ➔ &apos;COLLECTED&apos;.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-bold">Zero Marketing Spam Guarantee</div>
                <p className="text-zinc-400">
                  FoodLine will NEVER send promotional spam, external affiliate advertisements, or unsolicited marketing SMS.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'campus-code-conduct',
        number: '17',
        title: 'Campus Code of Conduct, Staff Demeanor & Queue Discipline',
        icon: <HeartHandshake className="text-[#10B981]" size={20} />,
        badge: 'Proctorial Discipline',
        summary:
          'Zero tolerance for queue jumping, harassment of cafeteria staff, or disruptive behavior at Counter #2.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Mutual respect between students and cafeteria kitchen staff is fundamental to FoodLine:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li><strong>Zero Harassment Policy:</strong> Verbal abuse, physical intimidation, or aggressive behavior towards Cafe @7 culinary or counter personnel is strictly prohibited.</li>
              <li><strong>Queue Demarcation:</strong> Express pickup holders must queue within designated FoodLine floor markings to ensure smooth foot-traffic flow during 11:50 AM recess rush.</li>
              <li><strong>Sanctions:</strong> Violations will result in immediate suspension of pre-ordering privileges and formal reporting to the Sanjivani University Proctorial Disciplinary Committee.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'banking-gateway-delays',
        number: '18',
        title: 'Banking Gateway Delays & Inter-Bank Network Disruptions',
        icon: <Landmark className="text-[#EAB308]" size={20} />,
        badge: 'NPCI & Banking SLAs',
        summary:
          'Clear procedures for handling NPCI bank server downtimes and delayed SMS debit notifications.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              While FoodLine verifies UTRs instantaneously, inter-bank clearance speeds are subject to National Payments Corporation of India (NPCI) and issuing bank infrastructure:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li>If your bank deducts funds but fails to return a UTR within 7 minutes, retain your bank debit SMS.</li>
              <li>Counter staff can perform manual ledger matching upon viewing the authentic bank SMS showing debit to <code className="text-[#00D4AA]">9960091371@slc</code>.</li>
              <li>FoodLine is not responsible for failed transactions where funds were held by the issuing bank prior to reaching Cafe @7 merchant VPA.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'intellectual-property',
        number: '19',
        title: 'Intellectual Property Rights & Software Anti-Reverse Engineering',
        icon: <Code2 className="text-[#A855F7]" size={20} />,
        badge: 'Proprietary IP & Code',
        summary:
          'Protection of FoodLine algorithms, slot throttling logic, KDS telemetry, and trademark assets.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              All software components, UI designs, slot allocation algorithms, real-time SSE protocols, and branding elements are the exclusive intellectual property of <strong>FoodLine Campus Ecosystem</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs">
              <li>Users shall not decompile, reverse-engineer, disassemble, or extract source code from the Platform.</li>
              <li>Creating unauthorized API wrapper bots, scrapers, or third-party reservation utilities is strictly forbidden under copyright and computer fraud laws.</li>
              <li>All trademarks, logos, and service marks displayed are protected by applicable intellectual property statutes.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'severability-governing-law',
        number: '20',
        title: 'Severability, Non-Waiver, Dispute Resolution & Governing Law',
        icon: <Scale className="text-[#00D4AA]" size={20} />,
        badge: 'Legal Boilerplate & Jurisdiction',
        summary:
          'Entire agreement clause, severability, and exclusive jurisdiction of competent courts in Kopargaon / Ahmednagar.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              These Terms constitute the entire and exclusive agreement between the User and FoodLine with respect to the subject matter hereof:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-bold">Severability</div>
                <p className="text-zinc-400">
                  If any provision of these Terms is held invalid or unenforceable, such provision will be modified to the minimum extent necessary, and the remaining provisions shall remain in full force.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-bold">Non-Waiver</div>
                <p className="text-zinc-400">
                  Our failure to enforce any right or provision shall not be deemed a waiver of such right or future enforcement.
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 pt-2 border-t border-white/5">
              <strong>Jurisdiction:</strong> These Terms are governed by the substantive laws of India. Any legal dispute, arbitration, or statutory claim shall fall under the exclusive jurisdiction of the competent courts in <strong>Kopargaon / Ahmednagar, Maharashtra</strong>.
            </p>
          </div>
        ),
      },
    ],
    []
  );

  const filteredClauses = useMemo(() => {
    if (!searchQuery.trim()) return clauses;
    const q = searchQuery.toLowerCase();
    return clauses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.number.includes(q) ||
        (c.badge && c.badge.toLowerCase().includes(q))
    );
  }, [clauses, searchQuery]);

  const handleCopyLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/terms#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <PageTransition className="min-h-screen bg-[#07070B] text-[#F8FAFC] pb-24 relative overflow-hidden">
      {/* Background Ambience Mesh */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-[var(--accent-orange)]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[var(--accent-teal)]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 relative z-10 space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] border border-[var(--accent-orange)]/25 text-xs font-extrabold uppercase tracking-widest">
            <FileText size={14} />
            <span>Master Service Agreement & Student Bylaws</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Terms & <br />
            <span className="bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-amber)] to-[var(--accent-teal)] bg-clip-text text-transparent">
              Conditions of Service
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 font-normal">
            Official operational bylaws governing food pre-ordering, direct UPI settlement, break-slot throttling, and express counter pickups at {pilotCampus}.
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-zinc-400">
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
              🗓 Effective: <strong className="text-white">{effectiveDate}</strong>
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
              🔄 Last Updated: <strong className="text-white">{lastUpdated}</strong>
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 font-bold">
              ✓ MoU Tripartite Authorized
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 font-bold">
              ⚖️ 20 Statutory & Operational Clauses
            </span>
          </div>
        </div>

        {/* INTERACTIVE SLA & SCENARIO LOOKUP WIDGET */}
        <section className="bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[var(--accent-orange)] flex items-center gap-2">
                <Sparkles size={14} />
                Instant Student Rights & SLA Lookup
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                What Happens in Your Situation?
              </h2>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-xl bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/25 font-bold self-start sm:self-auto">
              {scenarioLookup[selectedScenario].badge}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(scenarioLookup).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setSelectedScenario(key)}
                className={`p-3 rounded-2xl text-left transition cursor-pointer border ${
                  selectedScenario === key
                    ? 'bg-[var(--accent-orange)]/15 border-[var(--accent-orange)]/40 text-white shadow-lg'
                    : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="font-extrabold text-xs">{item.title}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 border border-white/10 rounded-2xl p-5 text-xs">
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

        {/* Quick Toolbar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F172A]/80 border border-white/10 backdrop-blur-xl shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses (e.g., 'refund', 'UTR', 'slot', 'OTP', 'bulk', 'delivery', 'code of conduct')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent-orange)] transition"
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer"
              title="Print official copy"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Sticky Sidebar + Interactive Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#0F172A]/90 border border-white/10 rounded-3xl p-5 backdrop-blur-2xl shadow-2xl space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent-amber)]" />
                Table of Contents ({clauses.length})
              </div>

              <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
                {clauses.map((clause) => (
                  <a
                    key={clause.id}
                    href={`#${clause.id}`}
                    onClick={() => setActiveSectionId(clause.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition group ${
                      activeSectionId === clause.id
                        ? 'bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300">
                        {clause.number}
                      </span>
                      <span className="truncate">{clause.title}</span>
                    </span>
                    <ChevronRight size={12} className="opacity-40 group-hover:opacity-100 shrink-0 ml-1" />
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-zinc-500">
                Need immediate dispute help?{' '}
                <a href="#severability-governing-law" className="text-[#00D4AA] underline">
                  Grievance Matrix
                </a>
              </div>
            </div>
          </aside>

          {/* Clauses Content */}
          <div className="lg:col-span-8 space-y-6">
            {filteredClauses.length === 0 ? (
              <div className="text-center py-16 bg-[#0F172A]/60 border border-white/10 rounded-3xl p-8 space-y-3">
                <HelpCircle size={36} className="mx-auto text-zinc-500" />
                <h3 className="text-lg font-bold text-white">No clauses matching &quot;{searchQuery}&quot;</h3>
                <p className="text-xs text-zinc-400">
                  Try searching for terms like &quot;refund&quot;, &quot;slot&quot;, &quot;bulk&quot;, &quot;delivery&quot;, &quot;conduct&quot;, or &quot;FSSAI&quot;.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-xs text-white rounded-xl font-bold"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredClauses.map((clause) => (
                <section
                  key={clause.id}
                  id={clause.id}
                  className="bg-[#0F172A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-5 transition duration-300 hover:border-white/20 scroll-mt-28"
                >
                  {/* Clause Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {clause.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[var(--accent-orange)] font-black">
                            SECTION {clause.number}
                          </span>
                          {clause.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold">
                              {clause.badge}
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                          {clause.title}
                        </h2>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyLink(clause.id)}
                      className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
                      title="Copy link to this clause"
                    >
                      {copiedId === clause.id ? (
                        <span className="text-[#00D4AA] font-bold">Link Copied!</span>
                      ) : (
                        <>
                          <ExternalLink size={12} />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border-l-2 border-[var(--accent-orange)] text-xs text-zinc-400 font-medium">
                    <strong className="text-zinc-200">Summary:</strong> {clause.summary}
                  </div>

                  {/* Detailed Content */}
                  <div>{clause.content}</div>
                </section>
              ))
            )}

            {/* STATUTORY CITATIONS TABLE */}
            <div className="bg-[#0F172A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen size={22} className="text-[#00D4AA]" />
                <div>
                  <h3 className="text-base font-black text-white">Statutory Citations & Legal Framework Matrix</h3>
                  <p className="text-xs text-zinc-400">Official Indian legal acts and regulations governing these Terms</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Statutory Act / Authority</th>
                      <th className="py-3 px-3">Clause Reference</th>
                      <th className="py-3 px-3 text-[#00D4AA]">Compliance Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {statutoryReferences.map((stat, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 px-3 font-bold text-white">{stat.regulation}</td>
                        <td className="py-3 px-3 font-mono text-[#FF8A3D]">{stat.clauseRef}</td>
                        <td className="py-3 px-3 text-zinc-400">{stat.scope}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
            <div className="bg-[#0F172A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <HelpCircle size={22} className="text-[var(--accent-amber)]" />
                <div>
                  <h3 className="text-base font-black text-white">Campus Dining FAQs & Real Scenarios</h3>
                  <p className="text-xs text-zinc-400">Frequently asked questions by students at Sanjivani University</p>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] transition"
                  >
                    <button
                      onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-[var(--accent-orange)] transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 shrink-0 ${
                          activeFaqIndex === index ? 'rotate-180 text-[var(--accent-orange)]' : 'text-zinc-500'
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {activeFaqIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Regulatory Seal & Contact Card */}
            <div className="bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Scale size={24} className="text-[var(--accent-teal)]" />
                <div>
                  <h3 className="text-base font-black text-white">Campus Legal & Ombudsman Liaison</h3>
                  <p className="text-xs text-zinc-400">Statutory inquiries and grievance filings regarding these Terms</p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                For contract interpretations, data access requests, or official cafeteria inquiries, contact the FoodLine Student Welfare Desk at{' '}
                <a href="mailto:foodlinecampus@gmail.com" className="text-[#00D4AA] font-bold underline">
                  foodlinecampus@gmail.com
                </a>{' '}
                or visit the Student Welfare Administrative Office, Sanjivani University, Kopargaon.
              </p>
            </div>
          </div>
        </div>

        {/* Global Footer Navigation */}
        <footer className="pt-8 border-t border-white/10 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 FoodLine Campus Dining Ecosystem. All rights reserved.</div>
          <div className="flex items-center gap-6 font-bold">
            <Link href="/menu" className="hover:text-white transition">
              Live Menu
            </Link>
            <Link href="/display" className="hover:text-white transition">
              TV Display
            </Link>
            <Link href="/kds" className="hover:text-white transition">
              Kitchen KDS
            </Link>
          </div>
        </footer>
      </main>
    </PageTransition>
  );
}
