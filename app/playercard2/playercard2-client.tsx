"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

type Card2 = {
  firstName: string; lastName: string; fullName: string;
  role: string; subtitle: string; bio: string; refId: string; dept: string;
  height: string; weight: string; acdScore: string; athScore: string;
  image: string; x: string; instagram: string; email: string;
};

const OG     = "#FF6600";
const W      = 340;
const H      = 516;
const JUNE15 = new Date("2026-06-15T05:00:00Z");
const FONT   = "'Impact', 'Arial Black', sans-serif";

function clean(s: string) { return s.replace(/_/g, " ").trim(); }

// ─── Front ────────────────────────────────────────────────────
function Front({ card }: { card: Card2 }) {
  const yr    = card.dept.replace(/^#/, "");
  const sport = clean(card.subtitle || card.role);
  const parts = card.fullName.trim().split(/\s+/);
  const first = parts.length > 1 ? parts.slice(0, -1).join(" ") : "";
  const last  = parts[parts.length - 1] || card.fullName;
  const isDefaultRole = !card.role || card.role.toLowerCase() === "athlete";
  const tagText = isDefaultRole ? sport : `${clean(card.role)} · ${sport}`;

  return (
    <div style={{ width: "100%", height: H, background: "#fff", borderRadius: 18, overflow: "hidden", position: "relative", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ height: 46, background: "#111", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/expo.avif" alt="Expo" style={{ width: 22, height: 22, objectFit: "contain", filter: "invert(1)" }} />
          <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "0.16em" }}>EXPO RECRUITS</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: OG }}>CLASS {yr}</div>
          <div style={{ fontSize: 6.5, fontWeight: 700, color: "rgba(255,255,255,0.38)", letterSpacing: "0.2em", textTransform: "uppercase" }}>PROSPECT</div>
        </div>
      </div>
      <div style={{ height: 218, background: "#e4e4e4", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.image} alt={card.fullName}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
          onError={(e) => { (e.target as HTMLImageElement).src = "/userplaceholder.png"; }}
        />
      </div>
      <div style={{ height: 3, background: OG, flexShrink: 0 }} />
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", height: H - 46 - 218 - 3 }}>
        <div style={{ marginBottom: 10, lineHeight: 1 }}>
          {first && last ? (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.38)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{first}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#111", letterSpacing: "-0.04em", textTransform: "uppercase", lineHeight: 0.94 }}>{last}</div>
            </>
          ) : (
            <div style={{ fontSize: 28, fontWeight: 900, color: "#111", letterSpacing: "-0.035em", textTransform: "uppercase" }}>{card.fullName}</div>
          )}
        </div>
        <div style={{ alignSelf: "flex-start", background: OG, borderRadius: 5, padding: "4px 10px", marginBottom: 12 }}>
          <span style={{ fontSize: 9.5, fontWeight: 900, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase" }}>{tagText}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", borderTop: "1px solid #efefef", borderBottom: "1px solid #efefef", padding: "9px 0", marginBottom: 12, flexShrink: 0 }}>
          <StatCell label="HEIGHT" value={card.height !== "--" ? card.height : "—"} />
          <StatCell label="WEIGHT" value={card.weight !== "--" ? card.weight : "—"} />
          <StatCell label="SCHOOL" value={card.refId || "—"} last />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flex: 1 }}>
          <div>
            <div style={{ fontSize: 7, fontWeight: 700, color: "rgba(0,0,0,0.32)", letterSpacing: "0", textTransform: "uppercase", marginBottom: 3 }}>ATH SCORE</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: OG, letterSpacing: "-0.04em", lineHeight: 1 }}>{card.athScore !== "--" ? card.athScore : "—"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "rgba(0,0,0,0.32)", letterSpacing: "0", textTransform: "uppercase", marginBottom: 3 }}>ACD SCORE</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#111", letterSpacing: "-0.04em", lineHeight: 1 }}>{card.acdScore !== "--" ? card.acdScore : "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: last ? "none" : "1px solid #efefef" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#111", textAlign: "center", lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 6.5, fontWeight: 700, color: "rgba(0,0,0,0.35)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ─── Back ─────────────────────────────────────────────────────
function Back({ card, userId }: { card: Card2; userId: string }) {
  const yr   = card.dept.replace(/^#/, "");
  const xUrl = card.x ? `https://x.com/${card.x.replace(/^@/, "")}` : null;
  return (
    <div style={{ width: "100%", height: H, background: "#fff", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ height: 46, background: "#111", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/expo.avif" alt="Expo" style={{ width: 22, height: 22, objectFit: "contain", filter: "invert(1)" }} />
          <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "0.16em" }}>EXPO RECRUITS</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: OG }}>CLASS {yr}</div>
          <div style={{ fontSize: 6.5, fontWeight: 700, color: "rgba(255,255,255,0.38)", letterSpacing: "0.2em", textTransform: "uppercase" }}>PROSPECT</div>
        </div>
      </div>
      <div style={{ height: 3, background: OG, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "18px 18px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid #efefef" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: OG, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3 }}>ATHLETE PROFILE</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#111", letterSpacing: "-0.03em", textTransform: "uppercase" }}>{card.fullName}</div>
          <div style={{ fontSize: 11, color: "rgba(0,0,0,0.42)", marginTop: 2 }}>{clean(card.role)} · {clean(card.subtitle)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 18 }}>
          <Row label="ATH SCORE" value={card.athScore !== "--" ? card.athScore : "—"} accent />
          <Row label="ACD SCORE" value={card.acdScore !== "--" ? card.acdScore : "—"} accent />
          <Row label="SCHOOL"    value={card.refId || "—"} />
          <Row label="GRAD YEAR" value={card.dept || "—"} />
          {card.height !== "--" && card.weight !== "--" && (
            <Row label="HT / WT" value={`${card.height} · ${card.weight}`} />
          )}
        </div>
        {card.bio ? (
          <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid #efefef" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "rgba(0,0,0,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>BIO</div>
            <p style={{ fontSize: 11.5, color: "rgba(0,0,0,0.52)", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{card.bio}</p>
          </div>
        ) : <div style={{ flex: 1 }} />}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href={`/profile/${userId}`} style={{ textDecoration: "none" }}>
            <div style={{ padding: "12px 0", background: "#111", borderRadius: 10, textAlign: "center", fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
              View Full Profile
            </div>
          </Link>
          {xUrl && (
            <a href={xUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ padding: "12px 0", border: `2px solid ${OG}`, borderRadius: 10, textAlign: "center", fontSize: 11, fontWeight: 900, color: OG, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
                Share on X
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Countdown ────────────────────────────────────────────────
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
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
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

// ─── June 15 Banner ───────────────────────────────────────────
function June15Banner({ dk }: { dk: boolean }) {
  const fg    = dk ? "#fff"                   : "#111";
  const fgDim = dk ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)";
  const fgX   = dk ? "rgba(255,255,255,0.5)"  : "rgba(0,0,0,0.45)";
  const ring  = dk ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)";
  const xStr  = dk ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.32)";
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
              BEGIN DIRECT CONTACT WITH 2028 RECRUITS — AND YOUR<br />
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

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.42)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 900, color: accent ? OG : "#111", letterSpacing: "-0.01em" }}>{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function PlayerCard2Client({ card, userId }: { card: Card2; userId: string }) {
  const [flipped, setFlipped]       = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [copied, setCopied]         = useState(false);
  const [mounted, setMounted]       = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

  const dk = mounted && resolvedTheme === "dark";

  const pg = {
    pageBg:     dk ? "#080808"                 : "#f7f5f2",
    dot:        dk ? "rgba(255,255,255,0.05)"  : "rgba(0,0,0,0.08)",
    glow:       dk ? `${OG}0b`                 : `${OG}14`,
    text:       dk ? "#fff"                    : "#111",
    textDim:    dk ? "rgba(255,255,255,0.4)"   : "rgba(0,0,0,0.42)",
    textFaint:  dk ? "rgba(255,255,255,0.25)"  : "rgba(0,0,0,0.3)",
    divider:    dk ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.09)",
    btnSecBg:   dk ? "#1c1c1c"                 : "rgba(0,0,0,0.06)",
    btnSecBd:   dk ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.1)",
    btnSecTxt:  dk ? "#fff"                    : "#111",
    btnOutBd:   dk ? "rgba(255,255,255,0.14)"  : "rgba(0,0,0,0.14)",
    btnOutTxt:  dk ? "rgba(255,255,255,0.75)"  : "rgba(0,0,0,0.65)",
    cardShadow: dk
      ? "0 32px 72px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.07)"
      : "0 20px 60px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.06)",
  };

  const flip = () => { setFlipped(f => !f); setHasFlipped(true); };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/playercard2?id=${userId}`);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const yr = card.dept.replace(/^#/, "");

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
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "35%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${pg.glow} 0%, transparent 65%)`,
        }} />
      </div>

      {/* June 15 promo — full width at top */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <June15Banner dk={dk} />
      </div>

      {/* Card section */}
      <div className="pc2-card-section" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36, maxWidth: 480, width: "100%" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            borderRadius: 100, border: `1px solid ${OG}50`, background: `${OG}15`,
            padding: "5px 16px", marginBottom: 14,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: OG }} />
            <span style={{ fontFamily: FONT, fontSize: 11, color: OG, letterSpacing: "0", textTransform: "uppercase" }}>
              JUNE 15 — {yr} RECRUITING WINDOW
            </span>
          </div>
         
        </div>

        {/* Flip scene */}
        <div
          className="pc2-flip-wrap"
          style={{ perspective: "1000px", height: H, cursor: "pointer" }}
          onClick={flip}
        >
          <div style={{
            width: "100%", height: "100%", position: "relative",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" as "hidden",
              borderRadius: 18, boxShadow: pg.cardShadow,
            }}>
              <Front card={card} />
            </div>
            <div style={{
              position: "absolute", inset: 0,
              backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" as "hidden",
              transform: "rotateY(180deg)",
              borderRadius: 18, boxShadow: pg.cardShadow,
            }}>
              <Back card={card} userId={userId} />
            </div>
          </div>
        </div>

        {/* Flip hint */}
        <p style={{
          marginTop: 14, fontFamily: FONT, fontSize: 11,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: pg.textFaint, opacity: hasFlipped ? 0 : 1,
          transition: "opacity 0.5s", pointerEvents: "none",
        }}>
          TAP TO FLIP
        </p>

        {/* Actions */}
        <div className="pc2-actions" style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={copyLink} style={{
            flex: 1, padding: "13px 0",
            background: pg.btnSecBg, border: `1px solid ${pg.btnSecBd}`, borderRadius: 12, cursor: "pointer",
            fontFamily: FONT, fontSize: 12, color: pg.btnSecTxt,
            letterSpacing: "0.14em", textTransform: "uppercase" as const,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {copied ? "COPIED!" : "COPY LINK"}
          </button>

          <button onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator.share({ title: card.fullName, url: window.location.href });
            } else copyLink();
          }} style={{
            flex: 1.4, padding: "13px 0",
            background: OG, border: "none", borderRadius: 12, cursor: "pointer",
            fontFamily: FONT, fontSize: 12, color: "#fff",
            letterSpacing: "0.14em", textTransform: "uppercase" as const,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            SHARE NOW
          </button>

          <Link href={`/profile/${userId}`} style={{ flex: 1, textDecoration: "none" }}>
            <div style={{
              padding: "13px 0", borderRadius: 12,
              border: `1px solid ${pg.btnOutBd}`,
              fontFamily: FONT, fontSize: 12, color: pg.btnOutTxt,
              letterSpacing: "0.1em", textTransform: "uppercase" as const,
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "100%",
            }}>
              PROFILE
            </div>
          </Link>
        </div>
      </div>

      {/* Why your card matters */}
      <div className="pc2-why-section" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ maxWidth: W, width: "100%" }}>
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
                  <span style={{ fontFamily: FONT, fontSize: 10, color: pg.textDim, letterSpacing: "0.12em", textTransform: "uppercase" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
