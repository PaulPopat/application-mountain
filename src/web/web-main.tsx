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
    selected: string | null;
    loading: boolean;
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
      selected: null,
      loading: true
    };
  }

  private readonly get_tag = (tagid: string) => {
    const tag = this.state.tags.find(t => t.id === tagid);
    if (!tag) {
      throw new Error("Could not find tag");
    }

    return tag;
  };

  private readonly refresh = async (tagid?: string | null) => {
    this.setState(s => ({ ...s, loading: true }));
    const library = await query("load-data", tagid);
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

    this.setState(s => ({ ...s, loading: false }));
    return {
      library,
      installed,
      open: -1,
      tags,
      editing: null,
      selected: null
    };
  };

  public async componentDidMount() {
    const data = await this.refresh();
    this.setState(data);
  }

  public render() {
    return (
      <div className="app">
        <Header
          onRefresh={this.refresh}
          canDeleteTag={this.state.selected != null}
          onDeleteTag={async () => {
            await query("remove-tag", this.state.selected);
            const data = await this.refresh();
            this.setState({ ...data });
          }}
        />
        <div className="body">
          <TagsView
            tags={this.state.tags}
            selected={this.state.editing || this.state.selected}
            onEditTag={async id => {
              const data = await this.refresh();
              this.setState({ ...data, editing: id });
            }}
            onAddTag={async name => {
              const id = await query("add-tag", name);
              if (!IsString(id)) {
                throw new Error("Id is of wrong type");
              }

              this.setState(s => ({
                ...s,
                tags: [...s.tags, { name, id, apps: [] }]
              }));
            }}
            onSelectTag={async id => {
              const data = await this.refresh(id);
              const selected = data.tags.find(t => t.id === id);
              this.setState({
                ...data,
                selected: (selected && selected.id) || null
              });
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
