import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json({ error: "Already logged in" }, { status: 400 });
    }

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Note: We don't need to implement actual login logic here
    // because NextAuth.js handles authentication through its own routes
    // This route is just a placeholder for any additional login-related functionality
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { error: "Failed to process login" },
      { status: 500 }
    );
  }
} 