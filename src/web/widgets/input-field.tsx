import React, { Component, SFC, createRef } from "react";
import { Button } from "./atoms";
import { Close, Minimise } from "./icons";
import { send } from "../web-messaging";

export class InputField extends Component<{
  onSubmit: (value: string) => void;
  onCancel: () => void;
  placeholder: string;
}> {
  private readonly inputRef = createRef<HTMLInputElement>();

  public componentDidMount() {
    this.inputRef.current && this.inputRef.current.focus();
  }

  public render() {
    return (
      <div className="field is-horizontal">
        <div className="field-body" style={{ marginRight: "5px" }}>
          <div className="field">
            <p className="control">
              <input
                className="input is-small"
                ref={this.inputRef}
                placeholder={this.props.placeholder}
                onKeyUp={e => {
                  if (e.key === "Enter") {
                    this.props.onSubmit(
                      (this.inputRef.current && this.inputRef.current.value) ||
                        ""
                    );
                  } else if (e.key === "Escape") {
                    this.props.onCancel();
                  }
                }}
              />
            </p>
          </div>
        </div>
        <Button
          onClick={() =>
            this.props.onSubmit(
              (this.inputRef.current && this.inputRef.current.value) || ""
            )
          }
          size="small"
          type="success"
        >
          Submit
        </Button>
      </div>
    );
  }
}

export const CloseButton: SFC<{
  children?: never[] | null;
  fill: string;
}> = p => (
  <div className="window-actions">
    <div className="close-button" onClick={() => send("window/minimise")}>
      <Minimise fill={p.fill} width="100%" height="100%" />
    </div>
    <div className="close-button" onClick={() => send("window/close")}>
      <Close fill={p.fill} width="100%" height="100%" />
    </div>
  </div>
);
