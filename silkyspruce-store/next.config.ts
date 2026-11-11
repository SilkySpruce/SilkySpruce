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
        source: '/collections/:slug*',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/products/:slug*',
        destination: '/shop/:slug*',
        permanent: true,
      },
      {
        source: '/api/event/collect',
        destination: '/',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;