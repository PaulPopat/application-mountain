import { file, directory_raw, directory } from "../fs";
import path from "path";

const installDirectories: ReturnType<typeof directory_raw>[] = [];

async function get_install_dirs() {
  if (installDirectories.length > 0) {
    return installDirectories;
  }

  installDirectories.push(directory("steam_dir", "steamapps"));

  // The data in question is a numeric with extra parameters,
  // this currently cannot be represented by the type checkers.
  const data: any = await file(
    "steam_dir",
    "steamapps",
    "libraryfolders.vdf"
  ).read_vdf("utf-8");

  for (const key in data.LibraryFolders) {
    if (!parseInt(key)) {
      continue;
    }

    installDirectories.push(
      directory_raw(path.join(data.LibraryFolders[key], "steamapps"))
    );
  }

  return installDirectories;
}

export async function get_installed_apps() {
  const result: number[] = [];
  for (const dir of await get_install_dirs()) {
    for await (const f of dir.children()) {
      const name = f.name;
      if (name.startsWith("appmanifest_") && name.endsWith(".acf")) {
        result.push(
          parseInt(name.replace("appmanifest_", "").replace(".acf", ""))
        );
      }
    }
  }

  return result;
}
