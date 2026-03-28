import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoveLeft, MoveUpRight, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { PostLikeButton } from "@/components/parts/post-like-button";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { PostShareMenu } from "@/components/parts/post-share-menu";
import { getUsageForUser, getUserFull } from "@/lib/data/users";
import {
  formatDate,
  getPostById,
  normalizeSport,
  summary,
} from "@/lib/posts";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: "Post Not Found | EXPO",
    };
  }

  const description = summary(post);
  const title = `${post.title} | College Openings | EXPO`;
  const url = `/posts/${post.id}`;
  const imageUrl = `/posts/${post.id}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Expo Recruits",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [usage, userResult] = await Promise.all([getUsageForUser(), getUserFull()]);
  const userId = userResult?.data?.id;
  const plan = usage?.data?.plan;
  const isAnonymous = !userId;
  const isFreePlan = Boolean(userId) && plan === "free";
  const isLocked = isAnonymous || isFreePlan;
  const lockedCtaHref = isAnonymous ? "/login" : "/upgrade";
  const lockedCtaLabel = isAnonymous ? "Login to Unlock" : "Upgrade to Unlock";
  const userSport = normalizeSport(userResult?.data?.sport);
  const post = await getPostById(id, userId);

  if (!post) {
    notFound();
  }

  const postHref = `/posts/${post.id}`;
  const postSummary = summary(post);
  const showMatch = userSport && normalizeSport(post.sport) === userSport;

  return (
    <>
      <Breadcrumbs pageName={post.title} />
      <PageWrapper>
        <section className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/85 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.45)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/75">
          <div className="relative h-[180px] sm:h-[260px] lg:h-[320px]">
            <Image
              src="/college-football-openings-banner.avif"
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.56)_0%,rgba(0,0,0,0.82)_100%)]" />
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-5 py-6 text-white sm:px-8 sm:py-8">
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium backdrop-blur transition hover:bg-white/15"
                >
                  <MoveLeft className="h-3.5 w-3.5" />
                  Back to posts
                </Link>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur">
                    {normalizeSport(post.sport)}
                  </span>
                  {post.division ? (
                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
                      {post.division}
                    </span>
                  ) : null}
                  {post.position ? (
                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
                      {post.position}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-4 max-w-3xl text-2xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  {post.title}
                </h1>
                {!isLocked ? (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82 sm:text-base">
                    {postSummary}
                  </p>
                ) : null}
                {isLocked ? (
                  <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-orange-300/50 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    <Link
                      href={lockedCtaHref}
                      className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white transition hover:bg-orange-400"
                    >
                      {lockedCtaLabel}
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
            <article className="rounded-[1.75rem] border border-zinc-200/90 bg-white/95 p-5 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950/95 sm:p-6">
              <div className="relative">
                <div
                  className={isLocked ? "pointer-events-none select-none blur-[7px]" : ""}
                  aria-hidden={isLocked}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black uppercase text-white shadow-sm">
                        Expo
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                            {post.author}
                          </h2>
                          <ShieldCheck className="h-4 w-4 fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Updated {formatDate(post.updatedAt)}
                        </p>
                        {showMatch ? (
                          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                            Match for your sport
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <PostShareMenu title={post.title} url={postHref} />
                      <PostLikeButton
                        postId={post.id}
                        initialLiked={post.likedByUser}
                        initialLikes={post.likes}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Sport
                      </p>
                      <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">
                        {post.sport}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Division
                      </p>
                      <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">
                        {post.division || "Open"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Position
                      </p>
                      <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">
                        {post.position || "Open"}
                      </p>
                    </div>
                  </div>

                  {post.programDetails ? (
                    <div className="mt-6 rounded-[1.4rem] border border-zinc-200/80 bg-zinc-50/80 px-5 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                        Program Details
                      </p>
                      <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                        {post.programDetails}
                      </p>
                    </div>
                  ) : null}

                  {(post.content || post.excerpt) && (
                    <div className="mt-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Post
                      </p>
                      <div className="mt-3 rounded-[1.4rem] border border-zinc-200/80 bg-white px-5 py-5 dark:border-zinc-800 dark:bg-zinc-950">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                          {post.content || post.excerpt}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={post.programUrl}
                      className="inline-flex min-w-[170px] items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                    >
                      Program Profile
                    </Link>

                    <Link
                      href={post.programUrl}
                      className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 transition hover:translate-x-0.5"
                    >
                      Visit program link
                      <MoveUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                {isLocked ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="mx-auto max-w-sm rounded-[1.5rem] border border-zinc-200/80 bg-white/92 p-6 text-center shadow-xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/90">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                        Member Preview
                      </p>
                      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
                        Unlock the full post
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        Upgrade to reveal the summary, program details, the full write-up, and direct links.
                      </p>
                      <Link
                        href="/upgrade"
                        className="mt-5 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        Upgrade Now
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
