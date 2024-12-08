import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { handleCheckoutComplete } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function POST(req: Request) {
  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
    }

    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature', { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await handleCheckoutComplete(session);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error in Stripe webhook:', error);
    return new NextResponse('Webhook Error', { status: 400 });
  }
} 