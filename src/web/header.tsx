import React, { SFC } from "react";
import { Button, Heading, Buttons } from "./widgets/atoms";
import { send } from "./web-messaging";
import { Close } from "./widgets/icons";

export const Header: SFC<{
  onRefresh: () => void;
  canDeleteTag: boolean;
  onDeleteTag: () => void;
}> = p => (
  <div className="header">
    <Buttons>
      <Button type="link" onClick={() => send("open-store")}>
        Open Steam Store
      </Button>
      <Button type="info" onClick={p.onRefresh}>
        Refresh
      </Button>
      <Button
        type="warning"
        disabled={!p.canDeleteTag}
        onClick={() => p.canDeleteTag && p.onDeleteTag()}
      >
        Delete tag
      </Button>
    </Buttons>
    <Heading level="3">Steam Library</Heading>

    <div className="window-actions">
      <div className="close-button" onClick={() => send("close-window")}>
        <Close fill="#ddd" width="100%" height="100%" />
      </div>
    </div>
  </div>
);
