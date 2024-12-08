import { Heading } from "./heading";
import { Subheading } from "./subheading";
import Image from "next/image";
import { Button } from "./button";
import { HiArrowRight } from "react-icons/hi2";
import { IconCode, IconRocket } from "@tabler/icons-react";
import Link from "next/link";

const products = [
  {
    title: "NavToAI",
    description: "Launch your AI tools directory in minutes with our modern, customizable template.",
    image: "/navtoai.png",
    link: "/products/navtoai",
    comingSoon: false
  },
  {
    title: "Coming Soon",
    description: "Our next exciting product is in development. Stay tuned for updates!",
    icon: <IconCode className="w-12 h-12 text-white/80" />,
    link: "#",
    comingSoon: true
  },
  {
    title: "Coming Soon",
    description: "Another innovative solution on the horizon. Join our waitlist to be the first to know.",
    icon: <IconRocket className="w-12 h-12 text-white/80" />,
    link: "#",
    comingSoon: true
  }
];

export const ProductShowcase = () => {
  return (
    <div className="relative z-20 py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Heading as="h2" className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text">
            Our Products
          </Heading>
          <Subheading>
            A suite of modern tools and templates to accelerate your development
          </Subheading>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={index}
              className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                {product.comingSoon ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0aa6fd] to-[#2a2bdb] flex items-center justify-center">
                    <div className="text-center">
                      {product.icon}
                      <span className="text-white font-semibold text-lg block mt-4">Coming Soon</span>
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:64px_64px] animate-move-bg opacity-10"></div>
                  </div>
                ) : (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-transparent bg-clip-text">
                  {product.title}
                </h3>
                <p className="text-muted dark:text-muted-dark mb-4">
                  {product.description}
                </p>
                <Button
                  variant="simple"
                  as={Link}
                  href={product.link}
                  disabled={product.comingSoon}
                  className="flex space-x-2 items-center group text-[#0aa6fd] hover:text-[#2a2bdb] transition-colors duration-200"
                >
                  <span>Learn More</span>
                  <HiArrowRight className="text-current group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-all duration-200" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 