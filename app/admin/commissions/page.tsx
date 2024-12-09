import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { IconCalendar, IconUser, IconCreditCard } from "@tabler/icons-react";
import { formatDistance } from "date-fns";
import { Commission, User } from "@prisma/client";
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

interface CommissionWithRelations extends Omit<Commission, 'referralCode' | 'purchase'> {
  referralCode: {
    user: UserWithNullableFields;
  };
  purchase: {
    user: UserWithNullableFields;
  };
}

export default async function CommissionsPage() {
  const commissions = await prisma.commission.findMany({
    include: {
      referralCode: {
        include: {
          user: true
        }
      },
      purchase: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  }) as CommissionWithRelations[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Commissions</h2>
        <p className="text-muted-foreground">
          Manage affiliate commissions and payouts
        </p>
      </div>

      <div className="grid gap-4">
        {commissions.map((commission) => (
          <Card key={commission.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <IconCreditCard className="h-6 w-6 text-neutral-500" />
                </div>
                <div>
                  <div className="font-medium">
                    Commission #{commission.id.slice(-8)}
                  </div>
                  <div className="flex items-center text-sm text-neutral-500">
                    <IconUser className="mr-1 h-4 w-4" />
                    {commission.referralCode.user.email}
                  </div>
                  <div className="flex items-center text-sm text-neutral-500">
                    <IconCalendar className="mr-1 h-4 w-4" />
                    {formatDistance(new Date(commission.createdAt), new Date())} ago
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div>
                  <div className="font-medium">
                    ${(commission.amount / 100).toFixed(2)}
                  </div>
                  <div className="text-neutral-500">Amount</div>
                </div>
                <div>
                  <div className="font-medium capitalize">{commission.status}</div>
                  <div className="text-neutral-500">Status</div>
                </div>
                <div>
                  <div className="font-medium">
                    {commission.purchase.user.email}
                  </div>
                  <div className="text-neutral-500">Referred User</div>
                </div>
                {commission.status === "pending" && (
                  <form action={async () => {
                    "use server";
                    await prisma.commission.update({
                      where: { id: commission.id },
                      data: {
                        status: "paid",
                        paidAt: new Date(),
                      },
                    });
                  }}>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
                    >
                      Mark as Paid
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