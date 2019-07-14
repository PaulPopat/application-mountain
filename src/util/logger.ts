import environment from "./environment";

export function warn(message: string) {
  if (environment.is_dev) {
    debugger;
  }

  console.warn(message);
}

export function info(message: string) {
  console.log(message);
}
