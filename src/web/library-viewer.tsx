import React, { SFC, useState, Fragment } from "react";
import { AppList } from "../util/types";
import Scrollbars from "react-custom-scrollbars";
import { AppDetails } from "./app-details";
import { build_classes } from "../util/html_utils";

export const LibraryViewer: SFC<{
  library: AppList;
  installed: number[];
  children?: null | never;
}> = p => {
  const [open, set_open] = useState(-1);

  const toggleOpen = (id: number) => {
    set_open(o => {
      if (o === id) {
        return -1;
      }

      return id;
    });
  };

  return (
    <Scrollbars
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      className="library-view"
    >
      <div className="library-container">
        {Array.from(
          p.library.map(a => (
            <Fragment key={a.appid}>
              <span
                className={build_classes({
                  "game-thumbnail-container": true,
                  installed: p.installed.find(i => i === a.appid) != null
                })}
                onClick={_ => toggleOpen(a.appid)}
              >
                <span className="game-thumbnail">
                  <span className="image-container">
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${
                        a.appid
                      }/capsule_184x69.jpg`}
                      onError={e => (e.currentTarget.style.display = "none")}
                    />
                  </span>
                  <span className="game-name">{a.name}</span>
                </span>
              </span>
              {open === a.appid && (
                <AppDetails
                  installed={p.installed.find(i => i === a.appid) != null}
                  appid={a.appid}
                />
              )}
            </Fragment>
          ))
        )}
      </div>
    </Scrollbars>
  );
};
