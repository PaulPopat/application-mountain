import { exec, spawn } from "child_process";

export function start(command: string, ...args: string[]) {
  return new Promise<string>((res, rej) => {
    exec('"' + command + '" ' + args.join(" "), (err, stdout, stderr) => {
      if (err) rej(err);
      res(stdout);
    });
  });
}

export function start_detached(command: string, ...args: string[]) {
  spawn(command, args, { detached: true });
}
