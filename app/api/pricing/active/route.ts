import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.pricingConfig.findFirst({
      where: { isActive: true },
      include: {
        features: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!config) {
      return NextResponse.json(
        { error: "No active pricing configuration found" },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching active pricing config:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing configuration" },
      { status: 500 }
    );
  }
} 