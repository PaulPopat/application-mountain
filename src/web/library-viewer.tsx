import React, { SFC, useState, Fragment } from "react";
import { AppList, IsAppList } from "../util/types";
import Scrollbars from "react-custom-scrollbars";
import { query } from "./messaging";
import { IsArray, IsNumber } from "../util/type";
import { Fade } from "./widgets/animations";
import { Modal } from "./widgets/modal";
import { AppDetails } from "./app-details";
import { Loading } from "./widgets/atoms";
import { thumbnail_url } from "../util/steam";

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

const LibraryItem: SFC<{
  appid: number;
  name: string;
  installed: boolean;
}> = p => {
  const [open, set_open] = useState(false);

  return (
    <Fragment>
      <span
        className="game-thumbnail-container"
        onClick={_ => set_open(o => !o)}
      >
        <span className="game-thumbnail">
          <span className="image-container">
            <img
              src={thumbnail_url(p.appid)}
              onError={e => (e.currentTarget.style.display = "none")}
            />
          </span>
          <span className="game-name">{p.name}</span>
          {p.installed && <div className="installed fill" />}
        </span>
      </span>
      <Modal show={open} onHide={() => set_open(false)}>
        {open && <AppDetails appid={p.appid} installed={p.installed} />}
      </Modal>
    </Fragment>
  );
};

export const LibraryViewer: SFC<{
  children?: null | never;
}> = _ => {
  const [{ library, installed }, set_data] = useState<{
    library: AppList;
    installed: number[];
  }>({ library: [], installed: [] });
  if (library.length === 0) {
    get_data().then(d => set_data(d));
  }

  return (
    <div className="library-view fill">
      <Loading show={library.length === 0} />
      <Fade show={library.length !== 0} fill overlay>
        <Scrollbars
          style={{ width: "100%", height: "100%", overflow: "hidden" }}
        >
          <div className="library-container fill">
            {Array.from(
              library.map(a => (
                <LibraryItem
                  key={a.appid}
                  appid={a.appid}
                  name={a.name}
                  installed={installed.find(i => i === a.appid) != null}
                />
              ))
            )}
          </div>
        </Scrollbars>
      </Fade>
    </div>
  );
};
