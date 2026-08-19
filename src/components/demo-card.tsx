import { Code2, ExternalLink, Rocket } from "lucide-react";

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
import type { Demo } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface DemoCardProps {
  demo: Demo;
}

export function DemoCard({ demo }: DemoCardProps) {
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/45 via-primary to-primary/45"
        aria-hidden="true"
      />
      <CardHeader className="gap-4 pt-7">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Rocket className="size-5" aria-hidden="true" />
          </span>
          <Badge variant="outline" className="max-w-40 truncate bg-background">
            <span className="mr-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {demo.status}
          </Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl leading-snug">
            <a
              href={demo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="decoration-primary/40 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {demo.title}
              <span className="sr-only">（在新标签页打开独立 Demo）</span>
            </a>
          </CardTitle>
          <CardDescription className="line-clamp-3 leading-relaxed">
            {demo.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {demo.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2" aria-label="Demo 技术标签">
            {demo.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-2 border-t pt-4 sm:flex-row">
        <a
          href={demo.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "default" }), "sm:flex-1")}
        >
          打开 Demo
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="sr-only">（在新标签页打开独立站点）</span>
        </a>
        {demo.repository ? (
          <a
            href={demo.repository}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "default" })}
          >
            <Code2 className="size-4" aria-hidden="true" />
            源码
            <span className="sr-only">（在新标签页打开）</span>
          </a>
        ) : null}
      </CardFooter>
    </Card>
  );
}
