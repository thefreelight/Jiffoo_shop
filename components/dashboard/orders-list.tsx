"use client";

import { Card } from "@/components/ui/card";
import { IconCalendar, IconReceipt } from "@tabler/icons-react";
import { formatDistance } from "date-fns";

interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  referralUse?: {
    referralCode: {
      user: {
        email: string;
      };
    };
  };
}

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted dark:text-muted-dark">
          You haven't made any purchases yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <IconReceipt className="h-6 w-6 text-neutral-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-neutral-500">
                    <IconCalendar className="inline-block h-4 w-4 mr-1" />
                    {formatDistance(new Date(order.createdAt), new Date())} ago
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(order.amount / 100).toFixed(2)}</p>
                  <p className="text-sm text-neutral-500 capitalize">{order.status}</p>
                </div>
              </div>
              {order.referralUse && (
                <p className="text-sm text-neutral-500 mt-2">
                  Referred by: {order.referralUse.referralCode.user.email}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 