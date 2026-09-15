import { ListTree } from "lucide-react";

import type { TocItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="文章目录"
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-24",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <ListTree className="size-4 text-primary" aria-hidden="true" />
        本篇目录
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-muted-foreground transition-colors hover:text-foreground",
                item.level === 3 && "pl-3 text-[0.9rem]",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
