import { Code2, Compass, PenLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 Dlog，以及这个空间所记录和探索的事情。",
};

const principles = [
  { icon: PenLine, title: "公开记录", description: "写作不是展示结论，而是让思考留下可追溯的路径。" },
  { icon: Code2, title: "以做促学", description: "通过真实项目验证知识，让抽象概念变成可以使用的作品。" },
  { icon: Compass, title: "保持好奇", description: "跨越设计与工程的边界，持续寻找更清晰、更自然的体验。" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-3xl">
        <Badge variant="secondary">About Dlog</Badge>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">在创造中思考，在记录中成长。</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Dlog 是一个关于设计、开发与数字生活的个人空间。这里既是笔记本，也是作品集：记录解决问题的过程，分享可复用的方法，也保存那些尚未成熟但值得探索的想法。
        </p>
      </header>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {principles.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
              <Icon className="size-5" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-3xl border bg-surface-sunken p-8 sm:p-12">
        <h2 className="text-2xl font-bold tracking-tight">从哪里开始？</h2>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          你可以从最近的文章了解这里的思考，也可以直接打开 Demo，看看这些想法如何变成可以交互的作品。
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/blog" className={buttonVariants()}>阅读文章</Link>
          <Link href="/demos" className={buttonVariants({ variant: "outline" })}>体验 Demo</Link>
        </div>
      </section>
    </div>
  );
}
