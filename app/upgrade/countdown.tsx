"use client";

import { useEffect, useState } from "react";

function getTargetDate() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // October 1st, midnight (next upcoming Oct 1).
  // Dates use the visitor's local time so the displayed clock and deadline agree.
  let target = new Date(currentYear, 9, 1, 0, 0, 0); // month is 0-based: 9 = October
  if (now.getTime() >= target.getTime()) {
    target = new Date(currentYear + 1, 9, 1, 0, 0, 0);
  }

  return target;
}

function FramerCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const targetDate = getTargetDate();

    const tick = () => {
      const diff = targetDate.getTime() - Date.now();

      if (diff <= 0) {
        setExpired(true);
        setT({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (expired) {
    return <span className="font-semibold">This promo has ended.</span>;
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const units = [
    { v: pad(t.d), label: "Days" },
    { v: pad(t.h), label: "Hours" },
    { v: pad(t.m), label: "Min" },
    { v: pad(t.s), label: "Sec" },
  ];

  return (
    <div className="flex items-start gap-4">
      {units.map(({ v, label }, i) => (
        <div key={label} className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black tabular-nums leading-none md:text-4xl">
              {v}
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-black leading-none text-white/40">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function UpgradeCountdownBanner() {
  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 p-5 text-white shadow-lg">
      <div className="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:items-center md:justify-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-white" />
            Ends Oct 1st
          </div>

          <h2 className="mt-3 text-xl font-black uppercase tracking-tight md:text-2xl">
            Mid Season Sale - 50% Off
          </h2>
        </div>

        <div className="mt-3 flex flex-col items-center justify-center rounded-xl bg-black/15 px-5 py-3 md:mt-0 md:items-center">
          <span className="text-xs uppercase tracking-wide text-orange-100">
            Time remaining
          </span>
          <div className="mt-1">
            <FramerCountdown />
          </div>
        </div>
      </div>
    </div>
  );
}
