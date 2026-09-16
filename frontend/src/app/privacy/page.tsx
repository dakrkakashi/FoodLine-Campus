import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PrivacyContent, PolicySection } from '@/components/legal/PrivacyContent';

const SECTIONS: PolicySection[] = [
  {
    id: 'data-collection',
    title: '1. Personal Data We Collect',
    summary: 'Strict data minimization: we only collect information necessary to route food orders to campus canteens.',
    content: [
      'Student Identity Data: Permanent Registration Number (PRN / Roll No.), Student Full Name, College or Personal Gmail address, and mobile phone number.',
      'Campus Affiliation: Selected college campus, academic department, and hostel residency for localized ordering.',
      'Transactional Data: Food order selections, token numbers, scheduled pickup slots, payment method type, and UPI transaction reference (UTR) numbers. We NEVER collect or store raw debit/credit card numbers, CVVs, or UPI MPINs.',
      'Technical Logs: IP address, device operating system, session tokens, and local cache preferences (such as menu grid vs. list view).',
    ],
  },
  {
    id: 'purpose-of-processing',
    title: '2. Purpose of Data Processing & Data Fiduciary Designation',
    summary: 'FoodLine Campus LLP serves as the Data Fiduciary under the India Digital Personal Data Protection (DPDP) Act 2023.',
    content: [
      'Data Fiduciary Role: FoodLine Campus LLP (Pending formal MCA registration) determines the purpose and means of student personal data processing strictly to fulfill food pre-orders.',
      'Token Generation & Kitchen Dispatch: Transmitting your dish selections and pickup code to the designated canteen kitchen display screen (KDS).',
      'Account Authentication: Securing your student wallet, active trays, and past order history using cryptographically hashed credentials.',
      'Receipts & Digital Passes: Sending instant order confirmations, pickup alerts, and refund receipts to your registered Gmail address.',
      'Fraud Prevention & Auditability: Verifying UPI transaction references (UTR) against canteen bank records to eliminate fake counter claims.',
    ],
  },
  {
    id: 'third-party-sharing',
    title: '3. Third-Party Sharing & Intermediaries',
    summary: 'We NEVER sell student personal data to marketing brokers or third-party advertisers.',
    content: [
      'Campus Canteen Operators: Canteen kitchen staff receive your first name, PRN, order token, and ordered dishes to prepare and hand over your meal.',
      'Licensed Payment Gateways & Aggregators: Transaction identifiers are securely processed via RBI-authorized aggregators (e.g. Razorpay) under strict PCI-DSS v4 compliance.',
      'Cloud & Infrastructure Providers: Application hosting and encrypted database storage managed on ISO 27001 certified cloud servers with strict firewall rules.',
      'Institutional Administration: If mandated by university security in cases of severe campus discipline violations, relevant access logs may be provided to campus authorities upon formal written notice.',
    ],
  },
  {
    id: 'security-encryption',
    title: '4. Security & Encryption Standards',
    summary: 'Military-grade cryptographic measures protecting data in transit and at rest.',
    content: [
      'In Transit: 100% of all HTTP communications are strictly forced over HTTPS with TLS 1.3 encryption and HSTS preloading.',
      'At Rest: Database volumes and sensitive tables are encrypted using AES-256 encryption.',
      'Password Security: Passwords and access passkeys are salted and hashed using modern bcrypt/Argon2 algorithms. Raw passwords are never visible or retrievable by any FoodLine engineer.',
      'Session Security: Student authentication utilizes short-lived JWTs (JSON Web Tokens) with CSRF mitigation.',
    ],
  },
  {
    id: 'student-rights',
    title: '5. Student Rights (DPDP Act 2023 & GDPR)',
    summary: 'You retain full control over your digital personal data at all times.',
    content: [
      'Right to Access: You can review your complete order history, profile details, and registered contact information at any time from your Profile page.',
      'Right to Correction: You can update your contact Gmail or phone number if your college details change.',
      'Right to Erasure (Right to Be Forgotten): Students graduating or leaving campus may request full account deletion via email to foodlinecampus07@gmail.com. Transient operational data is purged within 24 hours while statutory audit logs are retained.',
      'Right to Grievance Redressal: Direct access to the statutory Grievance Officer, FoodLine Campus LLP to address any privacy concerns within 48 hours.',
    ],
  },
  {
    id: 'cookies-storage',
    title: '6. Cookies & Local Storage Policy',
    summary: 'Zero third-party tracking cookies; only functional device storage.',
    content: [
      'Essential Storage: Used exclusively to maintain your active session token (foodline_token), student PRN profile, and current meal cart items.',
      'Preference Storage: Remembers your UI settings such as Menu Grid vs. List mode and Dark/Light theme mode.',
      'Opt-Out & Reset: You can clear this data at any moment by signing out of FoodLine Campus or clearing your browser site storage.',
    ],
  },
  {
    id: 'retention-policy',
    title: '7. Data Retention & Anonymization',
    summary: '24-hour purge for transient session and cart state; statutory logs retained per legal requirements.',
    content: [
      'Transient Operational Data: Temporary order cache, active checkout sessions, and cart state are purged within 24 hours of completion or cancellation.',
      'Active Student Accounts: Maintained for the duration of the student enrollment at the university campus.',
      'Order & Financial Records: Stored for the statutory period required by Indian accounting and GST compliance (up to 7 fiscal years), after which transactional metadata is permanently purged.',
      'Inactive / Expired Accounts: Accounts with no ordering activity for over 24 consecutive months are scheduled for automatic data anonymization.',
    ],
  },
  {
    id: 'grievance-contact',
    title: '8. Grievance Redressal & Data Protection Officer',
    summary: 'Direct human support for data protection inquiries and institutional privacy concerns under DPDP Act 2023.',
    content: [
      'Data Fiduciary: FoodLine Campus LLP (Pending formal MCA registration).',
      'Statutory Grievance Officer: Grievance Officer, FoodLine Campus LLP.',
      'Official Privacy Support Email: foodlinecampus07@gmail.com.',
      'Campus Address: FoodLine Campus LLP Desk, Student Welfare Complex, Sanjivani University, Kopargaon, Ahmednagar District, Maharashtra — 423603.',
      'Response SLA: All formal privacy and data deletion inquiries receive an initial acknowledgment within 48 hours and formal resolution within 15 business days.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 flex-1 w-full space-y-8">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-accent-orange transition font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Back to Campus Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
              DPDP Act 2023 & GDPR Compliant
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-orange/10 text-accent-orange text-xs font-bold border border-accent-orange/20">
            <ShieldCheck size={14} />
            <span>Official Campus Legal Safeguards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            FoodLine Campus is committed to protecting student privacy, academic dignity, and financial security. 
            This policy outlines how student data is processed, stored, and protected across university canteens.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>Version: 2.1 (Intermediary & Digital Campus Edition)</span>
            <span>•</span>
            <Link href="/terms" className="text-accent-orange hover:underline font-semibold">
              View Terms of Service
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="text-accent-orange hover:underline font-semibold">
              View Refund Policy
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-accent-orange font-bold text-xs">
              <EyeOff size={16} />
              <span>Zero Ad Tracking</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We do not track student browsing habits or sell your contact information to commercial advertising networks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
              <Lock size={16} />
              <span>Zero Card/PIN Storage</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              All UPI transactions are processed through certified RBI-authorized gateways. Raw bank credentials never touch our database.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-500 font-bold text-xs">
              <Trash2 size={16} />
              <span>Right to Erasure</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Upon campus graduation or written request, students have the explicit legal right to have their personal profile permanently deleted.
            </p>
          </div>
        </div>

        <PrivacyContent sections={SECTIONS} />

        <div className="p-6 rounded-2xl bg-linear-to-r from-accent-orange/10 via-amber-500/10 to-transparent border border-accent-orange/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Have a privacy or data security question?
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Contact our Campus Grievance Officer at <a href="mailto:foodlinecampus07@gmail.com" className="text-accent-orange underline font-semibold">foodlinecampus07@gmail.com</a>.
            </p>
          </div>
          <Link
            href="/faq"
            className="px-4 py-2 rounded-xl bg-accent-orange text-white text-xs font-bold shadow-md hover:bg-accent-orange/90 transition shrink-0"
          >
            Campus FAQ & Help
          </Link>
        </div>
      </main>
    </div>
  );
}
