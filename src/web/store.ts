import { AppList, TagsList, IsAppList, IsTagsList } from "../util/types";
import { query, send } from "./web-messaging";
import { IsArray, IsNumber, IsString, IsObject, Optional } from "../util/type";
import { import_tags } from "../app/providers/tags-provider";

export type State = {
  library: AppList;
  installed: number[];
  deleting: boolean;
  tags: TagsList;
  editing: string | null;
  selected: string[];
  loading: boolean;
  renaming: boolean;
  search: string;
};

export const initial_state: Readonly<State> = {
  library: [],
  installed: [],
  deleting: false,
  tags: [],
  editing: null,
  selected: [],
  loading: true,
  renaming: false,
  search: ""
};

type SetStateArg = ((s: State) => State) | State;
type SetState = (a: SetStateArg) => void;

export default function(getState: () => State, setState: SetState) {
  async function refresh(
    tagids: string[],
    filter: string,
    force: boolean = false
  ) {
    const timeout = setTimeout(
      () => setState(s => ({ ...s, loading: true })),
      100
    );
    const library = await query("/", {
      tags: tagids,
      filter,
      force
    });
    if (!IsAppList(library)) {
      throw new Error("Invalid library");
    }

    const installed = await query("/apps/installed");
    if (!IsArray(IsNumber)(installed)) {
      throw new Error("Invalid installed apps");
    }

    const tags = await query("/tags");
    if (!IsTagsList(tags)) {
      throw new Error("Invalid tags");
    }

    clearTimeout(timeout);
    return {
      library,
      installed,
      deleting: false,
      tags,
      editing: null,
      selected: tagids,
      search: filter,
      loading: false,
      renaming: false
    };
  }

  return {
    async refresh(force: boolean = false) {
      const state = getState();
      setState(await refresh(state.selected, state.search, force));
    },
    async delete_tag() {
      setState(s => ({ ...s, deleting: true }));
    },
    async confirm_delete_tag() {
      const state = getState();
      await query("/tags/remove", state.selected[0]);
      setState(await refresh([], state.search));
    },
    async add_tag(name: string) {
      const id = await query("/tags/add", name);
      if (!IsString(id)) {
        throw new Error("Id is of wrong type");
      }

      setState(s => ({
        ...s,
        tags: [...s.tags, { name, id, apps: [] }].sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }

          if (a.name > b.name) {
            return 1;
          }

          return 0;
        })
      }));
    },
    async edit_current() {
      const state = getState();
      setState({
        ...(await refresh([], state.search)),
        editing: state.selected[0]
      });
    },
    async search(filter: string) {
      const state = getState();
      setState(await refresh(state.selected, filter));
    },
    async select_tag(id: string | null) {
      const state = getState();
      if (!id) {
        setState(await refresh([], state.search));
        return;
      }

      if (!state.selected.find(i => i === id)) {
        setState(await refresh([...state.selected, id], state.search));
        return;
      }

      setState(
        await refresh(state.selected.filter(i => i !== id), state.search)
      );
    },
    async select_game(appid: number) {
      const state = getState();
      if (state.editing) {
        const tag = state.tags.find(t => t.id === state.editing);
        if (!tag) {
          throw new Error("Could not find tag");
        }

        if (tag.apps.find(a => a === appid)) {
          await send("/tags/tag/remove", {
            id: state.editing,
            app: appid
          });
          setState(s => ({
            ...s,
            tags: state.tags.map(t => {
              if (t.id !== state.editing) {
                return t;
              }

              return {
                ...t,
                apps: t.apps.filter(a => a !== appid)
              };
            })
          }));
        } else {
          await send("/tags/tag/add", {
            id: state.editing,
            app: appid
          });
          setState(s => ({
            ...s,
            tags: state.tags.map(t => {
              if (t.id !== state.editing) {
                return t;
              }

              return { ...t, apps: [...t.apps, appid] };
            })
          }));
        }
      } else {
        send("/app/open", appid);
      }
    },
    done_editing() {
      setState(s => ({ ...s, editing: null }));
    },
    stop_deleting() {
      setState(s => ({ ...s, deleting: false }));
    },
    start_rename() {
      setState(s => ({ ...s, renaming: true }));
    },
    stop_rename() {
      setState(s => ({ ...s, renaming: false }));
    },
    async submit_name(name: string) {
      const state = getState();
      await query("/tags/tag/rename", { id: state.selected[0], name });
      setState({
        ...(await refresh(state.selected, state.search))
      });
    },
    async import_tags() {
      const state = getState();
      await query("/tags/import");
      setState({
        ...(await refresh(state.selected, state.search))
      });
    }
  };
}
