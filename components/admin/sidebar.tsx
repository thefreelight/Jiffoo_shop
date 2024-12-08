"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconDashboard,
  IconUsers,
  IconReceipt,
  IconCreditCard,
  IconSettings,
  IconChartBar,
} from "@tabler/icons-react";
import { Logo } from "../Logo";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: IconDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: IconUsers,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: IconReceipt,
  },
  {
    name: "Commissions",
    href: "/admin/commissions",
    icon: IconCreditCard,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: IconChartBar,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: IconSettings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex w-64 flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/admin" className="flex items-center gap-4">
                <Logo className="h-12 w-auto" />
                <span className="text-lg font-semibold">Admin</span>
              </Link>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive
                          ? "text-black dark:text-white"
                          : "text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 