import React, { Component } from "react";
import { LibraryViewer } from "./library-viewer";
import { query } from "./messaging";
import { AppList, IsAppList } from "../util/types";
import { IsArray, IsNumber } from "../util/type";
import { Loading } from "./widgets/atoms";
import { Modal } from "./widgets/modal";
import { AppDetails } from "./app-details";

export class Main extends Component<
  { children?: null | never },
  { library: AppList; installed: number[]; open: number }
> {
  public constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      library: [],
      installed: [],
      open: -1
    };
  }

  public async componentDidMount() {
    const library = await query("load-data");
    if (!IsAppList(library)) {
      throw new Error("Invalid library");
    }

    const installed = await query("installed-apps");
    if (!IsArray(IsNumber)(installed)) {
      throw new Error("Invalid installed apps");
    }

    this.setState({ library, installed });
  }

  public render() {
    return (
      <>
        <div style={{ width: "100vw", height: "100vh" }}>
          <div className="library-view fill">
            <Loading loading={this.state.library.length === 0}>
              <LibraryViewer
                library={this.state.library}
                selected={this.state.installed}
                onSelect={appid => this.setState(s => ({ ...s, open: appid }))}
              />
            </Loading>
          </div>
        </div>

        <Modal
          show={this.state.open !== -1}
          onHide={() => this.setState(s => ({ ...s, open: -1 }))}
        >
          {this.state.open !== -1 && (
            <AppDetails
              appid={this.state.open}
              installed={
                this.state.installed.find(i => i === this.state.open) != null
              }
            />
          )}
        </Modal>
      </>
    );
  }
}
