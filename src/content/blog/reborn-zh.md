---
title: 'Reborn：我把旧网站彻底删了，从零重建'
description: '一次大迁移的故事：告别 React 与 Tailwind，迁到 Astro 7 + Vue，八套主题，三个 Rust/WASM 小应用，还有实时统计。很多代码，一点疯狂。'
pubDate: 2026-07-12
updatedDate: 2026-07-12
author: VAI_PROG
tags: ['reborn', '迁移', 'astro', 'vue', 'rust', 'tailwind']
lang: zh
translationKey: reborn
cover: /VAI-BANNER.png
---

你知道那种感觉吗——打开自己的旧项目，既想抱抱它，又想把它埋得深深的？我也是。旧的 `vai-rice.space` 挺可爱，但它长满了各种拐杖，`React` 和 `Tailwind` 缠得太紧，喘不过气。于是我做了对待遗留代码最诚实的一件事：

> **全部删掉。重新构建。从零开始。**

这是一个固执的开发者迁到 `Astro 7`、扔掉 React、告别 Tailwind、用 Rust 写了三个小应用——并且（基本上）没疯的故事。

## 👋 再见，React

没有私人恩怨。React 很棒，但对于一个拥有一堆独特主题的内容站点，它就像用显微镜钉钉子。我不需要每个按钮上都跑一个运行时框架——我需要的是**孤岛**。

于是我选择了 **Astro + Vue**。Astro 输出静态 HTML（快、省、对 SEO 友好），而重交互我精准地以 Vue 孤岛注水：

```astro
<MainPage client:only="vue" />
```

一个 `client:only`，整个 SPA 体验就活在浏览器里，其余部分是干净轻量的 HTML。状态交给 `Pinia`（主题、模式、语言）。React 离开了——世界安静得恰到好处。

## 🎨 你也一样，Tailwind

这一步几乎像做治疗。我认真检查过：**Tailwind 其实根本没用上**。没有一个 `md:flex`，没有一个 `@apply`。所有样式早就活在自定义 CSS 变量上：

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
```

每套主题只是覆盖 token（`--bg`、`--primary`、`--radius`、`--font-display`……），组件读取它们即可。于是 `@astrojs/tailwind` 和 `tailwindcss` 骑马入夕阳。少了一个依赖，少了一整层魔法——**零损失**。

## 🚀 Astro 4 → 7：一跃三个大版本

这里开始刺激了。项目停在 `Astro 4`，而世界已经到了 **`Astro 7.0.7`**。中间隔着全新的 *content layer*、改名的 API 和几个惊喜：

- `src/content/config.ts` 搬到了 **`src/content.config.ts`**；
- 集合现在需要 **loader**：

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({ /* … */ }),
});
```

- `post.slug` 变成了 `post.id`。

改几处、重新构建，`✓ 6 page(s) built`。顺便升级了 **Vue 3.5**、**Pinia 3**、**Vite 8**，甚至 **TypeScript 7**。走在刀尖上。🔪

## 🖥️ 八套主题，八种心情

网站会换装。而且不是"换个强调色"——是八种**不同的体验**：

- **Modern** —— 瑞士编辑风：钴蓝 + 朱红，大字号排版。
- **Windows 95** 和 **Mac Classic** —— 像素级怀旧，区块即窗口，还有 BSOD 彩蛋。
- **Windows 11**、**macOS 26**、**Snackers**、**Classic**、**Terminal** —— 各有字体、动效与秘密。

## 🦀 三个 Rust → WebAssembly 小应用

因为，为什么不呢：

- **[Horizon 2027](/files/horizon/)** —— 交互式新年之旅，实时倒数（公历**与**农历新年）。
- **[JustCode](/files/justcode/)** —— 把代码变成精美图片（PNG/JPEG/WebP/SVG）。
- **[VAI Terminal](/files/terminal/)** —— 命令行式作品集，带可写文件系统，同时懂 bash **和** PowerShell。

全部基于 `Leptos` 和纯正的 WASM。

## 📊 无痛的实时统计

以前每个页面都会为每位访客请求 GitHub API（速率限制你好）。现在**每 6 小时一次的 cron** 把星标、fork 和语言占比收集进公开的 `/data/stats.json`，网站直接读取。快、新鲜、没戏剧。

## 🧠 那些让人开心的小事

- 翻译（ru/en/zh）拆成**按板块的微文件**——编辑起来是种享受。
- 成年人的 SEO：带横幅的 Open Graph、`JSON-LD`、sitemap、robots。
- 面向 **AI 代理**的档案：`/llms.txt` 与 `/for-ai/`。
- 真正的品牌图标（`simple-icons`），而非通用图标。

## 结语

旧网站是个不错的草稿。新的这个才是我一直想要的：快、怪、完全属于我。没有 React，没有 Tailwind，在没人要求的地方塞了 Rust。

> 预测 2027 最好的方式，是自己把它造出来。最好从第一个提交开始。

谢谢你来看。现在我要去搞坏点别的、再修好它了。🚀
