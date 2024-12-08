import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createCheckoutSession } from '@/lib/stripe';
import { authOptions } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { referralCode } = body;

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      referralCode,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error in checkout route:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 