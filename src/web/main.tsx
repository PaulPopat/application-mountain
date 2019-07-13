import React, { Component } from "react";
import { query } from "./messaging";
import { LibraryViewer } from "./library-viewer";
import { AppList, IsAppList } from "../util/types";

export class Main extends Component<
  { children?: null | never },
  { library: AppList }
> {
  public async componentDidMount() {
    const result = await query("load-data");
    if (!IsAppList(result)) {
      throw new Error("Invalid load data");
    }

    this.setState({ library: result });
  }

  public render() {
    if (!this.state) {
      return <div>Loading Steam library, please wait.</div>;
    }

    return <LibraryViewer library={this.state.library} />;
  }
}
