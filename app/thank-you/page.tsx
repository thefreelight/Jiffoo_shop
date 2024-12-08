import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/button";
import { HiArrowRight } from "react-icons/hi2";
import Link from "next/link";

export default function ThankYouPage() {
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
              href="https://github.com/your-repo"
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
        </div>
      </Container>
    </div>
  );
} 