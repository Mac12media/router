"use client";

import { useState } from "react";
import Image from "next/image";
import MagicLinkForm from "@/components/auth/form";
import SignUpForm from "@/components/auth/sign-up";

import Logo from "@/public/expologo2.png";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");

  return (
    <section className="flex items-center justify-center h-screen w-screen bg-background/20 backdrop-blur-sm px-4">
      <div className="flex w-full max-w-4xl rounded-lg shadow-md overflow-hidden border bg-white dark:bg-muted dark:bordermuted">
        {/* Left Panel */}
        <div className="flex flex-col justify-center flex-1 px-8 py-12">
          <div className="flex items-center gap-2 mb-6">
            <Image src={Logo} alt="logo" width={70} height={70} className="" />
          </div>

          <h2 className="text-xl font-semibold mb-1 text-zinc-900 dark:text-zinc-100">
            {mode === "signup" ? "Sign up to EXPO Recruits" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {mode === "signup"
              ? "Manage your recruiting campaigns and EXPO+ score"
              : "Login to access your account."}
          </p>

          <div className="space-y-4">
            {mode === "signup" ? <SignUpForm /> : <MagicLinkForm />}
           
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  className="underline underline-offset-4 text-primary hover:text-orange-600 dark:hover:text-orange-400"
                  onClick={() => setMode("login")}
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  className="underline underline-offset-4 text-primary hover:text-orange-600 dark:hover:text-orange-400"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>

        {/* Right Panel - Google Login */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-muted dark:bg-muted border-l dark:border-zinc-700 p-8">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Log in</h3>
          <button className="flex items-center gap-3 px-4 py-2 border rounded-md hover:bg-muted-foreground/10 dark:border-zinc-600 dark:hover:bg-zinc-700 transition">
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
            <span className="text-zinc-800 dark:text-white">Continue with Google</span>
          </button>
        </div>
      </div>

      {/* Optional footer or policies could go here */}
    </section>
  );
}
