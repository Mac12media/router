"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Grad years 2025–2032 plus "transfer"
const GRAD_OPTIONS = [
  ...Array.from({ length: 8 }, (_, i) => (2025 + i).toString()),
  "Transfer",
];

// --- Smart email typo checks
const COMMON_TLD_FIXES: Record<string, string> = {
  con: "com",
  cpm: "com",
  ocm: "com",
  vom: "com",
};

const COMMON_DOMAIN_FIXES: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "hotnail.com": "hotmail.com",
  "outlok.com": "outlook.com",
};

function emailLooksMistyped(email: string): string | null {
  const match = email.match(/@([^@\s]+)$/);
  if (!match) return null;
  const domain = match[1].toLowerCase();

  // TLD check
  const parts = domain.split(".");
  if (parts.length >= 2) {
    const tld = parts[parts.length - 1];
    const fix = COMMON_TLD_FIXES[tld];
    if (fix) return `Did you mean ".${fix}" instead of ".${tld}"?`;
  }

  // Whole-domain common typos
  const fixDomain = COMMON_DOMAIN_FIXES[domain];
  if (fixDomain) return `Did you mean "${fixDomain}"?`;

  return null;
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" })
    .transform((v) => v.trim().toLowerCase())
    .superRefine((val, ctx) => {
      const hint = emailLooksMistyped(val);
      if (hint) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Email looks mistyped. ${hint}`,
        });
      }
    }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
  grad_year: z.enum([...(GRAD_OPTIONS as [string, ...string[]])], {
    required_error: "Graduation year is required",
  }),
});

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      grad_year: GRAD_OPTIONS[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        email: values.email.toLowerCase(), // safeguard
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      await signIn("credentials", {
        email: payload.email,
        password: values.password,
        callbackUrl,
      });
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Graduation Year OR Transfer */}
        <FormField
          control={form.control}
          name="grad_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduation Year</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year or transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRAD_OPTIONS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email (validated, lowercase) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.trim().toLowerCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={form.formState.isSubmitting}>
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
