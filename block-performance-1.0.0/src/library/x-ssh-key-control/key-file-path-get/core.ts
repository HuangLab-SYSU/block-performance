// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as file_system from "../../file-system/export.js";
import { key_find } from "../key-find/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        const { list } = await key_find(
            log,
            {
                username: input.username,
                address: input.address
            },
            {
                empty: (output) => {
                    return output;
                },
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        log.variable("list", list);

        if (list.length === 0) {
            return cb.none();
        } else if (list.length > 1) {
            throw log.new_error("multiple key matched found");
        }

        const target = list[0];
        log.variable("target", target);

        if (!target.private_key) {
            throw log.new_error("target private key content is empty");
        }

        const { path: temp_file_name } = await file_system.temp_path_resolve(
            log,
            {
                part_list: [`ssh-key-${target.id}.private`]
            },
            {
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        log.variable("temp_file_name", temp_file_name);

        await file_system.file_write_text(
            log,
            {
                name: temp_file_name,
                text: target.private_key
            },
            {
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        // IMPORTANT
        // set the key file permission, because ssh will check it and refuse if not set properly
        await file_system.chmod(
            log,
            {
                path: temp_file_name,
                mode: 0o600
            },
            {
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        return cb.ok({ key_file_path: temp_file_name });
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
