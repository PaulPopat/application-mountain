import React, { SFC, useState, Fragment } from "react";
import { AppList, IsAppList } from "../util/types";
import Scrollbars from "react-custom-scrollbars";
import { AppDetails } from "./app-details";
import { query } from "./messaging";
import { IsArray, IsNumber } from "../util/type";
import { Spinner } from "./widgets/icons";
import { Fade } from "./widgets/animations";

async function get_data() {
  const library = await query("load-data");
  if (!IsAppList(library)) {
    throw new Error("Invalid load data");
  }

  const installed = await query("installed-apps");
  if (!IsArray(IsNumber)(installed)) {
    throw new Error("Invalid installed apps data");
  }

  return { library, installed };
}

export const LibraryViewer: SFC<{
  children?: null | never;
}> = _ => {
  const [open, set_open] = useState(-1);
  const [{ library, installed }, set_data] = useState<{
    library: AppList;
    installed: number[];
  }>({ library: [], installed: [] });

  if (library.length === 0) {
    get_data().then(d => set_data(d));
  }

  const toggleOpen = (id: number) => {
    set_open(o => {
      if (o === id) {
        return -1;
      }

      return id;
    });
  };

  return (
    <div className="library-view fill">
      <Fade show={library.length === 0} fill overlay>
        <div className="loading-container fill">
          <Spinner
            fill="rgba(255, 255, 255, 0.8)"
            width="200px"
            height="200px"
          />
        </div>
      </Fade>
      <Fade show={library.length !== 0} fill overlay>
        <Scrollbars
          style={{ width: "100%", height: "100%", overflow: "hidden" }}
        >
          <div className="library-container fill">
            {Array.from(
              library.map(a => (
                <Fragment key={a.appid}>
                  <span
                    className="game-thumbnail-container"
                    onClick={_ => toggleOpen(a.appid)}
                  >
                    <span className="game-thumbnail">
                      <span className="image-container">
                        <img
                          src={`https://steamcdn-a.akamaihd.net/steam/apps/${
                            a.appid
                          }/capsule_184x69.jpg`}
                          onError={e =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </span>
                      <span className="game-name">{a.name}</span>
                      {installed.find(i => i === a.appid) != null && (
                        <div className="installed fill" />
                      )}
                    </span>
                  </span>
                  {open === a.appid && (
                    <AppDetails
                      installed={installed.find(i => i === a.appid) != null}
                      appid={a.appid}
                    />
                  )}
                </Fragment>
              ))
            )}
          </div>
        </Scrollbars>
      </Fade>
    </div>
  );
};
