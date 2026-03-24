"use client";

import { Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PostShareMenu({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const publicBaseUrl = process.env.NEXT_PUBLIC_APP_URL;

  function resolveUrl() {
    if (url.startsWith("http")) return url;
    if (publicBaseUrl) return new URL(url, publicBaseUrl).toString();
    if (typeof window !== "undefined") {
      return new URL(url, window.location.origin).toString();
    }
    return url;
  }

  const shareMessage = `Check out this opening on Expo Recruits: ${title}`;

  async function nativeShare() {
    if (!navigator.share) return;

    try {
      const resolvedUrl = resolveUrl();
      await navigator.share({
        title: `${title} | Expo Recruits`,
        text: shareMessage,
        url: resolvedUrl,
      });
    } catch {
      // no-op if the share dialog is closed
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(resolveUrl());
    } catch {
      // no-op fallback for unsupported environments
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Share post"
          className="rounded-full border border-transparent p-2 text-muted-foreground transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 dark:hover:border-orange-900 dark:hover:bg-orange-950/30"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {typeof navigator !== "undefined" && "share" in navigator ? (
          <DropdownMenuItem onClick={nativeShare}>Share</DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareMessage
            )}&url=${encodeURIComponent(resolveUrl())}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Post to X
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>Copy Link</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
