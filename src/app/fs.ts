import fs from "fs";
import path from "path";
import { app, dialog, BrowserWindow } from "electron";
import * as VDF from "@node-steam/vdf";
import { promisify } from "util";
import environment from "../util/environment";

type Encoding =
  | "ascii"
  | "base64"
  | "binary"
  | "hex"
  | "utf-16le"
  | "utf-8"
  | "latin1";

const dirname = environment.is_dev
  ? "application-mountain"
  : "Application Mountain";

const steamAppPathPath = path.join(
  app.getPath("appData"),
  dirname,
  "steam-path.txt"
);
let steamAppPath =
  fs.existsSync(steamAppPathPath) && fs.readFileSync(steamAppPathPath, "utf-8");

export async function set_steam_app_path(window: BrowserWindow) {
  if (!steamAppPath) {
    const loc = await new Promise<string>((res, rej) => {
      dialog.showOpenDialog(
        window,
        {
          properties: ["openFile"],
          title: "Please locate your steam executable"
        },
        p => {
          if (!p || p.length > 1 || p.length === 0) {
            rej(new Error("Invalid file selection"));
            return;
          }

          res(p[0]);
        }
      );
    });

    await promisify(fs.writeFile)(steamAppPathPath, loc);
    steamAppPath = loc;
  }
}

const locations = {
  data: path.join(app.getPath("appData"), dirname),
  downloads: app.getPath("downloads"),
  steam: steamAppPath || "",
  get steam_dir() {
    return path.dirname(steamAppPath || "");
  }
};

export function file_raw(loc: string) {
  return {
    write(data: any) {
      return new Promise((res, rej) => {
        fs.writeFile(loc, data, err => {
          if (err) rej(err);
          res();
        });
      });
    },
    write_json(data: any) {
      return new Promise((res, rej) => {
        fs.writeFile(loc, JSON.stringify(data), err => {
          if (err) rej(err);
          res();
        });
      });
    },
    write_vdf(data: any) {
      return new Promise((res, rej) => {
        fs.writeFile(loc, VDF.stringify(data), err => {
          if (err) rej(err);
          res();
        });
      });
    },
    read() {
      return new Promise<Buffer>((res, rej) => {
        fs.readFile(loc, (err, data) => {
          if (err) rej(err);
          res(data);
        });
      });
    },
    read_text(encoding: Encoding) {
      return new Promise<string>((res, rej) => {
        fs.readFile(loc, encoding, (err, data) => {
          if (err) rej(err);
          res(data);
        });
      });
    },
    read_json(encoding: Encoding) {
      return new Promise<unknown>((res, rej) => {
        fs.readFile(loc, encoding, (err, data) => {
          if (err) rej(err);
          res(JSON.parse(data));
        });
      });
    },
    read_vdf(encoding: Encoding) {
      return new Promise<unknown>((res, rej) => {
        fs.readFile(loc, encoding, (err, data) => {
          if (err) rej(err);
          res(VDF.parse(data));
        });
      });
    },
    exists() {
      return new Promise<boolean>((res, rej) => {
        fs.exists(loc, e => {
          if (e) {
            fs.stat(loc, (err, stats) => {
              if (err) rej(err);
              res(stats.isFile());
            });

            return;
          }

          res(false);
        });
      });
    },
    modified_at() {
      return new Promise<number>((res, rej) => {
        fs.stat(loc, (err, stats) => {
          if (err) rej(err);

          res(stats.mtimeMs);
        });
      });
    },
    path: loc,
    name: path.basename(loc),
    /** Can be used for type checking when getting children of a directory */
    isFileType: true
  };
}

export function file(location: keyof typeof locations, ...parts: string[]) {
  const loc = path.join(locations[location], ...parts);
  return file_raw(loc);
}

export function directory_raw(loc: string) {
  return {
    exists() {
      return new Promise<boolean>((res, rej) => {
        fs.exists(loc, e => {
          if (e) {
            fs.stat(loc, (err, stats) => {
              if (err) rej(err);
              res(stats.isDirectory());
            });

            return;
          }

          res(false);
        });
      });
    },
    async *children() {
      const files = await promisify(fs.readdir)(loc);
      for (const f of files) {
        const l = path.join(loc, f);
        if ((await promisify(fs.stat)(l)).isDirectory()) {
          yield directory_raw(path.join(loc, f));
        } else {
          yield file_raw(path.join(loc, f));
        }
      }
    },
    async *children_recursive(): AsyncIterableIterator<
      ReturnType<typeof file>
    > {
      const files = await promisify(fs.readdir)(loc);
      for (const f of files) {
        const l = path.join(loc, f);
        if ((await promisify(fs.stat)(l)).isDirectory()) {
          yield* await directory_raw(path.join(loc, f)).children_recursive();
        } else {
          yield file_raw(path.join(loc, f));
        }
      }
    },
    create() {
      return new Promise((res, rej) => {
        fs.mkdir(loc, err => {
          if (err) rej(err);
          res();
        });
      });
    },
    async find(...p: string[]) {
      const result = file_raw(path.join(loc, ...p));
      if (!(await result.exists())) {
        throw new Error(result.path + " is not a file");
      }

      return result;
    },
    async try_find(...p: string[]) {
      const result = file_raw(path.join(loc, ...p));
      if (!(await result.exists())) {
        return null;
      }

      return result;
    },
    path: loc,
    name: path.basename(loc),
    /** Can be used for type checking when getting children of a directory */
    isDirectoryType: true
  };
}

export function directory(
  location: keyof typeof locations,
  ...parts: string[]
) {
  const loc = path.join(locations[location], ...parts);
  return directory_raw(loc);
}

export function is_file(
  subject: ReturnType<typeof file> | ReturnType<typeof directory>
): subject is ReturnType<typeof file> {
  return (subject as ReturnType<typeof file>).isFileType;
}

export function is_directory(
  subject: ReturnType<typeof file> | ReturnType<typeof directory>
): subject is ReturnType<typeof directory> {
  return (subject as ReturnType<typeof directory>).isDirectoryType;
}
