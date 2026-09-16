'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';

export interface PolicySection {
  id: string;
  title: string;
  summary: string;
  content: string[];
}

export function PrivacyContent({ sections }: { sections: PolicySection[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
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
          <div
            key={section.id}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3 transition-opacity"
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
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
            No clauses matched your search query. Please try another search term or browse all sections above.
          </div>
        )}
      </div>
    </>
  );
}
