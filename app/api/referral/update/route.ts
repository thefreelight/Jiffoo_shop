import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getSystemSettings } from '@/lib/settings';

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Find the user's existing referral code
    const existingCode = await prisma.referralCode.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!existingCode) {
      return NextResponse.json({ error: "No referral code found" }, { status: 404 });
    }

    // Get system settings for default values
    const settings = await getSystemSettings();

    // Update the code with new settings
    const updatedCode = await prisma.referralCode.update({
      where: {
        id: existingCode.id,
      },
      data: {
        code: code.toUpperCase(),
        discountPercent: settings.defaultDiscountPercent,
        commissionRate: settings.defaultCommissionRate,
      },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error("Error updating referral code:", error);
    return NextResponse.json(
      { error: "Failed to update referral code" },
      { status: 500 }
    );
  }
} 