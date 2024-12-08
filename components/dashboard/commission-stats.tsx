"use client";

import { IconUsers, IconCurrencyDollar, IconClock } from "@tabler/icons-react";

interface CommissionStatsProps {
  stats: {
    totalUses: number;
    totalCommission: number;
    pendingCommission: number;
  };
}

export function CommissionStats({ stats }: CommissionStatsProps) {
  const cards = [
    {
      title: "Total Referrals",
      value: stats.totalUses,
      icon: <IconUsers className="h-5 w-5 text-[#0aa6fd]" />,
    },
    {
      title: "Total Commission",
      value: `$${(stats.totalCommission / 100).toFixed(2)}`,
      icon: <IconCurrencyDollar className="h-5 w-5 text-[#0aa6fd]" />,
    },
    {
      title: "Pending Commission",
      value: `$${(stats.pendingCommission / 100).toFixed(2)}`,
      icon: <IconClock className="h-5 w-5 text-[#0aa6fd]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 relative overflow-hidden group hover:border-[#0aa6fd] transition-colors duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0aa6fd]/5 to-[#2a2bdb]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {card.title}
              </p>
              <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text">
                {card.value}
              </p>
            </div>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
} 