import { LoginForm } from "@/components/login";
import { Metadata } from "next";

export const metadata = {
  title: "Login - Jiffoo",
  description: "Login to your Jiffoo account",
};

export default function LoginPage() {
  return <LoginForm />;
}
