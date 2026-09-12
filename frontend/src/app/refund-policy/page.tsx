'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  RotateCcw,
  Clock,
  ArrowLeft,
  Banknote,
  Receipt,
  Utensils,
  AlertTriangle,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition } from '@/components/ui';

interface RefundRule {
  state: string;
  badge: string;
  badgeColor: string;
  cancellable: boolean;
  refundPercentage: string;
  description: string;
  conditions: string[];
}

const RULES: RefundRule[] = [
  {
    state: 'Order Placed (Awaiting Kitchen Acceptance)',
    badge: '100% Refund Available',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    cancellable: true,
    refundPercentage: '100% Full Refund',
    description: 'If you placed an accidental order or wish to cancel before the kitchen marks the item as preparing, 100% immediate cancellation is permitted.',
    conditions: [
      'Cancellation must be requested before canteen staff changes order status to PREPARING.',
      'The entire payment is returned directly to the originating payment method (UPI VPA or Bank Account).',
    ],
  },
  {
    state: 'Food Preparing or Ready for Pickup',
    badge: 'Non-Cancellable',
    badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    cancellable: false,
    refundPercentage: '0% (Perishable Item Exemption)',
    description: 'Under Indian Consumer Protection (E-Commerce) Rules 2020, freshly cooked and perishable foods cannot be cancelled once cooking commences.',
    conditions: [
      'Canteen kitchen staff allocate and cook fresh perishable ingredients once an order is accepted.',
      'Cancellations are strictly disabled after the token status moves to PREPARING or READY.',
      'Students are requested to arrive at the designated counter within their assigned time window.',
    ],
  },
  {
    state: 'Canteen Out of Stock / Kitchen Rejection',
    badge: 'Auto 100% Refund',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    cancellable: true,
    refundPercentage: '100% Full Refund + Immediate Alert',
    description: 'If ingredients run out or the kitchen cannot fulfill your dish due to equipment or rush limitations, the order is automatically cancelled with a full refund.',
    conditions: [
      'Processed automatically without requiring manual student dispute intervention.',
      'An instant notification is sent to your registered Gmail address with cancellation details.',
    ],
  },
  {
    state: 'Expired / Uncollected Food Orders',
    badge: 'Forfeited After Window',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    cancellable: false,
    refundPercentage: '0% Non-Refundable',
    description: 'Meals are kept hot and sanitized at Counter #2 for up to 30 minutes following the close of your designated pickup window.',
    conditions: [
      'Perishable food items must be discarded after the grace period to comply with campus health and FSSAI hygiene standards.',
      'No refund or token credit is issued for orders that were prepared but never collected by the student.',
    ],
  },
];

export default function RefundPolicyPage() {
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
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold border border-blue-500/20">
              E-Commerce Rules 2020 Compliant
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold border border-blue-500/20">
            <RotateCcw size={14} />
            <span>Transparent Student Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            FoodLine Campus adheres to clear, deterministic rules for meal cancellations, kitchen rejections, and UPI transaction reversals.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>Intermediary Platform Guidelines</span>
            <span>•</span>
            <Link href="/privacy" className="text-accent-orange hover:underline font-semibold">
              View Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="text-accent-orange hover:underline font-semibold">
              View Terms of Service
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
              <Clock size={16} />
              <span>Instant UPI Reversal</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Approved refunds via UPI are initiated back to the student originating VPA handle typically within minutes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-accent-orange font-bold text-xs">
              <Banknote size={16} />
              <span>No Hidden Deductions</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Eligible refunds are processed at 100% of the dish price. No cancellation penalty or handling fee is charged to students.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-500 font-bold text-xs">
              <Receipt size={16} />
              <span>Audit Trail Receipt</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every cancellation generates a formal refund reference ID sent to your registered Gmail for bank tracking.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <Utensils size={18} className="text-accent-orange" />
            <span>Order Lifecycle & Refund Eligibility Matrix</span>
          </h2>

          <div className="space-y-4">
            {RULES.map((rule, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                    {rule.state}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border shrink-0 ${rule.badgeColor}`}>
                    {rule.badge}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {rule.description}
                </p>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5">
                  <div className="text-[11px] font-bold text-neutral-900 dark:text-white">
                    Refund Amount: <span className="text-accent-orange">{rule.refundPercentage}</span>
                  </div>
                  {rule.conditions.map((cond, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <AlertTriangle size={18} />
            <span>Failed UPI Payments & UTR Discrepancies</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            In rare cases where money is debited from your bank account but the screen shows payment pending:
          </p>
          <ul className="space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 pl-4 list-disc">
            <li><strong>Auto-Reversal:</strong> Under NPCI banking guidelines, uncredited UPI transactions are automatically reversed back to your bank account within 24 to 48 banking hours.</li>
            <li><strong>Counter Verification:</strong> If the canteen counter manager can view your payment reference on their dashboard, they will manually activate your token.</li>
            <li><strong>Support Escalation:</strong> You can submit your 12-digit UPI UTR number directly to our campus support email for manual verification.</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Need help with a meal refund or dispute?
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Email our Campus Support Desk at <a href="mailto:foodlinecampus07@gmail.com" className="text-blue-500 underline font-semibold">foodlinecampus07@gmail.com</a>.
            </p>
          </div>
          <Link
            href="/orders"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition shrink-0"
          >
            Check My Orders
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}
