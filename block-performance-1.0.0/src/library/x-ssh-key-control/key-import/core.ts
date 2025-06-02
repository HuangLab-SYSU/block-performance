// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as file_system from "../../file-system/export.js";
import { key_save } from "../key-save/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        const { text } = await file_system.file_read_text(
            log,
            {
                name: input.private_key_filename
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

        const { id } = await key_save(
            log,
            {
                username: input.username,
                address_list: input.address_list,
                tag_list: input.tag_list,
                private_key: text
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

        return cb.ok({ id });
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
