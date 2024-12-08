"use client";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function Pricing() {
  const features = [
    "Full source code access",
    "Modern tech stack (Next.js 14, React, Tailwind)",
    "Beautiful UI components",
    "Authentication & user management",
    "Database integration",
    "API integration examples",
    "Deployment guides",
    "Premium email support",
    "Private Discord access",
    "Lifetime updates",
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="mx-auto mt-4 md:mt-10">
        <div className="relative bg-gradient-to-br from-[#0aa6fd]/10 to-[#2a2bdb]/10 rounded-2xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(255,255,255,0.6))]" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text">
                Lifetime Access
              </h3>
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl line-through text-neutral-400">$299</span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text">$99</span>
                  <span className="text-neutral-600 dark:text-neutral-400">one-time</span>
                </div>
                <div className="text-sm text-[#0aa6fd] font-medium">
                  Save $200 (67% off)
                </div>
              </div>
            </div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              Get instant access to our production-ready AI application source code and start building today.
            </p>
            <ul className="mt-8 space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <IconCircleCheckFilled className="h-5 w-5 text-[#0aa6fd]" />
                  <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button className="w-full bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500 py-6 text-lg font-semibold">
                Get Started Now
              </Button>
              <p className="mt-4 text-sm text-center text-neutral-500">
                30-day money-back guarantee • Instant access • Lifetime updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
