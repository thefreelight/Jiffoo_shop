"use client";

import { Heading } from "./heading";
import { Subheading } from "./subheading";
import Image from "next/image";

export const Features = () => {
  return (
    <div className="relative z-20 py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Heading as="h2">Launch AI Apps at Lightning Speed</Heading>
          <Subheading>
            Jiffoo provides battle-tested AI application source code,
            helping developers and businesses launch production-ready AI solutions in minutes, not months.
          </Subheading>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Ready-to-Use Code Feature */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Production-Ready AI Source Code</h3>
            <p className="text-muted dark:text-muted-dark">
              Skip months of development with our curated collection of AI applications.
              Each codebase is thoroughly tested, documented, and ready for immediate deployment.
            </p>
            <div className="space-y-4">
              <div className="relative h-[300px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                  alt="Clean Code Example"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-[300px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src="https://images.unsplash.com/photo-1671726203638-83742a2721a1"
                  alt="AI Application Example"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quick Launch Feature */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Deploy in Minutes</h3>
            <p className="text-muted dark:text-muted-dark">
              From chatbots to image generators, get your AI application up and running instantly.
              Just clone, configure, and launch.
            </p>
            <div className="relative h-[640px] rounded-2xl overflow-hidden bg-white dark:bg-gray-800 p-6 shadow-lg">
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm">$ git clone jiffoo/ai-chatbot-template</p>
                </div>
                <div className="bg-black text-white p-4 rounded-lg">
                  <p className="text-sm">Cloning into 'ai-chatbot-template'...</p>
                  <p className="text-sm">Done in 2.1s</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm">$ cd ai-chatbot-template && yarn install</p>
                </div>
                <div className="bg-black text-white p-4 rounded-lg">
                  <p className="text-sm">Installing dependencies...</p>
                  <p className="text-sm">✨ Done in 18.2s</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm">$ yarn dev</p>
                </div>
                <div className="bg-black text-white p-4 rounded-lg">
                  <p className="text-sm">🚀 Ready on http://localhost:3000</p>
                  <p className="text-sm text-gray-400">Your AI chatbot is now live!</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900 p-4 rounded-lg">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Time to production: 3 minutes</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Saved 720 hours of development time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
