import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type { Post, PostMeta } from "@/lib/types";

const postsDirectory = path.join(process.cwd(), "content", "blog");
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

function parseFrontmatter(slug: string, data: Frontmatter): PostMeta | null {
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

  return {
    slug,
    title: data.title.trim(),
    description: data.description.trim(),
    date,
    tags: data.tags.map((tag) => tag.trim()),
    published: data.published,
    ...(typeof data.cover === "string" ? { cover: data.cover.trim() } : {}),
  };
}

function shouldIncludePost(meta: PostMeta): boolean {
  return process.env.NODE_ENV !== "production" || meta.published;
}

function readPostFile(slug: string): Post | null {
  if (!safeSlugPattern.test(slug)) {
    return null;
  }

  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const relativePath = path.relative(postsDirectory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  try {
    const source = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(source);
    const meta = parseFrontmatter(slug, data);

    if (meta === null || !shouldIncludePost(meta)) {
      return null;
    }

    return { meta, content };
  } catch {
    return null;
  }
}

export function getAllPosts(): PostMeta[] {
  let fileNames: string[];

  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch {
    return [];
  }

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => readPostFile(fileName.slice(0, -4)))
    .filter((post): post is Post => post !== null)
    .map((post) => post.meta)
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime(),
    );
}

export function getPostBySlug(slug: string): Post | null {
  return readPostFile(slug);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
