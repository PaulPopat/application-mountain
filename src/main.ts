import "@babel/polyfill";
import "./app/handlers/index";
import { app } from "electron";
import { areWindows, create_window } from "./app/window-service";

app.on("ready", () => {
  const window = create_window(1300, 920, "index.html");
  window.on("closed", () => {
    app.quit();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (!areWindows()) {
    const window = create_window(1300, 920, "index.html");
    window.on("closed", () => {
      app.quit();
    });
  }
});
