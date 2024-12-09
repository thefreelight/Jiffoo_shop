import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { validateReferralCode, generateReferralCode, getReferralRates } from "@/lib/referral";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, referralCode } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // Validate referral code if provided
    if (referralCode) {
      const validation = await validateReferralCode(referralCode, '');
      if (!validation.valid) {
        return new NextResponse(validation.error || "Invalid referral code", { status: 400 });
      }
    }

    const hashedPassword = await hash(password, 12);

    // Create user and generate referral code in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email,
          name,
          hashedPassword,
        },
      });

      // Get referral rates for the user's role
      const rates = await getReferralRates('user');

      // Generate and create referral code
      const userReferralCode = await tx.referralCode.create({
        data: {
          userId: user.id,
          code: generateReferralCode(),
          discountPercent: rates.discountPercent,
          commissionRate: rates.commissionRate,
          isActive: true,
        },
      });

      // If user signed up with a referral code, record the use
      if (referralCode) {
        const referrerCode = await tx.referralCode.findUnique({
          where: { code: referralCode },
        });

        if (referrerCode) {
          await tx.referralUse.create({
            data: {
              referralCodeId: referrerCode.id,
              userId: user.id,
              purchaseId: 'signup_' + user.id, // Special case for signup referrals
              discountAmount: 0, // No discount for signup referrals
              finalPrice: 0, // No price for signup referrals
            },
          });
        }
      }

      return user;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in signup:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 