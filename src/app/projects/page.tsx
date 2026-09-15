import type { Metadata } from "next";

import { LocalProjectCard } from "@/components/local-project-card";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { getAllLocalProjects } from "@/lib/content";
import { getGithubProjects } from "@/lib/github";

export const metadata: Metadata = {
  title: "项目",
  description: "正在构建、维护与探索的开源项目与个人作品。",
};

export default async function ProjectsPage() {
  const localProjects = getAllLocalProjects();
  const githubProjects = await getGithubProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <Badge variant="secondary">Portfolio</Badge>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">项目</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          从真实需求和个人兴趣出发，持续打磨的工具、产品与开源实验。精选项目用 MDX 深度介绍，其余仓库同步自 GitHub。
        </p>
      </header>

      {localProjects.length > 0 ? (
        <section className="mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">精选项目</h2>
              <p className="mt-2 text-muted-foreground">本地 MDX 撰写，展示设计取舍与实现路径。</p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {localProjects.map((project) => (
              <LocalProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      <section className={localProjects.length > 0 ? "mt-16 border-t pt-14" : "mt-14"}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">GitHub 仓库</h2>
          <p className="mt-2 text-muted-foreground">近期维护和探索中的开源项目。</p>
        </div>
        {githubProjects.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {githubProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed px-6 py-16 text-center">
            <p className="font-medium">项目列表暂时不可用</p>
            <p className="mt-2 text-sm text-muted-foreground">
              配置 GITHUB_USERNAME 后，仓库会自动出现在这里。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
