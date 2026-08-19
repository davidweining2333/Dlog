export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  cover?: string;
}

export interface Post {
  meta: PostMeta;
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
  repository?: string;
  tags: string[];
  status: "online" | "wip";
}
