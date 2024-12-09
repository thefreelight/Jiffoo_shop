import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

    const formattedUsers = users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
      totalSpent: user.purchases.reduce((sum, purchase) => sum + purchase.amount, 0),
      totalReferrals: user.referralCodes.reduce((sum, code) => sum + code.uses.length, 0),
      totalCommissions: user.referralCodes.reduce((sum, code) => 
        sum + code.commissions.reduce((sum, commission) => 
          sum + (commission.status === 'paid' ? commission.amount : 0), 0
        ), 0
      ),
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 