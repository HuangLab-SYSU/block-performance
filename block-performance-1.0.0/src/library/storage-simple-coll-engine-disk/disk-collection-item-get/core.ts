// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dirname from "../_dirname/index.js";
import { read_json_file } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { namespace, key, id } = input;
    const item_file = dirname.resolve_item(namespace, key, id);
    log.variable("item_file", item_file);
    return await read_json_file(log, item_file, {
        ok: (item) => {
            return cb.ok(item);
        },
        fail: (err) => {
            return cb.fail(err);
        }
    });
}
