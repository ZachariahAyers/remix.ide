# Changelog

## 2.0.0

Remix IDE, the Ethereum smart-contract IDE, in a sandboxed Electron desktop window for Windows, macOS and Linux.

- Electron 44 and Electron Forge 8.
- TypeScript, ES modules, strict compiler settings.
- Remix loads over HTTPS.
- Every renderer sandboxed with context isolation and no Node integration.
- Navigation held to the Remix origin; outside links open in the system browser over HTTPS only; new windows and `<webview>` refused.
- Permissions denied by default; Remix may use the clipboard and fullscreen.
- A content security policy added to Remix responses.
- Electron fuses set: no run-as-Node, no `NODE_OPTIONS`, no inspector flags, asar integrity, encrypted cookies.
- One instance at a time; a second launch focuses the open window.
- Installers for Windows (Squirrel), macOS (DMG, ZIP) and Linux (DEB, ZIP), with a Windows icon.
- Unit tests, ESLint, Prettier, a CI workflow that packages on all three platforms, and monthly Dependabot updates.
- README, CLAUDE.md and docs/ARCHITECTURE.md.
