import { supabase } from "@/lib/supabase";
import { getSubmittedPostIdsForUser } from "@/lib/data/post-submissions";

export type PostStatus = "Draft" | "Published";

export type Post = {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  sport: string;
  division: string;
  position: string;
  programDetails: string;
  programUrl: string;
  views: number;
  likes: number;
  likedByUser: boolean;
  hasSubmittedProfile: boolean;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
};

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function normalizeSport(value?: string | null) {
  const normalized = (value ?? "").trim().toLowerCase();

  switch (normalized) {
    case "football":
      return "Football";
    case "basketball_boys":
    case "basketball boys":
      return "Basketball Boys";
    case "basketball_girls":
    case "basketball girls":
      return "Basketball Girls";
    case "girls_flag_football":
    case "girls flag football":
    case "flag football":
      return "Flag Football";
    default:
      return value?.trim() || "";
  }
}

export function normalizePosition(value?: string | null) {
  const normalized = (value ?? "").trim().toLowerCase();

  if (!normalized) return "";
  if (
    normalized === "all positions" ||
    normalized === "all_position" ||
    normalized === "all"
  ) {
    return "All";
  }

  return value?.trim() || "";
}

export function getPostSportImage(value?: string | null) {
  const sport = normalizeSport(value).toLowerCase();

  if (sport.includes("basketball")) {
    return "/basketballbanner.png";
  }

  if (sport.includes("football")) {
    return "/footballbanner.png";
  }

  return "/footballbanner.png";
}

export function getPostSportFade(value?: string | null) {
  return "bg-[linear-gradient(135deg,rgba(249,115,22,0.38)_0%,rgba(249,115,22,0.22)_24%,rgba(234,88,12,0.14)_44%,rgba(0,0,0,0.58)_72%,rgba(0,0,0,0.84)_100%)]";
}

export function summary(post: Post) {
  return (
    post.programDetails ||
    post.content ||
    post.excerpt ||
    `${post.sport} ${post.division} opening for ${post.position}.`
  );
}

function mapPost(
  post: {
    id: string;
    title: string | null;
    author: string | null;
    excerpt: string | null;
    content: string | null;
    sport: string | null;
    division: string | null;
    position: string | null;
    program_details: string | null;
    program_url: string | null;
    likes: number | null;
    status: string | null;
    created_at: string | null;
    updated_at: string | null;
  },
  userId: string | undefined,
  likedPostIds: Set<string>,
  likeCountByPost: Map<string, number>,
  submittedPostIds: Set<string>
): Post {
  const postId = String(post.id);

  return {
    id: postId,
    title: post.title ?? "Untitled Post",
    author: post.author || "Expo Recruits",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    sport: post.sport ?? "Unknown Sport",
    division: post.division ?? "Unknown Division",
    position: post.position ?? "Open",
    programDetails: post.program_details ?? "",
    programUrl: post.program_url ?? "/football-programs",
    views: Number(post.likes ?? 0),
    likes: likeCountByPost.get(postId) ?? Number(post.likes ?? 0),
    likedByUser: Boolean(userId) && likedPostIds.has(postId),
    hasSubmittedProfile: submittedPostIds.has(postId),
    status: (post.status as PostStatus) ?? "Draft",
    createdAt: post.created_at ?? new Date().toISOString(),
    updatedAt: post.updated_at ?? post.created_at ?? new Date().toISOString(),
  };
}

function buildLikeState(
  likeRows:
    | {
        post_id: string;
        user_id: string;
      }[]
    | null,
  userId?: string
) {
  const likeCountByPost = new Map<string, number>();
  const likedPostIds = new Set<string>();

  if (!likeRows?.length) {
    return { likeCountByPost, likedPostIds };
  }

  for (const like of likeRows) {
    const postId = String(like.post_id);
    likeCountByPost.set(postId, (likeCountByPost.get(postId) ?? 0) + 1);

    if (userId && like.user_id === userId) {
      likedPostIds.add(postId);
    }
  }

  return { likeCountByPost, likedPostIds };
}

export async function getPosts(userId?: string): Promise<Post[]> {
  const [{ data, error }, { data: likeRows, error: likesError }] =
    await Promise.all([
      supabase
        .from("posts")
        .select(
          "id,title,author,excerpt,content,sport,division,position,program_details,program_url,likes,status,created_at,updated_at"
        )
        .order("updated_at", { ascending: false }),
      supabase.from("post_likes").select("post_id,user_id"),
    ]);

  if (error || !data?.length) return [];

  const { likeCountByPost, likedPostIds } = buildLikeState(
    likesError ? null : likeRows,
    userId
  );
  const submittedPostIds = await getSubmittedPostIdsForUser(
    userId,
    data.map((post) => String(post.id))
  );

  return data.map((post) =>
    mapPost(post, userId, likedPostIds, likeCountByPost, submittedPostIds)
  );
}

export async function getPostById(id: string, userId?: string) {
  const [{ data: post, error }, { data: likeRows, error: likesError }] =
    await Promise.all([
      supabase
        .from("posts")
        .select(
          "id,title,author,excerpt,content,sport,division,position,program_details,program_url,likes,status,created_at,updated_at"
        )
        .eq("id", id)
        .maybeSingle(),
      supabase.from("post_likes").select("post_id,user_id").eq("post_id", id),
    ]);

  if (error || !post) return null;

  const { likeCountByPost, likedPostIds } = buildLikeState(
    likesError ? null : likeRows,
    userId
  );
  const submittedPostIds = await getSubmittedPostIdsForUser(userId, [id]);

  return mapPost(post, userId, likedPostIds, likeCountByPost, submittedPostIds);
}

export function extractTweetUrls(...values: Array<string | null | undefined>) {
  const matches = new Set<string>();
  const tweetPattern =
    /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+(?:\?[^\s]+)?/gi;

  for (const value of values) {
    if (!value) continue;

    const urls = value.match(tweetPattern);
    if (!urls?.length) continue;

    for (const url of urls) {
      matches.add(url.replace(/^https?:\/\/x\.com/i, "https://twitter.com"));
    }
  }

  return [...matches];
}

export function stripTweetUrls(value?: string | null) {
  if (!value) return "";

  return value
    .replace(
      /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+(?:\?[^\s]+)?/gi,
      ""
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
