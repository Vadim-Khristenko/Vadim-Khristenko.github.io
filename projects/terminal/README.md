# VAI Terminal

An interactive command-line portfolio — explore who I am and what I build by typing commands. Written in **Rust + Leptos**, compiled to **WebAssembly**.

Aesthetic: an amber-phosphor CRT set into a graphite industrial bezel (with a paper light theme).

## Highlights
- A tiny **read-only virtual filesystem** — `ls`, `cd`, `cat`, `tree`, `grep` real files under `/` and `/projects`.
- **Speaks both bash and PowerShell**: `ls`/`dir`/`gci`, `cat`/`type`/`gc`, `cd`/`sl`, `pwd`/`gl`, `grep`/`sls`, …
- Portfolio commands: `about`, `projects`, `skills`, `contact`, `neofetch`.
- Command **history** (↑/↓), live `cwd` prompt, `theme dark|light`, `lang ru|en|zh`, and a couple of hidden secrets.

## Build

```bash
rustup target add wasm32-unknown-unknown       # once
cargo install trunk --locked                   # once
trunk build --release                           # → ../../public/files/terminal
```

Output lands in `public/files/terminal/`, served by the site at `/files/terminal/`.
