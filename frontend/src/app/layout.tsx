import type { Metadata, Viewport } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { OrganizationSchema } from '@/components/seo/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const viewport: Viewport = {
  themeColor: '#07070B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campus.foodline.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FoodLine Campus — Express Pre-Ordering & Pickup',
    template: '%s | FoodLine Campus',
  },
  description:
    'Skip the line, not the meal. Order ahead from class for 30-sec express collection at Sanjivani University Cafe @7.',
  keywords: [
    'canteen pre-ordering',
    'Sanjivani University',
    'Cafe @7',
    'foodline campus',
    'campus food pre-order',
    'express pickup',
    'break slot reservation',
    'student meal delivery',
  ],
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'FoodLine Campus — Express Pre-Ordering & Pickup',
    description:
      'Skip the line, not the meal. Order ahead from class for 30-sec express collection at Sanjivani University Cafe @7.',
    url: siteUrl,
    siteName: 'FoodLine Campus',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'FoodLine Campus — Express Pre-Ordering Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FoodLine Campus — Express Pre-Ordering & Pickup',
    description:
      'Order ahead from class for 30-sec express collection at Sanjivani University Cafe @7.',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
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
        <OrganizationSchema />
        <Providers>
          <div id="main-content" tabIndex={-1} className="outline-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
