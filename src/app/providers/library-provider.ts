import { directory, is_directory, file } from "../fs";
import { IsSharedConfig, IsSteamLibrary } from "../../util/types";
import axios from "axios";

export async function get_user_library() {
  for await (const user of directory("steam", "userdata").children()) {
    if (!is_directory(user)) {
      throw new Error("userdata/{user} should be a directory");
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

  if (await libraryFile.exists()) {
    const result = await libraryFile.read_json("utf-8");
    if (IsSteamLibrary(result)) {
      return result;
    }
  }

  console.log("No cache, pulling from server");
  return await get_steam_library();
}
