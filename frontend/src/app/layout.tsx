import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const viewport: Viewport = {
  themeColor: '#07070B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://foodline-campus.vercel.app'),
  title: {
    default: 'FoodLine Campus — Express Pre-Ordering & Pickup',
    template: '%s | FoodLine Campus',
  },
  description: 'Skip the line, not the meal. Order ahead from class for 30-sec express collection at Sanjivani University Cafe @7.',
  keywords: [
    'canteen pre-ordering',
    'Sanjivani University',
    'Cafe @7',
    'foodline',
    'campus food delivery',
    'express pickup',
    'break slot reservation',
  ],
  openGraph: {
    title: 'FoodLine Campus — Express Pre-Ordering & Pickup',
    description: 'Skip the line, not the meal. Order ahead from class for 30-sec express collection at Sanjivani University Cafe @7.',
    url: 'https://foodline-campus.vercel.app',
    siteName: 'FoodLine Campus',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'FoodLine Campus Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'FoodLine Campus — Express Pre-Ordering & Pickup',
    description: 'Order ahead from class for 30-sec express collection at Sanjivani University Cafe @7.',
    images: ['/logo.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FoodLine Campus',
  },
  applicationName: 'FoodLine Campus',
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FoodLine Campus" />
        <meta name="application-name" content="FoodLine Campus" />
        <meta name="theme-color" content="#07070B" />
      </head>
      <body className="min-h-screen bg-(--bg-canvas,#07070B) text-(--text-primary) antialiased selection:bg-(--accent-orange,#FF6B2C) selection:text-white font-sans relative overflow-x-hidden transition-colors duration-300">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-accent-orange text-white text-xs font-bold rounded-xl shadow-lg ring-2 ring-white transition"
        >
          Skip to main content
        </a>
        <Providers>
          <div id="main-content" tabIndex={-1} className="outline-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
