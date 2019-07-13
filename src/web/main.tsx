import React, { Component } from "react";

export class Main extends Component<{ children?: null | never }> {
  public async componentDidMount() {}

  public render() {
    if (!this.state) {
      return <></>;
    }

    return <div>Hello World</div>;
  }
}
