"use client";

import { useState, useRef, useEffect, useLayoutEffect, type PointerEvent } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

type Card = {
  userId: string;
  fullName: string;
  role: string;
  subtitle: string;
  bio: string;
  refId: string;
  state: string;
  dept: string;
  height: string;
  weight: string;
  acdScore: string;
  athScore: string;
  image: string;
  instagram: string;
  x: string;
  email: string;
};

const OG     = "#FF6600";
const CARD_W = 355;
const JUNE15 = new Date("2026-06-15T05:00:00Z");
const FONT = "'Impact', 'Arial Black', sans-serif";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return { first: "", last: fullName.trim() || "ATHLETE" };
  }

  return {
    first: parts.slice(0, -1).join(" "),
    last: parts.at(-1) || fullName.trim() || "ATHLETE",
  };
}

function BigMetric({
  label,
  value,
  bg,
  border,
  labelColor,
  valueColor,
  align = "left",
  fit = false,
}: {
  label: string;
  value: string;
  bg: string;
  border: string;
  labelColor: string;
  valueColor: string;
  align?: "left" | "right";
  fit?: boolean;
}) {
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const [valueScale, setValueScale] = useState(1);

  useLayoutEffect(() => {
    if (!fit) {
      setValueScale(1);
      return;
    }

    const el = valueRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const measure = () => {
      const availableWidth = parent.clientWidth - 8;
      const contentWidth = el.scrollWidth;
      if (!availableWidth || !contentWidth) return;
      const nextScale = Math.min(1, Math.max(0.26, availableWidth / contentWidth));
      setValueScale((current) => (Math.abs(current - nextScale) < 0.01 ? current : nextScale));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(parent);

    return () => ro.disconnect();
  }, [fit, value]);

  return (
    <div
      style={{
        borderRadius: 20,
        padding: "10px 12px 12px",
        border: `1px solid ${border}`,
        background: bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 76,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: 7.5,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: labelColor,
          textAlign: align,
        }}
      >
        {label}
      </span>
      <span
        ref={valueRef}
        style={{
          fontSize: label === "SCHOOL" ? 22 * valueScale : 34,
          fontWeight: 900,
          letterSpacing: label === "SCHOOL" ? "-0.08em" : "-0.06em",
          lineHeight: 0.9,
          color: valueColor,
          textTransform: "uppercase",
          alignSelf: align === "left" ? "flex-start" : "flex-end",
          whiteSpace: "nowrap",
          width: "100%",
          display: "block",
          textAlign: align,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function PlayerCardClient({ card }: { card: Card }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

  const dk = mounted && resolvedTheme === "dark";

  // Page / sidebar palette
  const pg = {
    bg:         dk ? "#000"                     : "var(--background)",
    dot:        dk ? "rgba(255,255,255,0.075)"  : "rgba(0,0,0,0.06)",
    text:       dk ? "rgba(255,255,255,0.95)"   : "rgba(0,0,0,0.9)",
    textMid:    dk ? "rgba(255,255,255,0.65)"   : "rgba(0,0,0,0.55)",
    textDim:    dk ? "rgba(255,255,255,0.4)"    : "rgba(0,0,0,0.38)",
    border:     dk ? "rgba(255,255,255,0.1)"    : "rgba(0,0,0,0.1)",
    badgeBg:    dk ? "rgba(255,255,255,0.05)"   : "rgba(0,0,0,0.04)",
    btnAlt:     dk ? "rgba(255,255,255,0.05)"   : "rgba(0,0,0,0.05)",
    btnAltBd:   dk ? "rgba(255,255,255,0.1)"    : "rgba(0,0,0,0.1)",
    divider:    dk ? "rgba(255,255,255,0.08)"   : "rgba(0,0,0,0.08)",
    actionBg:   dk ? "rgba(255,255,255,0.04)"   : "rgba(255,255,255,0.85)",
    actionBd:   dk ? "rgba(255,255,255,0.1)"    : "rgba(0,0,0,0.1)",
    actionText: dk ? "rgba(255,255,255,0.72)"   : "rgba(0,0,0,0.65)",
    actionDiv:  dk ? "rgba(255,255,255,0.1)"    : "rgba(0,0,0,0.1)",
  };

  // Card body palette — dark card vs white card
  const c = {
    bg:         dk ? "#0a0a0c"                  : "#ffffff",
    shadow:     dk
      ? ["0 50px 100px -20px rgba(0,0,0,0.9)", "0 0 0 1px rgba(255,255,255,0.07) inset", `0 0 80px ${OG}10`].join(",")
      : ["0 20px 60px -10px rgba(0,0,0,0.13)", "0 0 0 1px rgba(0,0,0,0.07) inset", `0 0 40px ${OG}08`].join(","),
    label:      dk ? "rgba(255,255,255,0.32)"   : "rgba(0,0,0,0.28)",
    photoBg:    dk ? "#111"                     : "#f2f2f4",
    name:       dk ? "rgba(255,255,255,0.97)"   : "rgba(0,0,0,0.9)",
    roleText:   dk ? "rgba(255,255,255,0.42)"   : "rgba(0,0,0,0.38)",
    rule:       dk ? "rgba(255,255,255,0.06)"   : "rgba(0,0,0,0.07)",
    statLabel:  dk ? "rgba(255,255,255,0.27)"   : "rgba(0,0,0,0.3)",
    statValue:  dk ? "rgba(255,255,255,0.92)"   : "rgba(0,0,0,0.88)",
    metricBg:   dk ? "rgba(255,255,255,0.03)"   : "rgba(0,0,0,0.02)",
    metricBorder: dk ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)",
    metricLabel: dk ? "rgba(255,255,255,0.34)"   : "rgba(0,0,0,0.34)",
    metricValue: dk ? "rgba(255,255,255,0.94)"   : "rgba(0,0,0,0.9)",
    brand:      dk ? "rgba(255,255,255,0.9)"    : "rgba(0,0,0,0.85)",
    brandSub:   dk ? "rgba(255,255,255,0.28)"   : "rgba(0,0,0,0.28)",
    htwtLabel:  dk ? "rgba(255,255,255,0.27)"   : "rgba(0,0,0,0.28)",
    htwtValue:  dk ? "rgba(255,255,255,0.75)"   : "rgba(0,0,0,0.65)",
    hole:       dk ? "#000"                     : "#e2e2e4",
    holeShadow: dk
      ? ["0 0 0 1.5px rgba(255,255,255,0.1)", "0 0 0 3px rgba(0,0,0,0.5)", "0 2px 8px rgba(0,0,0,1) inset"].join(",")
      : ["0 0 0 1.5px rgba(0,0,0,0.08)", "0 0 0 3px rgba(0,0,0,0.04)", "0 2px 6px rgba(0,0,0,0.18) inset"].join(","),
    glare:      dk
      ? `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 34%, transparent 60%)`
      : `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 60%)`,
    noiseBlend: (dk ? "overlay" : "multiply") as React.CSSProperties["mixBlendMode"],
  };

  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const swingDone = useRef(false);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [swingZ, setSwingZ] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, op: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const START_ANGLE = 14;
    const DECAY = 1.4;
    const FREQ = 1.6;
    let t0: number | null = null;

    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const s = (ts - t0) / 1000;
      const angle = START_ANGLE * Math.exp(-DECAY * s) * Math.sin(2 * Math.PI * FREQ * s);
      setSwingZ(angle);
      if (s < 3.5) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setSwingZ(0);
        swingDone.current = true;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!swingDone.current) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    const dx = (px - 50) / 50;
    const dy = (py - 50) / 50;
    setTilt({ x: dy * -9, y: dx * 11 });
    setGlare({ x: px, y: py, op: dk ? 0.12 + Math.abs(dx) * 0.07 : 0.5 + Math.abs(dx) * 0.2 });
  };

  const onLeave = () => {
    if (!swingDone.current) return;
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, op: 0 });
  };

  const copyInfo = async () => {
    const text = `${card.fullName}\n${card.role} • ${card.subtitle}\n${card.email}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  };

  const xUrl = card.x ? `https://x.com/${card.x.replace(/^@/, "")}` : "#";

  const t3d = swingDone.current
    ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
    : `perspective(1200px) rotateZ(${swingZ}deg)`;
  const { first, last } = splitName(card.fullName);
  const stateLabel = card.state || "--";

  if (!mounted) {
    return (
      <div className="pc-page-bg" style={{ minHeight: "100vh", marginTop: "-1rem", paddingTop: "1rem" }} />
    );
  }

  return (
    <main
      className="pc-page-bg"
      style={{
        marginTop: "-1rem",
        paddingTop: "1rem",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <June15Banner dk={dk} />
      </div>

      {/* June 15 promo — full width at top */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px 48px", flex: 1 }}>

      {/* Ambient glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "40%", left: "50%",
          transform: "translate(-50%,-55%)",
          width: 820, height: 820, borderRadius: "50%",
          background: `radial-gradient(circle, ${OG}0c 0%, transparent 65%)`,
        }} />
        <div style={{
          position: "absolute", bottom: "-8%", left: "18%",
          width: 380, height: 380, borderRadius: "50%",
          background: `radial-gradient(circle, ${OG}07 0%, transparent 70%)`,
        }} />
      </div>

      {/* Mobile-only header */}
      <div className="pc-top-header">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 100, border: `1px solid ${OG}50`, background: `${OG}15`, padding: "5px 16px", marginBottom: 14 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: OG }} />
          <span style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0", textTransform: "uppercase" as const, color: OG }}>JUNE 15 RECRUITING WINDOW</span>
        </div>
      </div>

      {/* ─── Main layout ─── */}
      <div className="pc-outer">

        {/* Card + lanyard assembly */}
        <div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            cursor: "pointer", userSelect: "none",
            transform: t3d,
            transition: swingDone.current ? "transform 0.12s ease-out" : "none",
            transformOrigin: "50% 0",
            willChange: "transform",
            position: "relative",
          }}
        >
          {/* Orange strap */}
          <div style={{
            width: 42, height: 122,
            background: "linear-gradient(180deg,#FF8000 0%,#cc5200 100%)",
            borderRadius: "4px 4px 0 0",
            position: "relative", zIndex: 3,
            boxShadow: "inset -4px 0 10px rgba(0,0,0,0.32), inset 4px 0 8px rgba(255,190,80,0.14)",
          }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "4px 4px 0 0",
              background: "repeating-linear-gradient(45deg,rgba(0,0,0,0.15) 0px,rgba(0,0,0,0.15) 1.5px,transparent 1.5px,transparent 4px)",
            }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 12 }}>
              <span style={{ writingMode: "vertical-rl" as const, transform: "rotate(180deg)", fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.38)" }}>EXPO RECRUITS</span>
            </div>
          </div>

          {/* Chrome clasp */}
          <div style={{ zIndex: 2, marginTop: -8, position: "relative" }}>
            <svg width="76" height="76" viewBox="0 0 80 90" fill="none">
              <defs>
                <linearGradient id="cl1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fff"/><stop offset="12%" stopColor="#d8d8d8"/>
                  <stop offset="42%" stopColor="#606060"/><stop offset="55%" stopColor="#f5f5f5"/>
                  <stop offset="85%" stopColor="#fff"/><stop offset="100%" stopColor="#484848"/>
                </linearGradient>
                <linearGradient id="cl2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff"/><stop offset="25%" stopColor="#c5c5c5"/>
                  <stop offset="50%" stopColor="#555"/><stop offset="72%" stopColor="#eaeaea"/>
                  <stop offset="100%" stopColor="#383838"/>
                </linearGradient>
                <linearGradient id="cl3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#888"/><stop offset="50%" stopColor="#383838"/>
                  <stop offset="100%" stopColor="#181818"/>
                </linearGradient>
              </defs>
              <path d="M12 10C12 5 68 5 68 10L65 18C65 21 15 21 15 18Z" fill="url(#cl2)"/>
              <rect x="18" y="10" width="44" height="5" rx="2" fill="#0d0d0d" opacity="0.65"/>
              <rect x="34" y="18" width="12" height="14" rx="2" fill="url(#cl2)"/>
              <ellipse cx="40" cy="32" rx="10" ry="3" fill="url(#cl2)"/>
              <line x1="40" y1="32" x2="49" y2="58" stroke="url(#cl3)" strokeWidth="3" strokeLinecap="round"/>
              <path d="M40 32C27 32 25 43 25 56C25 68 32 70 40 70" stroke="url(#cl1)" strokeWidth="6.5" strokeLinecap="round" fill="none"/>
              <circle cx="40" cy="25" r="2.5" fill="url(#cl3)"/>
            </svg>
          </div>

          {/* ── Card body ── */}
          <div style={{
            width: CARD_W, borderRadius: 26, overflow: "hidden",
            position: "relative", background: c.bg,
            marginTop: -42, zIndex: 1,
            boxShadow: c.shadow,
          }}>
            {/* PlayerCard2-style top header */}
            <div style={{ height: 46, background: "#111", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/expo.avif" alt="Expo" style={{ width: 22, height: 22, objectFit: "contain", filter: "invert(1)" }} />
                <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "0.16em" }}>EXPO RECRUITS</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: OG }}>CLASS {card.dept.replace(/^#/, "")}</div>
              </div>
            </div>

            <div style={{ height: 3, background: OG, flexShrink: 0 }} />

            {/* Orange top bar */}
            <div style={{ height: 2, background: `linear-gradient(to right,transparent,${OG}ee,${OG}88,transparent)` }}/>

            {/* Punch hole */}
            <div style={{
              position: "absolute", top: 18, left: "50%",
              transform: "translateX(-50%)",
              width: 20, height: 20, borderRadius: "50%",
              background: c.hole, boxShadow: c.holeShadow, zIndex: 20,
            }}/>

            {/* Mesh gradient */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: [
                `radial-gradient(ellipse 70% 55% at 12% 12%, ${OG}${dk ? "1a" : "0f"} 0%, transparent 100%)`,
                `radial-gradient(ellipse 60% 50% at 92% 28%, ${OG}${dk ? "12" : "0a"} 0%, transparent 100%)`,
                `radial-gradient(ellipse 48% 42% at 88% 90%, ${OG}${dk ? "0c" : "07"} 0%, transparent 100%)`,
              ].join(","),
            }}/>

            {/* Wave lines */}
            <svg viewBox="0 0 355 560" preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <path d="M-60,210 C88,318 228,252 425,372" stroke={`${OG}${dk ? "13" : "10"}`} strokeWidth="1.2" fill="none"/>
              <path d="M-60,290 C88,398 228,332 425,452" stroke={`${OG}${dk ? "0e" : "0b"}`} strokeWidth="0.9" fill="none"/>
              <path d="M-60,370 C88,478 228,412 425,532" stroke={`${OG}${dk ? "16" : "12"}`} strokeWidth="1.5" fill="none"/>
            </svg>

            {/* Noise grain */}
            <svg viewBox="0 0 355 560" preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <defs>
                <filter id="gn">
                  <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" result="n"/>
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0"/>
                  <feComposite operator="in" in2="SourceGraphic"/>
                </filter>
              </defs>
              <rect width="355" height="560" fill={dk ? "#fff" : "#000"} filter="url(#gn)" style={{ mixBlendMode: c.noiseBlend }}/>
            </svg>

            {/* Glare */}
            <div style={{
              position: "absolute", inset: 0,
              background: c.glare.replace("50% 50%", `${glare.x}% ${glare.y}%`),
              opacity: glare.op, pointerEvents: "none", zIndex: 10,
              mixBlendMode: dk ? "overlay" as const : "multiply" as const,
            }}/>

            {/* ── Content ── */}
            <div style={{ position: "relative", zIndex: 5, padding: "52px 24px 28px", display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* Photo */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, width: "100%" }}>
                <div style={{
                  width: "100%",
                  maxWidth: 285,
                  height: 168,
                  borderRadius: 18,
                  overflow: "hidden",
                  border: `2px solid ${OG}42`,
                  boxShadow: `0 0 0 5px ${OG}12, 0 14px 30px ${dk ? "rgba(0,0,0,0.62)" : "rgba(0,0,0,0.12)"}`,
                  background: c.photoBg,
                  flexShrink: 0,
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.fullName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
                    onError={(e) => { (e.target as HTMLImageElement).src = "/userplaceholder.png"; }}
                  />
                </div>
              </div>

              {/* Name */}
              <div style={{ width: "100%", textAlign: "center", marginBottom: 12 }}>
                {first ? (
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.roleText, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                    {first}
                  </div>
                ) : null}
                <h2 style={{
                  fontSize: first ? 34 : 30, fontWeight: 900, letterSpacing: "-0.04em",
                  color: c.name, lineHeight: 0.94,
                  margin: 0, textAlign: "center",
                  textTransform: "uppercase",
                }}>{last || card.fullName || "EXPO PLAYER"}</h2>
              </div>

              {/* Orange divider */}
              <div style={{ width: "72%", height: 1.5, alignSelf: "center", background: `linear-gradient(to right,transparent,${OG}cc,transparent)`, marginBottom: 10 }}/>

              {/* Position • Sport */}
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase" as const, color: c.roleText,
                margin: "0 0 18px", textAlign: "center",
              }}>{card.role} • {card.subtitle}</p>

              {/* Four stat boxes */}
              <div style={{ width: "100%", display: "grid", gridTemplateColumns: "0.8fr 1.3fr", gap: 8, marginBottom: 16 }}>
                <BigMetric
                  label="HEIGHT"
                  value={card.height}
                  bg={c.metricBg}
                  border={c.metricBorder}
                  labelColor={c.metricLabel}
                  valueColor={OG}
                  align="left"
                />
                <BigMetric
                  label="SCHOOL"
                  value={card.refId}
                  bg={c.metricBg}
                  border={c.metricBorder}
                  labelColor={c.metricLabel}
                  valueColor={c.metricValue}
                  align="right"
                  fit
                />
                <BigMetric
                  label="WEIGHT"
                  value={card.weight}
                  bg={c.metricBg}
                  border={c.metricBorder}
                  labelColor={c.metricLabel}
                  valueColor={OG}
                  align="left"
                />
                <BigMetric
                  label="STATE"
                  value={stateLabel}
                  bg={c.metricBg}
                  border={c.metricBorder}
                  labelColor={c.metricLabel}
                  valueColor={c.metricValue}
                  align="right"
                  fit
                />
              </div>

              <div style={{ width: "100%", marginTop: 2 }}>
                <Link href={`/profile/${card.userId}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: dk ? OG : "#111",
                    color: dk ? "#111" : "#fff",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    boxShadow: dk ? `0 14px 28px ${OG}24` : "0 14px 28px rgba(0,0,0,0.16)",
                  }}>
                    View Full Profile
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop sidebar ── */}
        <div className="pc-sidebar">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 100, border: `1px solid ${OG}50`, background: `${OG}15`, padding: "5px 16px", marginBottom: 14 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: OG }} />
            <span style={{ fontFamily: FONT, fontSize: 10, letterSpacing: "0", textTransform: "uppercase" as const, color: OG }}>JUNE 15 RECRUITING</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: pg.textDim, margin: "0 0 4px", letterSpacing: "0.18em", textTransform: "uppercase" as const }}>YOUR CUSTOM PLAYER CARD</p>
          <h1 style={{ fontFamily: FONT, fontSize: 38, color: pg.text, margin: "0 0 6px", letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 0.92 }}>{card.fullName}</h1>
          <p style={{ fontFamily: FONT, fontSize: 11, color: pg.textDim, margin: "0 0 28px", letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
            SHARE BEFORE COACHES GO LIVE
          </p>
          <div style={{ height: 1, background: pg.divider, width: "100%", marginBottom: 28 }}/>

          <button type="button" onClick={copyInfo} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "14px 20px", marginBottom: 12,
            background: `${OG}18`, border: `1px solid ${OG}44`,
            borderRadius: 14, cursor: "pointer",
            fontFamily: FONT, fontSize: 14, color: pg.text, letterSpacing: "0.08em", textTransform: "uppercase" as const,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={OG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {copied ? "COPIED!" : "COPY INFO"}
          </button>

          <button type="button" onClick={() => window.open(xUrl, "_blank")} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "14px 20px",
            background: pg.btnAlt, border: `1px solid ${pg.btnAltBd}`,
            borderRadius: 14, cursor: "pointer",
            fontFamily: FONT, fontSize: 14, color: pg.textMid, letterSpacing: "0.08em", textTransform: "uppercase" as const,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
            </svg>
            SHARE ON X
          </button>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="pc-bottom-actions">
        <div style={{
          display: "flex",
          alignItems: "center",
          borderRadius: 100,
          border: `1px solid ${pg.actionBd}`,
          background: pg.actionBg,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0,0,0,0.10)",
        }}>
          <button type="button" onClick={copyInfo} style={{ ...btnStyle, color: pg.actionText }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>{copied ? "Copied!" : "Copy Info"}</span>
          </button>
          <div style={{ width: 1, height: 20, background: pg.actionDiv, flexShrink: 0 }}/>
          <button type="button" onClick={() => window.open(xUrl, "_blank")} style={{ ...btnStyle, color: pg.actionText }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
            </svg>
            <span>Share on X</span>
          </button>
        </div>
      </div>

      </div>{/* end content wrapper */}

      <div className="pc-why-section" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ maxWidth: CARD_W, width: "100%" }}>
          <div style={{ borderTop: `1px solid ${pg.divider}`, paddingTop: 36 }}>
            <p style={{ fontFamily: FONT, fontSize: 10, letterSpacing: "0.28em", color: OG, margin: "0 0 14px", textTransform: "uppercase" }}>
              WHY THIS CARD MATTERS
            </p>
            <h3 style={{ fontFamily: FONT, fontSize: "clamp(20px, 4vw, 28px)", color: pg.text, textTransform: "uppercase", lineHeight: 0.95, margin: "0 0 24px", letterSpacing: "0.01em" }}>
              COACHES WILL BE SEARCHING.<br />BE THE FIRST THEY FIND.
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {[
                "YOUR CARD LOADS INSTANTLY — NO LOGIN REQUIRED FOR COACHES",
                "ONE LINK SHOWS YOUR FULL PROFILE, STATS & SCORES",
                "SHAREABLE TO X, INSTAGRAM, TEXT, OR EMAIL IN SECONDS",
              ].map((text) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${OG}20`, border: `1px solid ${OG}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={OG} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 10, color: pg.textDim, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{text}</span>
                </div>
              ))}
            </div>
            <a href="https://www.exporecruits.com/june15" target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "block" }}>
              <div style={{ padding: "13px 0", border: `1px solid ${pg.btnAltBd}`, borderRadius: 12, textAlign: "center", fontFamily: FONT, fontSize: 12, color: OG, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                LEARN ABOUT THE JUNE 15 WINDOW
              </div>
            </a>
            <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
              <a href={xUrl || "#"} onClick={(e) => { if (!xUrl) e.preventDefault(); }} target={xUrl ? "_blank" : undefined} rel={xUrl ? "noreferrer" : undefined} style={{ textDecoration: "none" }}>
                <div style={{ padding: "13px 0", borderRadius: 12, textAlign: "center", fontFamily: FONT, fontSize: 12, color: pg.text, letterSpacing: "0.14em", textTransform: "uppercase", border: `1px solid ${pg.btnAltBd}`, background: pg.btnAlt }}>
                  SHARE ON X
                </div>
              </a>
              <button
                type="button"
                onClick={copyInfo}
                style={{
                  padding: "13px 0",
                  borderRadius: 12,
                  textAlign: "center",
                  fontFamily: FONT,
                  fontSize: 12,
                  color: "#fff",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  border: "none",
                  background: OG,
                  cursor: "pointer",
                }}
              >
                {copied ? "COPIED!" : "COPY INFO"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FramerCountdown({ dk }: { dk: boolean }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, JUNE15.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const units = [
    { v: pad(t.d), label: "DAYS" },
    { v: pad(t.h), label: "HOURS" },
    { v: pad(t.m), label: "MINUTES" },
    { v: pad(t.s), label: "SECONDS" },
  ];
  const digitColor = dk ? "rgb(183,183,183)" : "rgb(50,50,50)";
  const labelColor = dk ? "rgb(153,153,153)" : "rgb(110,110,110)";

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: 22, fontFamily: "Inter, sans-serif", fontWeight: 900 }}>
      {units.map(({ v, label }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {v.split("").map((digit, i) => (
              <div key={i} style={{ position: "relative", height: 52.8, width: 31.2, overflow: "hidden", display: "flex", justifyContent: "center" }}>
                <span style={{ fontSize: 48, lineHeight: 1, color: digitColor, position: "absolute", fontFamily: "Inter, sans-serif", fontWeight: "inherit" }}>
                  {digit}
                </span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginTop: 6, textAlign: "center", color: labelColor, fontFamily: "Inter, sans-serif" }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function June15Banner({ dk }: { dk: boolean }) {
  const fg = dk ? "#fff" : "#111";
  const fgDim = dk ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)";
  const fgX = dk ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const ring = dk ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)";
  const xStr = dk ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.32)";
  const divBd = dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <section className="june15-banner-section" style={{ width: "100%", boxSizing: "border-box", borderBottom: `1px solid ${divBd}` }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <FramerCountdown dk={dk} />
        </div>
        <div className="june15-banner-body">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(32px, 5vw, 58px)", color: fg, textTransform: "uppercase", lineHeight: 0.9, margin: "0 0 18px", letterSpacing: "0.01em" }}>
              THE MOST IMPORTANT<br />DAY IN <span style={{ color: OG }}>RECRUITING</span>
            </h2>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: fgDim, textTransform: "uppercase", margin: "0 0 22px", lineHeight: 1.65 }}>
              <span style={{ color: OG }}>JUNE 15TH</span> IS WHEN COLLEGE COACHES CAN OFFICIALLY<br />
              BEGIN DIRECT CONTACT WITH 2028 RECRUITS - AND YOUR<br />
              CUSTOM PLAYER CARD GETS YOU SEEN FIRST.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${ring}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={xStr} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: fgX, textTransform: "uppercase", letterSpacing: "0.07em" }}>THOUSANDS OF ATHLETES WILL COMPETE FOR ATTENTION...</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: OG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: fg, textTransform: "uppercase", letterSpacing: "0.07em" }}>YOUR PLAYER CARD PUTS YOU AHEAD OF THE PACK</span>
              </div>
            </div>
            <a href="https://www.exporecruits.com/june15" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ display: "inline-block", background: OG, borderRadius: 10, padding: "16px 40px", fontFamily: FONT, fontSize: 15, color: "#fff", textTransform: "uppercase", letterSpacing: "0.2em", cursor: "pointer" }}>
                JUMPSTART NOW
              </div>
            </a>
          </div>
          <div className="june15-banner-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/e49d37_31b774e319fb4863b8b8662d000b050d~mv2.png/v1/fill/w_742,h_782,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/ea443b42-63d2-4cdb-be9a-febaceaa5f1c.png"
              alt="June 15 Recruiting"
              style={{ width: "100%", display: "block", borderRadius: 12 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, right, accent, labelColor, valueColor }: {
  label: string; value: string; right?: boolean; accent?: boolean;
  labelColor: string; valueColor: string;
}) {
  return (
    <div style={{ textAlign: right ? "right" : "left" }}>
      <p style={{
        fontSize: 8, fontWeight: 700, letterSpacing: "0",
        textTransform: "uppercase" as const, color: labelColor,
        margin: "0 0 4px",
      }}>{label}</p>
      <p style={{
        fontSize: 19, fontWeight: 700, margin: 0,
        color: accent ? OG : valueColor,
        letterSpacing: "-0.015em", lineHeight: 1.15,
      }}>{value}</p>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  padding: "14px 28px",
  fontSize: 13, fontWeight: 600,
  background: "none", border: "none", cursor: "pointer",
};
