import { ArrowRight, Code2, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getAllPosts } from "@/lib/content";
import { getGithubProjects } from "@/lib/github";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const posts = getAllPosts().slice(0, 3);
  const projects = (await getGithubProjects()).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-4xl rounded-full bg-[var(--hero-glow)] blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_0.7fr] lg:items-center lg:py-36">
          <div>
            <Badge variant="secondary" className="mb-5 gap-1.5">
              <Sparkles className="size-3.5" /> 设计、开发与数字生活
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              把想法写下来，
              <span className="text-primary">再把它做出来。</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              这里记录产品设计、前端工程与独立创造中的思考，也陈列那些从好奇心出发的小项目。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/blog" className={cn(buttonVariants({ size: "lg" }), "group")}>
                阅读文章
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/projects" className={buttonVariants({ variant: "outline", size: "lg" })}>
                浏览项目
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border bg-card/80 p-6 shadow-sm backdrop-blur">
              <PenLine className="mb-4 size-6 text-primary" />
              <p className="font-semibold">持续记录</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">复盘实践，沉淀可以反复使用的经验。</p>
            </div>
            <div className="rounded-2xl border bg-card/80 p-6 shadow-sm backdrop-blur">
              <Code2 className="mb-4 size-6 text-primary" />
              <p className="font-semibold">动手创造</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">用代码验证想法，让作品替思考发声。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading title="最新文章" description="最近写下的思考、方法与实践记录。" href="/blog" />
        {posts.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        ) : (
          <EmptyState>文章正在路上，欢迎稍后再来。</EmptyState>
        )}
      </section>

      <section className="border-y bg-surface-sunken">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading title="GitHub 项目" description="近期维护和探索中的开源项目。" href="/projects" />
          {projects.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          ) : (
            <EmptyState>项目列表暂时不可用，你仍可以先看看独立 Demo。</EmptyState>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="overflow-hidden rounded-3xl border bg-card p-8 shadow-sm sm:p-12">
          <div className="max-w-2xl">
            <Badge className="mb-4">Independent Lab</Badge>
            <h2 className="text-3xl font-bold tracking-tight">不止写代码，也做可体验的实验</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              从交互原型到创意编码，每个 Demo 都是一个独立、可运行的想法。
            </p>
            <Link href="/demos" className={cn(buttonVariants({ variant: "secondary" }), "mt-7 group")}>
              前往 Demo 陈列室
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      <Link href={href} className="group inline-flex items-center gap-1 text-sm font-medium text-primary">
        查看全部 <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">{children}</div>;
}
