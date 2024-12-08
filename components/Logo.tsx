"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center relative z-20">
      <div className="w-[200px] h-[60px] rounded-lg relative">
        <Image 
          src="/logos/jiffoo-logo.svg"
          alt="Jiffoo Logo"
          fill
          className="object-contain p-2"
          priority
        />
      </div>
    </Link>
  );
};
