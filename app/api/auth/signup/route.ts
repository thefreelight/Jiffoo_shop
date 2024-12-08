import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateReferralCode, getReferralRates } from "@/lib/referral";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

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

    const hashedPassword = await bcrypt.hash(password, 10);

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
      await tx.referralCode.create({
        data: {
          userId: user.id,
          code: generateReferralCode(),
          discountPercent: rates.discountPercent,
          commissionRate: rates.commissionRate,
          isActive: true,
        },
      });

      return user;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in signup:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 