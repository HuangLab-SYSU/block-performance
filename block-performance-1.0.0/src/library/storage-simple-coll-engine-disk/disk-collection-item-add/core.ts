// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import * as dirname from "../_dirname/index.js";
import { write_json_file } from "../../../myutils/node/file/index.js";
import { Input, Output, Callback } from "./type.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const { namespace, key, item } = input;
    // check id
    if (!item.id) {
        const err = new Error("item.id not exists: " + JSON.stringify(item));
        log.error(err);
        return cb.fail(err);
    }
    const item_file = dirname.resolve_item(namespace, key, item.id);
    log.variable("item_file", item_file);
    return await write_json_file(log, item_file, item, {
        ok: () => {
            return cb.ok({});
        },
        fail: (err) => {
            return cb.fail(err);
        }
    });
}
