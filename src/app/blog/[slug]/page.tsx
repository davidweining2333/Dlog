import { ArrowLeft, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getPostSlugs } from "@/lib/content";
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" /> 返回文章列表
      </Link>

      <article className="mt-10">
        <header className="border-b pb-10">
          <div className="flex flex-wrap gap-2">
            {post.meta.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{post.meta.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.meta.description}</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            <time dateTime={post.meta.date}>
              {new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(post.meta.date))}
            </time>
          </div>
        </header>

        <div className="article mt-10">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>

      <footer className="mt-14 border-t pt-8 text-sm text-muted-foreground">
        本文发布于 {siteConfig.name}。若它对你有帮助，欢迎分享给更多人。
      </footer>
    </div>
  );
}
