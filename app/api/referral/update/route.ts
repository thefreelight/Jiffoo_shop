import { NextResponse } from 'next/server';
import { getServerSession as getServerSessionHelper } from 'next-auth/next';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';
import type { Session } from 'next-auth';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSessionHelper(authOptions) as Session | null;

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, discountPercent, commissionRate, maxUses, expiresAt, isActive } = body;

    if (!id) {
      return new NextResponse('Referral code ID is required', { status: 400 });
    }

    // Verify ownership
    const existingCode = await prisma.referralCode.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingCode) {
      return new NextResponse('Referral code not found', { status: 404 });
    }

    if (existingCode.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update the referral code
    const updatedCode = await prisma.referralCode.update({
      where: { id },
      data: {
        discountPercent: discountPercent !== undefined ? discountPercent : undefined,
        commissionRate: commissionRate !== undefined ? commissionRate : undefined,
        maxUses: maxUses !== undefined ? maxUses : undefined,
        expiresAt: expiresAt !== undefined ? new Date(expiresAt) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error('Error updating referral code:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 