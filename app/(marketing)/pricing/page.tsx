'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import prisma from "@/lib/prisma";

interface Feature {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface PricingConfig {
  id: string;
  originalPrice: number;
  currentPrice: number;
  features: Feature[];
}

async function getActivePricingConfig(): Promise<PricingConfig | null> {
  const response = await fetch('/api/pricing/active');
  if (!response.ok) return null;
  return response.json();
}

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [referralDiscount, setReferralDiscount] = useState<number>(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 验证推广码 - 使用 useCallback 包装函数
  const validateReferralCode = useCallback(async (codeToValidate?: string | React.MouseEvent) => {
    const codeToUse = typeof codeToValidate === 'string' ? codeToValidate : referralCode;
    
    if (!codeToUse || typeof codeToUse !== 'string' || !codeToUse.trim()) {
      setError('Please enter a referral code');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response = await fetch('/api/referral/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: codeToUse.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid referral code');
        setReferralDiscount(0);
        localStorage.removeItem('referralCode');
      } else {
        setReferralDiscount(data.discountPercent);
        localStorage.setItem('referralCode', codeToUse.trim());
      }
    } catch (err) {
      setError('Failed to validate referral code');
      setReferralDiscount(0);
      localStorage.removeItem('referralCode');
    } finally {
      setIsValidating(false);
    }
  }, [referralCode]); // 添加依赖项

  // 加载初始价格配置
  useEffect(() => {
    getActivePricingConfig().then(setConfig);
  }, []);

  // 处理推广码
  useEffect(() => {
    const urlCode = searchParams.get('referralCode');
    const savedCode = localStorage.getItem('referralCode');
    
    // 优先使用 URL 中的推广码，其次使用保存的推广码
    const code = urlCode || savedCode || '';
    if (code && code !== referralCode) {
      setReferralCode(code);
      validateReferralCode(code);
    }
  }, [searchParams, validateReferralCode]); // 添加 validateReferralCode 作为依赖项

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
              Pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
              Loading pricing information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = config.originalPrice > config.currentPrice;
  const baseDiscountPercentage = hasDiscount 
    ? Math.round((1 - config.currentPrice / config.originalPrice) * 100)
    : 0;

  // 计算最终价格
  const finalPrice = referralDiscount > 0
    ? config.currentPrice * (1 - referralDiscount / 100)
    : config.currentPrice;

  // 计算总折扣
  const totalDiscountPercentage = referralDiscount > 0
    ? Math.round((1 - finalPrice / config.originalPrice) * 100)
    : baseDiscountPercentage;

  // 处理结算
  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 如果用户未登录，保存当前URL并重定向到登录页
      if (!session) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/login?callbackUrl=${returnUrl}`);
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode: referralDiscount > 0 ? referralCode : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // 重定向到 Stripe 结算页面
      window.location.href = data.url;
    } catch (err) {
      setError('Failed to initiate checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {(hasDiscount || referralDiscount > 0) && (
            <>
              <div className="inline-flex items-center rounded-full px-4 py-1 text-sm leading-6 text-blue-600 ring-1 ring-blue-600/10 bg-blue-50 dark:bg-blue-900/10">
                🎉 Special Offer
              </div>
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb]">
                Special Price: {totalDiscountPercentage}% Off
              </h1>
            </>
          )}
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            Get instant access to our production-ready AI application source code for just ${(finalPrice / 100).toFixed(2)}. 
            {(hasDiscount || referralDiscount > 0) && "Hurry up - this special price won't last long!"}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-neutral-200 dark:ring-neutral-800 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white">Lifetime Access</h3>
            <p className="mt-6 text-base leading-7 text-neutral-600 dark:text-neutral-400">
              Get instant access to our production-ready AI application source code and start building today.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-blue-600">What's included</h4>
              <div className="h-px flex-auto bg-neutral-100 dark:bg-neutral-800"></div>
            </div>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400 sm:grid-cols-2 sm:gap-6">
              {config.features.map((feature) => (
                <li key={feature.id} className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span>
                    <strong className="font-semibold text-black dark:text-white">{feature.title}</strong> {feature.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 py-10 text-center ring-1 ring-inset ring-neutral-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-neutral-600 dark:text-neutral-400">One-time payment</p>
                <div className="mt-6 flex items-baseline justify-center gap-x-2">
                  {(hasDiscount || referralDiscount > 0) && (
                    <span className="text-sm font-semibold leading-6 tracking-wide text-neutral-600 dark:text-neutral-400 line-through">
                      ${(config.originalPrice / 100).toFixed(2)}
                    </span>
                  )}
                  <span className="text-5xl font-bold tracking-tight text-black dark:text-white">
                    ${(finalPrice / 100).toFixed(2)}
                  </span>
                </div>
                {(hasDiscount || referralDiscount > 0) && (
                  <div className="mt-2 text-sm text-blue-600">
                    Save ${((config.originalPrice - finalPrice) / 100).toFixed(2)}
                  </div>
                )}
                <div className="mt-10">
                  <div className="space-y-2">
                    <div className="relative rounded-md">
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Enter referral code"
                        className="w-full rounded-md bg-white dark:bg-black p-2.5 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}
                    <button
                      onClick={validateReferralCode}
                      disabled={isValidating || !referralCode || !referralCode.trim()}
                      className="w-full rounded-md bg-blue-50 dark:bg-blue-900/10 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isValidating ? 'Validating...' : 'Apply Code'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="mt-10 block w-full rounded-md bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:from-[#2a2bdb] hover:to-[#0aa6fd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-500 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Get Access Now'}
                </button>
                <p className="mt-6 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
