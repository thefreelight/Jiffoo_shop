"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Welcome, {session?.user?.name || "User"}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 统计卡片 */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-aceternity">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Profile Status
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Your profile is complete
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-aceternity">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Account Type
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Free Plan
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-aceternity">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Last Login
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-aceternity overflow-hidden">
            <div className="p-6">
              <p className="text-neutral-600 dark:text-neutral-400">
                No recent activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 