import { ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-accent text-primary">
        <SearchX className="size-8" />
      </div>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-primary">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">这一页还没有被写下</h1>
      <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
        链接可能已经失效，或者你寻找的内容暂时不存在。不妨回到首页继续探索。
      </p>
      <Link href="/" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        <ArrowLeft className="size-4" /> 返回首页
      </Link>
    </div>
  );
}
