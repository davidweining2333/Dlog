import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { getReadingMetrics } from "@/lib/reading";
import { createHeadingSlugger } from "@/lib/slug";
import type {
  LocalProject,
  Post,
  PostMeta,
  ProjectMeta,
  TocItem,
} from "@/lib/types";

const postsDirectory = path.join(process.cwd(), "content", "blog");
const projectsDirectory = path.join(process.cwd(), "content", "projects");
const safeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Frontmatter = Record<string, unknown>;

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function normalizeDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : value;
}

function shouldInclude(published: boolean): boolean {
  return process.env.NODE_ENV !== "production" || published;
}

function extractToc(content: string): TocItem[] {
  const slugify = createHeadingSlugger();
  const lines = content.split("\n");
  const toc: TocItem[] = [];
  let inCodeFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) {
      continue;
    }

    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    const levelToken = match?.[1];
    const rawText = match?.[2];
    if (!match || !levelToken || !rawText) {
      continue;
    }

    const level = levelToken.length;
    const text = rawText.replace(/[*_`]/g, "").trim();
    if (!text) {
      continue;
    }

    toc.push({
      id: slugify(text),
      text,
      level,
    });
  }

  return toc;
}

function parsePostFrontmatter(
  slug: string,
  data: Frontmatter,
  content: string,
): Post | null {
  const date = normalizeDate(data.date);

  if (
    typeof data.title !== "string" ||
    data.title.trim().length === 0 ||
    typeof data.description !== "string" ||
    data.description.trim().length === 0 ||
    date === null ||
    !isStringArray(data.tags) ||
    typeof data.published !== "boolean" ||
    (data.cover !== undefined &&
      (typeof data.cover !== "string" || data.cover.trim().length === 0))
  ) {
    return null;
  }

  if (!shouldInclude(data.published)) {
    return null;
  }

  const metrics = getReadingMetrics(content);

  return {
    meta: {
      slug,
      title: data.title.trim(),
      description: data.description.trim(),
      date,
      tags: data.tags.map((tag) => tag.trim()),
      published: data.published,
      ...(typeof data.cover === "string" ? { cover: data.cover.trim() } : {}),
      readingMinutes: metrics.readingMinutes,
      wordCount: metrics.wordCount,
    },
    content,
    toc: extractToc(content),
  };
}

function isProjectStatus(value: unknown): value is ProjectMeta["status"] {
  return value === "active" || value === "experimental" || value === "archived";
}

function parseProjectFrontmatter(
  slug: string,
  data: Frontmatter,
  content: string,
): LocalProject | null {
  const date = normalizeDate(data.date);

  if (
    typeof data.title !== "string" ||
    data.title.trim().length === 0 ||
    typeof data.description !== "string" ||
    data.description.trim().length === 0 ||
    date === null ||
    !isStringArray(data.tags) ||
    typeof data.published !== "boolean"
  ) {
    return null;
  }

  if (!shouldInclude(data.published)) {
    return null;
  }

  return {
    meta: {
      slug,
      title: data.title.trim(),
      description: data.description.trim(),
      date,
      tags: data.tags.map((tag) => tag.trim()),
      published: data.published,
      ...(typeof data.repo === "string" && data.repo.trim()
        ? { repo: data.repo.trim() }
        : {}),
      ...(typeof data.homepage === "string" && data.homepage.trim()
        ? { homepage: data.homepage.trim() }
        : {}),
      status: isProjectStatus(data.status) ? data.status : "active",
    },
    content,
  };
}

function readMdxFile(directory: string, slug: string): string | null {
  if (!safeSlugPattern.test(slug)) {
    return null;
  }

  const filePath = path.join(directory, `${slug}.mdx`);
  const relativePath = path.relative(directory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function readPostFile(slug: string): Post | null {
  const source = readMdxFile(postsDirectory, slug);
  if (source === null) {
    return null;
  }

  const { data, content } = matter(source);
  return parsePostFrontmatter(slug, data, content);
}

function readProjectFile(slug: string): LocalProject | null {
  const source = readMdxFile(projectsDirectory, slug);
  if (source === null) {
    return null;
  }

  const { data, content } = matter(source);
  return parseProjectFrontmatter(slug, data, content);
}

function listMdxSlugs(directory: string): string[] {
  let fileNames: string[];

  try {
    fileNames = fs.readdirSync(directory);
  } catch {
    return [];
  }

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.slice(0, -4));
}

function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime(),
  );
}

export function getAllPosts(): PostMeta[] {
  return sortByDateDesc(
    listMdxSlugs(postsDirectory)
      .map((slug) => readPostFile(slug))
      .filter((post): post is Post => post !== null)
      .map((post) => post.meta),
  );
}

export function getPostBySlug(slug: string): Post | null {
  return readPostFile(slug);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const all = getAllPosts();
  const current = all.find((post) => post.slug === slug);

  if (!current) {
    return [];
  }

  return all
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime(),
    )
    .slice(0, limit)
    .map((item) => item.post);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((item) => item.toLowerCase() === tag.toLowerCase()),
  );
}

export function getAllLocalProjects(): ProjectMeta[] {
  return sortByDateDesc(
    listMdxSlugs(projectsDirectory)
      .map((slug) => readProjectFile(slug))
      .filter((project): project is LocalProject => project !== null)
      .map((project) => project.meta),
  );
}

export function getLocalProjectBySlug(slug: string): LocalProject | null {
  return readProjectFile(slug);
}

export function getLocalProjectSlugs(): string[] {
  return getAllLocalProjects().map((project) => project.slug);
}
