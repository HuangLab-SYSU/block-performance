// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as fs from "node:fs/promises";
import { directory_exist } from "../directory-exist/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    return await directory_exist(
        log,
        {
            name: input.name
        },
        {
            none: async () => {
                return cb.none();
            },
            ok: async (output) => {
                // .rmdir() is deprecated, must use .rm() here
                await fs.rm(input.name, {
                    recursive: true
                    // force: true // set true will not throw exception when target not exists
                });
                return cb.ok({});
            },
            fail: async (err) => {
                throw err;
            }
        }
    );
}
