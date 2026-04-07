import { supabase } from "@/lib/supabase";

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
  likes: number;
  likedByUser: boolean;
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
  likeCountByPost: Map<string, number>
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
    likes: likeCountByPost.get(postId) ?? Number(post.likes ?? 0),
    likedByUser: Boolean(userId) && likedPostIds.has(postId),
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

  return data.map((post) =>
    mapPost(post, userId, likedPostIds, likeCountByPost)
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

  return mapPost(post, userId, likedPostIds, likeCountByPost);
}
