import React, { Component } from "react";
import { LibraryViewer } from "./library-viewer";
import { Loading, Button, Heading, Field, Buttons } from "./widgets/atoms";
import { Modal } from "./widgets/modal";
import { Header } from "./header";
import { TagsView } from "./tags-view";
import Store, { State, initial_state } from "./store";
import { InputField } from "./widgets/input-field";
import { Fade } from "./widgets/animations";

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

  private readonly tag_exists = (tagid: string) => {
    return this.state.tags.find(t => t.id === tagid) != null;
  };

  public async componentDidMount() {
    await this.store.refresh(false);
  }

  public render() {
    return (
      <div className="app">
        <Header
          onRefresh={async () => await this.store.refresh(true)}
          canEditTag={
            this.state.selected.length === 1 &&
            this.state.selected[0] !== "hidden"
          }
          onDeleteTag={this.store.delete_tag}
          onSearch={this.store.search}
          onEditTag={this.store.edit_current}
          onRenameTag={this.store.start_rename}
          onImportTags={this.store.import_tags}
        />
        <div className="body">
          <TagsView
            tags={this.state.tags}
            selected={
              (this.state.editing && [this.state.editing]) ||
              this.state.selected
            }
            onAddTag={this.store.add_tag}
            onSelectTag={this.store.select_tag}
            editing={this.state.editing != null}
          />
          <div className="library-view">
            <Fade show={this.state.editing != null} fill overlay>
              <div className="editing-overlay" />
            </Fade>
            <div className="library-container">
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
            </div>

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

            <Modal show={this.state.renaming} onHide={this.store.stop_rename}>
              <Heading level="3">Rename Tag</Heading>
              <InputField
                placeholder={
                  (this.tag_exists(this.state.selected[0]) &&
                    this.get_tag(this.state.selected[0]).name) ||
                  ""
                }
                onSubmit={this.store.submit_name}
                onCancel={this.store.stop_rename}
              />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
