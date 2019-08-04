import { BrowserWindow } from "electron";
import environment from "../util/environment";
import { add_coms } from "./coms-service";
import { file } from "./fs";
import { IsSizes } from "../util/types";

const sizes_file = file("data", "window-sizes.json");

let windows: BrowserWindow[] = [];
export async function create_window(
  name: string,
  dimensions: {
    width: number;
    height: number;
    maxWidth?: number | undefined;
    maxHeight?: number | undefined;
    minWidth?: number | undefined;
    minHeight?: number | undefined;
  },
  ...params: string[]
) {
  if (!(await sizes_file.exists())) {
    await sizes_file.write_json({});
  }

  const sizes = await sizes_file.read_json("utf-8");
  if (!IsSizes(sizes)) {
    throw new Error("Invalid window bounds");
  }

  const window = sizes[name]
    ? new BrowserWindow({
        width: sizes[name].width,
        height: sizes[name].height,
        x: sizes[name].x,
        y: sizes[name].y,
        minWidth: dimensions.minWidth,
        minHeight: dimensions.minHeight,
        maxWidth: dimensions.maxWidth,
        maxHeight: dimensions.maxHeight,
        webPreferences: {
          nodeIntegration: true,
          additionalArguments: params
        },
        frame: false
      })
    : new BrowserWindow({
        width: dimensions.width,
        height: dimensions.height,
        minWidth: dimensions.minWidth,
        minHeight: dimensions.minHeight,
        maxWidth: dimensions.maxWidth,
        maxHeight: dimensions.maxHeight,
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

  add_coms(window, name);
  return window;
}

export function areWindows() {
  return windows.length > 0;
}
