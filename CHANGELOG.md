# Changelog

## 2.0.0

Rebuilt from the ground up. Same purpose: Remix IDE in its own desktop window.

- Electron 11 to Electron 44, Electron Forge 6 beta to Forge 8.
- JavaScript to TypeScript, ES modules, strict compiler settings.
- Remix loads over HTTPS. The old build loaded it over plain HTTP.
- Every renderer sandboxed with context isolation and no Node integration.
- Navigation held to the Remix origin; outside links open in the system browser over HTTPS only; new windows and `<webview>` refused.
- Permissions denied by default; Remix may use the clipboard and fullscreen.
- A content security policy added to Remix responses.
- Electron fuses set: no run-as-Node, no `NODE_OPTIONS`, no inspector flags, asar integrity, encrypted cookies.
- Fixed a crash on start on Windows and Linux: the old build called the macOS-only dock API unguarded.
- One instance at a time; a second launch focuses the open window.
- The build produces installers for Windows (Squirrel), macOS (DMG, ZIP) and Linux (DEB, ZIP), with a Windows icon added.
- Unit tests, ESLint, Prettier, a CI workflow that packages on all three platforms, and monthly Dependabot updates.
- Removed the IDE project files, the second lockfile and the stray `yarn` runtime dependency.
- README rewritten; CLAUDE.md and docs/ARCHITECTURE.md added.

## 1.0.0

The original wrapper: an Electron 11 window opening Remix, packaged with Electron Forge 6 beta.
