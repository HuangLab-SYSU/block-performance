// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as key_store from "../../x-ssh-key-control/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const obj_keys = Object.keys(input.ssh_auth_key).filter((name) => (input.ssh_auth_key as any)[name] !== undefined);
    log.variable("obj_keys", obj_keys);
    log.variable("obj_keys.length", obj_keys.length);
    // console.log(input.ssh_auth_key);
    if (obj_keys.length > 1) {
        throw log.new_error("invalid ssh_auth_key: only one option can be set, not multiple");
    }

    if (input.ssh_auth_key.os) {
        return cb.without_key_file();
    }

    if (typeof input.ssh_auth_key.file === "string") {
        if (!input.ssh_auth_key.file) {
            throw log.new_error("invalid ssh_auth_key: file is empty string");
        }
        return cb.ok({ key_file: input.ssh_auth_key.file });
    }

    if (input.ssh_auth_key.store) {
        const { key_file_path } = await key_store.key_file_path_get(
            log,
            {
                username: input.username,
                address: input.address
            },
            {
                none: () => {
                    throw log.new_error("key file not found in store");
                },
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );
        return cb.ok({ key_file: key_file_path });
    }

    throw log.new_error("invalid ssh_auth_key: at least one option must be set");
}
