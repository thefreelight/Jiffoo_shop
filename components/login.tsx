"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Password from "./password";
import { Button } from "./button";
import { Logo } from "./Logo";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Please enter email",
    })
    .email("Please enter valid email")
    .min(1, "Please enter email"),
  password: z
    .string({
      required_error: "Please enter password",
    })
    .min(1, "Please enter password"),
});

export type LoginUser = z.infer<typeof formSchema>;

function LoginFormContent() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const callbackUrl = from && !from.includes('/login') ? from : "/dashboard";

  const form = useForm<LoginUser>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginUser) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <div className="flex">
              <Logo />
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10">
            <div>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300"
                        >
                          Email address
                        </label>
                        <FormControl>
                          <div className="mt-2">
                            <input
                              id="email"
                              type="email"
                              placeholder="hello@johndoe.com"
                              className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border border-neutral-200 dark:border-neutral-800 py-1.5 text-black dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-[#0aa6fd] focus:border-transparent focus:outline-none sm:text-sm sm:leading-6"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300"
                        >
                          Password
                        </label>
                        <FormControl>
                          <div className="mt-2">
                            <Password
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border border-neutral-200 dark:border-neutral-800 py-1.5 text-black dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-[#0aa6fd] focus:border-transparent focus:outline-none sm:text-sm sm:leading-6"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm leading-6">
                    <Link href="#" className="font-normal text-neutral-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                  <p
                    className={cn(
                      "text-sm text-neutral-500 text-center mt-4 text-muted dark:text-muted-dark"
                    )}
                  >
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-[#0aa6fd] hover:text-[#2a2bdb] transition-colors duration-200"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-neutral-400 dark:text-neutral-500 dark:bg-black">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl })}
                  className="w-full py-1.5 bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
                >
                  <IconBrandGoogle className="h-5 w-5" />
                  <span className="text-sm font-semibold leading-6">Google</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => signIn('github', { callbackUrl })}
                  className="w-full py-1.5 bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
                >
                  <IconBrandGithub className="h-5 w-5" />
                  <span className="text-sm font-semibold leading-6">Github</span>
                </Button>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mt-8">
                By clicking on sign in, you agree to our{" "}
                <Link href="#" className="text-neutral-500 dark:text-neutral-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-neutral-500 dark:text-neutral-300">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
