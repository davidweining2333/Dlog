import { ArrowLeft, ExternalLink, GitBranch, Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getAllLocalProjects,
  getLocalProjectBySlug,
  getLocalProjectSlugs,
} from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLocalProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getLocalProjectBySlug(slug);

  if (!project) {
    return { title: "项目未找到" };
  }

  return {
    title: project.meta.title,
    description: project.meta.description,
    alternates: { canonical: `/projects/${project.meta.slug}` },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getLocalProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const others = getAllLocalProjects().filter((item) => item.slug !== project.meta.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> 返回项目列表
      </Link>

      <article className="mt-10">
        <header className="border-b pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{project.meta.status}</Badge>
            {project.meta.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {project.meta.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {project.meta.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.meta.repo ? (
              <a
                href={project.meta.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                <GitBranch className="size-4" aria-hidden="true" />
                查看仓库
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ) : null}
            {project.meta.homepage ? (
              <a
                href={project.meta.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants()}
              >
                <Home className="size-4" aria-hidden="true" />
                访问项目
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </header>

        <div className="article mt-10">
          <MDXRemote source={project.content} components={mdxComponents} />
        </div>
      </article>

      {others.length > 0 ? (
        <section className="mt-14 border-t pt-8">
          <h2 className="text-xl font-semibold">更多项目</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/projects/${item.slug}`}
                className="rounded-full border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
