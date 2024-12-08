"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heading } from "./heading";
import { Subheading } from "./subheading";

export const Companies = () => {
  let [logos, setLogos] = useState([
    [
      {
        title: "Next.js",
        src: "https://cdn.simpleicons.org/nextdotjs/000000",
      },
      {
        title: "React",
        src: "https://cdn.simpleicons.org/react/61DAFB",
      },
      {
        title: "Tailwind CSS",
        src: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
      },
      {
        title: "TypeScript",
        src: "https://cdn.simpleicons.org/typescript/3178C6",
      },
    ],
    [
      {
        title: "Next.js",
        src: "https://cdn.simpleicons.org/nextdotjs/000000",
      },
      {
        title: "React",
        src: "https://cdn.simpleicons.org/react/61DAFB",
      },
      {
        title: "Tailwind CSS",
        src: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
      },
      {
        title: "TypeScript",
        src: "https://cdn.simpleicons.org/typescript/3178C6",
      },
    ],
  ]);
  const [activeLogoSet, setActiveLogoSet] = useState(logos[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const flipLogos = () => {
    setLogos((currentLogos) => {
      const newLogos = [...currentLogos.slice(1), currentLogos[0]];
      setActiveLogoSet(newLogos[0]);
      setIsAnimating(true);
      return newLogos;
    });
  };

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        flipLogos();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Built with Modern Tech Stack</Heading>
      <Subheading className="text-center">
        Powered by the latest web technologies for optimal performance and developer experience.
      </Subheading>

      <div className="flex gap-10 flex-wrap justify-center md:gap-40 relative h-full w-full mt-20">
        {activeLogoSet.map((logo, idx) => (
          <div
            key={logo.title}
            className="relative group hover:scale-110 transition-transform duration-200"
          >
            <div className="w-16 h-16 relative dark:invert">
              <Image
                src={logo.src}
                alt={logo.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-sm text-muted dark:text-muted-dark whitespace-nowrap">
                {logo.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
