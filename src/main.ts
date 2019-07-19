import "@babel/polyfill";
import "./app/handlers/index";
import { app } from "electron";
import { areWindows, createWindow } from "./app/window-service";

app.on("ready", () => createWindow(1300, 920, "index.html"));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (!areWindows()) {
    createWindow(1300, 920, "index.html");
  }
});
