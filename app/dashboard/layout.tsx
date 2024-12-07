"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconLogout, IconDashboard, IconUser } from "@tabler/icons-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* 侧边栏 */}
      <div className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <Link href="/dashboard" className="text-xl font-bold text-black dark:text-white">
            Dashboard
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                <IconDashboard className="h-5 w-5" />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                <IconUser className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-black dark:text-white">
              Welcome back, {session?.user?.name || "User"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            <IconLogout className="h-5 w-5" />
            <span>Sign out</span>
          </button>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 