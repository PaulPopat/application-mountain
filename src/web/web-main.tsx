import React, { Component } from "react";
import { LibraryViewer } from "./library-viewer";
import { Loading, Button, Heading, Field, Buttons } from "./widgets/atoms";
import { Modal } from "./widgets/modal";
import { Header } from "./header";
import { TagsView } from "./tags-view";
import Store, { State, initial_state } from "./store";
import { build_classes } from "../util/html_utils";

export class Main extends Component<{ children?: null | never }, State> {
  private readonly store: ReturnType<typeof Store>;

  public constructor(props: any, context: any) {
    super(props, context);
    this.state = initial_state;
    this.store = Store(() => this.state, a => this.setState(a));
  }

  private readonly get_tag = (tagid: string) => {
    const tag = this.state.tags.find(t => t.id === tagid);
    if (!tag) {
      throw new Error("Could not find tag");
    }

    return tag;
  };

  public async componentDidMount() {
    await this.store.refresh(false);
  }

  public render() {
    return (
      <div className="app">
        <Header
          onRefresh={async () => await this.store.refresh(true)}
          canDeleteTag={this.state.selected.length === 1}
          onDeleteTag={this.store.delete_tag}
          onSearch={this.store.search}
        />
        <div className="body">
          <TagsView
            tags={this.state.tags}
            selected={
              (this.state.editing && [this.state.editing]) ||
              this.state.selected
            }
            onEditTag={this.store.edit_tag}
            onAddTag={this.store.add_tag}
            onSelectTag={this.store.select_tag}
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
                onSelect={this.store.select_game}
              />
            </Loading>

            {this.state.editing && (
              <div className="done-button">
                <Button
                  type="success"
                  rounded
                  onClick={this.store.done_editing}
                >
                  Done
                </Button>
              </div>
            )}

            <Modal show={this.state.deleting} onHide={this.store.stop_deleting}>
              <Heading level="1">Are you sure?</Heading>
              <Field>
                <p>This action is not reversible.</p>
              </Field>
              <Buttons>
                <Button type="danger" onClick={this.store.confirm_delete_tag}>
                  Ok
                </Button>
                <Button type="primary" onClick={this.store.stop_deleting}>
                  Cancel
                </Button>
              </Buttons>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
