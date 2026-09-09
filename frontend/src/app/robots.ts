import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodline-campus.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/menu', '/terms', '/login'],
        disallow: ['/admin/', '/kds/', '/api/', '/checkout'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
