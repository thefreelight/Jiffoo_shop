import { SignupForm } from "@/components/signup";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Signup - Jiffoo",
  description:
    "Jiffoo is a platform that helps you build and launch your own AI-powered directory. Join us to create a beautiful, modern, and customizable directory for your needs.",
  openGraph: {
    images: ["https://ai-saas-template-aceternity.vercel.app/banner.png"],
  },
};

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
