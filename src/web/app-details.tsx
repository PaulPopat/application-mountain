import React, { SFC, useState } from "react";
import { GameInfo, IsGameInfo } from "../util/types";
import { query } from "./messaging";
import { Loading } from "./widgets/atoms";
import { Fade } from "./widgets/animations";
import Scrollbars from "react-custom-scrollbars";

export const AppDetails: SFC<{
  children?: null | never;
  installed: boolean;
  appid: number;
}> = p => {
  const [details, set_details] = useState<GameInfo>({});
  const d = details[p.appid];

  if (!d || !d.data) {
    query("app-info", p.appid).then(d => {
      if (!IsGameInfo(d)) {
        throw new Error("Invalid app info from server");
      }

      set_details(d);
    });
  }

  return (
    <>
      <Loading show={!d || !d.data} />
      <Fade show={d && d.data != null}>
        <Scrollbars style={{ width: "50vw", height: "80vh" }}>
          {d && d.data && <div>{d.data.name}</div>}
        </Scrollbars>
      </Fade>
    </>
  );
};
