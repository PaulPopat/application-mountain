import { handle } from "../coms-service";
import {
  get_user_library,
  get_cached_steam_library,
  get_steam_library
} from "../providers/library-provider";
import {
  IsString,
  IsArray,
  IsObject,
  Optional,
  IsBoolean
} from "../../util/type";
import { set_steam_app_path, file } from "../fs";
import { shell, BrowserWindow } from "electron";
import { get_tag } from "../providers/tags-provider";
import { AppList, IsSizes } from "../../util/types";

const sizes_file = file("data", "window-sizes.json");

let apps: AppList = [];
async function get_apps_list(
  window: BrowserWindow,
  force: boolean | null | undefined
) {
  if (apps.length && !force) {
    return apps;
  }

  await set_steam_app_path(window);
  const lib = await get_user_library();
  let steamLibrary = force
    ? await get_steam_library()
    : await get_cached_steam_library();
  const userApps: number[] = [];
  for (const key in lib.UserLocalConfigStore.Software.valve.Steam.Apps) {
    if (
      lib.UserLocalConfigStore.Software.valve.Steam.Apps.hasOwnProperty(key)
    ) {
      userApps.push(parseInt(key));
    }
  }

  const result = steamLibrary.applist.apps
    .filter(a => userApps.find(u => a.appid === u))
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });

  apps = result;
  return result;
}

handle("/", async (options, window) => {
  if (
    !IsObject({
      tags: IsArray(IsString),
      filter: IsString,
      force: Optional(IsBoolean)
    })(options)
  ) {
    throw new Error("Invalid options format");
  }

  let result = await get_apps_list(window, options.force);

  for (const tagid of options.tags) {
    const tag = await get_tag(tagid);
    result = result.filter(a => tag.apps.find(t => t === a.appid) != null);
  }

  return result.filter(r =>
    r.name.toLowerCase().includes(options.filter.toLowerCase())
  );
});

handle("/store", async _ => {
  shell.openExternal("https://store.steampowered.com/");
});

handle("window/close", async (_, window, name) => {
  const bounds = window.getBounds();
  if (!(await sizes_file.exists())) {
    await sizes_file.write_json({});
  }

  const result = await sizes_file.read_json("utf-8");
  if (!IsSizes(result)) {
    throw new Error("Invalid window bounds");
  }

  result[name] = bounds;
  await sizes_file.write_json(result);
  window.close();
});

handle("window/minimise", async (_, window) => {
  window.minimize();
});
