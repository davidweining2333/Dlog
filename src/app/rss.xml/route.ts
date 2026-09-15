import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const posts = getAllPosts().filter((post) => post.published);
  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.slug}`, siteConfig.url).toString();
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `  <channel>`,
    `    <title>${escapeXml(siteConfig.name)}</title>`,
    `    <link>${escapeXml(siteConfig.url)}</link>`,
    `    <description>${escapeXml(siteConfig.description)}</description>`,
    `    <language>zh-CN</language>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(new URL("/rss.xml", siteConfig.url).toString())}" rel="self" type="application/rss+xml" />`,
    items,
    `  </channel>`,
    `</rss>`,
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
