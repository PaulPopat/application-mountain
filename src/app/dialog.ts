import { dialog as idialog, BrowserWindow, OpenDialogOptions } from "electron";

export async function dialog(
  window: BrowserWindow,
  options: OpenDialogOptions
) {
  return new Promise<string | undefined>((res, rej) => {
    idialog.showOpenDialog(window, options, p => {
      res(p && p[0]);
    });
  });
}
