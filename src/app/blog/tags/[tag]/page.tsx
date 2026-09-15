import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogExplorer } from "@/components/blog-explorer";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/content";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `标签：${tag}`,
    description: `带有「${tag}」标签的全部文章。`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  const allTags = getAllTags();

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <Badge variant="secondary">Tag</Badge>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{tag}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          共 {posts.length} 篇相关文章。
          <Link href="/blog" className="ml-2 text-primary underline-offset-4 hover:underline">
            返回全部文章
          </Link>
        </p>
      </header>

      <BlogExplorer posts={getAllPosts()} tags={allTags} defaultTag={tag} />
    </div>
  );
}
