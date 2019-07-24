import "@babel/polyfill";
import "./app/handlers/index";
import { app } from "electron";
import { areWindows, create_window } from "./app/window-service";
import environment from "./util/environment";
import { autoUpdater } from "electron-updater";

app.on("ready", async () => {
  const window = await create_window(
    "main",
    { width: 1300, height: 920 },
    "index.html"
  );
  window.on("closed", async () => {
    app.quit();
  });
});

app.on("activate", async () => {
  if (!areWindows()) {
    const window = await create_window(
      "main",
      { width: 1300, height: 920 },
      "index.html"
    );

    window.on("closed", async () => {
      app.quit();
    });
  }

  if (!environment.is_dev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});
