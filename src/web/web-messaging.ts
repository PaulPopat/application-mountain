const { ipcRenderer } = (window as any).require("electron");

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
