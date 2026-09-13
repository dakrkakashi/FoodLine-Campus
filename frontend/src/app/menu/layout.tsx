import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Campus Food Menu & Live Inventory',
  description:
    'Browse 100% pure vegetarian campus dining options at Sanjivani University Cafe @7. Check real-time dish availability and pre-order meals for express pickup.',
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: 'Campus Food Menu & Live Inventory | FoodLine Campus',
    description:
      'Explore 40+ hot campus meals, snacks, dosas, and beverages available for express 30-sec collection at Cafe @7.',
    url: 'https://campus.foodline.in/menu',
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
