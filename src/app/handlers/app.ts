import { handle } from "../coms-service";
import { IsNumber } from "../../util/type";
import { spawn } from "child_process";
import { file } from "../fs";
import { get_app_info } from "../providers/library-provider";
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

  return {
    info: await get_app_info(appid),
    tags: await get_tags_on_app(appid),
    allTags: await get_tags(),
    installed: installed
  };
});

handle("/apps/installed", async _ => {
  return await get_installed_apps();
});

handle("/app/open", async appid => {
  if (!IsNumber(appid)) {
    throw new Error("Invalid app id");
  }

  create_window(600, 900, `--appid=${appid}`);
});
