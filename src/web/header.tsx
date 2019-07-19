import React, { SFC } from "react";
import { Button, Heading, Buttons } from "./widgets/atoms";
import { send } from "./web-messaging";
import { debounce } from "../util/debounce";
import { CloseButton } from "./widgets/input-field";

export const Header: SFC<{
  onRefresh: () => void;
  canDeleteTag: boolean;
  onDeleteTag: () => void;
  onSearch: (filter: string) => void;
}> = p => {
  const search = debounce((val: string) => p.onSearch(val), 250);
  return (
    <div className="header">
      <Buttons>
        <Button type="link" onClick={() => send("/store")}>
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

      <div className="search-box">
        <input
          className="input"
          placeholder="Search"
          onChange={e => search(e.target.value)}
          onKeyUp={e => {
            if (e.key === "Escape") {
              e.currentTarget.blur();
            }
          }}
        />
      </div>

      <CloseButton fill="#ddd" />
    </div>
  );
};
