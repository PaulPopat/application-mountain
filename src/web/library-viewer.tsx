import React, { SFC } from "react";
import { AppList } from "../util/types";

export const LibraryViewer: SFC<{
  library: AppList;
  children?: null | never;
}> = p => {
  return (
    <div className="library-view">
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
  );
};
