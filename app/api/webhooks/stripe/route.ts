import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any,
  timeout: 10000,
  maxNetworkRetries: 3,
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature in request', { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Error verifying webhook signature:', err);
      return new NextResponse(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (!metadata) {
        return new NextResponse('No metadata in session', { status: 400 });
      }

      const { userId, referralCodeId, discountAmount, finalPrice } = metadata;

      // 先查找购买记录
      const existingPurchase = await prisma.purchase.findFirst({
        where: {
          paymentId: session.id,
        },
      });

      if (!existingPurchase) {
        // 如果找不到现有记录，创建新记录
        const purchase = await prisma.purchase.create({
          data: {
            userId,
            amount: parseInt(finalPrice),
            currency: 'usd',
            status: 'completed',
            paymentId: session.id,
            accessGranted: true,
          },
        });

        // 更新用户访问权限
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            hasAccess: true,
          },
        });

        // 如果使用了推广码，创建佣金记录
        if (referralCodeId) {
          await prisma.commission.create({
            data: {
              referralCodeId,
              purchaseId: purchase.id,
              amount: Math.round(parseInt(finalPrice) * 0.1), // 10% commission
              status: 'pending',
            },
          });
        }
      } else {
        // 如果找到现有记录，更新它
        const purchase = await prisma.purchase.update({
          where: {
            id: existingPurchase.id,
          },
          data: {
            status: 'completed',
            accessGranted: true,
          },
        });

        // 更新用户访问权限
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            hasAccess: true,
          },
        });

        // 如果使用了推广码，更新佣金状态
        if (referralCodeId) {
          await prisma.commission.update({
            where: {
              purchaseId: purchase.id,
            },
            data: {
              status: 'pending',
            },
          });
        }
      }
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new NextResponse(`Webhook error: ${error.message}`, { status: 500 });
  }
} 