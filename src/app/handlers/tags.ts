import { get_coms } from "../coms-provider";
import {
  get_tags,
  add_tag,
  add_apps,
  remove_app,
  remove_tag
} from "../providers/tags-provider";
import { IsString, IsArray, IsNumber, IsObject } from "../../util/type";

(async () => {
  const coms = await get_coms();
  coms.handle("load-tags", async _ => {
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

  coms.handle("add-tag", async name => {
    if (!IsString(name)) {
      throw new Error("Invalid tag name");
    }

    return await add_tag(name);
  });

  coms.handle("remove-tag", async id => {
    if (!IsString(id)) {
      throw new Error("Invalid tag name");
    }

    return await remove_tag(id);
  });

  coms.handle("add-app", async info => {
    if (!IsObject({ id: IsString, app: IsNumber })(info)) {
      throw new Error("Invalid data");
    }

    await add_apps(info.id, [info.app]);
  });

  coms.handle("remove-app", async info => {
    if (!IsObject({ id: IsString, app: IsNumber })(info)) {
      throw new Error("Invalid data");
    }

    await remove_app(info.id, info.app);
  });
})();
