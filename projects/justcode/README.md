# JustCode 2027

Turn source code into beautiful, shareable PNGs — rebuilt from scratch in **Rust + Leptos**, compiled to **WebAssembly**.

The reactive UI, theming and layout are 100% Rust. Two battle-tested browser libs are called through a thin JS bridge (`index.html`): **highlight.js** for tokenizing and **html-to-image** for rasterizing the preview card.

## Features
- Live preview card with 5 code themes (Midnight, Aurora, Ember, Graphite, Paper) and 7 gradient backdrops.
- macOS / minimal / none window chrome, adjustable padding, corner radius, font size, line numbers.
- 17 languages + auto-detect.
- Export crisp PNG at 1–4× pixel ratio, copy image to clipboard, or copy raw code.

## Build

```bash
rustup target add wasm32-unknown-unknown       # once
cargo install trunk --locked                   # once
trunk build --release                           # → ../../public/files/justcode
```

`trunk serve` is for local dev only — always ship a `--release` build (it strips the dev autoreload shim).

Output lands in `public/files/justcode/`, served by the site at `/files/justcode/`.
