import type { MetadataRoute } from "next";

import { getAllLocalProjects, getAllPosts, getAllTags } from "@/lib/content";
import { demos } from "@/data/demos";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/blog", "/projects", "/demos", "/about"].map((route) => ({
    url: new URL(route || "/", siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const posts = getAllPosts().map((post) => ({
    url: new URL(`/blog/${post.slug}`, siteConfig.url).toString(),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const tags = getAllTags().map(({ tag }) => ({
    url: new URL(`/blog/tags/${tag}`, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const projects = getAllLocalProjects().map((project) => ({
    url: new URL(`/projects/${project.slug}`, siteConfig.url).toString(),
    lastModified: new Date(project.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const demoRoutes = demos
    .filter((demo) => demo.internal && demo.url.startsWith("/"))
    .map((demo) => ({
      url: new URL(demo.url, siteConfig.url).toString(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...routes, ...posts, ...tags, ...projects, ...demoRoutes];
}
