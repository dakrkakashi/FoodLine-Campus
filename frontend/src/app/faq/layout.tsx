import type { Metadata } from 'next';
import { FaqSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Find answers to common student questions about express 30-sec pickup, break slot booking, UPI payments, and dining at Sanjivani University Cafe @7.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions | FoodLine Campus',
    description:
      'Everything students and staff need to know about pre-ordering, break slots, and express pickup at Sanjivani University Cafe @7.',
    url: 'https://campus.foodline.in/faq',
  },
};

const FAQ_STRUCTURED_DATA = [
  {
    question: 'How does express 30-second pickup work?',
    answer:
      'Order ahead from your lecture hall, pick your specific break slot (e.g. 1:15 PM - 1:25 PM), and pay via UPI. When your slot arrives, show your digital QR pass at the Express Pickup Counter at Cafe @7. The counter lead scans your pass and hands over your fresh tray in under 30 seconds.',
  },
  {
    question: 'What happens if my lecture runs late and I miss my slot?',
    answer:
      'Do not worry! Cafe @7 keeps your prepared meal warm in the staging zone for up to 15 minutes past your slot window. Your QR pass remains active during this grace period.',
  },
  {
    question: 'How do UPI payments and order verification work?',
    answer:
      'You scan the verified Canteen UPI QR and submit the 12-digit UPI Transaction ID (UTR). The canteen verification engine cross-checks the payment instantly and generates your unique 4-digit pickup OTP and pass.',
  },
  {
    question: 'What if a dish sells out while I am ordering?',
    answer:
      'FoodLine features real-time inventory locking. If an item sells out while you are browsing, the stock indicator updates immediately so you never pay for an unavailable meal.',
  },
  {
    question: 'Can I request takeaway packaging or low spice?',
    answer:
      'Yes! Before placing your order in the Food Tray, you can select Parcel / Takeaway or enter custom instructions (e.g. "extra napkins", "less spicy") directly for the kitchen chef.',
  },
];

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FaqSchema items={FAQ_STRUCTURED_DATA} />
      {children}
    </>
  );
}
