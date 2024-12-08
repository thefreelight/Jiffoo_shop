"use client";

import { useSession } from "next-auth/react";
import { Button } from "../button";
import { Logo } from "../Logo";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

export function DashboardHeader() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo className="h-12 w-36" />
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-base font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/referrals" 
                className="text-base font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              >
                Referrals
              </Link>
              <Link 
                href="/dashboard/commissions" 
                className="text-base font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              >
                Commissions
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="hidden md:flex md:items-center md:gap-2">
              <span className="text-base text-neutral-700 dark:text-neutral-300">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 