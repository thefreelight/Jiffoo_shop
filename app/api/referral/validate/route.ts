import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    const referralCode = await prisma.referralCode.findUnique({
      where: { 
        code,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });

    if (!referralCode) {
      return NextResponse.json(
        { error: "Invalid or expired referral code" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      discountPercent: referralCode.discountPercent,
      commissionRate: referralCode.commissionRate,
    });
  } catch (error) {
    console.error("Error validating referral code:", error);
    return NextResponse.json(
      { error: "Failed to validate referral code" },
      { status: 500 }
    );
  }
} 