import React, { SFC, Fragment } from "react";
import { AppList } from "../util/types";
import Scrollbars from "react-custom-scrollbars";
import { thumbnail_url } from "../util/steam";

const LibraryItem: SFC<{
  appid: number;
  name: string;
  selected: boolean;
  onSelect: (appid: number) => void;
}> = p => {
  return (
    <Fragment>
      <span
        className="game-thumbnail-container"
        onClick={_ => p.onSelect(p.appid)}
      >
        <span className="game-thumbnail">
          <span className="image-container">
            <img
              src={thumbnail_url(p.appid)}
              onError={e => (e.currentTarget.style.display = "none")}
            />
          </span>
          <span className="game-name">{p.name}</span>
          {p.selected && <div className="installed fill" />}
        </span>
      </span>
    </Fragment>
  );
};

export const LibraryViewer: SFC<{
  onSelect: (appid: number) => void;
  library: AppList;
  selected: number[];
  children?: null | never;
}> = p => {
  return (
    <Scrollbars style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <div className="library-container fill">
        {Array.from(
          p.library.map(a => (
            <LibraryItem
              key={a.appid}
              appid={a.appid}
              name={a.name}
              selected={p.selected.find(i => i === a.appid) != null}
              onSelect={p.onSelect}
            />
          ))
        )}
      </div>
    </Scrollbars>
  );
};
