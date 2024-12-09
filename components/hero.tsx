"use client";

import Balancer from "react-wrap-balancer";
import { Button } from "./button";
import { HiArrowRight } from "react-icons/hi2";
import { Badge } from "./badge";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen pt-20 md:pt-40 relative overflow-hidden">
      <motion.div
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
        }}
        className="flex justify-center"
      >
        <Badge onClick={() => router.push("/blog")} className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500">
          🚀 Launch Your Directory in Minutes
        </Badge>
      </motion.div>
      <motion.h1
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
        }}
        className="text-2xl md:text-4xl lg:text-8xl font-semibold max-w-6xl mx-auto text-center mt-6 relative z-10 bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text"
      >
        <Balancer>Build Your Own Directory with NavToAI</Balancer>
      </motion.h1>
      <motion.p
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.2,
        }}
        className="text-center mt-6 text-base md:text-xl text-muted dark:text-muted-dark max-w-3xl mx-auto relative z-10"
      >
        <Balancer>
          Get the complete source code of NavToAI and launch your AI tools directory in minutes. 
          Modern tech stack, beautiful UI, and ready for customization.
        </Balancer>
      </motion.p>
      <motion.div
        initial={{
          y: 80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.4,
        }}
        className="flex items-center gap-4 justify-center mt-6 relative z-10"
      >
        <Button href="/pricing" className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500">Get Source Code</Button>
        <Button
          variant="simple"
          href="https://navtoai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex space-x-2 items-center group text-[#0aa6fd] hover:text-[#2a2bdb] transition-colors duration-200"
        >
          <span>View Demo</span>
          <HiArrowRight className="text-current group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-all duration-200" />
        </Button>
      </motion.div>
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-[32px] mt-20 relative">
        <div className="absolute inset-x-0 bottom-0 h-40 w-full bg-gradient-to-b from-transparent to-white dark:to-black scale-[1.1] pointer-events-none" />
        <div className="p-2 bg-white dark:bg-black rounded-[24px]">
          <Image
            src="/navtoai.png"
            alt="NavToAI Dashboard"
            width={1920}
            height={1080}
            className="rounded-[20px]"
          />
        </div>
      </div>
    </div>
  );
};
