"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Password from "./password";
import { Button } from "./button";
import { Logo } from "./Logo";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Please enter your name",
    })
    .min(1, "Please enter your name"),
  email: z
    .string({
      required_error: "Please enter email",
    })
    .email("Please enter valid email")
    .min(1, "Please enter email"),
  company: z
    .string({
      required_error: "Please enter your company's name",
    })
    .min(1, "Please enter your company's name"),
  message: z
    .string({
      required_error: "Please enter your message",
    })
    .min(1, "Please enter your message"),
});

export type LoginUser = z.infer<typeof formSchema>;

export function ContactForm() {
  const form = useForm<LoginUser>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: LoginUser) {
    try {
      console.log("submitted form", values);
    } catch (e) {}
  }

  const socials = [
    {
      title: "twitter",
      href: "https://x.com/jiffoocom",
      icon: (
        <IconBrandX className="h-5 w-5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white transition-colors" />
      ),
    }
  ];

  return (
    <Form {...form}>
      <div className="flex relative z-20 items-center w-full justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl bg-white dark:bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Contact Us
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Please reach out to us and we will get back to you at the speed of light.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Full Name
                      </label>
                      <FormControl>
                        <input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className="mt-2 block w-full rounded-lg border border-neutral-200 bg-white/50 px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 text-sm transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2 text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Email Address
                      </label>
                      <FormControl>
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="mt-2 block w-full rounded-lg border border-neutral-200 bg-white/50 px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 text-sm transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2 text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Company
                      </label>
                      <FormControl>
                        <input
                          id="company"
                          type="text"
                          placeholder="Your Company"
                          className="mt-2 block w-full rounded-lg border border-neutral-200 bg-white/50 px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 text-sm transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2 text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Message
                      </label>
                      <FormControl>
                        <textarea
                          rows={4}
                          id="message"
                          placeholder="How can we help you?"
                          className="mt-2 block w-full rounded-lg border border-neutral-200 bg-white/50 px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 text-sm transition-all resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-2 text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors">
                  Send Message
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-center space-x-6">
                {socials.map((social) => (
                  <Link
                    href={social.href}
                    key={social.title}
                    className="group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
