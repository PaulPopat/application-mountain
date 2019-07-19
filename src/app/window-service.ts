import { BrowserWindow } from "electron";
import environment from "../util/environment";
import { autoUpdater } from "electron-updater";
import { add_coms } from "./coms-service";
import { messagingService } from "./server-messaging";
import path from "path";

let windows: BrowserWindow[] = [];
export async function createWindow(
  width: number,
  height: number,
  htmlPath: string
) {
  const window = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  window.setMenuBarVisibility(false);

  windows = [...windows, window];

  if (environment.is_dev) {
    window.loadFile(path.join("..", htmlPath));
    window.webContents.openDevTools();
  } else {
    window.loadFile(htmlPath);
  }

  window.on("closed", () => {
    windows = windows.filter(w => w === window);
  });

  add_coms(messagingService(window));

  if (!environment.is_dev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

export function areWindows() {
  return windows.length > 0;
}
