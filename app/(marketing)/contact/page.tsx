import { Background } from "@/components/background";
import { Metadata } from "next";
import { FeaturedTestimonials } from "@/components/featured-testimonials";
import { cn } from "@/lib/utils";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { ContactForm } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact Us - Jiffoo",
  description: "Get in touch with the Jiffoo team",
  openGraph: {
    title: "Contact Us - Jiffoo",
    description: "Get in touch with the Jiffoo team",
    images: [
      {
        url: '/banner/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Contact Jiffoo'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Jiffoo',
    description: 'Get in touch with the Jiffoo team',
    images: ['/banner/og-banner.png'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
            Contact Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            With lots of SaaS applications around, Jiffoo stands out with its unique features and capabilities. 
            Get in touch with us to learn more about how we can help you build your next project faster.
          </p>
        </div>
        <div className="mt-16">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
