import React, { SFC } from "react";
import { AppList } from "../util/types";
import Scrollbars from "react-custom-scrollbars";

export const LibraryViewer: SFC<{
  library: AppList;
  children?: null | never;
}> = p => {
  return (
    <Scrollbars
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      className="library-view"
    >
      <div className="library-container">
        {Array.from(
          p.library.map(a => (
            <span className="game-thumbnail-container" key={a.appid}>
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
          ))
        )}
      </div>
    </Scrollbars>
  );
};
