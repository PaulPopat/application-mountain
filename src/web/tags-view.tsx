import React, { Component } from "react";
import { TagsList } from "../util/types";
import { debounce } from "../util/debounce";
import { Heading, Field, Button } from "./widgets/atoms";
import { InputField } from "./widgets/input-field";
import Scrollbars from "react-custom-scrollbars";
import { build_classes } from "../util/html_utils";

type TagsViewProps = {
  tags: TagsList;
  selected: string[];
  editing: boolean;
  onAddTag: (name: string) => void;
  onSelectTag: (id: string | null) => void;
  onEditTag: (id: string) => void;
};

export class TagsView extends Component<
  TagsViewProps,
  { width: number; adding: boolean }
> {
  private readonly deb = debounce(
    () => this.setState(s => ({ ...s, width: window.innerWidth })),
    250
  );

  constructor(props: any, context: any) {
    super(props, context);
    this.state = { width: window.innerWidth, adding: false };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.deb();
  }

  public render() {
    return (
      <Scrollbars
        className="tags-display"
        style={{
          height: "100%",
          width: `${200 + ((this.state.width - 240) % 194)}px`
        }}
      >
        <div className="tags-container">
          <Heading level="4">Tags</Heading>
          <div className="tag-block">
            <div
              className={build_classes({
                "tag-item": true,
                selected: this.props.selected.length < 1
              })}
            >
              {this.props.editing ? (
                "All"
              ) : (
                <span onClick={() => this.props.onSelectTag(null)}>All</span>
              )}
            </div>
            {this.props.tags.map(t => (
              <div
                className={build_classes({
                  "tag-item": true,
                  selected: this.props.selected.find(i => i === t.id) != null
                })}
                key={t.id}
              >
                {this.props.editing ? (
                  t.name
                ) : (
                  <>
                    <span onClick={() => this.props.onSelectTag(t.id)}>
                      {t.name}
                    </span>
                    <div
                      className={build_classes({
                        "edit-button": true,
                        editing:
                          this.props.editing &&
                          this.props.selected.find(i => i === t.id) != null
                      })}
                      onClick={_ => this.props.onEditTag(t.id)}
                    >
                      Edit
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {this.state.adding && (
            <InputField
              placeholder="Tag Name"
              onSubmit={v => {
                this.setState(s => ({ ...s, adding: false }));
                this.props.onAddTag(v);
              }}
              onCancel={() => this.setState(s => ({ ...s, adding: false }))}
            />
          )}
          <Field>
            <Button
              size="small"
              type="primary"
              onClick={() => this.setState(s => ({ ...s, adding: true }))}
            >
              Add Tag
            </Button>
          </Field>
        </div>
      </Scrollbars>
    );
  }
}
