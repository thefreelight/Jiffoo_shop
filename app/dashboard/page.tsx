import { Container } from "@/components/container";
import { DashboardHeader } from "@/components/dashboard/header";
import { ReferralCodesList } from "@/components/dashboard/referral-codes-list";
import { CommissionStats } from "@/components/dashboard/commission-stats";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OrdersList } from "@/components/dashboard/orders-list";

interface ReferralCode {
  id: string;
  code: string;
  discountPercent: number;
  commissionRate: number;
  isActive: boolean;
  maxUses: number | null;
  expiresAt: Date | null;
  uses: Array<any>;
  commissions: Array<{
    status: string;
    amount: number;
  }>;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch user's referral codes and commission data
  const [referralCodes, orders] = await Promise.all([
    prisma.referralCode.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        uses: true,
        commissions: true,
      },
    }),
    prisma.purchase.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        referralUse: {
          include: {
            referralCode: {
              include: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  // Calculate total stats
  const stats = referralCodes.reduce((acc: {
    totalUses: number;
    totalCommission: number;
    pendingCommission: number;
  }, code: ReferralCode) => {
    const totalUses = code.uses.length;
    const totalCommission = code.commissions.reduce((sum, commission) => 
      sum + (commission.status === 'paid' ? commission.amount : 0), 0);
    const pendingCommission = code.commissions.reduce((sum, commission) => 
      sum + (commission.status === 'pending' ? commission.amount : 0), 0);

    return {
      totalUses: acc.totalUses + totalUses,
      totalCommission: acc.totalCommission + totalCommission,
      pendingCommission: acc.pendingCommission + pendingCommission,
    };
  }, {
    totalUses: 0,
    totalCommission: 0,
    pendingCommission: 0,
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <DashboardHeader />
      <Container className="py-10">
        <div className="space-y-10">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted dark:text-muted-dark">
              Manage your orders and referral codes
            </p>
          </div>
          
          <CommissionStats stats={stats} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Orders</h2>
              </div>
              <OrdersList orders={orders} />
            </section>
            
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Referral Code</h2>
              </div>
              <ReferralCodesList 
                referralCodes={referralCodes}
                basePrice={9900}
              />
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
} 