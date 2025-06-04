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
      ? "text-[#FF7200]"
      : "text-red-500";

  const starCount = Math.round(score / 20);

  return (
    <>
      <Breadcrumbs pageName={coach.head_coach} />
      <PageWrapper>
        <Header title={coach.school}></Header>

          {/* Profile Overview and Score Card in a Single Card */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-xl  ">
            {/* Profile Overview and Score in the same card */}
            <div className="sm:col-span-1 bg-card p-6 rounded-xl shadow border flex flex-col items-center sm:items-start justify-between space-y-6 sm:space-y-0">
              {/* Coach Photo */}
              {coach.photo_url && (
                <div className="flex justify-center self-center
">
                  <img
                    src={coach.photo_url}
                    alt={`${coach.school} logo`}
                    className="h-28 w-28 sm:h-32 sm:w-32 rounded-xl object-cover shadow border"
                  />
                </div>
              )}

              {/* Info and Score */}
              <div className="text-center self-center flex-1 space-y-2 sm:space-y-2">
                <h1 className="text-3xl font-bold text-primary">{coach.head_coach}</h1>
                <p className="text-lg">{coach.school}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {coach.created_at ? `20 years of coaching experience` : `Experienced coach`}
                </p>

                {/* Score */}
                <div className="text-center">
                  <h2 className="text-xs uppercase text-muted-foreground tracking-wide">Score</h2>
                  <div className={`text-3xl font-bold mt-1 ${scoreColor}`}>
                    {score ?? "N/A"}
                  </div>
                  <div className="mt-2 flex justify-center  gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < starCount ? "fill-yellow-400 text-[#FF7200]" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Coaching Details */}
            <div className="sm:col-span-2 space-y-6">
        
              {/* Contact Info and Coaching Details Combined */}
              <section className="bg-card p-6 rounded-xl shadow border">
                <h2 className="text-xl font-semibold mb-4">📞 Contact Information & Coaching Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  {/* Contact Information */}
                  <div className="space-y-2">
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

                  {/* Coaching Details */}
                  <div className="space-y-2">
                    <div>
                      <strong>Division:</strong> {coach.division}
                    </div>
                    <div>
                      <strong>School:</strong> {coach.school}
                    </div>
                    <div>
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
                    </div>
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
            </div>
          </section>

      </PageWrapper>
    </>
  );
}
