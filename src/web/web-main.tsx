import React, { Component } from "react";
import { LibraryViewer } from "./library-viewer";
import { Loading, Button } from "./widgets/atoms";
import { Modal } from "./widgets/modal";
import { AppDetails } from "./app-details";
import { Header } from "./header";
import { TagsView } from "./tags-view";
import Store, { State, initial_state } from "./store";

export class Main extends Component<{ children?: null | never }, State> {
  public constructor(props: any, context: any) {
    super(props, context);
    this.state = initial_state;
  }

  private readonly get_tag = (tagid: string) => {
    const tag = this.state.tags.find(t => t.id === tagid);
    if (!tag) {
      throw new Error("Could not find tag");
    }

    return tag;
  };

  public async componentDidMount() {
    const store = Store(this.state, this.setState);
    await store.refresh(false);
  }

  public render() {
    const store = Store(this.state, this.setState);
    return (
      <div className="app">
        <Header
          onRefresh={async () => await store.refresh(true)}
          canDeleteTag={this.state.selected.length !== 1}
          onDeleteTag={store.delete_tag}
          onSearch={store.search}
        />
        <div className="body">
          <TagsView
            tags={this.state.tags}
            selected={
              (this.state.editing && [this.state.editing]) ||
              this.state.selected
            }
            onEditTag={store.edit_tag}
            onAddTag={store.add_tag}
            onSelectTag={store.select_tag}
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
                onSelect={store.select_game}
              />
            </Loading>

            {this.state.editing && (
              <div className="done-button">
                <Button type="success" rounded onClick={store.done_editing}>
                  Done
                </Button>
              </div>
            )}

            <Modal show={this.state.open !== -1} onHide={store.hide_modal}>
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
