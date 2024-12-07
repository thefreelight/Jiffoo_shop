"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-aceternity overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    defaultValue={session?.user?.name || ""}
                    className="block w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-2 focus:ring-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    defaultValue={session?.user?.email || ""}
                    className="block w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-2 focus:ring-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 