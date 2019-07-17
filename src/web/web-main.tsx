import React, { Component } from "react";
import { LibraryViewer } from "./library-viewer";
import { query, send } from "./web-messaging";
import { AppList, IsAppList, TagsList, IsTagsList } from "../util/types";
import { IsArray, IsNumber, IsString } from "../util/type";
import { Loading, Button } from "./widgets/atoms";
import { Modal } from "./widgets/modal";
import { AppDetails } from "./app-details";
import { Header } from "./header";
import { TagsView } from "./tags-view";

export class Main extends Component<
  { children?: null | never },
  {
    library: AppList;
    installed: number[];
    open: number;
    tags: TagsList;
    editing: string | null;
    selected: string[];
    loading: boolean;
    search: string;
  }
> {
  public constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      library: [],
      installed: [],
      open: -1,
      tags: [],
      editing: null,
      selected: [],
      loading: true,
      search: ""
    };
  }

  private readonly get_tag = (tagid: string) => {
    const tag = this.state.tags.find(t => t.id === tagid);
    if (!tag) {
      throw new Error("Could not find tag");
    }

    return tag;
  };

  private readonly refresh = async (tagids: string[], filter: string) => {
    const timeout = setTimeout(
      () => this.setState(s => ({ ...s, loading: true })),
      100
    );
    const library = await query("load-data", { tags: tagids, filter });
    if (!IsAppList(library)) {
      throw new Error("Invalid library");
    }

    const installed = await query("installed-apps");
    if (!IsArray(IsNumber)(installed)) {
      throw new Error("Invalid installed apps");
    }

    const tags = await query("load-tags");
    if (!IsTagsList(tags)) {
      throw new Error("Invalid tags");
    }

    clearTimeout(timeout);
    return {
      library,
      installed,
      open: -1,
      tags,
      editing: null,
      selected: tagids,
      search: filter,
      loading: false
    };
  };

  public async componentDidMount() {
    this.setState(await this.refresh(this.state.selected, this.state.search));
  }

  public render() {
    return (
      <div className="app">
        <Header
          onRefresh={async () =>
            this.setState(
              await this.refresh(this.state.selected, this.state.search)
            )
          }
          canDeleteTag={this.state.selected != null}
          onDeleteTag={async () => {
            await query("remove-tag", this.state.selected);
            this.setState(await this.refresh([], this.state.search));
          }}
          onSearch={async filter =>
            this.setState(await this.refresh(this.state.selected, filter))
          }
        />
        <div className="body">
          <TagsView
            tags={this.state.tags}
            selected={
              (this.state.editing && [this.state.editing]) ||
              this.state.selected
            }
            onEditTag={async id => {
              this.setState({
                ...(await this.refresh([], this.state.search)),
                editing: id
              });
            }}
            onAddTag={async name => {
              const id = await query("add-tag", name);
              if (!IsString(id)) {
                throw new Error("Id is of wrong type");
              }

              this.setState(s => ({
                ...s,
                tags: [...s.tags, { name, id, apps: [] }].sort((a, b) => {
                  if (a.name < b.name) {
                    return -1;
                  }

                  if (a.name > b.name) {
                    return 1;
                  }

                  return 0;
                })
              }));
            }}
            onSelectTag={async id => {
              if (!id) {
                this.setState(await this.refresh([], this.state.search));
                return;
              }
              if (!this.state.selected.find(i => i === id)) {
                this.setState(
                  await this.refresh(
                    [...this.state.selected, id],
                    this.state.search
                  )
                );
                return;
              }

              this.setState(
                await this.refresh(
                  this.state.selected.filter(i => i !== id),
                  this.state.search
                )
              );
            }}
            editing={this.state.editing != null}
          />
          <div className="library-view">
            <Loading loading={this.state.loading}>
              <LibraryViewer
                library={this.state.library}
                selected={
                  this.state.editing != null
                    ? this.get_tag(this.state.editing).apps
                    : this.state.installed
                }
                onSelect={async appid => {
                  if (this.state.editing) {
                    const tag = this.state.tags.find(
                      t => t.id === this.state.editing
                    );
                    if (!tag) {
                      throw new Error("Could not find tag");
                    }

                    if (tag.apps.find(a => a === appid)) {
                      await send("remove-app", {
                        id: this.state.editing,
                        app: appid
                      });
                      this.setState(s => ({
                        ...s,
                        tags: this.state.tags.map(t => {
                          if (t.id !== this.state.editing) {
                            return t;
                          }

                          return {
                            ...t,
                            apps: t.apps.filter(a => a !== appid)
                          };
                        })
                      }));
                    } else {
                      await send("add-app", {
                        id: this.state.editing,
                        app: appid
                      });
                      this.setState(s => ({
                        ...s,
                        tags: this.state.tags.map(t => {
                          if (t.id !== this.state.editing) {
                            return t;
                          }

                          return { ...t, apps: [...t.apps, appid] };
                        })
                      }));
                    }
                  } else {
                    this.setState(s => ({ ...s, open: appid }));
                  }
                }}
              />
            </Loading>

            {this.state.editing && (
              <div className="done-button">
                <Button
                  type="success"
                  rounded
                  onClick={() => this.setState(s => ({ ...s, editing: null }))}
                >
                  Done
                </Button>
              </div>
            )}

            <Modal
              show={this.state.open !== -1}
              onHide={() => this.setState(s => ({ ...s, open: -1 }))}
            >
              {this.state.open !== -1 && (
                <AppDetails
                  appid={this.state.open}
                  installed={
                    this.state.installed.find(i => i === this.state.open) !=
                    null
                  }
                  all-tags={this.state.tags}
                />
              )}
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
