import { handle } from "../coms-service";
import { get_apps_list } from "../providers/library-provider";
import {
  IsString,
  IsArray,
  IsObject,
  Optional,
  IsBoolean
} from "../../util/type";
import { file, set_steam_app_path } from "../fs";
import { shell } from "electron";
import { get_tag } from "../providers/tags-provider";
import { IsSizes } from "../../util/types";
import { store_url } from "../../util/steam";

const sizes_file = file("data", "window-sizes.json");

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

  await set_steam_app_path(window);
  let result = await get_apps_list(options.force);

  for (const tagid of options.tags) {
    const tag = await get_tag(tagid);
    result = result.filter(a => tag.apps.find(t => t === a.appid));
  }

  if (!options.tags.find(t => t === "hidden")) {
    const tag = await get_tag("hidden");
    result = result.filter(a => !tag.apps.find(t => t === a.appid));
  }

  return result.filter(r =>
    r.name.toLowerCase().includes(options.filter.toLowerCase())
  );
});

handle("/store", async _ => {
  shell.openExternal(store_url);
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
