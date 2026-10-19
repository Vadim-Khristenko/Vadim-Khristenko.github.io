---
title: 'NotAnOtherVTUBERwiki: how I wrote my own wiki engine to leave FANDOM'
description: 'Seven weeks, 264 commits and 56 thousand lines of Rust: a wiki engine for fan communities that runs FilianWIKI. Why not MediaWiki, how skins, templates and translations work, and which bugs took the beta down.'
pubDate: 2026-10-19
updatedDate: 2026-10-19
author: VAI_PROG
tags: ['notanotherwiki', 'filianwiki', 'rust', 'axum', 'postgresql', 'wiki', 'vtuber', 'fandom']
lang: en
translationKey: notanotherwiki
cover: /blog/notanotherwiki/banner.webp
---

Almost every VTuber has a fan wiki, and almost all of them live on FANDOM. There are ads on top of the article, a page takes seconds to load, the skin cannot be changed, and everything the community wrote sits on someone else's platform. I am part of Filian's community, the Snackers, and at some point I wanted us to have a place of our own: fast, good-looking and ours.

That is how **NotAnotherWiki Engine** started, codename NotAnOtherVTUBERwiki. The first wiki on it is **FilianWIKI**, now in open beta at [beta.filian.wiki](https://beta.filian.wiki).

One thing first: this is a **fan project**. We are not Filian, we do not speak for her, and we are not part of any ARG. It says so at the bottom of every wiki page, and it is not a formality: while a streamer runs an alternate reality game, any site with her name on it is easy to mistake for a clue. There are no clues here.

![The FilianWIKI banner, drawn by just.call.me.l](/blog/notanotherwiki/banner.webp)

---

## What came out of it

I started on 31 August with an empty repository. Seven weeks later it has 264 commits, eight Rust crates, about 56 thousand lines of code and almost 600 tests. Version 0.6.1 went out today.

![The Filian article on FilianWIKI: infobox, footnotes and a notice that the English original has changed](/blog/notanotherwiki/article.webp)

What the engine does today:

- articles in **Markdown** with footnotes, a table of contents, infoboxes, tabs, navboxes and timelines;
- **templates and modules**: a template is placed into a page, a module computes part of a page on the server;
- **several languages** in one wiki, each article with its own translations;
- edit history with word-level diffs, a discussion for every page, a watchlist and notifications;
- roles and curators, page protection, a queue of pending edits and rollback;
- reports, an audit log, address blocks, rules against spam from new accounts;
- sign-in through Discord and Telegram, uploads of pictures, audio and video;
- import from MediaWiki and FANDOM, edit history included;
- a public read-only API under `/api/v1`.

---

## Why not MediaWiki

MediaWiki is great for Wikipedia, but it brings PHP, a markup language nobody remembers, and skins that are painful to change. I wanted something else:

- **Markdown first.** People write it every day in Discord and Telegram, there is nothing to learn.
- **A skin is just a folder of templates.** Templates are MiniJinja, a theme is a file of colors. The Snackers skin FilianWIKI wears is one file on top of the default skin.
- **Fast even on a Raspberry Pi.** The server is Rust and axum, pages are cached already rendered, responses carry ETags and answer conditional GETs.
- **Readable without JavaScript.** Articles, search and history work with JS off. Even sign-in works without scripts: you confirm it from another device and that is it.
- **AGPL-3.0**, so nobody can take the engine and turn it into a closed product.

The stack: Rust, axum and sqlx, PostgreSQL 18, Valkey 9. Next to them runs a Bun worker that draws Mermaid and Graphviz diagrams and makes WebP copies of pictures for phones. The landing page on filian.wiki is Vue, prerendered for every language.

---

## Markdown that understands a wiki

Plain Markdown is not enough for a wiki, so I extended it. Footnotes gather at the bottom in the order they are cited. An infobox is a block right in the text. Templates know `#switch` and `PAGELANGUAGE`, so one VTuber card shows in the language of the page it is placed on. VOD tables get a `:::timeline` block that reads like a stream's chapter list. 7TV emotes are written as `:name:` and stored on the wiki itself, so nothing depends on someone else's CDN.

Diagrams were a story of their own. Mermaid returns SVG, and SVG is basically HTML with its own scripts. So the worker rebuilds the SVG from an allowlist of tags and attributes, and whatever is not on the list never reaches the page.

The FANDOM import had a surprise too. `Special:Export` sits behind a Cloudflare check, and I did not try to get past it. But `api.php` returns the same XML with no check at all. The importer parses wikitext, turns tabbers into tabs and carries the edit history over.

---

## One article, many languages

FilianWIKI has been bilingual from day one. Every article has a language, and a translation links to its original. If the original changes after the translation, a notice saying so appears above the article with a link to the diff, as in the screenshot above. An address without a language opens the reader's version.

Languages also gave me the freshest bug. Today it turned out that on Recent changes the diff and history links of translated articles were built without the language prefix. The history link of a Russian article led to the English one, and where there was no English one, to a 404. The fix fit in one method: a link is now built in the language of the edit it shows, not in the language the page was opened in. The same day 0.6.1 was on the beta.

---

## Skins without AI slop

The first version of the special pages looked the way half the internet looks now: cards, gradients, dots, glow. At some point I admitted to myself that it was slop and redid it.

Search now reads as a **concordance**: the matched word sits in the middle of the line, with its context on the left and right. You see at once which section of the article matched and why.

![Search for "minecraft": matches aligned in the middle, like a concordance](/blog/notanotherwiki/search.webp)

The special pages became a **reference book**, and Recent changes turned into a feed with the time, the size of each edit and a bar that shows how big it was.

![Recent changes: a feed by day, edit sizes and links to the diff and history](/blog/notanotherwiki/recent.webp)

---

## Bugs I remember

The most interesting part of a project like this is not the features, it is what broke.

**An empty query that took four seconds.** Tests that talked to Postgres sometimes hung for seconds on the first connection. The culprit was `localhost`: on Windows it resolves to IPv6 `::1` first, Docker listens on IPv4, and every new connection waits for a refusal first. Now it is `127.0.0.1` everywhere, and that was literally the eighth commit of the project.

**Migrations that "applied".** sqlx embeds migrations into the binary at compile time, and cargo does not treat the migrations folder as a build input. Add a migration, run `migrate`, the log says "applied", and nothing was applied: the binary was built before the file existed. On the alpha this made sign-in answer 500 for two minutes. The fix is one line in `build.rs` (`rerun-if-changed` on the migrations folder), and after every deploy I look at the `_sqlx_migrations` table, not at the log.

**Twelve minutes of 500 on every page.** The `bool_or` aggregate over zero rows returns `NULL`, not `false`. I had marked the field as required in sqlx, and the query compiled just fine. It also ran on every page view, and almost no page has pending edits. The alpha answered 500 everywhere until the hotfix landed. Such aggregates are now wrapped in `COALESCE`, and every query on the hot path has a test for the empty result.

**A cache that remembers the old.** A rendered page is cached by the hash of its text. If the renderer changes and the text does not, the hash stays the same and the wiki keeps serving the old HTML. So the cache key includes a renderer version, and it has to go up in the same commit that changes the Markdown output. Once I forgot, and the alpha showed the old markup until I figured out why.

**A black screen on the landing page.** In Vue's scoped CSS, the selector `:global(.has-3d) .fallback` compiles to just `.has-3d`. The class sat on `<html>`, so a second after load the whole landing page went transparent. It looked like a WebGL bug and turned out to be one line of CSS.

**A local copy that stole the bot.** Telegram allows exactly one consumer of updates per bot. I ran the wiki locally with production settings, and the local copy started taking messages away from the beta. Local runs now always have bot polling off.

**A disk that ran out.** The `target/` folder of a workspace like this easily grows to 80 GB, and when space runs out rustc says nothing useful, it just crashes. I watch it now the same way I watch the tests.

---

## Security, since people write here

A wiki is a place where anyone can write anything, so I treat all input as hostile:

- every page is served with a Content Security Policy and a one-time nonce for scripts;
- state-changing requests that came from another site are refused;
- the database holds only digests of sessions, and the cookie carries the `__Host-` prefix;
- search snippets are escaped as text, not parsed as HTML;
- Markdown rendering is linear in the size of the text, and the cost of a diff is bounded, so one huge edit cannot take the server down;
- saving a page is a compare-and-swap: if two people edit at once, the second gets a 409 instead of silently overwriting the first;
- expensive routes have a rate limit per address, and an address block forbids writing but not reading;
- the trace log blanks tokens and OAuth codes in URLs, and the development login refuses to start on a public address.

I keep an eye on dependencies too: ammonia was updated twice in the last few days for fresh advisories, the latest being RUSTSEC-2026-0373.

---

## Moderation and people

The hardest part of a wiki is not the code, it is the people. So a lot of time went into tools for those who keep order: roles and curators, page protection levels, a queue of pending edits with rollback, reports that show the moderators' answer, a readable audit log. Pages that are not for all ages show a warning first, and the page does not open until the reader agrees.

Backups run every day, and once a week I check that they can really be restored. A backup nobody has ever restored from is just hope.

---

## Where it is now

Since 6 October FilianWIKI has been in open beta: anyone can sign in with Discord or Telegram and start editing. Articles about streams, the chronology, the glossary and the people around Filian are written with sources, and every fact can be checked through its footnote.

Next up are plugins the community can write on its own, and the first real release.

The code is open: [github.com/Vadim-Khristenko/NotAnOtherVTUBERwiki](https://github.com/Vadim-Khristenko/NotAnOtherVTUBERwiki). The wiki lives at [beta.filian.wiki](https://beta.filian.wiki). The FilianWIKI banner and icon were drawn by **just.call.me.l** from SnackersHQ, by hand, and a special thank you for that.
