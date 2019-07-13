import React, { Component } from "react";
import { LibraryViewer } from "./library-viewer";

export class Main extends Component<{ children?: null | never }> {
  public render() {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <LibraryViewer />
      </div>
    );
  }
}
