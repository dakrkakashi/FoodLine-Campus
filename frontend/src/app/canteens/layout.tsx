import type { Metadata } from 'next';
import { CanteenSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Campus Dining & Canteen Outlets',
  description:
    'Explore registered dining outlets and express food stalls at Sanjivani University, including Cafe @7, Nescafe Kiosk, and South Corner.',
  alternates: {
    canonical: '/canteens',
  },
  openGraph: {
    title: 'Campus Dining & Canteen Outlets | FoodLine Campus',
    description:
      'Check real-time counter rush, live meal inventory, and operating hours across all Sanjivani University campus dining locations.',
    url: 'https://campus.foodline.in/canteens',
  },
};

export default function CanteensLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CanteenSchema />
      {children}
    </>
  );
}
