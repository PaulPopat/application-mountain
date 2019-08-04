import { BrowserWindow, ipcMain, Event } from "electron";
import { warn } from "../util/logger";

type MessageHandler = (
  arg: unknown,
  window: BrowserWindow,
  name: string
) => Promise<unknown>;

function messagingService(window: BrowserWindow, name: string) {
  return {
    handle: (
      message: string,
      handler: (
        arg: unknown,
        window: BrowserWindow,
        name: string
      ) => Promise<unknown>
    ) => {
      ipcMain.on(message, async (e: Event, a: unknown) => {
        if (e.sender.id !== window.webContents.id) {
          return;
        }

        try {
          window.webContents.send(message, await handler(a, window, name));
        } catch (e) {
          warn(JSON.stringify(e));
        }
      });
    }
  };
}

const coms: ReturnType<typeof messagingService>[] = [];
const handlers: { [key: string]: MessageHandler } = {};

export function add_coms(window: BrowserWindow, name: string) {
  const service = messagingService(window, name);
  coms.push(service);
  for (const key in handlers) {
    if (!handlers.hasOwnProperty(key)) {
      continue;
    }

    service.handle(key, handlers[key]);
  }
}

export function handle(message: string, handler: MessageHandler) {
  if (handlers.hasOwnProperty(message)) {
    throw new Error("Duplicate handler");
  }

  handlers[message] = handler;

  for (const com of coms) {
    com.handle(message, handler);
  }
}
