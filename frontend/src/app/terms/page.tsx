import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { TermsContent } from '@/components/legal/TermsContent';

export const metadata: Metadata = {
  title: 'Terms & Conditions | FoodLine Campus',
  description:
    'Official University Canteen By-Laws, DPDP Act 2023 Compliance, and Fair Usage Policy for Sanjivani University.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) selection:bg-accent-orange/20 selection:text-accent-orange font-sans">
      <Navbar />
      <TermsContent />
    </div>
  );
}
