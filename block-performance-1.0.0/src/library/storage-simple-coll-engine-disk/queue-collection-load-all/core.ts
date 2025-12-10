// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { disk_collection_ls } from "../../storage-simple-coll-engine-disk/export.js";
import { queue_collection_load } from "../queue-collection-load/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    const output: Output = {
        version: 2,
        items: []
    };

    const collections: {
        namespace: string;
        key: string;
    }[] = await disk_collection_ls(
        log,
        {},
        {
            ok: ({ list }) => {
                return list;
            },
            fail: (err) => {
                log.warn(err);
                return [];
            }
        }
    );

    // load all collections
    for (let item of collections) {
        await queue_collection_load(log, item, {
            ok: (coll) => {
                output.items.push(coll);
            },
            fail: (err) => {
                // all collection must be load succesfully
                // even one fail will cause the whole fail
                log.println(`load collection failed, please fix it, namspace=${item.namespace}, key=${item.key}`);
                throw err;
            }
        });
    }

    return cb.ok(output);
}
