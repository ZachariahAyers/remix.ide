// What the shell allows. Pure functions, so they run under node:test without Electron.

export const REMIX_URL = "https://remix.ethereum.org/";
const REMIX_ORIGIN = new URL(REMIX_URL).origin;

// Remix copies to and pastes from the clipboard and can go fullscreen. Everything else is denied.
const GRANTED_PERMISSIONS: ReadonlySet<string> = new Set(["clipboard-read", "clipboard-sanitized-write", "fullscreen"]);

// Remix serves no policy of its own and pulls scripts from third parties that change with each
// deploy, so a source allow-list would break it. These directives close what Remix never uses.
export const CONTENT_SECURITY_POLICY = "object-src 'none'; base-uri 'self'";

export function isRemixUrl(url: string): boolean {
  return URL.parse(url)?.origin === REMIX_ORIGIN;
}

// A link that leaves Remix opens in the system browser, and only over HTTPS.
export function externalUrl(url: string): string | null {
  const parsed = URL.parse(url);
  return parsed?.protocol === "https:" ? parsed.href : null;
}

export function isPermissionGranted(permission: string, requestingUrl: string): boolean {
  return GRANTED_PERMISSIONS.has(permission) && isRemixUrl(requestingUrl);
}

// A response may carry several policies; the browser enforces all of them, so ours only narrows.
export function withContentSecurityPolicy(headers: Record<string, string[]> = {}): Record<string, string[]> {
  const key = Object.keys(headers).find((name) => name.toLowerCase() === "content-security-policy");
  const name = key ?? "Content-Security-Policy";
  return { ...headers, [name]: [...(headers[name] ?? []), CONTENT_SECURITY_POLICY] };
}
