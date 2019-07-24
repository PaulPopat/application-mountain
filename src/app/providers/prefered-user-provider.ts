import { file } from "../fs";
import { get_users } from "./library-provider";

const user_file = file("data", "user.txt");

export async function get_current_user() {
  if (!(await user_file.exists())) {
    const users = await get_users();
    return users[0].userid;
  }

  return parseInt(await user_file.read_text("utf-8"));
}

export async function set_current_user(userid: number) {
  await user_file.write(userid.toString());
}
