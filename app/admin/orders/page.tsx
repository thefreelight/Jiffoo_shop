import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { IconCalendar, IconUser, IconReceipt } from "@tabler/icons-react";
import { formatDistance } from "date-fns";

interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  user: {
    email: string;
  };
  referralUse?: {
    referralCode: {
      user: {
        email: string;
      };
    };
  };
}

async function getOrders() {
  return prisma.purchase.findMany({
    include: {
      user: true,
      referralUse: {
        include: {
          referralCode: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          View and manage all orders
        </p>
      </div>

      <div className="grid gap-4">
        {orders.map((order: Order) => (
          <Card key={order.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <IconReceipt className="h-6 w-6 text-neutral-500" />
                </div>
                <div>
                  <div className="font-medium">Order #{order.id.slice(-8)}</div>
                  <div className="flex items-center text-sm text-neutral-500">
                    <IconUser className="mr-1 h-4 w-4" />
                    {order.user.email}
                  </div>
                  <div className="flex items-center text-sm text-neutral-500">
                    <IconCalendar className="mr-1 h-4 w-4" />
                    {formatDistance(new Date(order.createdAt), new Date())} ago
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div>
                  <div className="font-medium">${(order.amount / 100).toFixed(2)}</div>
                  <div className="text-neutral-500">Amount</div>
                </div>
                <div>
                  <div className="font-medium capitalize">{order.status}</div>
                  <div className="text-neutral-500">Status</div>
                </div>
                {order.referralUse && (
                  <div>
                    <div className="font-medium">
                      {order.referralUse.referralCode.user.email}
                    </div>
                    <div className="text-neutral-500">Referred By</div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 