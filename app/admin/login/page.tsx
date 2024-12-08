import { AdminLoginForm } from "@/components/admin/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Jiffoo",
  description: "Login to Jiffoo admin dashboard",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
} 