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
  Card,
  ProgressBar
} from "./widgets/atoms";
import Scrollbars from "react-custom-scrollbars";
import {
  IsObject,
  IsBoolean,
  Optional,
  IsString,
  IsNumber
} from "../util/type";
import { CloseButton } from "./widgets/input-field";
import { Carousel } from "./widgets/carousel";

export const AppDetails: SFC<{
  children?: null | never;
  appid: number;
}> = p => {
  const [details, set_details] = useState<{
    info: GameInfo;
    tags: TagsList;
    allTags: TagsList;
    installed: boolean;
    hoursPlayed: string | null | undefined;
    progress: number | null | undefined;
    loading: boolean;
  }>({
    info: {},
    tags: [],
    allTags: [],
    installed: false,
    hoursPlayed: null,
    progress: null,
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
        hoursPlayed: Optional(IsString),
        progress: Optional(IsNumber)
      })(de)
    ) {
      throw new Error("Invalid app info from server");
    }

    set_details({ ...de, loading: false });
  };

  if (details.loading) {
    refresh();
  } else if (!document.hidden) {
    setTimeout(() => refresh(), 2000);
  } else {
    window.onfocus = () => setTimeout(() => refresh(), 2000);
  }

  const TagDetails = () => (
    <>
      {details.tags.length > 0 ? (
        <Tags>
          {details.tags.map(t =>
            editing ? (
              <Tags key={t.id} has-addons>
                <Tag rounded>{t.name}</Tag>
                <Tag
                  onClick={async () => {
                    await query("/tags/tag/remove", { id: t.id, app: p.appid });
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
        <Field>
          <p>No tags yet. Why not add some?</p>
        </Field>
      )}
      {editing && (
        <>
          <hr className="tags-divider" />
          <Field>
            <Tags>
              {details.allTags
                .filter(t => !details.tags.find(t1 => t.id === t1.id))
                .map(t => (
                  <Tag
                    key={t.id}
                    colour="dark"
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
        </>
      )}
    </>
  );

  return (
    <div className="app-details">
      <div className="header">
        <Heading level="3" title={(d && d.data && d.data.name) || ""}>
          {(d && d.data && d.data.name) || ""}
        </Heading>
        <CloseButton fill="#ddd" />
      </div>
      <Loading loading={details.loading} fill="#444" flex-fill>
        {d && d.data ? (
          <Scrollbars
            style={{ width: "100%", height: "100%" }}
            className="shadow-scroll"
          >
            <Carousel
              paths={d.data.screenshots.map(s => s.path_full)}
              interval={4000}
            />
            <div className="content-container">
              <div className="install-and-last-played">
                <Button
                  onClick={() => {
                    send("/app/start", p.appid);
                    refresh();
                  }}
                  type="primary"
                  disabled={
                    (details.progress != null && details.progress < 1) || false
                  }
                  rounded
                >
                  {details.installed ? "Play Game" : "Install"}
                </Button>
                {details.hoursPlayed && (
                  <div className="last-played">
                    <Heading level="5" subtitle>
                      Hours on Record
                    </Heading>
                    <p>{details.hoursPlayed}</p>
                  </div>
                )}
              </div>
              {details.progress != null &&
                details.progress < 1 &&
                details.progress > 0 && (
                  <div className="download-progress">
                    <Field>
                      <Heading level="6">Download Progress</Heading>
                      <ProgressBar
                        value={details.progress}
                        colour="warning"
                        size="small"
                      />
                    </Field>
                  </div>
                )}
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
                        type="light"
                        size="small"
                        rounded
                        onClick={() => set_editing(!editing)}
                      >
                        {editing ? "Done" : "Edit"}
                      </Button>
                    </>
                  ),
                  content: <TagDetails />
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
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Heading level="5">Looks like this app has no details...</Heading>
          </div>
        )}
      </Loading>
    </div>
  );
};
