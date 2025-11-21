"use client";

import { useEffect, useState } from "react";

function getTargetDate() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // December 1st, midnight, current year
  const target = new Date(currentYear, 11, 1, 0, 0, 0); // month is 0-based: 11 = December

  return target;
}

export function UpgradeCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const targetDate = getTargetDate();

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setExpired(true);
        setTimeLeft("");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
   <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 p-5 text-white shadow-lg">
  <div className="flex flex-col items-center justify-center text-center gap-3 md:flex-row md:items-center md:justify-center">
    <div>
      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
        <span className="h-2 w-2 rounded-full bg-white" />
        Ends December 1st
      </div>
      <h2 className="mt-3 text-xl font-bold md:text-2xl">
        🚨 BLACK FRIDAY SALE IS LIVE — SAVE 65% OFF! 🚀
      </h2>
      <p className="mt-1 text-sm text-black md:text-base">
        Take advantage of our biggest sale of the year!
      </p>
    </div>

    <div className="mt-3 flex flex-col items-center justify-center rounded-xl bg-black/15 px-4 py-3 text-sm md:mt-0 md:items-center">
      {expired ? (
        <span className="font-semibold">The evaluation period has ended.</span>
      ) : (
        <>
          <span className="text-xs uppercase tracking-wide text-orange-100">
            Time remaining
          </span>
          <span className="mt-1 text-lg font-semibold tabular-nums">
            {timeLeft || "Calculating..."}
          </span>
        </>
      )}
    </div>
  </div>
</div>

  );
}
