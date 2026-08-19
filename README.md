# Dlog

Dlog 是一个基于本地 MDX 内容的个人博客与作品展示站点。项目采用 Next.js App Router、严格 TypeScript、Tailwind CSS v4 和 shadcn/ui，并可在服务端读取 GitHub 公开资料。

## 技术栈

- Next.js App Router 与 React
- 严格 TypeScript
- Tailwind CSS v4
- shadcn/ui（New York 风格、CSS Variables、Neutral 基色）
- next-themes 深色模式
- gray-matter 与 next-mdx-remote/rsc 本地 MDX 渲染
- lucide-react 图标

## 本地开发

需要较新的 Node.js LTS 版本和 npm。

```bash
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell 可使用：

```powershell
Copy-Item .env.example .env.local
npm run dev
```

打开 <http://localhost:3000> 查看站点。

常用命令：

```bash
npm run dev        # 启动开发服务器
npm run build      # 创建生产构建
npm run start      # 启动生产服务器
npm run lint       # 执行 ESLint
npm run typecheck  # 执行 TypeScript 类型检查
```

## 环境变量

复制 `.env.example` 为 `.env.local`，并按需设置：

| 变量 | 必需 | 说明 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 是 | 站点完整公开地址；本地默认使用 `http://localhost:3000`。 |
| `GITHUB_USERNAME` | 是 | 用于读取公开用户资料和仓库信息的 GitHub 用户名。 |
| `GITHUB_TOKEN` | 否 | 用于提高 GitHub API 限额。该变量只能在服务端读取，绝不能改名为带 `NEXT_PUBLIC_` 前缀的变量，也不要提交真实 Token。 |

## 内容管理

博客文章和项目介绍均以本地 MDX 文件维护。推荐约定：

```text
src/content/
├── posts/       # 博客文章
└── projects/    # 项目介绍
```

每个 MDX 文件可在文件顶部使用 YAML front matter 描述标题、摘要、发布日期、标签和发布状态；正文由 `next-mdx-remote/rsc` 在服务端渲染，元数据由 `gray-matter` 解析。添加或修改内容后，先运行 `npm run typecheck` 和 `npm run build` 检查结果。

示例：

```mdx
---
title: "第一篇文章"
description: "Dlog 内容示例"
date: "2025-01-01"
tags:
  - Next.js
published: true
---

# 第一篇文章

这里是正文。
```

## 添加 shadcn/ui 组件

项目已配置 `components.json`，可直接通过 CLI 添加组件：

```bash
npx shadcn@latest add button
```

组件默认写入 `src/components/ui`，工具函数使用 `@/lib/utils`，全局样式文件为 `src/app/globals.css`。

## 构建与演示部署

提交或部署前执行：

```bash
npm run lint
npm run typecheck
npm run build
```

推荐部署到 Vercel：

1. 将仓库推送至 GitHub。
2. 在 Vercel 导入项目，并将根目录设置为 `Dlog`（如果 Dlog 位于 monorepo 中）。
3. 在项目设置中添加 `NEXT_PUBLIC_SITE_URL`、`GITHUB_USERNAME`，并按需添加仅服务端可见的 `GITHUB_TOKEN`。
4. 首次部署后，将 `NEXT_PUBLIC_SITE_URL` 更新为正式域名并重新部署。

也可以使用 Vercel CLI 创建演示部署：

```bash
npx vercel
```

生成生产部署：

```bash
npx vercel --prod
```

不要在日志、客户端代码、公开截图或仓库中暴露 `GITHUB_TOKEN`。
