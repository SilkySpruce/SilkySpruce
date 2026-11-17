import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://silkyspruce.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/admin', '/cart', '/api/', '/unsubscribe'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}