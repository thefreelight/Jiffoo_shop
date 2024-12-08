import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createReferralCode } from '@/lib/referral';
import { authOptions } from '@/auth';
import type { Session } from 'next-auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { code, discountPercent, commissionRate, maxUses, expiresAt } = body;

    const referralCode = await createReferralCode(session.user.id, {
      code,
      discountPercent,
      commissionRate: commissionRate || 30, // Default to 30%
      maxUses: maxUses || undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
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