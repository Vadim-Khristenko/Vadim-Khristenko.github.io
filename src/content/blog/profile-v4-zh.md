---
title: 'Profile v4：我的 GitHub 主页如何升了一个档次'
description: '主页卡片看起来像 AI 流水线产物，于是我把它们全部重做：每张卡片都成了一幅按自身项目风格绘制的作品，Rust 引擎把文字排成字形轮廓，NIKKE 有了真正的大厅，Last.fm 不再闹脾气，家庭实验室也有了自己的卡片。'
pubDate: 2026-10-19
updatedDate: 2026-10-19
author: VAI_PROG
tags: ['github', 'profile', 'readme', 'rust', 'svg', 'design', 'hatsune-miku', 'homelab']
lang: zh
translationKey: profile-v4
cover: /blog/profile-v4/header.webp
---

我在 GitHub 上有一份个人主页 README，很长一段时间里它都……还行。统计卡片、游戏架、「正在听」的小牌子。一切都能用，一切都会自动刷新。直到某天我换个眼光再看它，才意识到可怕的事实：**它看起来就像 AI 流水线的产物。** 整齐的矩形、千篇一律的渐变、人手一份的 Tokyo Night。一个亲手做了编辑器主题的人，主页却穿着别人的衣服。

于是我像对待网站那样处理它：不修修补补，全部重做。

![主页头图：人声音轨的钢琴卷帘，项目排成一条条音轨](/blog/profile-v4/header.webp)

---

## 先画草图，再写代码

上一次我直接从代码开始，结果在 Rust 里和自己争论设计争了太久。这一次规则很简单：**每张卡片先作为独立的作品画出来，只有我喜欢了，才移植进引擎。**

核心原则是：项目卡片应该**看起来就像项目本身**，而不是又一块写着名字的牌子。

- **Hatsune Miku themes**，我最受欢迎的仓库，变成了用主题配色展示各个编辑器的橱窗。其他程序的主题也在路上，位置已经留好了。
- **NotAnOtherVTUBERwiki** 被画成 FilianWIKI 暗色 Snackers 皮肤下的一篇条目：Article 与 Talk 标签、脚注、目录和信息框。
- **The Wall Dev** 住在一个 Win95 风格的窗口里，有画布、按 Wall 调色板上色的像素，还有机器人发来的通知。
- **Kumir 3** 变成了一本方格作业本：左边是 Kumir 程序，右边是机器人在给走廊刷漆，还有老师用红笔打的满分。
- **A CAT**（awg-containers-and-tools）变成了一个集装箱堆场，有吊车、路灯，还有一只坐在装满 AmneziaWG 镜像的集装箱上的猫。
- **Any Tech Architect** 和我的研究 **Aethelgard TQ-1.58** 也有了各自的卡片，Snackers 有了像素画。

![Kumir 3：方格本、Kumir 程序和走廊里的机器人](/blog/profile-v4/repo_kumir.webp)

![Hatsune Miku themes：编辑器橱窗](/blog/profile-v4/repo_miku_themes.webp)

最上方现在是一排**键帽**：画成机械键盘按键的徽章。主卡片则成了**人声音轨的钢琴卷帘**：音符拼出一句歌词，项目像 DAW 里的音轨一样排开，带着 M 和 S 按钮。

![头图上方的键帽](/blog/profile-v4/badges.webp)

---

## 引擎 v4：在哪儿看都一样的文字

这是最有意思的部分。GitHub 上的 README 把 SVG 当作普通图片显示。这样的图片加载不了外部字体，而每个人的系统字体又各不相同：我用 Arch，有人用 Windows，有人用手机。同一行字，在这里放得下，到那里就溢出了卡片边缘。

所以 **vai-profile 4.0** 干脆不再写 `<text>`。它用 [rustybuzz](https://github.com/RazrFalcon/rustybuzz) 自己排版每一行，取出所需字形的轮廓，每个字形只在 `<defs>` 里放一次，文字由 `<use>` 拼成：

```rust
let title = T::new(Font::UnboundedBold, 26.0).fill(pal::FG_HI).ls(-0.3);
b.push_str(&doc.text(40.0, 82.0, "Home is the datacenter", &title));
```

这样换来了：

- 构建时就知道每一行的**精确宽度**，过长的名字会用省略号截断，而不是越过边框；
- **在任何设备上都是同一张图**，字体不再依赖系统；
- **回退链**：某个字体缺字时，就从下一个字体取字形，最后永远有 Zen Kaku Gothic New 兜底西里尔字母和日文。

现在有一整排字体，全部采用 OFL 授权：Zen Kaku Gothic New、JetBrains Mono、Unbounded、Big Shoulders Stencil、Pixelify Sans、PT Sans、Caveat、Silkscreen、Saira Condensed 和 Michroma。每张卡片都有自己的声音：作业本用 Caveat 书写，Win95 说像素语，NIKKE 大厅用窄窄的 Saira 说话。

---

## 图片：用带遮罩的 JPEG 代替沉重的 PNG

带透明度的角色立绘做成 PNG，体积和一整张卡片差不多。纯 Rust、不带 C 依赖的情况下又做不出有损 WebP。于是引擎用了个小技巧：

1. 把图片缩小到实际绘制的尺寸；
2. 颜色存进 **JPEG**；
3. 透明度单独存成一张**很小的灰度 PNG 遮罩**，再通过 SVG 的 `<mask>` 叠上去。

```rust
// 在这种尺寸下，十六级透明度和 256 级看起来没有区别，
// 遮罩却能压缩得小好几倍。
.map(|p| ((p[3] as u16 + 8) / 17 * 17).min(255) as u8)
```

结果：最佳游戏卡片从 **1.25 MB 降到 362 KB**，游戏架从 **557 KB 降到 364 KB**。看起来一样，加载快了好几倍。

---

## NIKKE：真正的大厅

最佳游戏卡片以前只是「封面、标题、几个数字」。现在它是照着游戏截图画的 **NIKKE 大厅**：中间是阿妮斯，上方是钻石和信用点，右边是任务，还有我的主线小队及其等级和战力、前哨基地、方舟，以及金牌段位的 POGG 联盟。下面是「因剧情而爱」的展示架，十位一个不少。

![NIKKE 大厅：阿妮斯、主线小队、最爱的角色、前哨基地与联盟](/blog/profile-v4/bestgame.webp)

所有数字都在 `config/profile.toml` 里。升了级或通了一章：改一行，引擎就会重画。

---

## Last.fm 不再闹脾气

音乐卡片曾是主页里最神经质的部分：Last.fm 有时回应，有时不回应，于是本该是音乐的地方一片空白。原来 Last.fm 喜欢在 **HTTP 200 的响应里**返回错误：状态说「一切正常」，正文却写着 `{"error": 16}`。

现在客户端会：

- 区分网络错误、HTTP 错误和 API 错误，只重试值得重试的那些（错误码 8、11、16 和 29）；
- 最多尝试三次；
- 把最近一次成功的结果存进缓存，服务挂掉时显示它并标注数据已过时；
- **绝不**把缓存冒充成「正在播放」。

卡片本身也变成了 3D：透视中的 CD 盒，以及由最爱艺人柱子组成的等距城市，借助 SMIL 轻轻呼吸。

![音乐卡片：3D 的 CD 与艺人组成的等距城市](/blog/profile-v4/music.webp)

---

## 家庭实验室有了自己的卡片

我的大部分基础设施都在家里。我的家庭实验室由笔记本组成：两台作为服务器，跑着 **Arch** 和 **NixOS**；我的主力笔记本则是 **Windows 11** 与 **Arch Linux** 双系统。在外面的世界里，跑着 Arch、NixOS、Ubuntu 和 Debian 的 VPS 守着边缘。

现在这一切也画出来了：一张等距视角的桌子，服务器屏幕上滚动着日志，主力笔记本上的启动菜单在系统之间切换，数据包从路由器奔向各台 VPS。

![家庭实验室：桌上的笔记本与外面的 VPS](/blog/profile-v4/homelab.webp)

机器都写在配置里，新增一台服务器只需一行：

```toml
[showcase.homelab]
home = ["arch", "nixos"]
main = ["windows", "arch"]
vps  = ["arch", "nixos", "ubuntu", "debian"]
```

---

## 三个代码托管平台，一份统计

我的代码住在三个地方：GitHub、Codeberg，以及我自己在 `git.vai-rice.space` 上的 Forgejo。引擎从三处收集统计，并**合并镜像**：放在三个地方的同一个仓库只算一次代码，而星标会把所有平台的加在一起。平台卡片把各个托管平台画成服务器机架里的单元，同一仓库的副本用跳线连在一起。

---

## 双语 README

README 本身也从零重写，现在有两份：英文和俄文。引擎会同时更新两份文件：`<!-- ENGINE:...:START -->` 与 `END` 标记之间的内容归它管，其余文字归我。各个部分之间用五线谱和编号分隔线隔开，主页的最末尾写着「Fine.」，就像乐谱的结尾。

---

## 大扫除

新卡片顺带引来了一次彻底的大扫除：

- 旧卡片、旧主题，以及配置里早已没人读的那一半，全部删除；
- **60 个测试**，不仅检查代码，也检查图片：每张卡片都是合法的 XML，每个 `<use>` 都指向存在的字形，所有文字都在画布之内，每张卡片都有体积预算；
- `cargo clippy` 零警告；
- 动画尊重 `prefers-reduced-motion`：如果你让系统减少动态效果，主页就会静止下来。

---

## 总结

主页不再像一个模板。每张卡片都用自己项目的语言讲述那个项目，一切由一个 Rust 程序绘制，在 Actions 里点一下就能重建，而且比以前更轻。

欢迎来看看：[github.com/Vadim-Khristenko](https://github.com/Vadim-Khristenko)。如果你也想要一个这样的引擎，它就在主页仓库的 `engine/` 文件夹里。
