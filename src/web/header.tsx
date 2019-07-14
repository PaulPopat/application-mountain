import React, { SFC } from "react";
import { Button, Heading, Buttons } from "./widgets/atoms";
import { send } from "./messaging";

export const Header: SFC<{ onRefresh: () => void }> = p => (
  <div className="header">
    <Buttons>
      <Button type="link" onClick={() => send("open-store")}>
        Open Steam Store
      </Button>
      <Button type="info" onClick={p.onRefresh}>
        Refresh
      </Button>
    </Buttons>
    <Heading level="3">Steam Library</Heading>
  </div>
);
