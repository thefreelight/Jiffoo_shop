import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new NextResponse("No user found with this email", { status: 401 });
    }

    if (!user.hashedPassword) {
      return new NextResponse("Please login with OAuth provider", { status: 401 });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isCorrectPassword) {
      return new NextResponse("Invalid password", { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 