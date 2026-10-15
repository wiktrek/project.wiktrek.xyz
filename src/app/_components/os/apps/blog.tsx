import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { z } from "zod";

const postsSchema = z.array(
  z.object({
    title: z.string(),
    slug: z.string(),
    url: z.string(),
    description: z.string(),
    publishedAt: z.string(),
  }),
);

async function fetchPosts() {
  const res = await fetch("https://wiktrek.xyz/public/blogs");
  if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
  return postsSchema.parse(await res.json());
}

export function BlogApp() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["os-blog-posts"],
    queryFn: fetchPosts,
    staleTime: 60 * 60 * 1000,
  });

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 p-2">
        {isPending ? (
          <ul className="space-y-1">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="space-y-2 px-3 py-3">
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-white/5" />
              </li>
            ))}
          </ul>
        ) : isError ? (
          <div className="text-text-500 flex h-full flex-col items-center justify-center gap-3 py-16 text-sm">
            couldn&apos;t load posts
            <button
              onClick={() => void refetch()}
              className="rounded-md border border-white/15 px-3 py-1 text-xs transition-colors hover:bg-white/10 hover:text-white"
            >
              retry
            </button>
          </div>
        ) : (
          <ul>
            {data.map((post) => (
              <li key={post.slug}>
                <a
                  href={post.url}
                  target="_blank"
                  className="group flex items-start gap-4 rounded-md px-3 py-3 transition-colors hover:bg-white/5"
                >
                  <span className="text-text-600 w-20 shrink-0 pt-0.5 font-mono text-xs tabular-nums">
                    {post.publishedAt}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-text-100 block text-sm">
                      {post.title}
                    </span>
                    <span className="text-text-500 block truncate text-xs">
                      {post.description}
                    </span>
                  </span>
                  <ArrowUpRight className="text-text-600 h-4 w-4 shrink-0 transition-colors group-hover:text-white" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <a
        href="https://wiktrek.xyz/blog"
        target="_blank"
        className="text-text-500 border-t border-white/[0.06] px-5 py-2 text-xs lowercase transition-colors hover:text-white"
      >
        {data ? `${data.length} posts · ` : ""}open wiktrek.xyz/blog
      </a>
    </div>
  );
}
