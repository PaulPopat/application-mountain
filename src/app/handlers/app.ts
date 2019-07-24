import { handle } from "../coms-service";
import { IsNumber } from "../../util/type";
import { spawn } from "child_process";
import { file } from "../fs";
import { get_app_info, get_local_config } from "../providers/library-provider";
import { get_installed_apps } from "../providers/installation-provider";
import { get_tags_on_app, get_tags } from "../providers/tags-provider";
import { create_window } from "../window-service";

handle("/app/start", async appid => {
  if (!IsNumber(appid)) {
    return;
  }

  spawn(file("steam").path, ["-applaunch", appid.toString()], {
    detached: true
  });
});

handle("/app/info", async appid => {
  if (!IsNumber(appid)) {
    throw new Error("Invalid app id");
  }

  let installed = false;
  for (const app of await get_installed_apps()) {
    installed = installed || app === appid;
  }

  const getLastPlayed = async () => {
    const config = await get_local_config();
    const apps = config.UserLocalConfigStore.Software.valve.Steam.Apps;
    for (const key in apps) {
      if (!apps.hasOwnProperty(key)) {
        continue;
      }

      const app = apps[key];
      if (parseInt(key) === appid) {
        return app.LastPlayed;
      }
    }

    return null;
  };

  return {
    info: await get_app_info(appid),
    tags: await get_tags_on_app(appid),
    allTags: await get_tags(),
    installed: installed,
    lastPlayed: await getLastPlayed()
  };
});

handle("/apps/installed", async _ => {
  return await get_installed_apps();
});

handle("/app/open", async appid => {
  if (!IsNumber(appid)) {
    throw new Error("Invalid app id");
  }

  create_window(
    "app-details",
    { width: 600, height: 900, maxWidth: 600 },
    `--appid=${appid}`
  );
});
