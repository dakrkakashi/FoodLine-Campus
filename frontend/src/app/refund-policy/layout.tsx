import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description:
    'Read our 100% Direct UPI Refund guarantee within 15 minutes for kitchen stockouts, pre-cooking cancellations, and delayed orders.',
  alternates: {
    canonical: '/refund-policy',
  },
  openGraph: {
    title: 'Refund & Cancellation Policy | FoodLine Campus',
    description:
      'Clear policies on cancellations, 15-minute refund SLAs, and meal pickup grace periods at Sanjivani University Cafe @7.',
    url: 'https://campus.foodline.in/refund-policy',
  },
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
