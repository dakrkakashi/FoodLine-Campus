import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://foodline-campus.vercel.app'),
  title: 'FoodLine - Campus Pre-Ordering & Express Pickup Ecosystem',
  description: 'Skip the line, not the meal. Order ahead from class for 30-sec express collection at Sanjivani University Cafe @7.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-canvas,#07070B)] text-[#F5F5F7] antialiased selection:bg-[var(--accent-orange,#FF6B2C)] selection:text-white font-sans relative overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
