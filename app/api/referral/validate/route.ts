import { NextResponse } from 'next/server';
import { getServerSession as getServerSessionHelper } from 'next-auth/next';
import { validateReferralCode, calculateDiscountedPrice } from '@/lib/referral';
import { authOptions } from '@/auth';
import type { Session } from 'next-auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSessionHelper(authOptions) as Session | null;

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return new NextResponse('Referral code is required', { status: 400 });
    }

    const validation = await validateReferralCode(code, session.user.id);

    if (!validation.valid) {
      return NextResponse.json({
        valid: false,
        error: validation.error,
      });
    }

    const priceData = calculateDiscountedPrice(9900, validation.referralCode.discountPercent);

    return NextResponse.json({
      valid: true,
      discount: {
        percent: validation.referralCode.discountPercent,
        amount: priceData.discount,
        originalPrice: priceData.originalPrice,
        basePrice: priceData.basePrice,
        finalPrice: priceData.finalPrice,
        savedAmount: priceData.savedAmount,
      },
    });
  } catch (error) {
    console.error('Error validating referral code:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 