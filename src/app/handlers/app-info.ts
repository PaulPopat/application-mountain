import { get_coms } from "../coms-provider";
import { get_app_info } from "../providers/library-provider";
import { IsNumber } from "../../util/type";
import { get_installed_apps } from "../providers/installation-provider";
import { get_tags_on_app } from "../providers/tags-provider";

(async () => {
  const coms = await get_coms();

  coms.handle("app-info", async appid => {
    if (!IsNumber(appid)) {
      throw new Error("Invalid app id");
    }

    return {
      info: await get_app_info(appid),
      tags: await get_tags_on_app(appid)
    };
  });

  coms.handle("installed-apps", async _ => {
    return await get_installed_apps();
  });
})();
