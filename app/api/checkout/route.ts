import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  timeout: 10000, // 10 second timeout
  maxNetworkRetries: 3, // Increase retry attempts
});

// Helper function to add delay between retries
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to create Stripe checkout session with retries
async function createStripeCheckoutSession(params: Stripe.Checkout.SessionCreateParams, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await stripe.checkout.sessions.create(params);
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      
      console.log(`Stripe session creation failed (attempt ${attempt}/${maxRetries}):`, error.message);
      // Exponential backoff: 1s, 2s, 4s
      await wait(Math.pow(2, attempt - 1) * 1000);
    }
  }
}

export async function POST(request: Request) {
  try {
    // 1. 检查用户是否登录
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please login to continue' },
        { status: 401 }
      );
    }

    // 获取或创建用户
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 2. 解析请求数据
    const body = await request.json();
    console.log('Request body:', body);
    const { referralCode } = body;

    const headersList = headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // 3. 获取价格配置
    const config = await prisma.pricingConfig.findFirst({
      where: { isActive: true },
    });

    console.log('Price config:', config);

    if (!config) {
      console.log('No active price config found');
      return NextResponse.json(
        { error: 'No active pricing configuration found' },
        { status: 404 }
      );
    }

    // 4. 计算最终价格
    let finalPrice = config.currentPrice;
    let referralCodeRecord = null;

    if (referralCode) {
      console.log('Validating referral code:', referralCode);
      referralCodeRecord = await prisma.referralCode.findUnique({
        where: {
          code: referralCode,
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      });

      console.log('Referral code record:', referralCodeRecord);

      if (referralCodeRecord) {
        finalPrice = Math.round(finalPrice * (1 - referralCodeRecord.discountPercent / 100));
        console.log('Final price after discount:', finalPrice);
      }
    }

    // 5. 创建 Stripe 会话
    console.log('Creating Stripe session with price:', finalPrice);
    const checkoutSession = await createStripeCheckoutSession({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Jiffoo - AI Application Source Code',
              description: 'Lifetime access to production-ready AI application source code',
            },
            unit_amount: finalPrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        referralCode: referralCode || '',
        userId: user.id,
      },
      customer_email: user.email || undefined,
    });

    if (!checkoutSession?.url) {
      throw new Error('Failed to create Stripe checkout session URL');
    }

    // 6. 创建待处理的购买记录
    const purchase = await prisma.purchase.create({
      data: {
        amount: finalPrice,
        currency: 'usd',
        status: 'pending',
        paymentId: checkoutSession.id,
        userId: user.id,
        accessGranted: false,
      }
    });

    console.log('Purchase record created:', purchase.id);

    // 7. 如果使用了推广码，创建佣金记录
    if (referralCodeRecord) {
      const commissionAmount = Math.round(finalPrice * (referralCodeRecord.commissionRate / 100));
      console.log('Creating commission record:', {
        amount: commissionAmount,
        referralCodeId: referralCodeRecord.id,
        purchaseId: purchase.id,
      });

      // 创建推广码使用记录
      await prisma.referralUse.create({
        data: {
          referralCodeId: referralCodeRecord.id,
          userId: user.id,
          purchaseId: purchase.id,
          discountAmount: config.currentPrice - finalPrice,
          finalPrice: finalPrice,
        }
      });

      // 创建佣金记录
      await prisma.commission.create({
        data: {
          amount: commissionAmount,
          status: 'pending',
          referralCodeId: referralCodeRecord.id,
          purchaseId: purchase.id,
        }
      });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code,
      raw: error.raw,
    });

    const errorMessage = error.type === 'StripeConnectionError' 
      ? 'Failed to connect to payment service. Please try again.'
      : 'Checkout error';

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message,
        type: error.type,
        code: error.code,
      },
      { status: 500 }
    );
  }
} 