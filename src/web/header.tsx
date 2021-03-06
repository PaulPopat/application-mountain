import React, { SFC } from "react";
import {
  Button,
  Heading,
  Buttons,
  Dropdown,
  DropdownItem,
  DropdownDivider
} from "./widgets/atoms";
import { send, query } from "./web-messaging";
import { debounce } from "../util/debounce";
import { CloseButton } from "./widgets/input-field";

export const Header: SFC<{
  onRefresh: () => void;
  canEditTag: boolean;
  onDeleteTag: () => void;
  onEditTag: () => void;
  onRenameTag: () => void;
  onSearch: (filter: string) => void;
  onImportTags: () => void;
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
        <Dropdown id="tag-edit" type="primary" disabled={!p.canEditTag}>
          {{
            title: <>Edit tag</>,
            content: (
              <>
                <DropdownItem onClick={p.onEditTag}>Edit Apps</DropdownItem>
                <DropdownItem onClick={p.onRenameTag}>Rename</DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={p.onDeleteTag}>Delete</DropdownItem>
              </>
            )
          }}
        </Dropdown>
        <Button type="warning" onClick={() => query("/tags/export")}>
          Export tags
        </Button>
        <Button type="danger" onClick={p.onImportTags}>
          Import tags
        </Button>
      </Buttons>

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
