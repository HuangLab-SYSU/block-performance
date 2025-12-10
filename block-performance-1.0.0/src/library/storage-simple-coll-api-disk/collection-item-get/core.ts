// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { collection_item_ls } from "../collection-item-ls/export.js";
import { Item } from "../_type/index.js";

export async function core<R>(
    log: Logger,
    input: Input & {
        match?: (item: Item) => boolean;
    },
    cb: Callback<R>
): Promise<R> {
    const { namespace, key, match } = input;

    if (!match) {
        return cb.none();
    }

    return collection_item_ls(
        log,
        {
            namespace,
            key,
            filter: (item: Item) => match(item)
        },
        {
            empty: () => {
                return cb.none();
            },
            ok: ({ items }) => {
                return cb.ok(items[0]);
            },
            fail: (err) => {
                return cb.fail(err);
            }
        }
    );
}
