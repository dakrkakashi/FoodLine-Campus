import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Legal framework, slot reservations, UPI payments, FSSAI compliance, and student rights for FoodLine Campus at Sanjivani University.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms and Conditions | FoodLine Campus',
    description:
      'Tripartite agreement governing student pre-orders, express pickups, and canteen operations at Sanjivani University.',
    url: 'https://campus.foodline.in/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
