import { get_coms } from "../coms-provider";
import {
  get_user_library,
  get_cached_steam_library,
  get_steam_library
} from "../providers/library-provider";
import { IsNumber } from "../../util/type";
import { spawn } from "child_process";
import { file } from "../fs";

(async () => {
  const coms = await get_coms();

  coms.handle("load-data", async tag => {
    const userLibrary = await get_user_library();
    let steamLibrary = await get_cached_steam_library();
    const userApps: number[] = [];
    for (const key in userLibrary.UserLocalConfigStore.Software.valve.Steam
      .Apps) {
      if (
        userLibrary.UserLocalConfigStore.Software.valve.Steam.Apps.hasOwnProperty(
          key
        )
      ) {
        userApps.push(parseInt(key));
      }
    }

    if (
      userApps.filter(a => !steamLibrary.applist.apps.find(v => v.appid === a))
        .length > 0
    ) {
      steamLibrary = await get_steam_library();
    }

    return steamLibrary.applist.apps
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
  });

  coms.handle("start-app", async appid => {
    if (!IsNumber(appid)) {
      return;
    }

    spawn(file("steam", "Steam.exe").path, ["-applaunch", appid.toString()], {
      detached: true
    });
  });
})();
