"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

type PostViewCounterProps = {
  postId: string;
  initialViews: number;
  incrementOnMount?: boolean;
  className?: string;
};

export function PostViewCounter({
  postId,
  initialViews,
  incrementOnMount = false,
  className,
}: PostViewCounterProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (!incrementOnMount) return;

    let cancelled = false;

    async function recordView() {
      try {
        const response = await fetch(`/api/posts/${postId}/view`, {
          method: "POST",
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || cancelled) return;
        setViews(Number(data?.views ?? initialViews + 1));
      } catch {
        // no-op
      }
    }

    recordView();

    return () => {
      cancelled = true;
    };
  }, [incrementOnMount, initialViews, postId]);

  return (
    <span className={className}>
      <Eye className="h-3.5 w-3.5" />
      <span>{views}</span>
    </span>
  );
}
