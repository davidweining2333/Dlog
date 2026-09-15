import type { Demo } from "@/lib/types";

export const demos: Demo[] = [
  {
    slug: "focus-timer",
    title: "专注计时器",
    description: "强调键盘操作与低干扰体验的番茄钟：可调时长、白噪音提示与会话统计。",
    url: "/demos/focus-timer",
    internal: true,
    tags: ["React", "State", "PWA 思路"],
    status: "online",
  },
  {
    slug: "generative-type",
    title: "生成式排版实验",
    description: "探索网格、字符密度与动态扰动之间关系的 Canvas 创意编码小品。",
    url: "/demos/generative-type",
    internal: true,
    tags: ["Canvas", "Typography", "Creative Coding"],
    status: "online",
  },
  {
    slug: "palette-lab",
    title: "色彩令牌实验室",
    description: "拖动色相与明度，实时生成设计令牌，并预览语义色在浅色/深色下的表现。",
    url: "/demos/palette-lab",
    internal: true,
    tags: ["Design Tokens", "Color", "UI"],
    status: "online",
  },
];
