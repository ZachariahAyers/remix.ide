# Remix IDE Desktop

An Electron shell that opens https://remix.ethereum.org in a sandboxed desktop window. It ships no IDE code of its own: its job is to keep Remix on its origin and everything else out.

## Commands

- `npm ci` installs. Node 22.18 or newer (CI uses 24).
- `npm run check` is the gate: format check, lint, typecheck, tests. Run it before every commit.
- `npm test` runs `node --test` on `test/**/*.test.ts` (Node strips the types; no test framework).
- `npm run build` compiles `src/` to `dist/` with `tsc -p tsconfig.build.json`.
- `npm run make` builds installers for the host OS into `out/make/`. CI runs it on Windows, macOS and Linux.
- `npm start` opens the app. It needs a desktop session; do not run it unattended.

## Map

- `src/main.ts`: the main process. Window, session handlers, single-instance lock.
- `src/policy.ts`: every allow/deny decision as pure functions. No Electron imports, so it is testable.
- `test/policy.test.ts`: the tests for `policy.ts`.
- `forge.config.ts`: packaging, makers and Electron fuses.
- `docs/ARCHITECTURE.md`: the security model and why each piece exists.

## Conventions

- ESM TypeScript run by Node's type stripping: relative imports end in `.ts`, no enums or namespaces (`erasableSyntaxOnly`).
- A new security decision goes in `policy.ts` with a test that fails without it; `main.ts` only wires it to Electron.
- Never weaken the window: `sandbox`, `contextIsolation`, no `nodeIntegration`, no preload, no `webSecurity: false`.
- Comments say what the code does and why, never its history.
- Conventional commits, lower-case subject after the type.

## Done means

`npm run check` passes, a behaviour change has a test, and `docs/ARCHITECTURE.md` still matches the code.
