import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getCoach } from "@/lib/data/coaches";

export default async function CoachPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coachid = parseInt(id, 10);
  const data = await getCoach({ coachid });
  const { data: coach } = data || {};

  if (!coach) return notFound();

  const score = 80;
  const scoreColor =
    score >= 85
      ? "text-green-600"
      : score >= 70
      ? "text-yellow-500"
      : "text-red-500";

  const starCount = Math.round(score / 20);

  return (
    <>
      <Breadcrumbs pageName={coach.head_coach} />
      <PageWrapper>
        <Header title="🏆 Ranked Coach Profile">{coach.school}</Header>

        <main className="p-6 max-w-4xl mx-auto space-y-10">
          {/* Profile Overview */}
          <section className="flex flex-col md:flex-row items-center md:items-start gap-6 rounded-xl bg-muted p-6 shadow-lg border">
            {/* Coach Photo */}
            {coach.photo_url && (
              <img
                src={coach.photo_url}
                alt={`${coach.school} logo`}
                className="h-28 w-28 md:h-32 md:w-32 rounded-xl object-cover shadow border"
              />
            )}

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-primary">{coach.head_coach}</h1>
              <p className="text-lg">{coach.school}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {coach.created_at ? `20 years of coaching experience` : `Experienced coach`}
              </p>
            </div>

            {/* Score Card */}
            <div className="bg-background rounded-xl border p-4 text-center w-full sm:w-40 shadow-md">
              <h2 className="text-xs uppercase text-muted-foreground tracking-wide">Score</h2>
              <div className={`text-3xl font-bold mt-1 ${scoreColor}`}>
                {score ?? "N/A"}
              </div>
              <div className="mt-2 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < starCount ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Program Bio */}
          {coach.program_bio && (
            <section className="bg-card p-6 rounded-xl shadow border">
              <h2 className="text-xl font-semibold mb-2">🏅 Program Bio</h2>
              <p className="leading-relaxed text-muted-foreground">{coach.program_bio}</p>
            </section>
          )}

          {/* Contact Info */}
          <section className="bg-card p-6 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-4">📞 Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Email:</strong>{" "}
                <span className="blur-sm hover:blur-none transition duration-300 cursor-pointer">
                  {coach.email}
                </span>
              </div>
              <div>
                <strong>Phone:</strong> {coach.phone}
              </div>
            </div>
          </section>

          {/* Coaching Details */}
          <section className="bg-card p-6 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-4">📘 Coaching Details</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Division:</strong> {coach.division}
              </li>
              <li>
                <strong>School:</strong> {coach.school}
              </li>
              <li>
                <strong>Website:</strong>{" "}
                {coach.website ? (
                  <a
                    href={coach.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                ) : (
                  "N/A"
                )}
              </li>
            </ul>
          </section>
        </main>
      </PageWrapper>
    </>
  );
}
