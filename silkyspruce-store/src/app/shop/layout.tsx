import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Plant Based Skincare & Oils | Silky Spruce',
  description: 'Handcrafted plant based remedies sourced from nature.',
  alternates: {
    canonical: 'https://silkyspruce.com/shop',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}