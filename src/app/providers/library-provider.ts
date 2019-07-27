import { directory, is_directory, file, set_steam_app_path } from "../fs";
import {
  IsSharedConfig,
  IsSteamLibrary,
  IsGameInfo,
  IsLocalConfig,
  AppList
} from "../../util/types";
import axios from "axios";
import { info } from "../../util/logger";
import { get_current_user } from "./prefered-user-provider";
import { start, start_detached } from "../application-service";
import { wait } from "../../util/time";

export async function get_user_library(userid: number) {
  for await (const user of directory("steam_dir", "userdata").children()) {
    if (!is_directory(user)) {
      throw new Error("userdata/{user} should be a directory");
    }

    if (parseInt(user.name) !== userid) {
      continue;
    }

    const libraryFile = await user.find("7", "remote", "sharedconfig.vdf");
    const library = await libraryFile.read_vdf("utf-8");
    if (IsSharedConfig(library)) {
      return library;
    } else {
      throw new Error("Invalid user library");
    }
  }

  throw new Error("No library found");
}

export async function get_steam_library() {
  const response = await axios.get<unknown>(
    "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
  );

  if (response.status !== 200) {
    throw new Error("Error while getting the steam library");
  }

  const data = response.data;
  const libraryFile = file("data", "steam-library.json");
  await libraryFile.write_json(data);
  if (!IsSteamLibrary(data)) {
    throw new Error("Invalid response from Steam server");
  }

  return data;
}

export async function get_cached_steam_library() {
  const libraryFile = file("data", "steam-library.json");
  const now = new Date().getTime();
  // Steam cache is valid for a day
  if (
    (await libraryFile.exists()) &&
    now - (await libraryFile.modified_at()) < 8.64e7
  ) {
    const result = await libraryFile.read_json("utf-8");
    if (IsSteamLibrary(result)) {
      return result;
    }
  }

  info("No cache, pulling from server");
  return await get_steam_library();
}

export async function get_app_info(appid: number) {
  const infoDir = directory("data", "app-info");
  if (!(await infoDir.exists())) {
    await infoDir.create();
  }

  const appFile = await infoDir.try_find(appid.toString() + ".json");
  const now = new Date().getTime();
  // Game info is valid for a day
  if (appFile && now - (await appFile.modified_at()) < 8.64e7) {
    const data = await appFile.read_json("utf-8");
    if (!IsGameInfo(data)) {
      throw new Error("Invalid response from Steam server");
    }

    return data;
  }

  const response = await axios.get<unknown>(
    `http://store.steampowered.com/api/appdetails?appids=${appid}`
  );

  if (response.status !== 200) {
    throw new Error("Error while getting game info from steam");
  }

  const data = response.data;
  if (!IsGameInfo(data)) {
    throw new Error("Invalid response from Steam server");
  }

  await file("data", "app-info", appid.toString() + ".json").write_json(data);
  return data;
}

export async function get_local_config(userid: number) {
  for await (const user of directory("steam_dir", "userdata").children()) {
    if (!is_directory(user)) {
      throw new Error("userdata/{user} should be a directory");
    }

    if (parseInt(user.name) !== userid) {
      continue;
    }

    const configFile = await user.find("config", "localconfig.vdf");
    const config = await configFile.read_vdf("utf-8");
    if (IsLocalConfig(config)) {
      return config;
    } else {
      throw new Error("Invalid user local config file");
    }
  }

  throw new Error("No local config found");
}

export async function get_users() {
  const result: { username: string; userid: number }[] = [];
  for await (const user of directory("steam_dir", "userdata").children()) {
    if (!is_directory(user)) {
      throw new Error("userdata/{user} should be a directory");
    }

    const configFile = await user.find("config", "localconfig.vdf");
    const config = await configFile.read_vdf("utf-8");
    if (IsLocalConfig(config)) {
      result.push({
        userid: parseInt(user.name),
        username: config.UserLocalConfigStore.friends.PersonaName
      });
    } else {
      throw new Error("Invalid user local config file");
    }
  }

  return result;
}

let user = -1;
let apps: AppList = [];
export async function get_apps_list(force: boolean | null | undefined) {
  const cuser = await get_current_user();
  if (apps.length && !force && cuser === user) {
    return apps;
  }

  const runningApps = await start("tasklist");
  if (runningApps.includes("SteamService.exe")) {
    await start(file("steam").path, "-shutdown");
  }

  start_detached(file("steam").path, "-silent");
  while (!(await start("tasklist")).includes("SteamService.exe")) {
    await wait(4000);
  }

  user = cuser;
  const lib = await get_user_library(cuser);
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
