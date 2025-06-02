// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as store from "../../x-jmeter-cloud-store/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    return await store.credential_ls(
        log,
        {},
        {
            empty: (output) => {
                throw log.new_error("no credential found");
            },
            ok: ({ list }) => {
                if (list.length > 1) {
                    throw log.new_error("multiple credentials found");
                }

                return cb.ok({
                    credential: list[0]
                });
            },
            fail: (err) => {
                throw err;
            }
        }
    );
}
