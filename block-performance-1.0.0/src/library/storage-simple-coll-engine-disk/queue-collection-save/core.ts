// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { disk_collection_save } from "../../storage-simple-coll-engine-disk/export.js";
import { queue_add } from "../_queue/index.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    // [dangerous] Dining Philosophers problem
    // don't invoke cb.xxx() in queue_add()
    // or serous bugs happen that never return and task never return
    const err = await queue_add(log, async () => {
        return await disk_collection_save(log, input, {
            ok: () => {
                // return cb.ok({}); // don't do this!
                return null;
            },
            fail: (err) => {
                // return cb.fail(err); // don't do this!
                return err;
            }
        });
    });

    // invoke the callback outside the queue_add()
    if (err) {
        return cb.fail(err);
    } else {
        return cb.ok({});
    }
}
