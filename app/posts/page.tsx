import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, MoveUpRight, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { PostSummaryToggle } from "@/components/parts/post-summary-toggle";
import { PostViewCounter } from "@/components/parts/post-view-counter";
import { PostsSportSelect } from "@/components/parts/posts-sport-select";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { PostShareMenu } from "@/components/parts/post-share-menu";
import { getUsageForUser, getUserFull } from "@/lib/data/users";
import {
  extractTweetUrls,
  getPostSportFade,
  getPosts,
  normalizePosition,
  normalizeSport,
  stripTweetUrls,
  summary,
} from "@/lib/posts";

const pageData = {
  name: "Posts",
};

const POST_SPORT_OPTIONS = [
  "Football",
  "Basketball Boys",
  "Basketball Girls",
  "Flag Football",
] as const;

export const metadata: Metadata = {
  title: "College Openings | EXPO",
  description:
    "Browse live college openings across football, basketball, and flag football programs on Expo Recruits.",
  alternates: {
    canonical: "/posts",
  },
  openGraph: {
    title: "College Openings | EXPO",
    description:
      "Browse live college openings across football, basketball, and flag football programs on Expo Recruits.",
    url: "/posts",
      siteName: "Expo Recruits",
      images: [
        {
          url: "/expo_banner.png",
          width: 1536,
          height: 1024,
          alt: "College openings banner",
        },
      ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Openings | EXPO",
    description:
      "Browse live college openings across football, basketball, and flag football programs on Expo Recruits.",
    images: ["/expo_banner.png"],
  },
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type PostsPageProps = {
  searchParams?: Promise<{
    sport?: string;
  }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const [usage, userResult] = await Promise.all([getUsageForUser(), getUserFull()]);
  const plan = usage?.data?.plan;
  const isLocked = plan === "free";
  const userId = userResult?.data?.id;
  const posts = await getPosts(userId);
  const userSport = normalizeSport(userResult?.data?.sport);
  const userPosition = normalizePosition(userResult?.data?.position);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedSport = normalizeSport(resolvedSearchParams?.sport);

  const prioritizedPosts = userSport
    ? [...posts].sort((a, b) => {
        const aMatch = normalizeSport(a.sport) === userSport ? 1 : 0;
        const bMatch = normalizeSport(b.sport) === userSport ? 1 : 0;
        return bMatch - aMatch;
      })
    : posts;

  const selectedSport = requestedSport
    ? POST_SPORT_OPTIONS.includes(requestedSport as (typeof POST_SPORT_OPTIONS)[number])
      ? requestedSport
      : userSport &&
          POST_SPORT_OPTIONS.includes(userSport as (typeof POST_SPORT_OPTIONS)[number])
        ? userSport
        : POST_SPORT_OPTIONS[0]
    : userSport &&
        POST_SPORT_OPTIONS.includes(userSport as (typeof POST_SPORT_OPTIONS)[number])
      ? userSport
      : POST_SPORT_OPTIONS[0];

  const postsForSport = prioritizedPosts.filter(
    (post) => normalizeSport(post.sport) === selectedSport
  );
  const visiblePosts = postsForSport.filter((post) => {
    const postPosition = normalizePosition(post.position);
    if (!userPosition) return true;
    return postPosition === "All" || postPosition === userPosition;
  });

  const heroSport = selectedSport;
  const heroTitle = "College Openings";
  const recentLabel = `Recent ${heroSport} Post`;
  const heroFadeClass = getPostSportFade(heroSport);
  const heroOverlayStyle = {
    backgroundImage:
      "linear-gradient(135deg, rgba(249,115,22,0.05), rgba(249,115,22,0.16)), linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.82))",
  } as const;

  return (
    <>
      <Breadcrumbs pageName={pageData.name} />
      <PageWrapper>
        <section className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/85 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.45)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/75">
          <div className="relative h-[140px] sm:h-[240px] lg:h-[280px]">
            <Image
              src="/expo_banner.png"
              alt="College football openings banner"
              fill
              priority
              className="object-cover"
            />
            <div className={`absolute inset-0 ${heroFadeClass}`} />
            <div className="absolute inset-0" style={heroOverlayStyle} />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <PostsSportSelect sports={[...POST_SPORT_OPTIONS]} value={heroSport} />
              <h1 className="max-w-2xl text-2xl font-black uppercase leading-none tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                {heroTitle}
              </h1>
            </div>
          </div>

          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-5 w-1 rounded-full bg-orange-500" />
              <p className="text-sm font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white">
                {recentLabel}
              </p>
            </div>

            <div className="space-y-6">
              {visiblePosts.map((post) => {
                const postHref = isLocked ? "/upgrade" : `/posts/${post.id}`;
                const postSummary = summary(post);
                const summaryTweetUrls = extractTweetUrls(postSummary);
                const summaryText = stripTweetUrls(postSummary);

                return (
                  <article
                    key={post.id}
                    className="group relative rounded-[1.6rem] border border-zinc-200/90 bg-white/95 p-4 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-30px_rgba(0,0,0,0.38)] sm:p-5 dark:border-zinc-800 dark:bg-zinc-950/95"
                  >
                  <Link
                    href={postHref}
                    aria-label={isLocked ? `Upgrade to view ${post.title}` : `View ${post.title}`}
                    className="absolute inset-0 z-0 rounded-[1.6rem]"
                  />

                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black uppercase text-white shadow-sm">
                        Expo
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">
                            {post.author}
                          </h2>
                          <ShieldCheck className="h-3.5 w-3.5 fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDate(post.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <PostViewCounter
                        postId={post.id}
                        initialViews={post.views}
                        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-2 text-[10px] font-medium uppercase text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                      />
                      <PostShareMenu title={post.title} url={postHref} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] dark:border-zinc-800">
                   
                  </div>

                  <div className="relative mt-4">
                    <div
                      className={`relative z-10 mb-4 transition ${
                        isLocked ? "pointer-events-none select-none blur-[5px]" : ""
                      }`}
                    >
                      <Link href={postHref} className="relative z-10 block">
                        <h3 className="text-base font-semibold tracking-[-0.02em] text-zinc-950 transition-colors group-hover:text-orange-500 dark:text-white sm:text-lg">
                          {post.title}
                        </h3>
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {post.sport ? (
                          <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            {post.sport}
                          </span>
                        ) : null}
                        {post.division ? (
                          <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {post.division}
                          </span>
                        ) : null}
                        {post.position ? (
                          <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {post.position}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div
                      className={`rounded-2xl border border-zinc-200/80 bg-zinc-50/70 px-4 py-4 transition dark:border-zinc-800 dark:bg-zinc-900/50 ${
                        isLocked ? "pointer-events-none select-none blur-[5px]" : ""
                      }`}
                    >
                      <PostSummaryToggle
                        text={summaryText}
                        href={postHref}
                        tweetUrls={summaryTweetUrls}
                      />
                    </div>

                    {isLocked ? (
                      <div className="absolute inset-0 flex items-center justify-center px-3">
                        <Link
                          href="/upgrade"
                          className="rounded-full bg-black px-4 py-2 text-[11px] font-semibold uppercase  text-white shadow-lg transition hover:bg-zinc-900 dark:bg-orange-500 dark:text-black dark:hover:bg-orange-400"
                        >
                          Upgrade to Unlock
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  <div className="relative z-10 mt-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      {isLocked ? (
                        <Link
                          href="/upgrade"
                          className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 sm:min-w-[150px] sm:w-auto"
                        >
                          Upgrade
                        </Link>
                      ) : (
                        <Link
                          href={postHref}
                          className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-xs font-semibold transition sm:min-w-[150px] sm:w-auto ${
                            post.hasSubmittedProfile
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                        >
                          {post.hasSubmittedProfile ? "Profile Submitted" : "Submit Profile"}
                        </Link>
                      )}
                      <Link
                        href={isLocked ? "/upgrade" : post.programUrl}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 sm:min-w-[150px] sm:w-auto dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                      >
                        {isLocked ? "Members Only" : "Visit Program"}
                      </Link>
                    </div>
                  </div>

                  
                  </article>
                );
              })}

              {visiblePosts.length === 0 && (
                <div className="rounded-[1.6rem] border border-dashed border-zinc-300 bg-zinc-50/70 p-8 text-center text-sm text-muted-foreground dark:border-zinc-800 dark:bg-zinc-900/40">
                  No live posts yet. Add posts in the dashboard to see them here.
                </div>
              )}
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
