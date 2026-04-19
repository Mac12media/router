import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoveLeft, MoveUpRight, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { PostProfileSubmitButton } from "@/components/parts/post-profile-submit-button";
import { PageWrapper } from "@/components/parts/page-wrapper";
import { PostShareMenu } from "@/components/parts/post-share-menu";
import { PostTweetEmbeds } from "@/components/parts/post-tweet-embeds";
import { PostViewCounter } from "@/components/parts/post-view-counter";
import { getPostSubmissionForUser } from "@/lib/data/post-submissions";
import { getUsageForUser, getUserFull } from "@/lib/data/users";
import {
  extractTweetUrls,
  formatDate,
  getPostSportFade,
  getPostSportImage,
  getPostById,
  normalizeSport,
  stripTweetUrls,
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
  const imageUrl = getPostSportImage(post.sport);

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
          alt: `${normalizeSport(post.sport) || "College"} openings`,
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
  const userSport = normalizeSport(userResult?.data?.sport);
  const post = await getPostById(id, userId);

  if (!post) {
    notFound();
  }

  const postHref = `/posts/${post.id}`;
  const postSummary = summary(post);
  const showMatch = userSport && normalizeSport(post.sport) === userSport;
  const heroFadeClass = getPostSportFade(post.sport);
  const existingSubmission = await getPostSubmissionForUser(post.id, userId);
  const programDetailsTweetUrls = extractTweetUrls(post.programDetails);
  const postBodyTweetUrls = extractTweetUrls(post.content || post.excerpt);
  const cleanProgramDetails = stripTweetUrls(post.programDetails);
  const cleanPostBody = stripTweetUrls(post.content || post.excerpt);
  const heroOverlayStyle = {
    backgroundImage:
      "linear-gradient(135deg, rgba(249,115,22,0.05), rgba(249,115,22,0.16)), linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.82))",
  } as const;
  return (
    <>
      <Breadcrumbs pageName={post.title} />
      <PageWrapper>
        <section className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/85 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.45)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/75">
          <div className="relative h-[180px] sm:h-[260px] lg:h-[320px]">
            <Image
              src="/expo_banner.png"
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
            <div className={`absolute inset-0 ${heroFadeClass}`} />
            <div className="absolute inset-0" style={heroOverlayStyle} />
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

                <h1 className="mt-4 max-w-3xl text-xl font-black tracking-[-0.04em] sm:text-3xl lg:text-4xl">
                  {post.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
            <article className="rounded-[1.75rem] border border-zinc-200/90 bg-white/95 p-4 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950/95 sm:p-6">
              <div className="relative">
                <div
                  className={isLocked ? "pointer-events-none select-none blur-[7px]" : ""}
                  aria-hidden={isLocked}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                        
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <PostShareMenu title={post.title} url={postHref} />
                      <PostViewCounter
                        postId={post.id}
                        initialViews={post.views}
                        incrementOnMount
                                              className="inline-flex w-fit items-center gap-1.5 self-start rounded-full border border-zinc-200 bg-white px-3 py-2 text-[10px] font-medium uppercase text-zinc-700 sm:self-auto dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"

                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3">
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

                  {(cleanProgramDetails || programDetailsTweetUrls.length > 0) ? (
                    <div className="mt-6 border-t border-zinc-200/80 pt-5 dark:border-zinc-800 sm:rounded-[1.4rem] sm:border sm:bg-zinc-50/80 sm:px-5 sm:py-5 dark:sm:bg-zinc-900/50">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                        Program Details
                      </p>
                      {cleanProgramDetails ? (
                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                          {cleanProgramDetails}
                        </p>
                      ) : null}
                      {programDetailsTweetUrls.length ? (
                        <PostTweetEmbeds
                          urls={programDetailsTweetUrls}
                          className={cleanProgramDetails ? "mt-4" : "mt-3"}
                        />
                      ) : null}
                    </div>
                  ) : null}

                  {(cleanPostBody || postBodyTweetUrls.length > 0) && (
                    <div className="mt-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Post
                      </p>
                      <div className="mt-3 border-t border-zinc-200/80 pt-4 dark:border-zinc-800 sm:rounded-[1.4rem] sm:border sm:bg-white sm:px-5 sm:py-5 dark:sm:border-zinc-800 dark:sm:bg-zinc-950">
                        {cleanPostBody ? (
                          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                            {cleanPostBody}
                          </p>
                        ) : null}
                        {postBodyTweetUrls.length ? (
                          <PostTweetEmbeds
                            urls={postBodyTweetUrls}
                            className={cleanPostBody ? "mt-4" : ""}
                          />
                        ) : null}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <PostProfileSubmitButton
                        postId={post.id}
                        postTitle={post.title}
                        profile={userResult?.data}
                        existingSubmission={existingSubmission}
                      />

                      <Link
                        href={post.programUrl}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 sm:min-w-[170px] sm:w-auto dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                      >
                        Visit Program
                      </Link>
                    </div>

                  </div>
                </div>
                {isLocked ? (
                  <div className="absolute inset-0 flex items-start justify-center px-4 pt-4 sm:items-center sm:px-0 sm:pt-0">
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
