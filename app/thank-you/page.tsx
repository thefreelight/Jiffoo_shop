import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/button";
import { HiArrowRight } from "react-icons/hi2";
import Link from "next/link";
import { getRepoUrl } from "@/lib/github";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

async function checkUserAccess(userId: string, maxRetries = 10): Promise<boolean> {
  console.log(`Starting access check for user ${userId}`);
  
  for (let i = 0; i < maxRetries; i++) {
    console.log(`Access check attempt ${i + 1} of ${maxRetries}`);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.hasAccess) {
      console.log('User access confirmed');
      return true;
    }

    console.log(`Access not found, waiting 2 seconds before retry ${i + 1}`);
    // Wait for 2 seconds before retrying
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('Max retries reached without finding access');
  return false;
}

export default async function ThankYouPage({
  searchParams: { session_id }
}: {
  searchParams: { session_id?: string }
}) {
  console.log('Thank you page loaded with session_id:', session_id);

  if (!session_id) {
    console.log('No session_id provided');
    redirect('/pricing');
  }

  try {
    // Retrieve the checkout session
    console.log('Retrieving checkout session...');
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    console.log('Checkout session retrieved:', {
      id: checkoutSession.id,
      status: checkoutSession.status,
      payment_status: checkoutSession.payment_status
    });

    const userId = checkoutSession.metadata?.userId;

    if (!userId) {
      console.error('No userId found in session metadata');
      redirect('/pricing');
    }

    // Check if payment is completed
    if (checkoutSession.payment_status !== 'paid') {
      console.error('Payment not completed. Status:', checkoutSession.payment_status);
      redirect('/pricing');
    }

    console.log('Payment confirmed as paid, checking user access...');

    // Check user access with retries
    const hasAccess = await checkUserAccess(userId);
    if (!hasAccess) {
      console.error('User access not granted after all retries');
      redirect('/pricing');
    }

    console.log('User access confirmed, rendering thank you page');

    const repoUrl = getRepoUrl();

    return (
      <div className="relative overflow-hidden py-20 md:py-40">
        <Background />
        <Container className="flex flex-col items-center justify-between pb-20">
          <div className="relative z-20">
            <div className="flex flex-col items-center gap-4">
              <span className="px-4 py-1 bg-gradient-to-r from-[#0aa6fd]/10 to-[#2a2bdb]/10 rounded-full text-sm font-medium text-[#0aa6fd]">
                🎉 Thank You for Your Purchase!
              </span>
              <Heading as="h1" className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text text-center">
                Welcome to the Jiffoo Family
              </Heading>
            </div>
            <Subheading className="text-center max-w-2xl mx-auto">
              Your purchase was successful! You now have lifetime access to the NavToAI source code.
              Check your email for further instructions on accessing the code repository.
            </Subheading>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as="a"
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
              >
                Access Source Code
              </Button>
              <Button
                variant="simple"
                as={Link}
                href="/docs"
                className="flex space-x-2 items-center group text-[#0aa6fd] hover:text-[#2a2bdb] transition-colors duration-200"
              >
                <span>View Documentation</span>
                <HiArrowRight className="text-current group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-all duration-200" />
              </Button>
            </div>
            <p className="mt-6 text-sm text-center text-neutral-500">
              Note: You should receive a GitHub invitation email shortly. Please accept it to access the repository.
              If you don't receive the invitation within 5 minutes, please contact support.
            </p>
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    console.error('Error in thank-you page:', error);
    redirect('/pricing');
  }
} 