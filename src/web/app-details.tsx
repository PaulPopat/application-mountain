import React, { SFC, useState } from "react";
import { GameInfo, IsGameInfo } from "../util/types";
import { query, send } from "./messaging";
import { Loading, Heading, Button, Field } from "./widgets/atoms";
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
      <Scrollbars style={{ width: "600px", height: "40vh" }}>
        <Loading loading={!d || !d.data} fill="#444">
          {d && d.data && (
            <>
              <Heading level="1">{d.data.name}</Heading>
              <Field>
                <Button
                  onClick={() => send("start-app", p.appid)}
                  type="primary"
                  rounded
                >
                  {p.installed ? "Play Game" : "Install"}
                </Button>
              </Field>
              <p>{d.data.short_description}</p>
            </>
          )}
        </Loading>
      </Scrollbars>
    </>
  );
};
