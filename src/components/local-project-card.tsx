import { ExternalLink, GitBranch, Home, Rocket } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LocalProject } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface LocalProjectCardProps {
  project: LocalProject["meta"];
}

const statusLabel: Record<LocalProject["meta"]["status"], string> = {
  active: "维护中",
  experimental: "实验中",
  archived: "已归档",
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function LocalProjectCard({ project }: LocalProjectCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Rocket className="size-5" aria-hidden="true" />
            </span>
            <CardTitle className="min-w-0 text-lg leading-snug">
              <Link
                href={`/projects/${project.slug}`}
                className="decoration-primary/40 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {project.title}
              </Link>
            </CardTitle>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {statusLabel[project.status]}
          </Badge>
        </div>
        <CardDescription className="line-clamp-3 leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {project.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2" aria-label="项目标签">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <p className="mt-auto text-xs text-muted-foreground">
          更新于{" "}
          <time dateTime={project.date}>
            {dateFormatter.format(new Date(project.date))}
          </time>
        </p>
      </CardContent>

      <CardFooter className="flex-wrap gap-2 border-t pt-4">
        <Link
          href={`/projects/${project.slug}`}
          className={cn(buttonVariants({ size: "sm" }), "flex-1")}
        >
          查看详情
        </Link>
        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <GitBranch className="size-4" aria-hidden="true" />
            仓库
            <span className="sr-only">（在新标签页打开）</span>
          </a>
        ) : null}
        {project.homepage ? (
          <a
            href={project.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Home className="size-4" aria-hidden="true" />
            主页
            <ExternalLink className="size-3" aria-hidden="true" />
            <span className="sr-only">（在新标签页打开）</span>
          </a>
        ) : null}
      </CardFooter>
    </Card>
  );
}
