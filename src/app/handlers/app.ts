import { handle } from "../coms-service";
import { IsNumber } from "../../util/type";
import { file } from "../fs";
import { get_app_info, get_user_library } from "../providers/library-provider";
import { get_installed_apps } from "../providers/installation-provider";
import { get_tags_on_app, get_tags } from "../providers/tags-provider";
import { create_window } from "../window-service";
import { start_detached } from "../application-service";
import { get_current_user } from "../providers/prefered-user-provider";

handle("/app/start", async appid => {
  if (!IsNumber(appid)) {
    return;
  }

  start_detached(file("steam").path, "-applaunch", appid.toString());
});

handle("/app/info", async appid => {
  if (!IsNumber(appid)) {
    throw new Error("Invalid app id");
  }

  let installed = false;
  for (const app of await get_installed_apps()) {
    installed = installed || app === appid;
  }

  const getHoursPlayed = async () => {
    const library = await get_user_library(await get_current_user(), false);
    const game = library.gamesList.games[0].game.find(
      g => parseInt(g.appID[0]) === appid
    );
    if (!game) {
      return null;
    }

    return game.hoursOnRecord && game.hoursOnRecord[0];
  };

  return {
    info: await get_app_info(appid),
    tags: await get_tags_on_app(appid),
    allTags: await get_tags(),
    installed: installed,
    hoursPlayed: await getHoursPlayed()
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
    { width: 600, height: 900, maxWidth: 600, minWidth: 600 },
    `--appid=${appid}`
  );
});
