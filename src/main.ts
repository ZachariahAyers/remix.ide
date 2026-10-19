import path from "node:path";
import { BrowserWindow, app, session, shell, type WebContents } from "electron";
import squirrelStartup from "electron-squirrel-startup";
import { REMIX_URL, externalUrl, isPermissionGranted, isRemixUrl, withContentSecurityPolicy } from "./policy.ts";

function openExternally(url: string): void {
  const target = externalUrl(url);
  if (target) void shell.openExternal(target);
}

// Every web contents, including any Remix might spawn, stays on Remix or hands the link to the OS.
function lockDown(contents: WebContents): void {
  contents.on("will-attach-webview", (event) => {
    event.preventDefault();
  });
  contents.on("will-navigate", (event) => {
    if (isRemixUrl(event.url)) return;
    event.preventDefault();
    openExternally(event.url);
  });
  contents.setWindowOpenHandler(({ url }) => {
    openExternally(url);
    return { action: "deny" };
  });
}

function configureSession(): void {
  const ses = session.defaultSession;
  ses.setPermissionRequestHandler((_contents, permission, callback, details) => {
    callback(isPermissionGranted(permission, details.requestingUrl));
  });
  ses.setPermissionCheckHandler((_contents, permission, requestingOrigin) =>
    isPermissionGranted(permission, requestingOrigin),
  );
  ses.webRequest.onHeadersReceived({ urls: [`${REMIX_URL}*`] }, (details, callback) => {
    callback({ responseHeaders: withContentSecurityPolicy(details.responseHeaders) });
  });
}

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    title: app.getName(),
    // macOS and Windows take the icon from the bundle; Linux needs it on the window.
    ...(process.platform === "linux" && { icon: path.join(app.getAppPath(), "assets", "icon.png") }),
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  void window.loadURL(REMIX_URL);
}

function focusWindow(): void {
  const [window] = BrowserWindow.getAllWindows();
  if (!window) return;
  if (window.isMinimized()) window.restore();
  window.focus();
}

// Squirrel runs the app during install and uninstall; a second launch focuses the first.
if (squirrelStartup || !app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.enableSandbox();
  app.on("web-contents-created", (_event, contents) => {
    lockDown(contents);
  });
  app.on("second-instance", focusWindow);
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  await app.whenReady();
  configureSession();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}
