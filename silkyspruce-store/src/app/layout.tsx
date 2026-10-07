import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Silky Spruce',
    default: 'Silky Spruce | Handcrafted Botanical Skincare'
  },
  description: 'Natural, handcrafted botanical skincare, soaps, and wellness rituals made in Kenya.',
  metadataBase: new URL('https://silkyspruce.co.ke'), // Replace with your actual domain when you buy it
  openGraph: {
    title: 'Silky Spruce | Handcrafted Botanical Skincare',
    description: 'Natural, handcrafted botanical skincare, soaps, and wellness rituals made in Kenya.',
    url: 'https://silkyspruce.co.ke',
    siteName: 'Silky Spruce',
    images: [
      {
        url: '/products/Silky Spruce Logo.png',
        width: 1200,
        height: 630,
        alt: 'Silky Spruce Botanical Skincare',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silky Spruce | Handcrafted Botanical Skincare',
    description: 'Natural, handcrafted botanical skincare, soaps, and wellness rituals.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#111111] text-white antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}