// auto generated by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../_/master-server/index.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    return await store.add(
        log,
        {
            id: "",
            ...store.make_private(),
            ...input.master_server
        },
        {
            ok: (item) => {
                return cb.ok({ id: item.id });
            },
            fail: (err) => {
                return cb.fail(err);
            }
        }
    );
}
