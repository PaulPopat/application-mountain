import React, { SFC, useState } from "react";
import { GameInfo, IsGameInfo, IsTagsList, TagsList } from "../util/types";
import { query, send } from "./web-messaging";
import {
  Loading,
  Heading,
  Button,
  Field,
  Tags,
  Tag,
  Columns,
  Buttons,
  Card,
  CardFooterItem
} from "./widgets/atoms";
import Scrollbars from "react-custom-scrollbars";
import { IsObject, IsBoolean, IsNumber, Optional } from "../util/type";
import { CloseButton } from "./widgets/input-field";
import { Carousel } from "./widgets/carousel";

function get_date(seconds: number) {
  const date = new Date(0);
  date.setUTCSeconds(seconds);
  return date;
}

export const AppDetails: SFC<{
  children?: null | never;
  appid: number;
}> = p => {
  const [details, set_details] = useState<{
    info: GameInfo;
    tags: TagsList;
    allTags: TagsList;
    installed: boolean;
    lastPlayed: number | null | undefined;
    loading: boolean;
  }>({
    info: {},
    tags: [],
    allTags: [],
    installed: false,
    lastPlayed: null,
    loading: true
  });

  const [editing, set_editing] = useState(false);
  const d = details.info[p.appid];
  const refresh = async () => {
    const de = await query("/app/info", p.appid);
    if (
      !IsObject({
        info: IsGameInfo,
        tags: IsTagsList,
        allTags: IsTagsList,
        installed: IsBoolean,
        lastPlayed: Optional(IsNumber)
      })(de)
    ) {
      throw new Error("Invalid app info from server");
    }

    set_details({ ...de, loading: false });
  };

  if (details.loading) {
    refresh();
  }

  return (
    <>
      <Loading loading={details.loading} fill="#444">
        {d && d.data && (
          <div className="app-details">
            <div className="header">
              <Heading level="3" title={d.data.name}>
                {d.data.name}
              </Heading>
              <CloseButton fill="#ddd" />
            </div>
            <Scrollbars
              style={{ width: "100%", flex: "1" }}
              className="shadow-scroll"
            >
              <Carousel
                paths={d.data.screenshots.map(s => s.path_full)}
                interval={4000}
              />
              <div className="content-container">
                <div className="install-and-last-played">
                  <Button
                    onClick={() => send("/app/start", p.appid)}
                    type="primary"
                    rounded
                  >
                    {details.installed ? "Play Game" : "Install"}
                  </Button>
                  {details.lastPlayed && (
                    <div className="last-played">
                      <Heading level="5" subtitle>
                        Last Opened:
                      </Heading>
                      <p>{get_date(details.lastPlayed).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                <Field>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: d.data.short_description
                    }}
                  />
                </Field>
                <Card>
                  {{
                    header: (
                      <>
                        Tags
                        <Button
                          type="success"
                          size="small"
                          rounded
                          onClick={() => set_editing(!editing)}
                        >
                          {editing ? "Done" : "Edit"}
                        </Button>
                      </>
                    ),
                    content: (
                      <>
                        {details.tags.length > 0 ? (
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
                        ) : (
                          <p>No tags yet. Why not add some?</p>
                        )}
                        {editing && (
                          <Field>
                            <Tags>
                              {details.allTags
                                .filter(
                                  t => !details.tags.find(t1 => t.id === t1.id)
                                )
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
                      </>
                    )
                  }}
                </Card>
                {((d.data.categories && d.data.categories.length > 0) ||
                  (d.data.genres && d.data.genres.length > 0)) && (
                  <Card>
                    {{
                      header: "Steam Categories",
                      content: (
                        <Tags>
                          {d.data.categories &&
                            d.data.categories.map(c => (
                              <Tag key={c.id} rounded>
                                {c.description}
                              </Tag>
                            ))}
                          {d.data.genres &&
                            d.data.genres.map(g => (
                              <Tag key={g.id} rounded>
                                {g.description}
                              </Tag>
                            ))}
                        </Tags>
                      )
                    }}
                  </Card>
                )}
              </div>
            </Scrollbars>
          </div>
        )}
      </Loading>
    </>
  );
};
