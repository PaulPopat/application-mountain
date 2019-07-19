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
  "all-tags": TagsList;
}> = p => {
  const [details, set_details] = useState<{ info: GameInfo; tags: TagsList }>({
    info: {},
    tags: []
  });
  const [editing, set_editing] = useState(false);
  const d = details.info[p.appid];
  const refresh = async () => {
    const de = await query("/app/info", p.appid);
    if (!IsObject({ info: IsGameInfo, tags: IsTagsList })(de)) {
      throw new Error("Invalid app info from server");
    }

    set_details(de);
  };

  if (!d || !d.data) {
    refresh();
  }

  return (
    <>
      <Scrollbars style={{ width: "600px", height: "60vh" }}>
        <Loading loading={!d || !d.data} fill="#444">
          {d && d.data && (
            <>
              <Heading level="1">{d.data.name}</Heading>
              <Field>
                <Button
                  onClick={() => send("/app/start", p.appid)}
                  type="primary"
                  rounded
                >
                  {p.installed ? "Play Game" : "Install"}
                </Button>
              </Field>
              <Field>
                <p
                  dangerouslySetInnerHTML={{ __html: d.data.short_description }}
                />
              </Field>
              {details.tags.length > 0 && (
                <>
                  <Heading level="5" spaced>
                    Tags
                  </Heading>
                  <Tags>
                    {details.tags.map(t =>
                      editing ? (
                        <Tags key={t.id} has-addons>
                          <Tag rounded>{t.name}</Tag>
                          <Tag
                            onClick={async () => {
                              await query("/tags/tag/remove", {
                                id: t.id,
                                app: p.appid
                              });
                              refresh();
                            }}
                            rounded
                            is-delete
                          />
                        </Tags>
                      ) : (
                        <Tag key={t.id} rounded>
                          {t.name}
                        </Tag>
                      )
                    )}
                  </Tags>
                </>
              )}
              {editing && (
                <Field>
                  <Tags>
                    {p["all-tags"]
                      .filter(t => !details.tags.find(t1 => t.id === t1.id))
                      .map(t => (
                        <Tag
                          key={t.id}
                          colour="link"
                          onClick={async () => {
                            await query("/tags/tag/add", {
                              id: t.id,
                              app: p.appid
                            });
                            refresh();
                          }}
                        >
                          {t.name}
                        </Tag>
                      ))}
                  </Tags>
                </Field>
              )}
              <Field>
                <Button
                  onClick={() => set_editing(!editing)}
                  type="info"
                  size="small"
                >
                  {editing ? "Stop Editing" : "Edit Tags"}
                </Button>
              </Field>
              {d.data.categories && d.data.categories.length > 0 && (
                <>
                  <Heading level="5" spaced>
                    Steam Categories
                  </Heading>
                  <Tags>
                    {d.data.categories.map(c => (
                      <Tag key={c.id} rounded>
                        {c.description}
                      </Tag>
                    ))}
                  </Tags>
                </>
              )}
              {d.data.genres && d.data.genres.length > 0 && (
                <>
                  <Heading level="5" spaced>
                    Steam Genres
                  </Heading>
                  <Tags>
                    {d.data.genres.map(g => (
                      <Tag key={g.id} rounded>
                        {g.description}
                      </Tag>
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
