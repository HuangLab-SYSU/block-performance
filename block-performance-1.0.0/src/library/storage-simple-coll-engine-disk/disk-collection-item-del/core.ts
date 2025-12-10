// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dirname from "../_dirname/index.js";
import { del_file } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { namespace, key, item_id } = input;
    const item_file = dirname.resolve_item(namespace, key, item_id);
    log.variable("item_file", item_file);
    return del_file(log, item_file, {
        ok: () => {
            return cb.ok({});
        },
        fail: (err) => {
            return cb.fail(err);
        }
    });
}
