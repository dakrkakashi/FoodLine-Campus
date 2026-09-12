'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  FileText,
  Mail,
  Building2,
  Trash2,
  Database,
  CheckCircle2,
  ArrowLeft,
  Search,
  Clock,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';

interface PolicySection {
  id: string;
  title: string;
  summary: string;
  content: string[];
}

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
    title: '2. Purpose of Data Processing',
    summary: 'Every data point serves a verifiable functional purpose under India DPDP Act 2023 & GDPR principles.',
    content: [
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
      'Licensed Payment Gateways: Transaction identifiers are securely processed via RBI-authorized aggregators under strict PCI-DSS v4 compliance.',
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
      'Right to Erasure (Right to Be Forgotten): Students graduating or leaving campus may request full account deletion. Order logs will be cryptographically anonymized for statutory tax and canteen audit purposes while personal records are deleted.',
      'Right to Grievance Redressal: Access to an appointed Grievance Officer to address any privacy concerns within 48 business hours.',
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
    summary: 'Data is held only for as long as needed for academic and accounting compliance.',
    content: [
      'Active Student Accounts: Maintained for the duration of the student enrollment at the university campus.',
      'Order & Financial Records: Stored for the statutory period required by Indian accounting and GST compliance (up to 7 fiscal years), after which transactional metadata is permanently purged.',
      'Inactive / Expired Accounts: Accounts with no ordering activity for over 24 consecutive months are scheduled for automatic data anonymization.',
    ],
  },
  {
    id: 'grievance-contact',
    title: '8. Grievance Redressal & Data Protection Officer',
    summary: 'Direct human support for data protection inquiries and institutional privacy concerns.',
    content: [
      'Grievance Redressal Officer: Chief Compliance Lead, FoodLine Campus.',
      'Official Privacy Support Email: grievance@foodlinecampus.com (copy: foodlinecampus07@gmail.com).',
      'Campus Address: FoodLine Campus Operations Desk, Sanjivani University, Kopargaon, Maharashtra - 423603, India.',
      'Response SLA: All formal privacy and data deletion inquiries receive an initial acknowledgment within 24 hours and resolution within 15 calendar days.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <PageTransition className="min-h-screen flex flex-col justify-between bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100">
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

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search privacy clauses (e.g., 'refund', 'delete', 'UPI', 'canteen sharing')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] transition-all"
          />
        </div>

        <div className="space-y-6">
          {filteredSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-accent-orange" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                    {section.title}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {section.summary}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                {section.content.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0 mt-1.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {filteredSections.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
              No clauses matched your search query. Please try another search term or browse all sections above.
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-linear-to-r from-accent-orange/10 via-amber-500/10 to-transparent border border-accent-orange/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Have a privacy or data security question?
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Contact our Campus Grievance Officer at <a href="mailto:grievance@foodlinecampus.com" className="text-accent-orange underline font-semibold">grievance@foodlinecampus.com</a>.
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
    </PageTransition>
  );
}
