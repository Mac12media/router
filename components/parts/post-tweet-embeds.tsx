"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

type PostTweetEmbedsProps = {
  urls: string[];
  className?: string;
};

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: Element | null) => void;
      };
    };
  }
}

function normalizeTweetUrl(url: string) {
  return url.replace(/^https?:\/\/x\.com/i, "https://twitter.com");
}

function parseTweet(url: string) {
  const match = normalizeTweetUrl(url).match(
    /^https?:\/\/(?:www\.)?twitter\.com\/([A-Za-z0-9_]+)\/status\/(\d+)/i
  );

  if (!match) return null;

  return {
    author: match[1],
    id: match[2],
    url: normalizeTweetUrl(url),
  };
}

export function PostTweetEmbeds({ urls, className }: PostTweetEmbedsProps) {
  const tweets = useMemo(
    () => urls.map(parseTweet).filter((tweet): tweet is NonNullable<typeof tweet> => Boolean(tweet)),
    [urls]
  );
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (!tweets.length) return;
    window.twttr?.widgets?.load();
  }, [tweets.length]);

  useEffect(() => {
    const updateTheme = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!tweets.length) return null;

  return (
    <div className={className}>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => window.twttr?.widgets?.load()}
      />

      <style jsx global>{`
        .expo-tweet-embed blockquote.twitter-tweet {
          margin: 0 !important;
        }

        .expo-tweet-embed iframe {
          display: block !important;
          border-radius: 18px !important;
          background-color: black;
          max-height: 680px !important;
        }
      `}</style>

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div
            key={tweet.url}
            className="expo-tweet-embed max-h-[680px] overflow-hidden p-0"
          >
            <blockquote className="twitter-tweet" data-theme={theme} data-dnt="true">
              <a href={tweet.url}>{`https://twitter.com/${tweet.author}/status/${tweet.id}`}</a>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}
