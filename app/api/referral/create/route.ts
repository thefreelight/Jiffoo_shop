import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createReferralCode } from '@/lib/referral';
import { authOptions } from '@/lib/auth';
import type { Session } from 'next-auth';
import prisma from '@/lib/prisma';
import { getSystemSettings } from '@/lib/settings';

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a referral code
    const existingCode = await prisma.referralCode.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (existingCode) {
      return NextResponse.json(
        { error: "User already has a referral code" },
        { status: 400 }
      );
    }

    // Get system settings for default values
    const settings = await getSystemSettings();

    // Create new referral code
    const referralCode = await prisma.referralCode.create({
      data: {
        userId: session.user.id,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercent: settings.defaultDiscountPercent,
        commissionRate: settings.defaultCommissionRate,
        isActive: true,
      },
    });

    return NextResponse.json(referralCode);
  } catch (error) {
    console.error("Error creating referral code:", error);
    return NextResponse.json(
      { error: "Failed to create referral code" },
      { status: 500 }
    );
  }
} 