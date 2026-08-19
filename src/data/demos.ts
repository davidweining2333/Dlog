import type { Demo } from "@/lib/types";

// 示例链接使用 example.com 占位，请替换为你自己的线上地址与仓库地址。
export const demos: Demo[] = [
  {
    title: "交互式数据看板",
    description: "将复杂指标整理为清晰、响应迅速的可视化工作台。",
    url: "https://example.com/demos/dashboard",
    repository: "https://example.com/repositories/dashboard",
    tags: ["Next.js", "TypeScript", "Data Viz"],
    status: "online",
  },
  {
    title: "专注计时器",
    description: "一个强调键盘操作与低干扰体验的番茄钟实验。",
    url: "https://example.com/demos/focus-timer",
    repository: "https://example.com/repositories/focus-timer",
    tags: ["React", "Web Audio", "PWA"],
    status: "online",
  },
  {
    title: "生成式排版实验",
    description: "探索网格、字体变量与动态内容之间关系的创意编码项目。",
    url: "https://example.com/demos/generative-type",
    tags: ["Canvas", "Typography", "Creative Coding"],
    status: "wip",
  },
];
