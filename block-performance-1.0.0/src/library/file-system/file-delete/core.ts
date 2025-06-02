// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import * as fs from "node:fs/promises";
import { file_exist } from "../file-exist/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    return await file_exist(
        log,
        {
            name: input.name
        },
        {
            none: async () => {
                return cb.none();
            },
            ok: async (output) => {
                await fs.rm(input.name);
                return cb.ok({});
            },
            fail: async (err) => {
                throw err;
            }
        }
    );
}
