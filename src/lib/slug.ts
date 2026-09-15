export function createHeadingSlugger() {
  const used = new Map<string, number>();

  return function slugifyHeading(text: string): string {
    const base =
      text
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "section";

    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export function slugifyHeading(text: string): string {
  return createHeadingSlugger()(text);
}
