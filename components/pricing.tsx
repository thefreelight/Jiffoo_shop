"use client";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function Pricing() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<{
    percent: number;
    amount: number;
    finalPrice: number;
    savedAmount: number;
  } | null>(null);

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

  const validateReferralCode = async () => {
    if (!referralCode) return;
    if (!session) {
      router.push('/login');
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/referral/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: referralCode }),
      });

      const data = await response.json();

      if (data.valid) {
        setDiscountInfo(data.discount);
        toast.success('Referral code applied successfully!');
      } else {
        setDiscountInfo(null);
        toast.error(data.error || 'Invalid referral code');
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      toast.error('Failed to validate referral code');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode: referralCode || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                  <span className="text-4xl font-bold bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text">
                    ${((discountInfo?.finalPrice || 9900) / 100).toFixed(2)}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">one-time</span>
                </div>
                <div className="text-sm text-[#0aa6fd] font-medium">
                  Save ${((discountInfo?.savedAmount || 20000) / 100).toFixed(2)}
                  {discountInfo && ` (${discountInfo.percent}% extra off)`}
                </div>
              </div>
            </div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              Get instant access to our production-ready AI application source code and start building today.
            </p>
            <div className="mt-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-[#0aa6fd]"
                />
                <Button
                  onClick={validateReferralCode}
                  disabled={isValidating || !referralCode}
                  className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
                >
                  {isValidating ? 'Validating...' : 'Apply'}
                </Button>
              </div>
            </div>
            <ul className="mt-8 space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <IconCircleCheckFilled className="h-5 w-5 text-[#0aa6fd]" />
                  <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500 py-6 text-lg font-semibold"
              >
                {isLoading ? 'Processing...' : 'Get Started Now'}
              </Button>
              <p className="mt-4 text-sm text-center text-neutral-500">
                Instant access • Lifetime updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
