"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface BlogExplorerProps {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
  defaultTag?: string;
}

export function BlogExplorer({ posts, tags, defaultTag }: BlogExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(defaultTag ?? null);

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return posts.filter((post) => {
      if (activeTag && !post.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase())) {
        return false;
      }
      if (!keyword) {
        return true;
      }

      const haystack = [post.title, post.description, ...post.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [posts, query, activeTag]);

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">搜索文章</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、摘要或标签…"
            className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="清空搜索"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </label>
      </div>

      {tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="按标签筛选">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              activeTag === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            全部
            <span className="ml-1.5 opacity-70">{posts.length}</span>
          </button>
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setActiveTag((current) =>
                  current?.toLowerCase() === tag.toLowerCase() ? null : tag,
                )
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                activeTag?.toLowerCase() === tag.toLowerCase()
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {tag}
              <span className="ml-1.5 opacity-70">{count}</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        共 {filteredPosts.length} 篇文章
        {activeTag ? (
          <>
            ，已筛选 <Badge variant="secondary" className="mx-1 font-normal">{activeTag}</Badge>
          </>
        ) : null}
        {query ? <>，关键词「{query.trim()}」</> : null}
      </p>

      {filteredPosts.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed px-6 py-16 text-center text-muted-foreground">
          没有匹配的文章，试试换个关键词或取消标签筛选。
        </div>
      )}
    </div>
  );
}
