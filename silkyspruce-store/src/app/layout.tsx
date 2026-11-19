import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MaintenanceMode from "@/components/MaintenanceMode";
import { AlertProvider } from "@/components/CustomAlert";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ReferralTracker from "@/components/ReferralTracker";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://silkyspruce.com"),
  title: {
    template: "%s | Silky Spruce",
    default: "Silky Spruce | Handcrafted Plant Based Skincare",
  },
  description:
    "Natural, handcrafted plant based skincare, body oils, hair oils, soaps, and wellness rituals made in Kenya.",
  keywords: [
    "Silky Spruce",
    "natural skincare Kenya",
    "plant based skincare Nairobi",
    "organic body oils Kenya",
    "beard oil Kenya",
    "shea body butter",
    "handcrafted soaps Kenya",
    "hair growth oil Kenya",
  ],
  authors: [{ name: "Silky Spruce", url: "https://silkyspruce.com" }],
  creator: "Silky Spruce",
  publisher: "Silky Spruce",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Silky Spruce | Handcrafted Plant Based Skincare",
    description:
      "Natural, handcrafted plant based skincare, body oils, hair oils, soaps, and wellness rituals made in Kenya.",
    url: "https://silkyspruce.com",
    siteName: "Silky Spruce",
    images: [
      {
        url: "/products/OpenGraph%20Banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Silky Spruce | Handcrafted Plant Based Skincare",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silky Spruce | Handcrafted Plant Based Skincare",
    description:
      "Natural, handcrafted plant based skincare, body oils, hair oils, soaps, and wellness rituals made in Kenya.",
    images: ["/products/OpenGraph%20Banner.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#111111] text-white antialiased min-h-screen flex flex-col`}>
        {isMaintenance ? (
          <MaintenanceMode />
        ) : (
          <AlertProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <ReferralTracker />
            </Suspense>
          </AlertProvider>
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}