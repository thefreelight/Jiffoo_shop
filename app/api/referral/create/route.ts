import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createReferralCode } from '@/lib/referral';
import { authOptions } from '@/auth';
import type { Session } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user already has a referral code
    const existingCode = await prisma.referralCode.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (existingCode) {
      return new NextResponse('You already have a referral code', { status: 400 });
    }

    const body = await req.json();
    const { code } = body;

    // Use fixed system values
    const referralCode = await createReferralCode(session.user.id, {
      code,
      discountPercent: 20, // Fixed 20% discount
      commissionRate: 30,  // Fixed 30% commission
      maxUses: undefined,  // No limit on uses
      expiresAt: undefined // No expiration
    });

    return NextResponse.json(referralCode);
  } catch (error) {
    console.error('Error creating referral code:', error);
    if (error instanceof Error && error.message === 'This referral code already exists') {
      return new NextResponse('Referral code already exists', { status: 400 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
} 