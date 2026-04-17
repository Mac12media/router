type PostTweetEmbedsProps = {
  urls: string[];
};

export function PostTweetEmbeds({ urls }: PostTweetEmbedsProps) {
  if (!urls.length) return null;

  return (
    <div className="mt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Tweets
      </p>
      <div className="mt-3 space-y-4">
        {urls.map((url) => (
          <div
            key={url}
            className="overflow-hidden rounded-[1.4rem] border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          >
            <iframe
              title={`Embedded tweet ${url}`}
              src={`https://twitframe.com/show?url=${encodeURIComponent(url)}`}
              className="h-[420px] w-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
