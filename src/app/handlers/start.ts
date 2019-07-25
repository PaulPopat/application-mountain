import { handle } from "../coms-service";
import { get_users, get_apps_list } from "../providers/library-provider";
import {
  IsString,
  IsArray,
  IsObject,
  Optional,
  IsBoolean,
  IsNumber
} from "../../util/type";
import { file } from "../fs";
import { shell } from "electron";
import { get_tag } from "../providers/tags-provider";
import { IsSizes } from "../../util/types";
import {
  get_current_user,
  set_current_user
} from "../providers/prefered-user-provider";
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

handle("/users", async _ => {
  return await get_users();
});

handle("/users/user", async userid => {
  if (!userid) {
    return await get_current_user();
  }

  if (!IsNumber(userid)) {
    throw new Error("Invalid user id");
  }

  await set_current_user(userid);
});
