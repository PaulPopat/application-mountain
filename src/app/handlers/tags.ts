import { handle } from "../coms-service";
import {
  get_tags,
  add_tag,
  add_app,
  remove_app,
  remove_tag,
  rename_tag,
  export_tags,
  import_tags
} from "../providers/tags-provider";
import { IsString, IsNumber, IsObject } from "../../util/type";

handle("/tags", async _ => {
  const result = await get_tags();
  return result.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });
});

handle("/tags/add", async name => {
  if (!IsString(name)) {
    throw new Error("Invalid tag name");
  }

  return await add_tag(name);
});

handle("/tags/remove", async id => {
  if (!IsString(id)) {
    throw new Error("Invalid tag name");
  }

  return await remove_tag(id);
});

handle("/tags/tag/add", async info => {
  if (!IsObject({ id: IsString, app: IsNumber })(info)) {
    throw new Error("Invalid data");
  }

  await add_app(info.id, info.app);
});

handle("/tags/tag/rename", async info => {
  if (!IsObject({ id: IsString, name: IsString })(info)) {
    throw new Error("Invalid data");
  }

  await rename_tag(info.id, info.name);
});

handle("/tags/tag/remove", async info => {
  if (!IsObject({ id: IsString, app: IsNumber })(info)) {
    throw new Error("Invalid data");
  }

  await remove_app(info.id, info.app);
});

handle("/tags/export", async (_, window) => {
  await export_tags(window);
});

handle("/tags/import", async (_, window) => {
  await import_tags(window);
});
