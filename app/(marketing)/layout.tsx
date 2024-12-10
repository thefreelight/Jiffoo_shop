import type { Metadata } from "next";
import "../globals.css";
import { GeistSans } from "geist/font/sans";
import { NavBar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Jiffoo",
  description: "Launch your apps as fast as a bullet. Speed up your success!",
  openGraph: {
    title: "Jiffoo",
    description: "Launch your apps as fast as a bullet. Speed up your success!",
    url: 'https://jiffoo.com',
    siteName: 'Jiffoo',
    images: [
      {
        url: '/banner/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Jiffoo - Launch your apps as fast as a bullet'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jiffoo',
    description: 'Launch your apps as fast as a bullet. Speed up your success!',
    images: ['/banner/og-banner.png'],
    creator: '@jiffoo',
    site: '@jiffoo'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
