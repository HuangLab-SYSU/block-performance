// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { Item } from "../_type/index.js";
import * as api_disk from "../../storage-simple-coll-api-disk/export.js";

export async function core<R>(
    log: Logger,
    input: Input & {
        filter?: (item: Item) => boolean;
        sort?: (a: Item, b: Item) => number;
    },
    cb: Callback<R>
): Promise<R> {
    return await api_disk.collection_item_ls(log, input, {
        empty: () => {
            return cb.empty();
        },
        ok: (output) => {
            return cb.ok(output);
        },
        fail: (err) => {
            throw err;
        }
    });
}
