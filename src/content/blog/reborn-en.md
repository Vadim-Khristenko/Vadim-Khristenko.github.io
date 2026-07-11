---
title: 'Reborn: how I tore down the old site and built a new one from scratch'
description: 'The story of a big migration: saying goodbye to React and Tailwind, moving to Astro 7 + Vue, eight themes, three Rust/WASM mini-apps, my own domain instead of github.io, autonomous stats and a profile for AIs. Lots of code, a bit of madness, and one internet connection that kept falling over.'
pubDate: 2026-07-12
updatedDate: 2026-07-12
author: VAI_PROG
tags: ['reborn', 'migration', 'astro', 'vue', 'rust', 'tailwind', 'github-actions', 'dns']
lang: en
translationKey: reborn
cover: /VAI-BANNER.png
---

You know that feeling when you open an old project of yours and want to hug it and bury it deep at the same time? That was me. The old `vai-rice.space` was cute. Genuinely cute. But it had grown so densely tangled with crutches, React and Tailwind that it got hard to breathe: every edit dragged three foreign abstractions along with it, every new theme was another layer of "magic" I was, frankly, afraid to look into myself.

And at some point I did the most honest thing you can possibly do with legacy code:

> **Deleted everything. And rebuilt it. From scratch.**

Didn't refactor. Didn't "gradually migrate." Nuked it and rewrote it.

This is the story of how one stubborn developer moved to Astro 7, threw out React, said goodbye to Tailwind, cut ties with `vadim-khristenko.github.io`, rebuilt CI, wrote three mini-apps in Rust, taught the site to collect its own statistics — and didn't lose his mind. Well, almost. Spoiler: the internet kept dropping the entire time with impressive regularity, but more on that below.

---

## Goodbye, React

Nothing personal. React is a great tool, and I'm not about to write yet another "why frameworks are evil" manifesto. But for a content site with a pile of unique themes it felt like hammering a nail with a microscope: expensive, awkward, and a shame about the microscope.

I didn't need a runtime framework on every button. I needed **islands**.

That's how I arrived at **Astro + Vue**. Astro ships static HTML — fast, cheap, SEO-friendly, nothing for the browser to "revive" before it can show it. And I hang the heavy interactivity precisely where it's actually needed:

```astro
<MainPage client:only="vue" />
```

One `client:only` — and the whole SPA experience lives in the browser, while everything else stays clean, light HTML that loads before you've finished blinking. State lives in **Pinia**: theme, mode, locale. Three stores, zero ceremony.

React left. It got quiet and pleasant. A hole appeared in `package.json` — and it was beautiful.

---

## And you too, Tailwind

This one was almost therapy.

I honestly, with an open heart, checked: **Tailwind wasn't used in the project.** Not a single `md:flex`. Not one `@apply`. Not one of those garlands of class names that turn markup into a Cold War cipher. It just sat in the dependencies, dragging along its config, its build step, its PostCSS — and did exactly nothing. A classic project parasite: moved in "just in case" and stayed to live.

Because all the styling had long and happily lived on custom CSS variables:

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
}
```

Every theme simply overrides the tokens — `--bg`, `--primary`, `--radius`, `--font-display`, `--shadow`, `--motion` — and the components read them without asking extra questions. That's the entire "design system": a set of variables and an agreement to respect them.

So `@astrojs/tailwind` and `tailwindcss` itself rode off into the sunset. Minus one dependency, minus a whole layer of magic, minus one config I never looked at anyway — and **zero losses**. Zero. Not a single pixel was harmed.

If your project holds a dependency you can't explain out loud in ten seconds — that's not a dependency, that's a tenant.

---

## Astro 4 → 7: a jump across three majors

This is where it got fun. Fun in the sense that fixing a tap at three in the morning is fun.

The project sat on **Astro 4**. Outside — **Astro 7.0.7**. Between them: a new content layer, renamed APIs and a couple of surprises the changelog describes in one line but which, in reality, are half an hour of profane monologue in an empty room.

The big changes:

- `src/content/config.ts` moved to **`src/content.config.ts`** — yes, just like that, minus one folder, and half the guides on the internet suddenly went stale;
- collections now require a **loader**:

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['ru', 'en', 'zh']),
    translationKey: z.string(),
  }),
});
```

- `post.slug` quietly became `post.id`. One letter of difference in the API — and half an hour of chasing `undefined` through templates.

A couple of edits, a rebuild — and the sacred `✓ 6 page(s) built`. Along the way I pulled in **Vue 3.5**, **Pinia 3**, **Vite 8** and **TypeScript 7**. Living on the edge: if it breaks, it'll break beautifully and first.

---

## Eight themes, eight moods

The site can change clothes. And this isn't "we swapped the accent colour and added a dark background." These are eight **different experiences**, each with its own typography, its own motion, its own interface sounds playing in the reader's head.

In this iteration I didn't just port the themes over — I redrew them from scratch, because the old ones were "fine," and I wanted them to be **right**.

- **Modern** — Swiss editorial: cobalt and vermilion, big typography, lots of air, a grid you can feel even when you can't see it. A theme for people who came to read.
- **Windows 95** — nostalgia down to the pixel. Window-sections with real title bars and a close button (please don't press it, really), chunky bevels, a system font, and — yes — a BSOD easter egg for the especially curious.
- **Mac Classic** — platinum grey, striped title bars, rounded rectangles from another era. A quiet, polite, slightly condescending theme.
- **Windows 11** — acrylic, soft shadows, rounded corners, tidy animation. Modern and a touch sterile, like a hospital corridor with a good designer.
- **macOS 26** — glass, depth, layers. Lots of transparency and respect for margins.
- **Snackers** — the cheekiest one. Colour, motion, character. A theme that clearly refuses to be serious, and that's its best trait.
- **Classic** — plain, calm, "just a website." For those who want the content without the circus.
- **Terminal** — monospace font, a cursor, green on black, a complete absence of mercy. My native habitat.

Each theme is a set of tokens and a couple of specific components. No copy-pasted styles: one engine, eight costumes.

---

## Three mini-apps in Rust → WebAssembly

Because why not. Because "can it be done" is the only question that actually moves pet projects forward.

- **[Horizon 2027](/files/horizon/index.html)** — an interactive New Year journey with a live countdown. The Gregorian New Year **and** the Chinese one, because you should celebrate both — it's mathematically more profitable.
- **[JustCode](/files/justcode/index.html)** — turns code into beautiful images: PNG, JPEG, WebP, SVG. Yes, there are a million services like this. No, I'm not ashamed.
- **[VAI Terminal](/files/terminal/index.html)** — a portfolio as a command line, with a writable file system, understanding both bash and PowerShell syntax. It's the most honest form of résumé I could come up with: want to learn about me — learn to `cd`.

All of it on **Leptos** and honest WASM. No wrappers, no "well, we actually did this bit in JS."

---

## My own domain: goodbye, `vadim-khristenko.github.io`

For a long time the site lived at `vadim-khristenko.github.io`. Did it work? It worked. But it's like showing up to interviews with a mail.ru address: functional, sure, but it leaves a residue. Long, bloated, borrowed.

Now there's **`vai-rice.space`** and **`www.vai-rice.space`**. My own domain, my own rules.

Sounds like a fifteen-minute task. In practice — an evening of dancing with DNS, because DNS will always, **always** be the place where the thing that shouldn't break, breaks.

What had to be sorted out:

- **The apex domain** — four `A` records pointing to GitHub Pages IPs (and `AAAA` for IPv6, because we're not barbarians).
- **`www`** — a separate `CNAME` record to `vadim-khristenko.github.io`. Not the apex. Never the apex.
- **A `CNAME` file** at the build root — otherwise GitHub Pages happily forgets who it is and why on every deploy.
- **HTTPS** — the Let's Encrypt certificate is issued automatically, but only after DNS has fully propagated. Which means: you set it up, everything's correct, and you sit and wait. And refresh. And wait again.
- **Redirects** — so that `www` and the apex don't live as two different sites in the eyes of search engines, but canonicalise into one entity.

A genre of its own is **debugging during propagation**. `dig`, `nslookup`, three different DNS resolvers, browser cache, system cache, ISP cache, and over all of it — the persistent feeling that the internet is mocking you personally.

Spoiler: the internet really was mocking me. More on that two sections down.

---

## GitHub Actions: a pipeline rebuilt from scratch

The old deploy was... well, it was. One workflow that did something in there, and if it fell over I'd usually just restart it and hope for the best. That's not CI. That's a ritual.

Rebuilt everything:

- **Build** — install dependencies, an Astro build, type checking. Fails on types — the whole pipeline fails, no "eh, I'll fix it later."
- **Cache** — dependencies and Astro artifacts are cached between runs. A three-minute build turned into under a minute.
- **WASM build** — a separate step with its own `cargo` cache. Rust compiles slowly, that's a fact of life, but recompiling it on every sneeze is already masochism.
- **Deploy** — via the official `actions/deploy-pages`, with a proper `environment`, instead of a hand-rolled push to `gh-pages` by force of will.
- **A cron job** for the stats — that one's right now.

Now a push to `main` isn't "let's see." It's "it'll build now, and I even know why."

---

## Live stats without the pain

Previously, every page hit the GitHub API **for every visitor**. The idea sounded fine right up until I remembered rate limits. Sixty requests per hour per unauthenticated IP. One curious person shows up, pokes five tabs — and the stats for everyone else turn into a pumpkin.

The solution turned out to be embarrassingly simple: **let the data be collected in advance.**

I wrote an autonomous script that runs on a cron **every six hours** inside GitHub Actions. It hits the API, gathers stars, forks, the language breakdown, fresh releases — and drops it all into a public `/data/stats.json`. The site just reads the ready-made JSON. Zero requests from the visitor, zero limits, zero nerves.

A bonus I didn't plan but am very happy about: if the GitHub API is suddenly down — the site doesn't even notice. It already has data. The last fresh data, but data. Degradation instead of failure is probably my favourite engineering emotion.

---

## The blog, rethought

The old blog was a "page with posts." Technically — a blog. In feel — a landfill.

Reworked the whole concept:

- **Multilingualism as first class.** Every post has a `translationKey`, and switching the language takes you not to the homepage but **to this same post in another language**. Ru, en, zh. Nothing gets lost along the way.
- **Interface translations split into micro-files by section.** Not one god-awful `translations.json` at fifteen hundred lines, but tidy little pieces: navigation on its own, footer on its own, blog on its own. Editing is a joy, finding the right string takes a second.
- **A Zod schema.** Forgot a field in the frontmatter? The build fails. Not "fails somewhere in prod a week later," but right here, with a clear message.
- **Grown-up SEO:** Open Graph with a banner, `JSON-LD` markup, sitemap, robots. Not because I'm chasing traffic, but because doing it halfway is worse than not doing it at all.
- **Real brand icons** (`simple-icons`) instead of generic little circles. A small thing. But small things like these are what add up to the feeling that a site was made by hand, not assembled from a template in one evening.

---

## A profile for AIs: `/llms.txt` and `/for-ai/`

Let's be honest: it's not only humans walking your site. Crawlers, assistants, agents walk it too, and there will only be more of them. And most sites greet them exactly the way they greeted Googlebot in 2010: with a pile of divs and a hope for the best.

I decided to come at it from the other side and made an **explicit profile for AI agents**:

- **`/llms.txt`** — a machine-readable digest: who I am, what the projects are, where things live, what can be quoted. No marketing noise, no "innovative solutions," just structured facts.
- **`/for-ai/`** — a human-readable (and agent-readable) page with extended context: stack, principles, projects, links, licenses.

The thought is simple: if a model is going to talk about me anyway — let it talk **correctly**, instead of hallucinating from scraps of a three-year-old cache. Give the agents a proper source — get a proper picture of yourself back. That's not futurism, it's just being polite to a new kind of reader.

---

## More about me — and about the people I owe

The old "About" section was a three-line paragraph, clearly written in a hurry and clearly by a person uncomfortable talking about himself. (That was me. I'm still uncomfortable. But it has to be done.)

Now there's **a proper story**: what I do, what I love about engineering, why I obsess over minimal dependencies and systems that don't fall but degrade; olympiads, open source, pet projects, strange ideas dragged into production against all common sense.

And something that had long been missing also appeared — **a communities and inspiration section.**

Because this whole site, this whole stack, this whole stubborn habit of writing encryption from scratch instead of `npm install` — it didn't come out of a vacuum. It grew out of chats where at three in the morning someone explains why your code is garbage and exactly what's wrong with it. Out of repositories you read instead of documentation. Out of people who did strange things in public and thereby gave you permission to do strange things too.

So — by name, honestly.

- **Ilya (Tapeline)** — a human spark. All my love for **KuMir** comes from him: he's warm to talk to, you can wander across a hundred topics with him and get bored on none of them, and — yes — he definitely knows how to flirt.
- **Misha (misshanya)** — **Go**, **DevOps**, and the exact person you argue code with at three in the morning; strange architectural debates you always leave smarter than you entered.
- **Semyon (EkeVoki)** — just starting out, but one of those worth watching: early in the journey, and the instinct already shows.
- **Kaito** — Matrix, Rust, Extera. Living proof you can do serious things and still stay yourself.
- **Masha (Rice)**, **Misha Kazarnovsky**, **Yura Kuznetsov** — the ones who've been around longer than any repository of mine has existed. Without them there'd be neither the mood to write nor anyone to show it to.

And from the communities that basically raised me:

- **PROD** — an olympiad and a community that taught me to ship to production, not to "well, it works locally."
- **T-Education** — where algorithms stopped being scary and became a tool.
- **GitHub Open Source** and **Telegram Dev** — an endless feed of other people's code you learn from faster than from any book.
- **Snackers** (Filian's community) — for the reminder that there are always living people behind the screen, and that warmth is a feature, not a bug.

And separately — the people I merely watch for now and would one day like to grow into a conversation-as-equals with: **Filian**, **Sam Altman**, **Dario Amodei**, **Elon Musk**. Completely different people, one shared trait: they do absurdly big things and aren't shy about it.

Open source isn't about licenses. It's about someone before you not being too lazy to explain.

---

## And yes, the internet kept dropping

A separate chapter, without which the story would be dishonest.

A significant part of this migration happened under conditions I'd describe as "internet on a schedule, schedule unknown." The connection dropped. Not "loaded slowly" — it flat-out **dropped**, in the middle of `npm ci`, in the middle of `cargo build`, in the middle of a push, in the middle of DNS propagation, which you've been checking for the third hour straight and can no longer tell whether it's not resolving for you or for the world.

That is, of course, a special genre of hell. You don't know whether there's an error in your config or a package just didn't arrive. You fix what isn't broken, because the real failure is outside and you can't see it. Debugging turns into fortune-telling.

But it does great things for the brain. When the network isn't a given but a privilege, you suddenly start to value:

- **local caches** (`npm ci` from cache is love);
- **minimal dependencies** (every extra package is one more chance the build doesn't make it);
- an **offline-first approach** to development in general;
- and **systems that degrade rather than fall** — the very philosophy for which I built the stats cache in the first place.

The irony is that an unstable internet made the site better. Not because it was meant to, but because pain is an excellent architect.

---

## The bottom line

The old site was a good draft. It honestly did its job, taught me what it was supposed to, and deservedly moved on.

The new one is what I'd envisioned from the very start — I just hadn't had the nerve to admit that rewriting is easier than fixing.

Fast. Strange. Entirely mine.

No React. No Tailwind. With my own domain. With eight themes, three Rust mini-apps, autonomous stats, honest CI and a profile for the machines that will come to read this after you.

> The best way to predict 2027 is to build it yourself. Preferably from the first commit.

Thanks for stopping by. Now I'm off to break and fix something else.
