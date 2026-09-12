'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does express 30-second pickup work?',
    answer:
      'Order ahead from your lecture hall, pick your specific break slot (e.g. 1:15 PM - 1:25 PM), and pay via UPI. When your slot arrives, show your digital QR pass at the Express Pickup Counter at Cafe @7. The counter lead scans your pass and hands over your fresh tray in under 30 seconds.',
  },
  {
    id: 'faq-2',
    question: 'What happens if my lecture runs late and I miss my slot?',
    answer:
      'Do not worry! Cafe @7 keeps your prepared meal warm in the staging zone for up to 15 minutes past your slot window. Your QR pass remains active during this grace period.',
  },
  {
    id: 'faq-3',
    question: 'How do UPI payments and order verification work?',
    answer:
      'You scan the verified Canteen UPI QR and submit the 12-digit UPI Transaction ID (UTR). The canteen verification engine cross-checks the payment instantly and generates your unique 4-digit pickup OTP and pass.',
  },
  {
    id: 'faq-4',
    question: 'What if a dish sells out while I am ordering?',
    answer:
      'FoodLine features real-time inventory locking. If an item sells out while you are browsing, the stock indicator updates immediately so you never pay for an unavailable meal.',
  },
  {
    id: 'faq-5',
    question: 'Can I request takeaway packaging or low spice?',
    answer:
      'Yes! Before placing your order in the Food Tray, you can select Parcel / Takeaway or enter custom instructions (e.g. "extra napkins", "less spicy") directly for the kitchen chef.',
  },
];

export function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section aria-labelledby="faq-heading" className="w-full max-w-3xl mx-auto my-12 px-4">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Student Helpdesk</span>
        </div>
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-extrabold text-(--text-primary)">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-(--text-secondary) max-w-md mx-auto">
          Everything you need to know about pre-ordering, break slots, and picking up meals at Sanjivani Cafe @7.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-card,#12121A)]/80 backdrop-blur-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left text-sm font-bold text-(--text-primary) hover:text-accent-orange transition cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-accent-orange shrink-0" />
                  <span>{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-(--text-muted) transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-accent-orange' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-(--text-secondary) leading-relaxed border-t border-[var(--border-glass)]/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
