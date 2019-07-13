import React, { SFC, useState } from "react";
import { GameInfo, IsGameInfo } from "../util/types";
import { query } from "./messaging";
import { Spinner } from "./widgets/icons";

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

    return <Spinner fill="#666" width="100px" height="100px" />;
  }

  return <div>{d.data.name}</div>;
};
