---
title: 'Profile v4: how my GitHub profile went up a level'
description: 'My profile cards looked like AI slop, so I redid all of them: every card is now its own piece of art in the style of its project, a Rust engine lays text out as glyph outlines, NIKKE got a real lobby, Last.fm stopped being moody, and the homelab got a card of its own.'
pubDate: 2026-10-19
updatedDate: 2026-10-19
author: VAI_PROG
tags: ['github', 'profile', 'readme', 'rust', 'svg', 'design', 'hatsune-miku', 'homelab']
lang: en
translationKey: profile-v4
cover: /blog/profile-v4/header.webp
---

I have a profile README on GitHub, and for a long time it was… fine. Stats cards, a game shelf, a "now listening" plate. Everything worked, everything refreshed itself. Then one day I looked at it with fresh eyes and realised the scary part: **it looked like AI slop.** Neat rectangles, identical gradients, the same Tokyo Night everyone else has. The profile of a person who made his own editor theme was wearing somebody else's.

So I did what I did with the site: no touch-ups. I rebuilt all of it.

![Profile header: a vocal track piano roll and the projects as tracks](/blog/profile-v4/header.webp)

---

## Sketches first, code second

Last time I started straight in code and then argued with myself about design inside Rust for far too long. This time the rule was simple: **every card is drawn as a standalone piece of art first, and only once I like it does it get ported to the engine.**

And the core principle: a project card should look **like the project itself**, not like another plate with a name on it.

- **Hatsune Miku themes**, my top repo, became a showcase of editors in the theme's colours. Themes for other programs are coming, and there is room for them already.
- **NotAnOtherVTUBERwiki** is drawn as a FilianWIKI article page in the dark Snackers skin: Article and Talk tabs, footnotes, contents, an infobox.
- **The Wall Dev** lives in a Win95-style window, with a canvas, pixels in the Wall palette and a notification from the bot.
- **Kumir 3** turned into a squared school notebook: a Kumir program on the left, the Robot painting a corridor on the right, and a teacher's top mark in red pen.
- **A CAT** (awg-containers-and-tools) became a container yard with a crane, a lamp and a cat sitting on containers full of AmneziaWG images.
- **Any Tech Architect** and my **Aethelgard TQ-1.58** research got cards of their own, and Snackers got pixel art.

![Kumir 3: a squared notebook, a Kumir program and the Robot in a corridor](/blog/profile-v4/repo_kumir.webp)

![Hatsune Miku themes: the editor showcase](/blog/profile-v4/repo_miku_themes.webp)

On top of it all there is now a row of **keycaps**: badges drawn as mechanical keyboard keys. And the main card became a **vocal track piano roll**: the notes spell out a line of lyrics, and the projects are lined up as tracks in a DAW, with M and S buttons.

![Keycaps above the header](/blog/profile-v4/badges.webp)

---

## Engine v4: text that looks the same everywhere

This is the interesting part. A README on GitHub shows an SVG as a plain image. Such an image cannot load an external font, and system fonts differ for everyone: I am on Arch, someone is on Windows, someone is on a phone. The same line fits in one place and spills past the card's edge in another.

So **vai-profile 4.0** does not write `<text>` at all anymore. It shapes each line itself with [rustybuzz](https://github.com/RazrFalcon/rustybuzz), takes the outlines of the glyphs it needs, puts each one into `<defs>` once and builds the text out of `<use>`:

```rust
let title = T::new(Font::UnboundedBold, 26.0).fill(pal::FG_HI).ls(-0.3);
b.push_str(&doc.text(40.0, 82.0, "Home is the datacenter", &title));
```

What that buys:

- **the exact width** of every line at build time, so a long name gets cut with an ellipsis instead of crossing the frame;
- **the same picture** on every device, fonts no longer depend on the system;
- **a fallback chain**: if a font lacks a character, the glyph comes from the next one, and at the very end there is always Zen Kaku Gothic New for Cyrillic and Japanese.

There is a whole shelf of fonts now, all under the OFL: Zen Kaku Gothic New, JetBrains Mono, Unbounded, Big Shoulders Stencil, Pixelify Sans, PT Sans, Caveat, Silkscreen, Saira Condensed and Michroma. Each card picks its own voice: the notebook writes in Caveat, Win95 speaks pixel, the NIKKE lobby talks in narrow Saira.

---

## Images: JPEG with a mask instead of a heavy PNG

Character art with transparency weighs as much as a whole card as PNG. Lossy WebP is not available in pure Rust without C dependencies. So the engine plays a trick:

1. the image is resized to the size it is actually drawn at;
2. colour goes into a **JPEG**;
3. transparency travels separately as a **tiny grayscale PNG mask**, applied with an SVG `<mask>`.

```rust
// Sixteen steps of alpha look the same as 256 at these sizes and make the
// mask compress several times better.
.map(|p| ((p[3] as u16 + 8) / 17 * 17).min(255) as u8)
```

The result: the best-game card went from **1.25 MB to 362 KB**, the game shelf from **557 to 364 KB**. Looks the same, loads several times faster.

---

## NIKKE: a real lobby

The best-game card used to be "cover, title, a couple of numbers". Now it is the **NIKKE lobby**, drawn after a screenshot from the game: Anis in the middle, gems and credits on top, missions on the right, my campaign squad with levels and power, the outpost, the Ark and the POGG union with its gold rank. Below sits the "loved for the lore" shelf, and all ten of them are there, no exceptions.

![The NIKKE lobby: Anis, the campaign squad, favourite characters, outpost and union](/blog/profile-v4/bestgame.webp)

Every number lives in `config/profile.toml`. Levelled up or cleared a chapter: change one line, the engine redraws it.

---

## Last.fm stopped being moody

The music card used to be the most nervous part of the profile: sometimes Last.fm answered, sometimes it did not, and then there was a blank where the music should be. It turns out Last.fm likes to return an error **inside an HTTP 200 response**: the status says "all good", the body says `{"error": 16}`.

Now the client:

- tells network errors, HTTP errors and API errors apart, and only retries what is worth retrying (codes 8, 11, 16 and 29);
- makes up to three attempts;
- keeps the last good answer in a cache and, when the service is down, shows it marked as stale;
- **never** passes the cache off as "playing right now".

And the card itself went 3D: a CD case in perspective and an isometric city made of columns for my favourite artists, breathing through SMIL.

![The music card: a CD in 3D and an isometric city of artists](/blog/profile-v4/music.webp)

---

## The homelab got its own card

Most of my infrastructure lives at home. My homelab is made of laptops: two of them work as servers on **Arch** and **NixOS**, and my main laptop dual boots **Windows 11** and **Arch Linux**. Out in the world, VPS on Arch, NixOS, Ubuntu and Debian hold the edge.

Now that is drawn too: an isometric desk, logs scrolling on the servers' screens, a boot menu flipping between systems on the main laptop, packets running from the router to the VPS.

![The homelab: laptops on a desk and VPS out in the world](/blog/profile-v4/homelab.webp)

The machines are described in the config, so a new server is one line:

```toml
[showcase.homelab]
home = ["arch", "nixos"]
main = ["windows", "arch"]
vps  = ["arch", "nixos", "ubuntu", "debian"]
```

---

## Three forges, one count

My code lives in three places: GitHub, Codeberg and my own Forgejo at `git.vai-rice.space`. The engine collects stats from all three and **folds mirrors together**: a repo that lives in three places counts as code once, while its stars add up from every platform. The platforms card draws the forges as units in a server rack, with patch cables joining copies of the same repo.

---

## A README in two languages

The README itself was rewritten from scratch too, and now there are two: English and Russian. The engine updates both at once: everything between the `<!-- ENGINE:...:START -->` and `END` markers belongs to it, the rest of the text is mine. Sections are split by music staves and numbered dividers, and the very end of the profile says "Fine.", like the end of a score.

---

## Housekeeping

The new cards brought a proper spring clean with them:

- the old cards, the old theme and the half of the config nobody read anymore are gone;
- **60 tests**, and they check the pictures as well as the code: every card is valid XML, every `<use>` points at a glyph that exists, all text stays inside the canvas, every card has a size budget;
- `cargo clippy` without a single warning;
- animations respect `prefers-reduced-motion`: if you asked your system to move less, the profile holds still.

---

## The upshot

The profile no longer looks like a template. Every card talks about its project in that project's own language, everything is drawn by one Rust binary, rebuilds with one button in Actions and weighs less than before.

Come have a look: [github.com/Vadim-Khristenko](https://github.com/Vadim-Khristenko). And if you want an engine like this for yourself, it lives right in the profile repo, in the `engine/` folder.
