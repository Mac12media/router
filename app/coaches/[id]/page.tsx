import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getCoach } from "@/lib/data/coaches";




export default async function CoachPage({ params }: { params: { id: string } }) {

const id = parseInt(params.id, 10);
  const data = await getCoach({ id });
      const { data: coach, serverError } = data || {};

    const score = 80;
  if (!coach) return notFound();

  const scoreColor =
    score && score >= 85
      ? "text-green-600"
      : score ?? 100 >= 70 
      ? "text-yellow-500"
      : "text-red-500";

  const starCount = Math.round((score ?? 0) / 20);

  return (
    <>
      <Breadcrumbs pageName={coach.head_coach} />
      <PageWrapper>
        <Header title="🏆 Ranked Coach Profile">{coach.school}</Header>

        <main className="p-6 max-w-3xl mx-auto space-y-10">
          {/* Header Section with Ranking */}
          <section className="flex flex-col md:flex-row items-center gap-6">
            {coach.photo_url && (
              <img
                src={coach.photo_url}
                alt={`${coach.school} logo`}
                className="h-24 w-24 rounded-lg shadow-md"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{coach.head_coach}</h1>
              <p className="">{coach.school}</p>
              <p className="text-sm text-muted-foreground">
                {coach.created_at
                  ? `${20} years of coaching experience`
                  : `Experienced coach`}
              </p>
            </div>

            {/* Ranking */}
            <div className="bg-grey rounded-lg border p-4 shadow text-center w-40">
              <h2 className="text-sm uppercase text-gray-500">Score</h2>
              <div className={`text-4xl font-bold ${scoreColor}`}>
                {score ?? "N/A"}
              </div>
              <div className="mt-2 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < starCount ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Bio */}
          {coach.program_bio && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Bio</h2>
              <p className=" leading-relaxed">{coach.program_bio}</p>
            </section>
          )}

          {/* Contact Info */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Contact Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>Email:</strong>{" "}
                <span className="blur-sm hover:blur-none transition duration-300 cursor-pointer">
                  {coach.email}
                </span>
              </p>
              <p>
                <strong>Phone:</strong> {coach.phone}
              </p>
            </div>
          </section>

          {/* Coaching Details */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Coaching Details</h2>
            <ul className="list-disc pl-5 space-y-1 ">
              <li>
                <strong>Division:</strong> {coach.division}
              </li>
              <li>
                <strong>School:</strong> {coach.school}
              </li>
              <li>
                <strong>Website</strong> {coach.website ?? "N/A"}
              </li>
            </ul>
          </section>
        </main>
      </PageWrapper>
    </>
  );
}
