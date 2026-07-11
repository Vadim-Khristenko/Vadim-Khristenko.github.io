# Horizon 2027 — Rust · Leptos · WASM

An interactive, branching "threshold of the new year" experience. Choose how you enter 2027;
the accent colour, the passage and the finale react to your path.

## One-time toolchain setup

```sh
rustup target add wasm32-unknown-unknown
cargo install trunk --locked
```

## Develop

```sh
cd projects/horizon
trunk serve --open      # http://127.0.0.1:8081
```

## Build (outputs into the site)

```sh
cd projects/horizon
trunk build --release
```

`Trunk.toml` writes the bundle straight into `../../public/files/horizon/`, so the main
`bun run build` picks it up and it ships at **/files/horizon/**.

## Stack

- [Leptos 0.6](https://leptos.dev/) (CSR) — reactive UI in Rust
- [Trunk](https://trunkrs.dev/) — WASM bundler
- `console_error_panic_hook` — readable panics in the browser
