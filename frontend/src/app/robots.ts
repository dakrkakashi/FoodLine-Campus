import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campus.foodline.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/menu',
          '/canteens',
          '/faq',
          '/terms',
          '/privacy',
          '/refund-policy',
          '/login',
          '/onboarding',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/kds',
          '/kds/*',
          '/api/*',
          '/checkout',
          '/checkout/*',
          '/order/*',
          '/orders',
          '/orders/*',
          '/profile',
          '/profile/*',
          '/debug',
          '/debug/*',
          '/display/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
