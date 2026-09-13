import React from 'react';

/**
 * Organization & WebSite structured data (JSON-LD)
 * Establishes brand entity, URL, logo, and social search signals for FoodLine Campus.
 */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FoodLine Campus',
    url: 'https://campus.foodline.in',
    logo: 'https://campus.foodline.in/logo.png',
    description:
      'Next-Generation Campus Pre-Ordering, Break Slot Throttling & 30-Second Express Pickup Platform.',
    sameAs: [
      'https://www.instagram.com/foodline.campus',
      'https://linkedin.com/company/foodline-campus',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@foodline.in',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FoodLine Campus',
    url: 'https://campus.foodline.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://campus.foodline.in/menu?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

/**
 * FoodEstablishment / Restaurant structured data for campus canteens
 */
export function CanteenSchema({
  name = 'Cafe @7 — Sanjivani University',
  description = 'Sanjivani University Central Campus Food Court & Express Pickup Canteen',
  url = 'https://campus.foodline.in/canteens',
  image = 'https://campus.foodline.in/logo.png',
}: {
  name?: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name,
    description,
    image,
    url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sanjivani University Campus, Cafe @7',
      addressLocality: 'Kopargaon',
      addressRegion: 'Maharashtra',
      postalCode: '423603',
      addressCountry: 'IN',
    },
    servesCuisine: ['Indian', 'Fast Food', 'Snacks', 'Beverages', 'Street Food'],
    priceRange: '₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '18:00',
      },
    ],
    hasMenu: 'https://campus.foodline.in/menu',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage structured data for rich FAQ snippet accordions on SERP
 */
export function FaqSchema({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
