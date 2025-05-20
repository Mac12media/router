import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

type Coach = {
  id: string;
  name: string;
  college: string;
  sport: string;
  email: string;
  phone: string;
  logoUrl?: string;
  yearsCoaching?: number;
  bio?: string;
  score?: number; // 0–100
};

const sampleCoaches: Coach[] = [
  {
    id: "1",
    name: "John Smith",
    college: "University of Michigan",
    sport: "Basketball",
    email: "jsmith@umich.edu",
    phone: "555-123-4567",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Michigan_Wolverines_logo.svg/1200px-Michigan_Wolverines_logo.svg.png",
    yearsCoaching: 12,
    bio: "John Smith has been coaching collegiate basketball for over a decade. Known for his defensive strategies and leadership development, he's led Michigan to multiple conference titles.",
    score: 3,
  },
];

export default function CoachPage({ params }: { params: { id: string } }) {
  const coach = sampleCoaches.find((c) => c.id === params.id);

  if (!coach) return notFound();

  const scoreColor =
    coach.score && coach.score >= 85
      ? "text-green-600"
      : coach.score ?? 100 >= 70 
      ? "text-yellow-500"
      : "text-red-500";

  const starCount = Math.round((coach.score ?? 0) / 20);

  return (
    <>
      <Breadcrumbs pageName={coach.name} />
      <PageWrapper>
        <Header title="🏆 Ranked Coach Profile">{coach.college}</Header>

        <main className="p-6 max-w-3xl mx-auto space-y-10">
          {/* Header Section with Ranking */}
          <section className="flex flex-col md:flex-row items-center gap-6">
            {coach.logoUrl && (
              <img
                src={coach.logoUrl}
                alt={`${coach.college} logo`}
                className="h-24 w-24 rounded-lg shadow-md"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{coach.name}</h1>
              <p className="text-gray-600">{coach.college}</p>
              <p className="text-sm text-muted-foreground">
                {coach.yearsCoaching
                  ? `${coach.yearsCoaching} years of coaching experience`
                  : `Experienced coach`}
              </p>
            </div>

            {/* Ranking */}
            <div className="bg-grey rounded-lg border p-4 shadow text-center w-40">
              <h2 className="text-sm uppercase text-gray-500">Score</h2>
              <div className={`text-4xl font-bold ${scoreColor}`}>
                {coach.score ?? "N/A"}
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
          {coach.bio && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Bio</h2>
              <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
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
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                <strong>Sport:</strong> {coach.sport}
              </li>
              <li>
                <strong>College:</strong> {coach.college}
              </li>
              <li>
                <strong>Years Coaching:</strong> {coach.yearsCoaching ?? "N/A"}
              </li>
            </ul>
          </section>
        </main>
      </PageWrapper>
    </>
  );
}
