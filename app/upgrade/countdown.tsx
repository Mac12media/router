"use client";

import { useEffect, useState } from "react";

function getTargetDate() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // March 1st, midnight (next upcoming March 1)
  let target = new Date(currentYear, 3, 1, 0, 0, 0); // month is 0-based: 2 = March
  if (now.getTime() >= target.getTime()) {
    target = new Date(currentYear + 1, 2, 1, 0, 0, 0);
  }

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
      <div className="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:items-center md:justify-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-white" />
            Ends April 1st
          </div>

          <h2 className="mt-3 text-xl font-bold md:text-2xl">
            🎉 RECRUITING MADNESS — SAVE 60% OFF! 🚀
          </h2>

          <p className="mt-1 text-sm text-black md:text-base">
            Take advantage of our limited-time offer!
          </p>
        </div>

        <div className="mt-3 flex flex-col items-center justify-center rounded-xl bg-black/15 px-4 py-3 text-sm md:mt-0 md:items-center">
          {expired ? (
            <span className="font-semibold">This promo has ended.</span>
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
