import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Referral code ID is required" }, { status: 400 });
    }

    // Verify the referral code belongs to the user
    const referralCode = await prisma.referralCode.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
    }

    // Delete the referral code
    await prisma.referralCode.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting referral code:", error);
    return NextResponse.json(
      { error: "Failed to delete referral code" },
      { status: 500 }
    );
  }
} 