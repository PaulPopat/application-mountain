import React, { SFC, useState } from "react";
import { GameInfo, IsGameInfo, IsTagsList, TagsList } from "../util/types";
import { query, send } from "./web-messaging";
import { Loading, Heading, Button, Field, Tags, Tag } from "./widgets/atoms";
import Scrollbars from "react-custom-scrollbars";
import { IsObject } from "../util/type";

export const AppDetails: SFC<{
  children?: null | never;
  installed: boolean;
  appid: number;
}> = p => {
  const [details, set_details] = useState<{ info: GameInfo; tags: TagsList }>({
    info: {},
    tags: []
  });
  const d = details.info[p.appid];

  if (!d || !d.data) {
    query("app-info", p.appid).then(d => {
      if (!IsObject({ info: IsGameInfo, tags: IsTagsList })(d)) {
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
              <Field>
                <p>{d.data.short_description}</p>
              </Field>
              {details.tags.length > 0 && (
                <>
                  <Heading level="5" spaced>
                    Tags
                  </Heading>
                  <Tags>
                    {details.tags.map(t => (
                      <Tag rounded>{t.name}</Tag>
                    ))}
                  </Tags>
                </>
              )}
              {d.data.categories.length > 0 && (
                <>
                  <Heading level="5" spaced>
                    Steam Categories
                  </Heading>
                  <Tags>
                    {d.data.categories.map(c => (
                      <Tag rounded>{c.description}</Tag>
                    ))}
                  </Tags>
                </>
              )}
              {d.data.genres.length > 0 && (
                <>
                  <Heading level="5" spaced>
                    Steam Genres
                  </Heading>
                  <Tags>
                    {d.data.genres.map(g => (
                      <Tag rounded>{g.description}</Tag>
                    ))}
                  </Tags>
                </>
              )}
            </>
          )}
        </Loading>
      </Scrollbars>
    </>
  );
};
