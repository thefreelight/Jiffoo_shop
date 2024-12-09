import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 删除用户相关的所有数据
    await prisma.$transaction([
      // 删除用户的推广码
      prisma.referralCode.deleteMany({
        where: { userId: params.id }
      }),
      // 删除用户的账号
      prisma.account.deleteMany({
        where: { userId: params.id }
      }),
      // 删除用户本身
      prisma.user.delete({
        where: { id: params.id }
      })
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 