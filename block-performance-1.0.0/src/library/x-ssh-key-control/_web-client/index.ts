// auto generated by dev/system

import { LibraryType } from "./type.js";
import { make_library_client } from "../../../myutils/common/rpc/make_library_client.js";

export const x_ssh_key_control: LibraryType = make_library_client<LibraryType>("x-ssh-key-control");

export function make_x_ssh_key_control(base_url: string): LibraryType {
    return make_library_client<LibraryType>("x-ssh-key-control", base_url);
}
