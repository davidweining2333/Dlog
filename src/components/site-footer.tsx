import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Dlog. 保持好奇，持续创造。</p>
        <div className="flex items-center gap-4">
          <a href="/rss.xml" className="transition-colors hover:text-foreground">
            RSS
          </a>
          <Link href="/about" className="transition-colors hover:text-foreground">
            关于
          </Link>
          <p>Next.js · MDX · shadcn/ui</p>
        </div>
      </div>
    </footer>
  );
}
