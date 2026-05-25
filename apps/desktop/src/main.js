import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const devUrl = process.env.SPARK_WEB_URL ?? "http://127.0.0.1:5173";
const allowedDevOrigin = new URL(devUrl).origin;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 360,
    minHeight: 640,
    backgroundColor: "#fffaf7",
    title: "Spark",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.resolve(__dirname, "preload.cjs")
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (!isAllowedAppUrl(url)) {
      event.preventDefault();
      if (isSafeExternalUrl(url)) shell.openExternal(url);
    }
  });

  if (app.isPackaged) {
    win.loadFile(path.resolve(__dirname, "../../web/dist/index.html"));
  } else {
    win.loadURL(devUrl);
  }
}

app.whenReady().then(createWindow);

app.on("web-contents-created", (_event, contents) => {
  contents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

function isSafeExternalUrl(url) {
  return ["https:", "mailto:"].includes(new URL(url).protocol);
}

function isAllowedAppUrl(url) {
  const parsedUrl = new URL(url);
  if (app.isPackaged) return parsedUrl.protocol === "file:";
  return parsedUrl.origin === allowedDevOrigin;
}
