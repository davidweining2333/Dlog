import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/components/mdx-components";
import { PostCard } from "@/components/post-card";
import { TableOfContents } from "@/components/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${post.meta.slug}` },
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.description,
      url: `/blog/${post.meta.slug}`,
      publishedTime: post.meta.date,
      tags: post.meta.tags,
      ...(post.meta.cover ? { images: [post.meta.cover] } : {}),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.meta.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> 返回文章列表
      </Link>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">
          <header className="border-b pb-10">
            <div className="flex flex-wrap gap-2">
              {post.meta.tags.map((tag) => (
                <Link key={tag} href={`/blog/tags/${tag}`}>
                  <Badge variant="secondary" className="transition-colors hover:bg-accent">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              {post.meta.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {post.meta.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" aria-hidden="true" />
                <time dateTime={post.meta.date}>
                  {new Intl.DateTimeFormat("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(post.meta.date))}
                </time>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4" aria-hidden="true" />
                约 {post.meta.readingMinutes} 分钟
                <span className="text-muted-foreground/70">· {post.meta.wordCount} 字</span>
              </span>
            </div>
          </header>

          <div className="article mt-10">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        {post.toc.length > 0 ? (
          <aside className="hidden lg:block">
            <TableOfContents items={post.toc} />
          </aside>
        ) : null}
      </div>

      {relatedPosts.length > 0 ? (
        <section className="mt-16 border-t pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">相关文章</h2>
              <p className="mt-2 text-muted-foreground">按共同标签推荐的延伸阅读。</p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <PostCard key={related.slug} post={related} />
            ))}
          </div>
        </section>
      ) : null}

      <footer className="mt-14 border-t pt-8 text-sm text-muted-foreground">
        本文发布于 {siteConfig.name}。若它对你有帮助，欢迎通过 RSS 订阅后续更新。
      </footer>
    </div>
  );
}
