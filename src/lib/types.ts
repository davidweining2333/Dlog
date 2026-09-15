export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  cover?: string;
  readingMinutes: number;
  wordCount: number;
}

export interface Post {
  meta: PostMeta;
  content: string;
  toc: TocItem[];
}

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  repo?: string;
  homepage?: string;
  status: "active" | "experimental" | "archived";
}

export interface LocalProject {
  meta: ProjectMeta;
  content: string;
}

export interface GithubProject {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

export interface Demo {
  title: string;
  description: string;
  url: string;
  slug?: string;
  internal?: boolean;
  repository?: string;
  tags: string[];
  status: "online" | "wip";
}
