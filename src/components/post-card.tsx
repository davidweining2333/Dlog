import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PostMeta } from "@/lib/types";

export interface PostCardProps {
  post: PostMeta;
}

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}

export function PostCard({ post }: PostCardProps) {
  const href = `/blog/${post.slug}`;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg">
      {post.cover ? (
        <div
          role="img"
          aria-label={`${post.title} 的封面`}
          className="aspect-[16/7] w-full bg-muted bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01]"
          style={{ backgroundImage: `url(${JSON.stringify(post.cover)})` }}
        />
      ) : null}

      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          {!post.published ? <Badge variant="outline">草稿</Badge> : null}
        </div>
        <CardTitle className="text-xl leading-snug">
          <Link
            href={href}
            className="decoration-primary/40 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3 leading-relaxed">
          {post.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2" aria-label="文章标签">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          aria-label={`阅读文章：${post.title}`}
        >
          阅读文章
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </CardFooter>
    </Card>
  );
}
