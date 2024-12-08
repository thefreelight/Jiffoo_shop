import { Container } from "@/components/container";
import { DashboardHeader } from "@/components/dashboard/header";
import { ReferralCodesList } from "@/components/dashboard/referral-codes-list";
import { CommissionStats } from "@/components/dashboard/commission-stats";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

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
  const referralCodes = await prisma.referralCode.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      uses: true,
      commissions: true,
    },
  });

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
          <CommissionStats stats={stats} />
          <ReferralCodesList 
            referralCodes={referralCodes}
            basePrice={9900}
          />
        </div>
      </Container>
    </div>
  );
} 