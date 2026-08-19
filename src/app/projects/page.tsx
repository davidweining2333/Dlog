import type { Metadata } from "next";

import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { getGithubProjects } from "@/lib/github";

export const metadata: Metadata = {
  title: "项目",
  description: "正在构建、维护与探索的开源项目。",
};

export default async function ProjectsPage() {
  const projects = await getGithubProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <Badge variant="secondary">Open Source</Badge>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">项目</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          从真实需求和个人兴趣出发，持续打磨的工具、产品与开源实验。
        </p>
      </header>

      {projects.length > 0 ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">项目列表暂时不可用</p>
          <p className="mt-2 text-sm text-muted-foreground">GitHub 配置完成后，项目会自动出现在这里。</p>
        </div>
      )}
    </div>
  );
}
