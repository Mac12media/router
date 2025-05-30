"use client";

import { useState } from "react";
import Image from "next/image";

import MagicLinkForm from "@/components/auth/form";
import SignUpForm from "@/components/auth/sign-up";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <section className="flex fixed top-0 right-0 left-0 h-screen w-screen overflow-hidden flex-col items-center justify-center bg-background/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg border p-6 shadow-sm md:p-12 mt-12 bg-muted">
        <Image
          className="mb-8 dark:invert"
          src="/icon.svg"
          alt="logo"
          width={50}
          height={72}
        />
        <p className="text-center text-xl">
          {mode === "login" ? "Welcome to Expo Recruits" : "Create your account"}
        </p>
        <p className="text-center text-muted-foreground">
          {mode === "login" ? "Login to access your account." : "Sign up to get started."}
        </p>

        <div className="flex flex-col items-center w-full gap-2">
          {mode === "login" ? <MagicLinkForm /> : <SignUpForm />}
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                className="underline underline-offset-4"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="underline underline-offset-4"
                onClick={() => setMode("login")}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>

      <p className="mt-4 max-w-xs text-center text-sm text-muted-foreground md:mb-24">
        By using router.so, you agree to our{" "}
        <a
          className="underline underline-offset-4"
          target="_blank"
          href="https://router.so/privacy"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          className="underline underline-offset-4"
          target="_blank"
          href="https://router.so/terms"
        >
          Terms of Service
        </a>
        .
      </p>
    </section>
  );
}
