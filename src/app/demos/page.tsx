import type { Metadata } from "next";

import { DemoCard } from "@/components/demo-card";
import { Badge } from "@/components/ui/badge";
import { demos } from "@/data/demos";

export const metadata: Metadata = {
  title: "Demo",
  description: "可以直接体验的交互原型、创意编码与产品实验。",
};

export default function DemosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <Badge variant="secondary">Playground</Badge>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Demo 陈列室</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          小而完整的交互实验。它们或许不够正式，但都可以亲手体验。
        </p>
      </header>

      {demos.length > 0 ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo) => <DemoCard key={demo.url} demo={demo} />)}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed px-6 py-16 text-center text-muted-foreground">
          新实验正在孵化中。
        </div>
      )}
    </div>
  );
}
