import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

const nav = [
  ["/blog", "文章"],
  ["/projects", "项目"],
  ["/demos", "Demo"],
  ["/about", "关于"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-4 px-4 py-2 sm:px-6">
        <Link href="/" className="mr-auto text-xl font-bold tracking-tight">Dlog<span className="text-primary">.</span></Link>
        <nav className="flex flex-wrap items-center gap-1" aria-label="主导航">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}
