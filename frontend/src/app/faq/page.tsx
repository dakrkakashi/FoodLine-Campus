'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Phone, Mail, HelpCircle, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { FAQAccordion } from '@/components/FAQAccordion';
import { PageTransition } from '@/components/ui';

export default function FAQPage() {
  return (
    <PageTransition className="min-h-screen flex flex-col justify-between bg-(--bg-canvas) text-(--text-primary) font-sans antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-(--text-secondary) hover:text-accent-orange transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Campus Support & Helpdesk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Everything students and staff need to know about ordering, pickup slots, UPI payments, and dining at Sanjivani University Cafe @7.
          </p>
        </div>

        {/* FAQ Accordion Component */}
        <div className="mb-14">
          <FAQAccordion />
        </div>

        {/* Contact / Helpdesk Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left">
            <div className="w-9 h-9 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center font-bold mb-3">
              <HelpCircle size={18} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">Canteen Helpdesk</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Counter #1, Ground Floor, Engineering Building Cafe @7.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left">
            <div className="w-9 h-9 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center font-bold mb-3">
              <Mail size={18} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">Email Support</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              foodlinecampus07@gmail.com for student queries and receipts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold mb-3">
              <MessageSquare size={18} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">Live UPI Help</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              UPI payment verification is instant. Show UTR at pickup if network fails.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 px-4 text-xs text-neutral-500 dark:text-neutral-400 text-center">
        FoodLine Campus Ecosystem • Sanjivani University, Kopargaon
      </footer>
    </PageTransition>
  );
}
