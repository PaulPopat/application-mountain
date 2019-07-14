import { BrowserWindow, ipcMain, Event, dialog } from "electron";

export type MessagingService = {
  handle(message: string, handler: (arg: unknown) => Promise<unknown>): void;
  wait(message: string): Promise<unknown>;
  query(message: string, arg?: any): Promise<unknown>;
  send(message: string, arg?: any): void;
  readonly window: BrowserWindow;
};

export function messagingService(window: BrowserWindow): MessagingService {
  return {
    handle: (message: string, handler: (arg: unknown) => Promise<unknown>) => {
      ipcMain.on(message, async (e: Event, a: unknown) => {
        try {
          window.webContents.send(message, await handler(a));
        } catch {}
      });
    },
    wait: (message: string) => {
      return new Promise<unknown>((res, rej) => {
        ipcMain.once(message, (e: Event, a: unknown) => {
          res(a);
        });
      });
    },
    query: (message: string, arg?: any) => {
      window.webContents.send(message, arg);
      return new Promise<unknown>((res, rej) => {
        ipcMain.once(message, (e: Event, a: unknown) => {
          res(a);
        });
      });
    },
    send: (message: string, arg?: any) => {
      window.webContents.send(message, arg);
    },
    get window() {
      return window;
    }
  };
}
