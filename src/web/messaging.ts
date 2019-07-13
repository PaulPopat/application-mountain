const { ipcRenderer } = (window as any).require("electron");

export function handle(
  message: string,
  handler: (arg: unknown) => Promise<unknown>
) {
  ipcRenderer.on(message, async (e: Event, a: unknown) => {
    ipcRenderer.send(message, await handler(a));
  });
}

export function wait(message: string) {
  return new Promise<unknown>((res, rej) => {
    ipcRenderer.once(message, (e: Event, a: unknown) => {
      res(a);
    });
  });
}

export function query(message: string, arg?: any) {
  ipcRenderer.send(message, arg);
  return new Promise<unknown>((res, rej) => {
    ipcRenderer.once(message, (e: Event, a: unknown) => {
      res(a);
    });
  });
}

export function send(message: string, arg?: any) {
  ipcRenderer.send(message, arg);
}
