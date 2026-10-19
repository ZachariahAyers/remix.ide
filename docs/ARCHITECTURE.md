# Architecture

Remix IDE Desktop is a single Electron main process that opens one window on `https://remix.ethereum.org`. Remix itself is a remote web app; the shell adds no IDE code and exposes nothing to the page.

```
main process (src/main.ts)
 ├─ single-instance lock, Squirrel install hooks
 ├─ app.enableSandbox()              every renderer sandboxed
 ├─ web-contents-created → lockDown  navigation, popups, <webview>
 └─ session handlers                 permissions, response CSP
        │
        ▼  decisions from src/policy.ts (pure, unit-tested)
renderer: https://remix.ethereum.org  (sandboxed, isolated, no Node, no preload)
```

## Why Electron

Remix targets Chromium. Tauri renders with the platform webview, which on macOS and Linux is WebKit at whatever version the OS or distribution ships ([Tauri webview versions](https://v2.tauri.app/reference/webview-versions/)), so the same app would behave differently per machine. Electron ships one Chromium everywhere.

## Security model

Each item maps to the [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security).

| Control                                                                                                                                                            | Where                                 | Checklist item |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | -------------- |
| HTTPS only; the old build loaded `http://`                                                                                                                         | `REMIX_URL`                           | 1              |
| `sandbox`, `contextIsolation`, no `nodeIntegration`, no preload                                                                                                    | `createWindow`, `app.enableSandbox()` | 2, 3, 4, 20    |
| Permissions deny by default; Remix may use the clipboard and fullscreen                                                                                            | `isPermissionGranted`                 | 5              |
| A CSP is added to Remix responses                                                                                                                                  | `withContentSecurityPolicy`           | 7              |
| `<webview>` attachment refused                                                                                                                                     | `lockDown`                            | 12             |
| Main-frame navigation off the Remix origin is cancelled and sent to the system browser                                                                             | `lockDown`, `isRemixUrl`              | 13             |
| New windows are denied; HTTPS links open in the system browser, other schemes are dropped                                                                          | `externalUrl`                         | 14, 15         |
| Fuses: no `ELECTRON_RUN_AS_NODE`, no `NODE_OPTIONS`, no inspector flags, asar-only loading with integrity checks, encrypted cookies, no extra `file://` privileges | `forge.config.ts`                     | 19             |

Origins are compared with the WHATWG URL parser, never by string prefix, so `https://remix.ethereum.org.attacker.example` is rejected.

### Content security policy

Remix serves no CSP of its own, and its page loads scripts from third parties (payments, forms) that change with each deploy. A source allow-list written here would break Remix the next time it ships. The shell therefore adds a narrowing policy, `object-src 'none'; base-uri 'self'`, beside any policy Remix sends. Browsers enforce every policy on a response, so this can only remove capability, never grant it.

### What is not covered

- The web app's own code is Remix's responsibility. A compromised Remix deploy runs in the sandbox with no Node access, but it can still read what you type into it.
- Browser extensions such as MetaMask do not load in Electron. Use the Remix VM, a local node, or WalletConnect.

## Packaging

Electron Forge builds, per host OS:

| OS      | Output                           |
| ------- | -------------------------------- |
| Windows | Squirrel installer (`Setup.exe`) |
| macOS   | `.dmg` and `.zip`                |
| Linux   | `.deb` and `.zip`                |

Only `package.json`, `LICENSE`, `dist/`, `assets/` and production `node_modules/` go into the asar. Builds are unsigned; signing needs the platform certificates and is configured when they exist.
