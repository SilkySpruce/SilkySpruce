import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/collections',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/collections/:path*',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/products/:slug((?!.*\\.(?:png|jpg|jpeg|webp|gif|svg|ico)$).*)',
        destination: '/shop/:slug',
        permanent: true,
      },
      {
        source: '/pages/about-us',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/pages/contact',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/pages/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blogs/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/policies/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/policies/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/policies/:path*',
        destination: '/terms',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;