import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { IconMail, IconCalendar } from "@tabler/icons-react";
import { formatDistance } from "date-fns";

interface UserWithStats extends User {
  totalSpent: number;
  totalReferrals: number;
  totalCommissions: number;
  purchases: Purchase[];
  referralCodes: (ReferralCode & {
    uses: ReferralUse[];
    commissions: Commission[];
  })[];
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
}

interface Purchase {
  amount: number;
  status: string;
}

interface ReferralCode {
  uses: ReferralUse[];
  commissions: Commission[];
}

interface ReferralUse {
  id: string;
}

interface Commission {
  status: string;
  amount: number;
}

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      purchases: {
        where: { status: "completed" },
      },
      referralCodes: {
        include: {
          uses: true,
          commissions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user): UserWithStats => ({
    ...user,
    totalSpent: user.purchases.reduce((sum: number, purchase) => sum + purchase.amount, 0),
    totalReferrals: user.referralCodes.reduce((sum: number, code) => sum + code.uses.length, 0),
    totalCommissions: user.referralCodes.reduce((sum: number, code) => 
      sum + code.commissions.reduce((sum: number, commission) => 
        sum + (commission.status === 'paid' ? commission.amount : 0), 0
      ), 0
    ),
  }));
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage your users and their permissions
        </p>
      </div>

      <div className="grid gap-4">
        {users.map((user: UserWithStats) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="text-xl font-bold text-neutral-500">
                      {(user.name || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{user.name || "No name"}</div>
                  <div className="flex items-center text-sm text-neutral-500">
                    <IconMail className="mr-1 h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-sm text-neutral-500">
                    <IconCalendar className="mr-1 h-4 w-4" />
                    Joined {formatDistance(new Date(user.createdAt), new Date())} ago
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div>
                  <div className="font-medium">${(user.totalSpent / 100).toFixed(2)}</div>
                  <div className="text-neutral-500">Total Spent</div>
                </div>
                <div>
                  <div className="font-medium">{user.totalReferrals}</div>
                  <div className="text-neutral-500">Referrals</div>
                </div>
                <div>
                  <div className="font-medium">${(user.totalCommissions / 100).toFixed(2)}</div>
                  <div className="text-neutral-500">Earned</div>
                </div>
                <div>
                  <div className="font-medium">{user.role}</div>
                  <div className="text-neutral-500">Role</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 