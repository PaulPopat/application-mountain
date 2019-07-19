import "@babel/polyfill";
import "./app/handlers/index";
import { autoUpdater } from "electron-updater";
import { app, BrowserWindow } from "electron";
import { messagingService } from "./app/server-messaging";
import { set_coms } from "./app/coms-provider";
import environment from "./util/environment";

let windows: BrowserWindow[] = [];
async function createWindow() {
  const window = new BrowserWindow({
    width: 1300,
    height: 920,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  window.setMenuBarVisibility(false);

  windows = [...windows, window];

  if (environment.is_dev) {
    window.loadFile("../index.html");
    window.webContents.openDevTools();
  } else {
    window.loadFile("index.html");
  }

  window.on("closed", () => {
    windows = windows.filter(w => w === window);
  });

  set_coms(messagingService(window));

  autoUpdater.checkForUpdatesAndNotify();
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
