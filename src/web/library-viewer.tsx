import React, { SFC, Fragment } from "react";
import { AppList } from "../util/types";
import Scrollbars from "react-custom-scrollbars";
import { Check } from "./widgets/icons";

const LibraryItem: SFC<{
  appid: number;
  name: string;
  logo: string;
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
              src={p.logo}
              onError={e => (e.currentTarget.style.display = "none")}
            />
          </span>
          <span className="game-name">{p.name}</span>
          {p.selected && (
            <div className="selected">
              <Check fill="#fff" width="18px" height="18px" />
            </div>
          )}
          <span className="overlay" />
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
    <div className="fill" style={{ width: "100%" }}>
      <Scrollbars
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
      >
        <div style={{ paddingLeft: "20px" }}>
          {Array.from(
            p.library.map(a => (
              <LibraryItem
                key={a.appid}
                appid={a.appid}
                name={a.name}
                logo={a.logo}
                selected={p.selected.find(i => i === a.appid) != null}
                onSelect={p.onSelect}
              />
            ))
          )}
        </div>
      </Scrollbars>
    </div>
  );
};
