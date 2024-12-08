"use client";

import { useSession } from "next-auth/react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../button";
import Link from "next/link";
import { IconMenu2, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

export function AdminHeader() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center flex-1">
            <button
              type="button"
              className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-neutral-700 dark:text-neutral-300"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <IconMenu2 className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-6 flex flex-1">
              <div className="flex w-full md:ml-0">
                <div className="relative w-full text-neutral-400 focus-within:text-neutral-600 dark:focus-within:text-neutral-300">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <IconSearch className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="block h-full w-full border-transparent bg-transparent py-2 pl-10 pr-3 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center gap-4">
            <ModeToggle />
            <div className="hidden md:flex md:items-center md:gap-2">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {session?.user?.email}
              </span>
              <Button variant="simple" as={Link} href="/api/auth/signout">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 