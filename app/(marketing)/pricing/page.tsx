import prisma from "@/lib/prisma";
import type { Feature, PricingConfig } from "@prisma/client";

interface PricingConfigWithFeatures extends PricingConfig {
  features: Feature[];
}

async function getActivePricingConfig(): Promise<PricingConfigWithFeatures | null> {
  return prisma.pricingConfig.findFirst({
    where: { isActive: true },
    include: {
      features: {
        orderBy: { order: 'asc' }
      }
    }
  });
}

export default async function PricingPage() {
  const config = await getActivePricingConfig();
  
  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
              Pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
              Pricing information is not available at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = config.originalPrice > config.currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - config.currentPrice / config.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {hasDiscount && (
            <>
              <div className="inline-flex items-center rounded-full px-4 py-1 text-sm leading-6 text-blue-600 ring-1 ring-blue-600/10 bg-blue-50 dark:bg-blue-900/10">
                🎉 Limited Time Offer
              </div>
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb]">
                Special Launch Price: {discountPercentage}% Off
              </h1>
            </>
          )}
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            Get instant access to our production-ready AI application source code for just ${(config.currentPrice / 100).toFixed(2)}. {hasDiscount && "Hurry up - this special price won't last long!"}
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
                  {hasDiscount && (
                    <span className="text-sm font-semibold leading-6 tracking-wide text-neutral-600 dark:text-neutral-400 line-through">
                      ${(config.originalPrice / 100).toFixed(2)}
                    </span>
                  )}
                  <span className="text-5xl font-bold tracking-tight text-black dark:text-white">
                    ${(config.currentPrice / 100).toFixed(2)}
                  </span>
                </div>
                {hasDiscount && (
                  <div className="mt-2 text-sm text-blue-600">
                    Save ${((config.originalPrice - config.currentPrice) / 100).toFixed(2)}
                  </div>
                )}
                <div className="mt-10">
                  <div className="rounded-md bg-white dark:bg-black p-2.5">
                    <input
                      type="text"
                      placeholder="Enter referral code"
                      className="w-full bg-transparent border-0 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm"
                    />
                  </div>
                </div>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:from-[#2a2bdb] hover:to-[#0aa6fd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-500"
                >
                  Get Access Now
                </a>
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
