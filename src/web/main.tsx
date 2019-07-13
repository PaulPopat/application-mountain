import React, { Component } from "react";
import { query } from "./messaging";
import { LibraryViewer } from "./library-viewer";
import { AppList, IsAppList } from "../util/types";
import { Spinner } from "./widgets/icons";
import { IsArray, IsNumber } from "../util/type";

export class Main extends Component<
  { children?: null | never },
  { library: AppList; installed: number[] }
> {
  public async componentDidMount() {
    const library = await query("load-data");
    if (!IsAppList(library)) {
      throw new Error("Invalid load data");
    }

    const installed = await query("installed-apps");
    if (!IsArray(IsNumber)(installed)) {
      throw new Error("Invalid installed apps data");
    }

    this.setState({ library, installed });
  }

  public render() {
    if (!this.state) {
      return (
        <div style={{ width: "100vw", height: "100vh" }}>
          <div className="loading-container">
            <Spinner
              fill="rgba(255, 255, 255, 0.8)"
              width="200px"
              height="200px"
            />
          </div>
        </div>
      );
    }

    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <LibraryViewer
          library={this.state.library}
          installed={this.state.installed}
        />
      </div>
    );
  }
}
