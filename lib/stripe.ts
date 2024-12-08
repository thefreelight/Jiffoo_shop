import Stripe from 'stripe';
import { validateReferralCode, calculateDiscountedPrice } from './referral';
import { PrismaClient } from '@prisma/client';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

interface CreateCheckoutSessionOptions {
  userId: string;
  referralCode?: string;
}

export async function createCheckoutSession({ userId, referralCode }: CreateCheckoutSessionOptions) {
  let basePrice = 9900; // $99.00 in cents
  let referralCodeData = null;

  // If referral code is provided, validate and apply discount
  if (referralCode) {
    const validation = await validateReferralCode(referralCode, userId);
    if (validation.valid && validation.referralCode) {
      referralCodeData = validation.referralCode;
      const priceData = calculateDiscountedPrice(basePrice, validation.referralCode.discountPercent);
      basePrice = priceData.finalPrice;
    }
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'NavToAI Source Code',
            description: 'Complete source code access with lifetime updates',
          },
          unit_amount: basePrice,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId,
      referralCodeId: referralCodeData?.id || '',
      basePrice: '9900',
      finalPrice: basePrice.toString(),
      discountAmount: referralCodeData ? (9900 - basePrice).toString() : '0',
    },
  });

  return checkoutSession;
}

export async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { userId, referralCodeId, basePrice, finalPrice, discountAmount } = session.metadata || {};
  
  if (!userId) {
    throw new Error('No userId found in session metadata');
  }

  const prisma = new PrismaClient();
  
  try {
    // Start a transaction to ensure all database operations succeed or fail together
    await prisma.$transaction(async (tx: PrismaClient) => {
      // Create the purchase record
      const purchase = await tx.purchase.create({
        data: {
          userId,
          amount: parseInt(finalPrice || '9900'),
          currency: session.currency || 'usd',
          status: 'completed',
          paymentId: session.payment_intent as string,
          accessGranted: true,
        },
      });

      // Update user access
      await tx.user.update({
        where: { id: userId },
        data: { hasAccess: true },
      });

      // If there was a referral code used, record it
      if (referralCodeId) {
        await tx.referralUse.create({
          data: {
            referralCodeId,
            userId,
            purchaseId: purchase.id,
            discountAmount: parseInt(discountAmount || '0'),
            finalPrice: parseInt(finalPrice || '9900'),
          },
        });

        // Create commission record
        await tx.commission.create({
          data: {
            referralCodeId,
            purchaseId: purchase.id,
            amount: Math.round((parseInt(finalPrice || '9900') * 30) / 100), // 30% commission
            status: 'pending',
          },
        });
      }
    });
  } finally {
    await prisma.$disconnect();
  }
} 