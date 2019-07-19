import { BrowserWindow, ipcMain, Event } from "electron";

export type MessageHandler = (
  arg: unknown,
  window: BrowserWindow
) => Promise<unknown>;

export function messagingService(window: BrowserWindow) {
  return {
    handle: (
      message: string,
      handler: (arg: unknown, window: BrowserWindow) => Promise<unknown>
    ) => {
      ipcMain.on(message, async (e: Event, a: unknown) => {
        if (e.sender.id !== window.webContents.id) {
          return;
        }

        try {
          window.webContents.send(message, await handler(a, window));
        } catch {}
      });
    }
  };
}
