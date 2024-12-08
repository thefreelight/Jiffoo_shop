import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import {
  IconUsers,
  IconReceipt,
  IconCreditCard,
  IconChartBar,
} from "@tabler/icons-react";

async function getStats() {
  const [
    totalUsers,
    totalPurchases,
    totalRevenue,
    totalCommissions,
    pendingCommissions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.purchase.count({
      where: { status: "completed" },
    }),
    prisma.purchase.aggregate({
      _sum: {
        amount: true,
      },
      where: { status: "completed" },
    }),
    prisma.commission.aggregate({
      _sum: {
        amount: true,
      },
      where: { status: "paid" },
    }),
    prisma.commission.aggregate({
      _sum: {
        amount: true,
      },
      where: { status: "pending" },
    }),
  ]);

  return {
    totalUsers,
    totalPurchases,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalCommissions: totalCommissions._sum.amount || 0,
    pendingCommissions: pendingCommissions._sum.amount || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: IconUsers,
      description: "Total registered users",
    },
    {
      title: "Total Sales",
      value: stats.totalPurchases,
      icon: IconReceipt,
      description: "Completed purchases",
    },
    {
      title: "Total Revenue",
      value: `$${(stats.totalRevenue / 100).toFixed(2)}`,
      icon: IconChartBar,
      description: "Total revenue from sales",
    },
    {
      title: "Total Commissions",
      value: `$${(stats.totalCommissions / 100).toFixed(2)}`,
      icon: IconCreditCard,
      description: "Paid affiliate commissions",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your application's performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {card.description}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-lg font-medium">Recent Orders</h3>
            {/* TODO: Add recent orders table */}
          </div>
        </Card>

        <Card className="col-span-3">
          <div className="p-6">
            <h3 className="text-lg font-medium">Pending Commissions</h3>
            <p className="mt-2 text-2xl font-bold">
              ${(stats.pendingCommissions / 100).toFixed(2)}
            </p>
            {/* TODO: Add pending commissions list */}
          </div>
        </Card>
      </div>
    </div>
  );
} 