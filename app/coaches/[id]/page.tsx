import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { notFound } from "next/navigation";
import {
  MapPin,
  Star,
} from "lucide-react";
import { getCoach } from "@/lib/data/coaches";
import { getUsageForUser } from "@/lib/data/users";

/**
 * Page – /coach/[id]
 * ----------------------------------------------------------------------------------
 * This version updates the layout so that it matches the reference screenshot:
 *   1.  Full-width dark header card that contains the school logo + summary details.
 *   2.  Two light cards underneath – a wide “Coach Info” card (2/3) and a narrow
 *       “Program Info” card (1/3).
 *   3.  Accent orange left-border on section titles and orange CTA buttons.
 *   4.  Existing plan-lock blur overlay is preserved.
 *
 *  Tailwind is used heavily; tweak breakpoints/utilities as needed for your design system.
 * ----------------------------------------------------------------------------------
 */
export default async function CoachPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coachid = parseInt(id, 10);

  const usage = await getUsageForUser();
  const plan = usage?.data?.plan;

  // Check if the user has a valid plan (rookie, mvp, or elite)
  const isPlanValid = plan === "rookie" || plan === "mvp" || plan === "elite";

  const data = await getCoach({ coachid });
  const { data: coach } = data || {};

  if (!coach) return notFound();

  /* ------------------------------------------------------------
   * Temporary fallback values until these fields exist in the DB
   * ---------------------------------------------------------- */
  const gpa = coach.gpa ?? 3.65;
  const act = coach.act_sat ?? 24;
  const conference = coach.conference ?? coach.division ?? "";
  const location = coach.location ?? "";

  return (
    <>
      <Breadcrumbs pageName={coach.head_coach} />

      <PageWrapper>
        {/* ------------------------------------------------------------------ */}
        {/* 1️⃣  Header – Logo + School Overview                               */}
        {/* ------------------------------------------------------------------ */}
        <section
          className={`relative rounded-xl p-6 shadow border bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white space-y-6 ${
            !isPlanValid ? "filter blur-sm" : ""
          }`}
        >
          {/* Favourite Star */}
          <Star
            size={26}
            className="absolute right-6 top-6 stroke-[#FF7200]"
          />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Logo */}
            {coach.image && (
              <img
                src={coach.image}
                alt={`${coach.school} logo`}
                className="h-28 w-28 rounded-full object-cover border"
              />
            )}

            {/* School meta */}
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-[#FF7200]">
                {coach.school}
              </h1>
              <hr className="border-gray-600/60" />
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>{location}</span>
                </div>
                {conference && <span>{conference}</span>}
              </div>
            </div>

            {/* Academic quick-facts */}
            <div className="flex items-center gap-10 self-start sm:self-auto">
              <div className="text-center">
                <span className="block text-xs uppercase tracking-wider text-gray-400">
                  GPA
                </span>
                <span className="block text-2xl font-semibold">{gpa}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs uppercase tracking-wider text-gray-400">
                  ACT
                </span>
                <span className="block text-2xl font-semibold">{act}</span>
              </div>
            </div>
          </div>

          {/* NCAA Division tag */}
          {coach.division && (
            <span className="absolute right-6 bottom-6 text-sm uppercase tracking-wide">
              {coach.division}
            </span>
          )}
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2️⃣  Lower cards – Coach Info & Program Info                        */}
        {/* ------------------------------------------------------------------ */}
        <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Coach Info – 2/3rd width */}
          <div
            className={`sm:col-span-2 rounded-xl border bg-card p-6 shadow ${
              !isPlanValid ? "filter blur-sm" : ""
            }`}
          >
            <h2 className="mb-4 flex items-center text-xl font-semibold">
              <span className="mr-2 inline-block h-5 w-1.5 rounded-sm bg-[#FF7200]" />
              Coach Info
            </h2>

            <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-3">
              {/* Labels / Values */}
              <div className="space-y-2">
                <div className="text-xs uppercase text-gray-500">Head Coach</div>
                <div className="font-medium text-[#FF7200]">{coach.head_coach}</div>

                <a
                  href="#"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  View Full Staff
                </a>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase text-gray-500">Email</div>
                <div className="break-all">{coach.email}</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase text-gray-500">Phone</div>
                <div>{coach.phone}</div>
              </div>
            </div>

            {/* Bio */}
            {coach.bio && (
              <div className="mt-6">
                <div className="text-xs uppercase text-gray-500">Bio</div>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {coach.bio}
                </p>
              </div>
            )}
          </div>

          {/* Program Info – 1/3rd width */}
          <div
            className={`sm:col-span-1 flex flex-col justify-between rounded-xl border bg-card p-6 shadow ${
              !isPlanValid ? "filter blur-sm" : ""
            }`}
          >
            <div>
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <span className="mr-2 inline-block h-5 w-1.5 rounded-sm bg-[#FF7200]" />
                Program Info
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {coach.camps && (
                <a
                  href={coach.camps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-[#FF7200] py-3 text-center font-medium text-white transition hover:opacity-90"
                >
                  Questionnaire
                </a>
              )}

              {coach.camps && (
                <a
                  href={coach.camps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-black py-3 text-center font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Camps
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Plan lock overlay (unchanged) */}
        {!isPlanValid && (
          <div className="relative left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-xl border-4 border-[#FF7200] bg-white p-24 text-center shadow-xl dark:bg-black">
            <h2 className="mb-4 text-4xl font-bold">This content is locked</h2>
            <p className="mb-6 text-lg">Upgrade your plan to view this content.</p>
            <a
              href="/upgrade"
              className="rounded-lg bg-primary py-3 px-8 text-xl text-white transition duration-300 hover:bg-primary-dark dark:text-black"
            >
              Upgrade Now
            </a>
          </div>
        )}
      </PageWrapper>
    </>
  );
}
