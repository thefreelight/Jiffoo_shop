import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Pricing } from "@/components/pricing";
import { Companies } from "@/components/companies";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Special Offer - Jiffoo",
  description:
    "Limited time offer: Get lifetime access to Jiffoo's AI application source code for just $99 (67% off). One-time payment, no subscriptions.",
  openGraph: {
    images: ["https://ai-saas-template-aceternity.vercel.app/banner.png"],
  },
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <div className="flex flex-col items-center gap-4">
            <span className="px-4 py-1 bg-gradient-to-r from-[#0aa6fd]/10 to-[#2a2bdb]/10 rounded-full text-sm font-medium text-[#0aa6fd]">
              🎉 Limited Time Offer
            </span>
            <Heading as="h1" className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text text-center">
              Special Launch Price: 67% Off
            </Heading>
          </div>
          <Subheading className="text-center max-w-2xl mx-auto">
            Get instant access to our production-ready AI application source code for just $99.
            Hurry up - this special price won't last long!
          </Subheading>
        </div>
        <Pricing />
        <Companies />
      </Container>
    </div>
  );
}
