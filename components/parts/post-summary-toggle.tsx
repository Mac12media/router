"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PostTweetEmbeds } from "@/components/parts/post-tweet-embeds";

type PostSummaryToggleProps = {
  text: string;
  href?: string;
  tweetUrls?: string[];
};

export function PostSummaryToggle({ text, href, tweetUrls = [] }: PostSummaryToggleProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkOverflow = () => {
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div>
      {text ? (
        <p
          ref={textRef}
          className="whitespace-pre-wrap break-words text-xs leading-6 text-zinc-700 dark:text-zinc-300 sm:text-sm"
          style={{
            maxHeight: "7.5rem",
            overflow: "hidden",
          }}
        >
          {text}
        </p>
      ) : (
        <div ref={textRef} className="hidden" />
      )}

      {tweetUrls.length ? <PostTweetEmbeds urls={tweetUrls} className={text ? "mt-3" : ""} /> : null}

      {isOverflowing ? (
        href ? (
          <Link
            href={href}
            className="mt-2 inline-flex text-xs font-semibold text-orange-500 transition hover:text-orange-600"
          >
            Show more
          </Link>
        ) : null
      ) : null}
    </div>
  );
}
