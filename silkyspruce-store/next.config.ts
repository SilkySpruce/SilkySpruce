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
    ];
  },
};

export default nextConfig;