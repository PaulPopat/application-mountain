import fs from "fs";
import path from "path";
import { app } from "electron";
import * as VDF from "@node-steam/vdf";
import { promisify } from "util";

type Encoding =
  | "ascii"
  | "base64"
  | "binary"
  | "hex"
  | "utf-16le"
  | "utf-8"
  | "latin1";

const locations = {
  data: path.join(app.getPath("appData"), "steam-library-manager"),
  downloads: app.getPath("downloads"),
  steam: path.join("C:", "Program Files (x86)", "Steam")
};

export function file(location: keyof typeof locations, ...parts: string[]) {
  const loc = path.join(locations[location], ...parts);
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
      console.log(loc);
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
    path: loc,
    name: parts[parts.length - 1],
    /** Can be used for type checking when getting children of a directory */
    isFileType: true
  };
}

export function directory(
  location: keyof typeof locations,
  ...parts: string[]
) {
  const loc = path.join(locations[location], ...parts);
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
          yield directory(location, ...parts, f);
        } else {
          yield file(location, ...parts, f);
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
          yield* await directory(location, ...parts, f).children_recursive();
        } else {
          yield file(location, ...parts, f);
        }
      }
    },
    async find(...p: string[]) {
      const result = file(location, ...parts, ...p);
      if (!(await result.exists())) {
        throw new Error(result.path + " is not a file");
      }

      return result;
    },
    path: loc,
    name: parts[parts.length - 1],
    /** Can be used for type checking when getting children of a directory */
    isDirectoryType: true
  };
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
