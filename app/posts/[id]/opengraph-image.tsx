import { ImageResponse } from "next/og";
import { getPostById, normalizeSport, summary } from "@/lib/posts";

export const runtime = "nodejs";
export const alt = "Expo Recruits post preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

export default async function Image({ params }: RouteProps) {
  const { id } = await params;
  const post = await getPostById(id);

  const title = truncate(post?.title || "College Openings", 90);
  const postSummary = truncate(
    post ? summary(post) : "Live openings from Expo Recruits.",
    170
  );
  const sport = normalizeSport(post?.sport) || "College Openings";
  const division = post?.division?.trim() || "Open Division";
  const position = post?.position?.trim() || "Open Position";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top right, rgba(255,114,0,0.28), transparent 30%), linear-gradient(135deg, #09090b 0%, #111827 42%, #1c1917 100%)",
          color: "white",
          padding: "44px",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 22,
            borderRadius: 34,
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 68,
                  height: 68,
                  borderRadius: 9999,
                  background: "#ff7200",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                EXPO
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.68)",
                  }}
                >
                  College Openings
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  Expo Recruits
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 9999,
                padding: "12px 20px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {sport}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {[sport, division, position].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 9999,
                    padding: "10px 18px",
                    background: item === sport ? "#ff7200" : "rgba(255,255,255,0.08)",
                    border:
                      item === sport
                        ? "1px solid rgba(255,114,0,0.8)"
                        : "1px solid rgba(255,255,255,0.12)",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "white",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                maxWidth: 900,
                fontSize: 66,
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: "-0.05em",
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                maxWidth: 830,
                fontSize: 28,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.76)",
              }}
            >
              {postSummary}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                color: "rgba(255,255,255,0.74)",
              }}
            >
              expo-recruits.com/posts/{post?.id || id}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 9999,
                padding: "14px 24px",
                background: "rgba(255,114,0,0.12)",
                border: "1px solid rgba(255,114,0,0.38)",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#ff9b47",
              }}
            >
              Live Opening
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
