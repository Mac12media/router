// components/Logo.tsx
"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import LogoDark from "@/public/expologo2logo.png";
import LogoLight from "@/public/expologo1logo.png";

const Logo = () => {
  return (
    <>
      {/* Light logo (hidden in dark mode) */}
      <Image
        src={LogoDark}
        alt="logo"
        width={120}
        height={120}
        className="dark:hidden" // Hidden in dark mode
      />
      {/* Dark logo (shown only in dark mode) */}
      <Image
        src={LogoLight}
        alt="logo"
        width={120}
        height={120}
        className="hidden dark:block" // Shown only in dark mode
      />
    </>
  );
};

export default Logo;
