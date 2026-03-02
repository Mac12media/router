"use client";

import { useState } from "react";
import Image from "next/image";
import MagicLinkForm from "@/components/auth/form";
import SignUpForm from "@/components/auth/sign-up";
import LogoDark from "@/public/expologo2logo.png";
import LogoLight from "@/public/expologo1logo.png";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");

  return (
<section className="flex fixed top-0 right-0 p-2 left-0 h-screen w-screen overflow-hidden flex-col items-center justify-center bg-background/20 backdrop-blur-sm">
            <div className="absolute inset-0 hidden dark:block bg-[url('/expo-bg.png')] bg-cover bg-center opacity-80" />
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-black/80 via-black/60 to-orange-900/40" />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/10 md:p-10 dark:bg-black/75 dark:ring-white/20 dark:backdrop-blur">
            <div className="mb-6">
              <p className="text-xl font-bold uppercase  text-[#FF7200]">
                Exposure Starts Here
              </p>
              <p className="mt-2 text-xs text-black/90 dark:text-white/85">
                Gain exposure, manage your recruiting & earn a scholarship
              </p>
            </div>

            <h2 className="text-lg font-bold text-black dark:text-white">
              {mode === "signup" ? "Sign Up" : "Log In"}
            </h2>

            <div className="mt-6 space-y-4">
              {mode === "signup" ? <SignUpForm /> : <MagicLinkForm />}
            </div>

            <p className="mt-5 text-sm text-black/85 dark:text-white/85">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    className="font-semibold text-[#FF7200] hover:opacity-90"
                    onClick={() => setMode("login")}
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    className="font-semibold text-[#FF7200] hover:opacity-90"
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="hidden items-center justify-center rounded-3xl bg-white p-10 ring-1 ring-black/5 md:flex dark:bg-black/60 dark:ring-white/10 dark:backdrop-blur">
            <Image
        src={LogoDark}
        alt="logo"
        width={240}
        height={240}
        className="dark:hidden" // Hidden in dark mode
      />
      {/* Dark logo (shown only in dark mode) */}
      <Image
        src={LogoLight}
        alt="logo"
        width={240}
        height={240}
        className="hidden dark:block" // Shown only in dark mode
      />
          </div>
        </div>
      </div>
    </section>
  );
}
