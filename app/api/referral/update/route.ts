import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { updateReferralCode } from '@/lib/referral';
import { authOptions } from '@/auth';
import type { Session } from 'next-auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return new NextResponse('Code is required', { status: 400 });
    }

    const updatedCode = await updateReferralCode(session.user.id, code);
    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error('Error updating referral code:', error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
} 