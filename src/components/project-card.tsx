import {
  Code2,
  ExternalLink,
  GitFork,
  Star,
} from "lucide-react";

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
import type { GithubProject } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  project: GithubProject;
}

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}

export function ProjectCard({ project }: ProjectCardProps) {
  const visibleTopics = project.topics.slice(0, 4);
  const hiddenTopicCount = project.topics.length - visibleTopics.length;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Code2 className="size-5" aria-hidden="true" />
            </span>
            <CardTitle className="min-w-0 text-lg leading-snug">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words decoration-primary/40 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {project.name}
                <span className="sr-only">（在新标签页打开 GitHub）</span>
              </a>
            </CardTitle>
          </div>
          <ExternalLink
            className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          />
        </div>
        <CardDescription className="line-clamp-3 leading-relaxed">
          {project.description || "这个项目暂时还没有介绍。"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {project.language ? (
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
              <dt className="sr-only">主要语言</dt>
              <dd>{project.language}</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <Star className="size-4" aria-hidden="true" />
            <dt className="sr-only">Stars</dt>
            <dd>{project.stars.toLocaleString("zh-CN")}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <GitFork className="size-4" aria-hidden="true" />
            <dt className="sr-only">Forks</dt>
            <dd>{project.forks.toLocaleString("zh-CN")}</dd>
          </div>
        </dl>

        {project.topics.length > 0 ? (
          <div className="flex flex-wrap gap-2" aria-label="项目主题">
            {visibleTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="font-normal">
                {topic}
              </Badge>
            ))}
            {hiddenTopicCount > 0 ? (
              <Badge variant="outline" className="font-normal" aria-label={`另有 ${hiddenTopicCount} 个主题`}>
                +{hiddenTopicCount}
              </Badge>
            ) : null}
          </div>
        ) : null}

        <p className="mt-auto text-xs text-muted-foreground">
          更新于 <time dateTime={project.updatedAt}>{formatDate(project.updatedAt)}</time>
        </p>
      </CardContent>

      <CardFooter className="flex-wrap gap-2 border-t pt-4">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Code2 className="size-4" aria-hidden="true" />
          GitHub
          <span className="sr-only">（在新标签页打开）</span>
        </a>
        {project.homepage ? (
          <a
            href={project.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "ml-auto")}
          >
            访问项目
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">（在新标签页打开）</span>
          </a>
        ) : null}
      </CardFooter>
    </Card>
  );
}
