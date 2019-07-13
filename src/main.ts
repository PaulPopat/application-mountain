import "@babel/polyfill";
import "./app/handlers/index";
import { app, BrowserWindow } from "electron";
import { messagingService } from "./app/messaging";
import { set_coms } from "./app/coms-provider";

function isDev() {
  return (
    process.mainModule && process.mainModule.filename.indexOf("app.asar") === -1
  );
}

let windows: BrowserWindow[] = [];
async function createWindow() {
  const window = new BrowserWindow({
    width: 1223,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  });
  window.setMenuBarVisibility(false);

  windows = [...windows, window];

  window.loadFile("../index.html");
  if (isDev()) {
    window.webContents.openDevTools();
  }

  window.on("closed", () => {
    windows = windows.filter(w => w === window);
  });

  set_coms(messagingService(window));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (windows.length === 0) {
    createWindow();
  }
});