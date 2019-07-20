import { file } from "../fs";
import { IsTagsList, TagsList } from "../../util/types";
import uuid from "uuid/v1";

async function write_tags(tags: TagsList) {
  const tagsFile = file("data", "tags.json");
  await tagsFile.write_json(tags);
}

export async function get_tags() {
  const tagsFile = file("data", "tags.json");

  if (await tagsFile.exists()) {
    const result = await tagsFile.read_json("utf-8");
    if (!IsTagsList(result)) {
      throw new Error("Invalid tags list");
    }

    return result;
  }

  const tags: TagsList = [];
  await tagsFile.write_json(tags);
  return tags;
}

export async function get_tag(id: string) {
  const result = (await get_tags()).find(t => t.id === id);
  if (!result) {
    throw new Error("Tag not found");
  }

  return result;
}

export async function add_tag(name: string) {
  const id = uuid();
  const tags = await get_tags();
  tags.push({ id, name, apps: [] });
  await write_tags(tags);
  return id;
}

export async function remove_tag(id: string) {
  const tags = await get_tags();
  await write_tags(tags.filter(t => t.id !== id));
}

export async function rename_tag(id: string, name: string) {
  const tags = await get_tags();
  await write_tags(
    tags.map(t => {
      if (t.id === id) {
        return {
          ...t,
          name
        };
      }

      return t;
    })
  );
}

export async function add_app(id: string, app: number) {
  const tags = await get_tags();
  const tag = tags.find(t => t.id === id);
  if (!tag) {
    throw new Error("Could not find tag");
  }

  tag.apps.push(app);
  write_tags(tags);
}

export async function remove_app(id: string, app: number) {
  const tags = await get_tags();
  const tag = tags.find(t => t.id === id);
  if (!tag) {
    throw new Error("Could not find tag");
  }

  tag.apps = tag.apps.filter(a => a !== app);
  write_tags(tags);
}

export async function get_tags_on_app(app: number) {
  const tags = await get_tags();
  return tags.filter(t => t.apps.find(a => a === app));
}
