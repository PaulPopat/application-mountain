import fs from "fs";
import path from "path";
import { app } from "electron";

const locations = {
  data: app.getPath("appData"),
  downloads: app.getPath("downloads")
};

export function get_file(location: keyof typeof locations, ...parts: string[]) {
  const loc = path.join(locations[location], ...parts);
  return {
    save: (data: any) =>
      new Promise((res, rej) => {
        fs.writeFile(loc, data, err => {
          if (err) rej(err);
          res();
        });
      }),
    save_json: (data: any) =>
      new Promise((res, rej) => {
        fs.writeFile(loc, JSON.stringify(data), err => {
          if (err) rej(err);
          res();
        });
      }),
    read: () =>
      new Promise<Buffer>((res, rej) => {
        fs.readFile(loc, (err, data) => {
          if (err) rej(err);
          res(data);
        });
      }),
    read_text: () =>
      new Promise<string>((res, rej) => {
        fs.readFile(loc, "utf-8", (err, data) => {
          if (err) rej(err);
          res(data);
        });
      }),
    read_json: () =>
      new Promise<unknown>((res, rej) => {
        fs.readFile(loc, "utf-8", (err, data) => {
          if (err) rej(err);
          res(JSON.parse(data));
        });
      }),
    exists: () =>
      new Promise<boolean>(res => {
        fs.exists(loc, e => {
          res(e);
        });
      })
  };
}
