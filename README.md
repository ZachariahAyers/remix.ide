# Remix IDE Desktop

[![CI](https://github.com/ZachariahAyers/remix.ide/actions/workflows/ci.yml/badge.svg)](https://github.com/ZachariahAyers/remix.ide/actions/workflows/ci.yml)

A desktop app that opens the Remix IDE for Ethereum smart contracts in its own window, restricted to Remix.

## Features

- Remix IDE in a dedicated window, separate from your browser
- Navigation is limited to Remix; links that leave it open in your default browser
- Clipboard and fullscreen are allowed; camera, microphone, location and USB are denied
- Installers for Windows, macOS and Linux

## Tech stack

TypeScript, Electron, Electron Forge, Node.js test runner, ESLint, Prettier.

## Getting started

Requires Node.js 22.18 or newer.

```bash
git clone https://github.com/ZachariahAyers/remix.ide.git
cd remix.ide
npm ci
npm start
```

## Development

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run check       # all of the above
npm run make        # installers for your OS in out/make/
```

How it is put together: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License

Apache License 2.0. See [LICENSE](LICENSE). This is an independent desktop wrapper around the [Remix Project](https://github.com/remix-project-org/remix-project) and is not affiliated with it.

---

Built by [Zachariah Ayers](https://ayers.repair).
