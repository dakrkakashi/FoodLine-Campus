import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & DPDP Act Compliance',
  description:
    'Our commitment to student data protection under the Digital Personal Data Protection (DPDP) Act 2023. Data minimization, 24h record cleanup, and zero ads.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy & DPDP Act Compliance | FoodLine Campus',
    description:
      'Learn how FoodLine Campus handles student information with DPDP Act 2023 compliance, data minimization, and statutory right to erasure.',
    url: 'https://campus.foodline.in/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
