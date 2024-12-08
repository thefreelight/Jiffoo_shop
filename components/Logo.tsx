"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/logos/jiffoo-logo.svg"
      alt="Jiffoo Logo"
      width={360}
      height={120}
      className={className}
    />
  );
}
