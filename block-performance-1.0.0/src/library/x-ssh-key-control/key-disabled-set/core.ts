// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../../x-ssh-key-store/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    try {
        const { key } = await store.key_get(
            log,
            {
                id: input.id
            },
            {
                none: () => {
                    throw log.new_error("key not found");
                },
                ok: (output) => {
                    return output;
                },
                fail: (err) => {
                    throw err;
                }
            }
        );

        await store.key_set(
            log,
            {
                key: {
                    ...key,
                    disabled: input.disabled
                }
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

        return cb.ok({});
    } catch (err) {
        log.print_unknown_error(err);
        return cb.fail(err);
    }
}
