import type { Metadata } from "next";

import { BlogExplorer } from "@/components/blog-explorer";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getAllTags } from "@/lib/content";

export const metadata: Metadata = {
  title: "文章",
  description: "关于产品设计、前端工程与数字生活的文章。",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <Badge variant="secondary">Writing</Badge>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">文章</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          记录设计判断、工程实践，以及创造过程里值得保留的细节。
        </p>
      </header>

      {posts.length > 0 ? (
        <BlogExplorer posts={posts} tags={tags} />
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed px-6 py-16 text-center text-muted-foreground">
          还没有公开文章，第一篇正在准备中。
        </div>
      )}
    </div>
  );
}
