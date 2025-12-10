// initialized by dev/system

import { Logger } from "../../../myutils/logger.js";
import { Input, Output, Callback } from "./type.js";
import { file_write_text } from "../file-write-text/export.js";

export async function core<R>(log: Logger, input: Input, cb: Callback<R>): Promise<R> {
    await file_write_text(
        log,
        {
            name: input.name,
            text: input.json_format ? JSON.stringify(input.json_value, null, 4) : JSON.stringify(input.json_value)
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
}
