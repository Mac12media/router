"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";

export function PostLikeButton({
  postId,
  initialLiked,
  initialLikes,
}: {
  postId: string;
  initialLiked: boolean;
  initialLikes: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  function updateOptimisticState(nextLiked: boolean) {
    setLiked(nextLiked);
    setLikes((currentLikes) =>
      Math.max(0, currentLikes + (nextLiked ? 1 : -1))
    );
  }

  function handleToggle() {
    if (isPending) return;

    const previousLiked = liked;
    const previousLikes = likes;
    const nextLiked = !previousLiked;

    updateOptimisticState(nextLiked);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/like`, {
          method: nextLiked ? "POST" : "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to update like");
        }

        const data = (await response.json()) as {
          liked?: boolean;
          likes?: number;
        };

        setLiked(Boolean(data.liked));
        setLikes(Number(data.likes ?? previousLikes));
      } catch {
        setLiked(previousLiked);
        setLikes(previousLikes);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={liked}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] transition ${
        liked
          ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-900/70 dark:bg-orange-950/30 dark:text-orange-400"
          : "border-zinc-200 text-muted-foreground hover:border-orange-200 hover:text-orange-500 dark:border-zinc-800 dark:hover:border-orange-900/70 dark:hover:text-orange-400"
      } ${isPending ? "opacity-70" : ""}`}
    >
      <Heart
        className={`h-3.5 w-3.5 ${
          liked ? "fill-orange-500 text-orange-500" : "text-current"
        }`}
      />
      {likes} {likes === 1 ? "Like" : "Likes"}
    </button>
  );
}
