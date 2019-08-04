import { directory, file } from "../fs";
import {
  IsGameInfo,
  AppList,
  IsUserLibrary,
  UserLibrary
} from "../../util/types";
import axios from "axios";
import { get_current_user } from "./prefered-user-provider";
import xml2js from "xml2js";
import { dialog, app } from "electron";

function parse_xml(xml: string) {
  return new Promise<unknown>((res, rej) => {
    xml2js.parseString(xml, (err, d) => {
      if (err) rej(err);
      res(d);
    });
  });
}

let cachedLibrary: UserLibrary;
export async function get_user_library(userid: string, force: boolean) {
  if (!force && cachedLibrary) {
    return cachedLibrary;
  }

  const response = await axios.get<string>(
    `https://steamcommunity.com/profiles/${userid}/games?xml=1`
  );

  const json = await parse_xml(response.data);
  if (!IsUserLibrary(json)) {
    throw new Error("Invalid user library");
  }

  if (json.gamesList.games[0].game.length < 1) {
    dialog.showErrorBox(
      "Error!",
      "Could not get a user library. Please make sure your library is available to the public."
    );
    app.quit();
  }

  cachedLibrary = json;
  return json;
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

let apps: AppList = [];
export async function get_apps_list(force: boolean | null | undefined) {
  if (apps.length && !force) {
    return apps;
  }

  const user = await get_current_user();
  const lib = await get_user_library(user, force || false);
  const result = lib.gamesList.games[0].game
    .map(g => ({
      appid: parseInt(g.appID[0]),
      name: g.name[0],
      logo: g.logo[0]
    }))
    .sort((a1, a2) => (a1.name > a2.name ? 1 : -1));

  apps = result;
  return result;
}
