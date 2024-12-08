import Stripe from 'stripe';
import { validateReferralCode, calculateDiscountedPrice } from './referral';
import prisma from '@/lib/prisma';
import { inviteUserToRepo } from './github';
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
  console.log('Starting handleCheckoutComplete for session:', session.id);
  const { userId, referralCodeId, basePrice, finalPrice, discountAmount } = session.metadata || {};
  
  if (!userId) {
    console.error('No userId found in session metadata');
    throw new Error('No userId found in session metadata');
  }

  try {
    console.log('Starting database transaction for user:', userId);
    // Start a transaction to ensure all database operations succeed or fail together
    await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => {
      // Create the purchase record
      console.log('Creating purchase record...');
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
      console.log('Purchase record created:', purchase.id);

      // Update user access
      console.log('Updating user access...');
      const user = await tx.user.update({
        where: { id: userId },
        data: { hasAccess: true },
      });
      console.log('User access updated for:', user.id);

      // If there was a referral code used, record it
      if (referralCodeId) {
        console.log('Processing referral code:', referralCodeId);
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
        console.log('Referral and commission records created');
      }

      // Send GitHub repository invitation
      if (user.email) {
        try {
          console.log('Sending GitHub invitation to:', user.email);
          await inviteUserToRepo(user.email);
          console.log('GitHub invitation sent successfully');
        } catch (error) {
          console.error('Failed to send GitHub invitation:', error);
          // Don't throw error here to avoid rolling back the transaction
          // We can handle this separately
        }
      }
    });
    console.log('Transaction completed successfully');
  } catch (error) {
    console.error('Error in handleCheckoutComplete:', error);
    throw error;
  }
} 