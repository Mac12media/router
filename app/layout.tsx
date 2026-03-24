import "./globals.css";

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import Nav from "@/components/parts/nav";
import { PostHogProvider } from "@/components/providers/post-hog/post-hog-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "EXPO",
  description:
    "Boost Your Recruitment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} flex flex-col-reverse sm:grid sm:overflow-hidden sm:h-screen sm:w-screen sm:grid-cols-[256px,1fr]`}
      >
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0  bg-cover bg-center opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br dark:from-black/95 from-white/95 dark:via-black/85 via-white/85 to-orange-950/30" />
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <Nav />
            <main className="relative z-10 flex min-h-screen flex-col gap-4  py-4 ">
              {children}
            </main>

            <Toaster />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
