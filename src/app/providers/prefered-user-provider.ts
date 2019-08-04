import { file } from "../fs";
import nodeUrl from "url";
import openid from "openid";
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  session,
  dialog
} from "electron";
import { IsArray, IsString, IsObject } from "../../util/type";

const user_file = file("data", "configured_user.txt");

function steam_auth(windowParams: BrowserWindowConstructorOptions) {
  function authenticate() {
    var rely = new openid.RelyingParty(
      "http://localhost:3000/verify-steam",
      "http://localhost:3000/", // Realm (specifies realm for OpenID authentication)
      true, // Use stateless verification
      false, // Strict mode
      [] // List of extensions to enable and include
    );

    return new Promise<{
      response_nonce: string;
      assoc_handle: string;
      identity: string;
      steam_id: string;
      sig: string;
    }>((resolve, reject) => {
      rely.authenticate("http://steamcommunity.com/openid", false, function(
        error,
        providerUrl
      ) {
        const authWindow = new BrowserWindow(
          windowParams || { "use-content-size": true }
        );

        if (!providerUrl) {
          reject(new Error("Invalid provider url"));
          return;
        }

        authWindow.loadURL(providerUrl);
        authWindow.show();

        authWindow.on("closed", () => {
          reject(new Error("window was closed by user"));
        });

        function onCallback(url: string) {
          const cleanup = () => {
            authWindow.removeAllListeners("closed");
            setImmediate(function() {
              authWindow.close();
            });
          };

          var query = nodeUrl.parse(url, true).query;
          if (query["openid.identity"] === undefined) {
            reject(new Error("cannot authenticate through Steam"));
            authWindow.removeAllListeners("closed");
            setImmediate(function() {
              authWindow.close();
            });
          } else {
            const identity = query["openid.identity"];
            if (!identity || !IsString(identity)) {
              reject(new Error("Invalid identity"));
              cleanup();
              return;
            }

            const match = identity.match(/\/id\/(.*$)/);
            if (!match) {
              reject(new Error("Could not parse identity"));
              cleanup();
              return;
            }

            const result = {
              response_nonce: query["openid.response_nonce"],
              assoc_handle: query["openid.assoc_handle"],
              identity: identity,
              steam_id: match[1],
              sig: query["openid.sig"]
            };

            if (
              !IsObject({
                response_nonce: IsString,
                assoc_handle: IsString,
                identity: IsString,
                steam_id: IsString,
                sig: IsString
              })(result)
            ) {
              reject(new Error("Invalid response"));
              cleanup();
              return;
            }

            resolve(result);
            cleanup();
          }
        }

        authWindow.webContents.on("will-navigate", (event, url) => {
          onCallback(url);
        });

        if (!session || !session.defaultSession) {
          reject(new Error("Session does not exist"));
          return;
        }

        session.defaultSession.webRequest.onBeforeRedirect(details => {
          if (details.redirectURL.toLowerCase().indexOf("twitter") === -1) {
            onCallback(details.redirectURL);
          }
        });
      });
    });
  }

  return {
    authenticate: authenticate
  };
}

async function get_steam_id() {
  while (true) {
    try {
      const auth = steam_auth({
        alwaysOnTop: true,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false
        }
      });

      const result = await auth.authenticate();
      return result.steam_id;
    } catch {
      dialog.showErrorBox(
        "Error!",
        "Unable to get your steam ID. Please make sure you log in properly."
      );
    }
  }
}

export async function get_current_user() {
  if (!(await user_file.exists())) {
    const result = await get_steam_id();
    await set_current_user(result);
    return result;
  }

  return await user_file.read_text("utf-8");
}

export async function set_current_user(userid: string) {
  await user_file.write(userid);
}
