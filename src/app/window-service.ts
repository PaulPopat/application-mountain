import { BrowserWindow } from "electron";
import environment from "../util/environment";
import { autoUpdater } from "electron-updater";
import { add_coms } from "./coms-service";
import { messagingService } from "./server-messaging";

let windows: BrowserWindow[] = [];
export function create_window(
  width: number,
  height: number,
  ...params: string[]
) {
  const window = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      additionalArguments: params
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

  add_coms(messagingService(window));

  if (!environment.is_dev) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  return window;
}

export function areWindows() {
  return windows.length > 0;
}
