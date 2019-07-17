import React, { Component, createRef } from "react";
import { Button } from "./atoms";

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
