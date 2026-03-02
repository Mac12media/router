"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import FootballIcon from "@/public/sport-icons/football-gray.png";
import BasketballIcon from "@/public/sport-icons/basketball-gray.png";

import FlagFootballICon from "@/public/sport-icons/football-pink.png";
import GirlsBasketballIcon from "@/public/sport-icons/basketball-pink.png";


const GRAD_OPTIONS = [
  ...Array.from({ length: 7 }, (_, i) => (2026 + i).toString()),
  "Transfer",
];



const SPORT_OPTIONS = [
  { value: "football", label: "Football", icon: FootballIcon },
  { value: "basketball_boys", label: "Basketball (Boys)", icon: BasketballIcon },
  { value: "basketball_girls", label: "Basketball (Girls)", icon: GirlsBasketballIcon },
  { value: "girls_flag_football", label: "Girls Flag Football", icon: FlagFootballICon },
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
  sport: z.string().min(1, { message: "Sport is required" }),
  grad_year: z.string().min(1, { message: "Class year is required" }),
});

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";
  const [step, setStep] = useState<"user" | "sport">("user");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      sport: "",
      grad_year: "",
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

  const handleContinue = async () => {
    const ok = await form.trigger(["name", "email", "password"]);
    if (ok) setStep("sport");
  };

  const handleBack = () => setStep("user");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {step === "user" ? (
          <>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/60">
                User Details
              </p>
              <p className="text-sm text-black/60 dark:text-white/70">Tell us about yourself.</p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/70 dark:text-white/80">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      className="border-black/10 bg-white text-black placeholder:text-black/40 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/70 dark:text-white/80">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="border-black/10 bg-white text-black placeholder:text-black/40 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.trim().toLowerCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/70 dark:text-white/80">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="border-black/10 bg-white text-black placeholder:text-black/40 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="button" className="w-full bg-[#FF7200] hover:opacity-90" onClick={handleContinue}>
              Continue
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/60">
                Sport Details
              </p>
              <p className="text-sm text-black/60 dark:text-white/70">Select your sport and class.</p>
            </div>

            <FormField
              control={form.control}
              name="sport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/70 dark:text-white/80">Sport</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid gap-3 md:grid-cols-2"
                    >
                      {SPORT_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:border-[#FF7200] dark:border-white/10 dark:bg-white/5 dark:hover:border-[#FF7200]",
                            field.value === option.value &&
                              "border-[#FF7200] bg-orange-500/10 dark:bg-orange-500/10"
                          )}
                        >
                          <RadioGroupItem value={option.value} className="sr-only" />
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10">
                            <Image
                              src={option.icon}
                              alt=""
                              width={400}
              height={400}
                            />
                          </span>
                          <span className="text-sm text-black dark:text-white">{option.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grad_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/70 dark:text-white/80">Class</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="border-black/10 bg-white text-black dark:border-white/15 dark:bg-white/10 dark:text-white">
                        <SelectValue placeholder="Select class year" />
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

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-[#FF7200] hover:opacity-90" loading={form.formState.isSubmitting}>
                Create a FREE Profile
              </Button>
              <Button type="button" variant="ghost" className="text-black/60 hover:text-black dark:text-white/70 dark:hover:text-white" onClick={handleBack}>
                Back
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
