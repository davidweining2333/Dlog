import "server-only";

import type { GithubProject } from "@/lib/types";

interface GithubApiRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export async function getGithubProjects(): Promise<GithubProject[]> {
  const username = process.env.GITHUB_USERNAME?.trim();

  if (!username) {
    return [];
  }

  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const endpoint = new URL(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
  );
  endpoint.searchParams.set("sort", "updated");
  endpoint.searchParams.set("direction", "desc");
  endpoint.searchParams.set("per_page", "100");

  try {
    const response = await fetch(endpoint, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const repositories: unknown = await response.json();

    if (!Array.isArray(repositories)) {
      return [];
    }

    return (repositories as GithubApiRepo[])
      .filter((repository) => !repository.fork && !repository.archived)
      .slice(0, 12)
      .map((repository) => ({
        id: repository.id,
        name: repository.name,
        description: repository.description,
        url: repository.html_url,
        homepage: repository.homepage,
        language: repository.language,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        topics: Array.isArray(repository.topics) ? repository.topics : [],
        updatedAt: repository.updated_at,
      }));
  } catch {
    return [];
  }
}
