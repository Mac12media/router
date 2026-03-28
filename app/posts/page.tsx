import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MoveUpRight, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { PostsSportSelect } from "@/components/parts/posts-sport-select";
import { PostLikeButton } from "@/components/parts/post-like-button";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { PostShareMenu } from "@/components/parts/post-share-menu";
import { getUsageForUser, getUserFull } from "@/lib/data/users";
import { getPosts, normalizeSport, summary } from "@/lib/posts";

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
        url: "/college-football-openings-banner.avif",
        width: 2048,
        height: 768,
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
    images: ["/college-football-openings-banner.avif"],
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

  const visiblePosts = prioritizedPosts.filter(
    (post) => normalizeSport(post.sport) === selectedSport
  );

  const heroSport = selectedSport;
  const heroTitle = "College Openings";
  const recentLabel = `Recent ${heroSport} Post`;

  return (
    <>
      <Breadcrumbs pageName={pageData.name} />
      <PageWrapper>
        <section className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/85 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.45)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/75">
          <div className="relative h-[140px] sm:h-[240px] lg:h-[280px]">
            <Image
              src="/college-football-openings-banner.avif"
              alt="College football openings banner"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.56)_0%,rgba(0,0,0,0.78)_100%)]" />
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

                return (
                  <article
                    key={post.id}
                    className="group relative rounded-[1.6rem] border border-zinc-200/90 bg-white/95 p-4 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-30px_rgba(0,0,0,0.38)] dark:border-zinc-800 dark:bg-zinc-950/95"
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

                    <PostShareMenu title={post.title} url={postHref} />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] dark:border-zinc-800">
                   
                  </div>

                  <div className="relative mt-4">
                    <div
                      className={`rounded-2xl border border-zinc-200/80 bg-zinc-50/70 px-4 py-4 transition dark:border-zinc-800 dark:bg-zinc-900/50 ${
                        isLocked ? "pointer-events-none select-none blur-[5px]" : ""
                      }`}
                    >
                    <div className="flex flex-wrap items-center gap-2">
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

                    <Link href={postHref} className="relative z-10 block">
                      <h3 className="mt-4 text-base font-semibold tracking-[-0.02em] text-zinc-950 transition-colors group-hover:text-orange-500 dark:text-white sm:text-lg">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="mt-3 text-xs leading-6 text-zinc-700 dark:text-zinc-300 sm:text-sm">
                      {summary(post)}
                    </p>
                    </div>

                    {isLocked ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Link
                          href="/upgrade"
                          className="rounded-full bg-black px-4 py-2 text-[11px] font-semibold uppercase  text-white shadow-lg transition hover:bg-zinc-900 dark:bg-orange-500 dark:text-black dark:hover:bg-orange-400"
                        >
                          Upgrade to Unlock
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  <div className="relative z-10 mt-4 flex items-center justify-between gap-4">
                    <Link
                      href={isLocked ? "/upgrade" : post.programUrl}
                      className="inline-flex min-w-[150px] items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600"
                    >
                      {isLocked ? "Upgrade" : "Visit"}
                    </Link>

                    {isLocked ? (
                      <Link
                        href="/upgrade"
                        className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-[10px] font-medium uppercase  text-orange-600 transition hover:border-orange-300 hover:bg-orange-100 dark:border-orange-900/70 dark:bg-orange-950/30 dark:text-orange-400"
                      >
                        Members Only
                      </Link>
                    ) : (
                      <PostLikeButton
                        postId={post.id}
                        initialLiked={post.likedByUser}
                        initialLikes={post.likes}
                      />
                    )}
                  </div>

                  <div className="relative z-10 mt-4 flex justify-end text-[11px] text-muted-foreground">
                    <Link
                      href={postHref}
                      className="inline-flex items-center gap-1 font-medium text-orange-500 transition group-hover:translate-x-0.5"
                    >
                      View Post
                      <MoveUpRight className="h-3.5 w-3.5" />
                    </Link>
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
