import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { IconCalendar, IconUser, IconReceipt } from "@tabler/icons-react";
import { formatDistance } from "date-fns";
import { Purchase, User, ReferralUse } from "@prisma/client";
import { Button } from "@/components/button";

type UserWithNullableFields = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  hashedPassword: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  hasAccess: boolean;
};

interface OrderWithRelations extends Omit<Purchase, 'user'> {
  user: UserWithNullableFields;
  referralUse: (ReferralUse & {
    referralCode: {
      user: UserWithNullableFields;
    };
  }) | null;
}

export default async function OrdersPage() {
  const orders = await prisma.purchase.findMany({
    include: {
      user: true,
      referralUse: {
        include: {
          referralCode: {
            include: {
              user: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  }) as OrderWithRelations[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          View and manage all orders
        </p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
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
                {order.status === "pending" && (
                  <form action={async () => {
                    "use server";
                    await prisma.purchase.update({
                      where: { id: order.id },
                      data: {
                        status: "completed",
                        accessGranted: true
                      },
                    });
                  }}>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
                    >
                      Grant Access
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 