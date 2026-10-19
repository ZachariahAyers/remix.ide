# Remix IDE Desktop

[ayers.repair](https://ayers.repair) · [GitHub](https://github.com/ZachariahAyers)

[Remix IDE](https://remix.ethereum.org), the Ethereum smart-contract IDE, in its own desktop window, locked to Remix and nothing else.

## Why

Remix in a browser tab shares that browser with everything else you have open. This app gives it a dedicated, sandboxed window: the page cannot reach Node or the file system, it cannot navigate away from Remix, links that leave Remix open in your normal browser, and it gets the clipboard and fullscreen, never the camera, microphone, location or USB.

## Stack

- [Electron](https://www.electronjs.org) 44, with the [security checklist](https://www.electronjs.org/docs/latest/tutorial/security) applied and the hardening fuses set
- TypeScript, compiled with `tsc`, ES modules
- [Electron Forge](https://www.electronforge.io) for Windows, macOS and Linux installers
- `node:test`, ESLint with typescript-eslint, Prettier
- GitHub Actions: lint, typecheck, test, then package on all three platforms

## Run

Requires Node.js 22.18 or newer.

```bash
git clone https://github.com/ZachariahAyers/remix.ide.git
cd remix.ide
npm ci
npm start
```

## Build

```bash
npm run make
```

Installers for your OS land in `out/make/`: a Squirrel `Setup.exe` on Windows, a `.dmg` and `.zip` on macOS, a `.deb` and `.zip` on Linux. Every CI run builds all three and attaches them to the run. Builds are unsigned.

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run check`   | Format check, lint, typecheck and tests             |
| `npm test`        | Unit tests for the navigation and permission policy |
| `npm run build`   | Compile `src/` to `dist/`                           |
| `npm run package` | Package the app without making installers           |

## Structure

```
src/main.ts           main process: window, session handlers, single instance
src/policy.ts         every allow/deny decision, as pure functions
test/policy.test.ts   tests for policy.ts
forge.config.ts       packaging, makers, Electron fuses
assets/               app icons (.icns, .ico, .png)
docs/ARCHITECTURE.md  the security model in detail
```

## Notes

- Browser extensions such as MetaMask do not run in Electron. Deploy with the Remix VM, a local node, or WalletConnect.
- Remix loads from the network on every start, so you always get the current release and need a connection.

## Credits and license

Remix IDE is built by the [Remix Project](https://github.com/remix-project-org/remix-project) under the Apache License 2.0. This is an independent desktop shell and is not affiliated with or endorsed by the Remix Project or the Ethereum Foundation. It bundles no Remix code.

This shell is licensed under the [Apache License 2.0](LICENSE). Copyright Ayers Electronics Inc.

Built by Zachariah Ayers.
