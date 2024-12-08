import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { handleCheckoutComplete } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
      throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
    }

    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      console.error('No stripe-signature in webhook request');
      return new NextResponse('No signature', { status: 400 });
    }

    console.log('Received webhook. Verifying signature...');
    console.log('Webhook secret length:', webhookSecret.length);
    console.log('Signature:', signature);
    console.log('Raw body length:', body.length);

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook signature verified. Event type:', event.type);
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return new NextResponse(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing checkout.session.completed. Session ID:', session.id);
      console.log('Session metadata:', session.metadata);
      
      try {
        await handleCheckoutComplete(session);
        console.log('Successfully processed checkout completion for session:', session.id);
      } catch (error) {
        console.error('Error processing checkout completion:', error);
        // In development, we'll return the error to help with debugging
        if (process.env.NODE_ENV === 'development') {
          return new NextResponse(`Error processing webhook: ${error.message}`, { status: 500 });
        }
        // In production, acknowledge receipt so Stripe will retry
        return new NextResponse(null, { status: 200 });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error in Stripe webhook:', error);
    // In development, return detailed error
    if (process.env.NODE_ENV === 'development') {
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }
    return new NextResponse('Webhook Error', { status: 400 });
  }
} 